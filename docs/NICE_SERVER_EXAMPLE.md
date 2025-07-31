# NICE 본인인증 서버 사이드 구현 예시

## 1. Node.js/Express 서버 예시

### 1.1 토큰 요청 API

```javascript
// routes/niceAuth.js
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const router = express.Router();

// NICE API 설정
const NICE_CONFIG = {
  siteCode: process.env.NICE_SITE_CODE,
  sitePassword: process.env.NICE_SITE_PASSWORD,
  apiUrl: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
  encryptKey: process.env.NICE_ENCRYPT_KEY,
};

// 1. 토큰 요청 API
router.post('/token', async (req, res) => {
  try {
    const { returnUrl, errorUrl } = req.body;
    
    // 현재 시간 (YYYYMMDDHHMMSS 형식)
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    // 요청 데이터 구성
    const requestData = {
      siteCode: NICE_CONFIG.siteCode,
      sitePassword: NICE_CONFIG.sitePassword,
      returnUrl: returnUrl,
      errorUrl: errorUrl,
      reqSeq: generateReqSeq(), // 요청 시퀀스 (고유값)
      reqDate: timestamp,
      reqTime: timestamp,
    };

    // 데이터 암호화
    const encryptedData = encryptNiceData(requestData);

    // NICE API 호출
    const response = await axios.post(NICE_CONFIG.apiUrl, {
      data: encryptedData,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = response.data;

    if (result.resultCode === '0000') {
      // 성공 시 NICE 본인인증 페이지 URL 반환
      const authUrl = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token=${result.token}`;
      
      res.json({
        success: true,
        authUrl: authUrl,
        token: result.token,
      });
    } else {
      res.json({
        success: false,
        errorCode: result.resultCode,
        errorMessage: result.resultMessage || '인증 토큰 요청 실패',
      });
    }
  } catch (error) {
    console.error('NICE 토큰 요청 오류:', error);
    res.status(500).json({
      success: false,
      errorCode: '9999',
      errorMessage: '서버 오류가 발생했습니다.',
    });
  }
});

// 2. 인증 결과 검증 API
router.post('/verify', async (req, res) => {
  try {
    const { encData, integrityValue } = req.body;
    
    // 데이터 복호화
    const decryptedData = decryptNiceData(encData);
    
    // 무결성 검증
    if (!verifyIntegrity(decryptedData, integrityValue)) {
      return res.json({
        success: false,
        errorCode: '0001',
        errorMessage: '데이터 무결성 검증 실패',
      });
    }

    // 인증 결과 파싱
    const authResult = parseAuthResult(decryptedData);

    res.json({
      success: true,
      name: authResult.name,
      phone: authResult.phone,
      birth: authResult.birth,
      gender: authResult.gender,
      ci: authResult.ci,
      di: authResult.di,
    });
  } catch (error) {
    console.error('NICE 인증 결과 검증 오류:', error);
    res.status(500).json({
      success: false,
      errorCode: '9999',
      errorMessage: '인증 결과 검증 중 오류가 발생했습니다.',
    });
  }
});

// 3. 리턴 URL 처리 (콜백)
router.get('/callback', (req, res) => {
  const { enc_data, integrity_value, resultCode, resultMessage } = req.query;
  
  if (resultCode === '0000' && enc_data && integrity_value) {
    // 성공 시 클라이언트로 리다이렉트
    res.redirect(`yourapp://auth/success?enc_data=${enc_data}&integrity_value=${integrity_value}`);
  } else {
    // 실패 시 클라이언트로 리다이렉트
    res.redirect(`yourapp://auth/failure?error=${resultMessage}`);
  }
});

// 유틸리티 함수들
function generateReqSeq() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `REQ_${timestamp}_${random}`;
}

function encryptNiceData(data) {
  const jsonString = JSON.stringify(data);
  const cipher = crypto.createCipher('aes-256-cbc', NICE_CONFIG.encryptKey);
  let encrypted = cipher.update(jsonString, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decryptNiceData(encryptedData) {
  const decipher = crypto.createDecipher('aes-256-cbc', NICE_CONFIG.encryptKey);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

function verifyIntegrity(data, integrityValue) {
  const dataHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  return dataHash === integrityValue;
}

function parseAuthResult(data) {
  return {
    name: data.name || '',
    phone: data.phone || data.mobile || '',
    birth: data.birth || '',
    gender: data.gender || '',
    ci: data.ci || '',
    di: data.di || '',
  };
}

module.exports = router;
```

### 1.2 서버 설정

```javascript
// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// NICE 본인인증 라우터
app.use('/api/nice-auth', require('./routes/niceAuth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
```

## 2. React Native 클라이언트 수정

### 2.1 NiceAuthModal 수정

```typescript
// src/features/auth/components/NiceAuthModal.tsx

// NICE 본인인증 시작
const startNiceAuth = async () => {
  setIsLoading(true);
  try {
    // 개발 환경에서는 시뮬레이션
    if (__DEV__) {
      setTimeout(() => {
        const mockResult = {
          success: true,
          name: '홍길동',
          phone: '01012345678',
          birth: '19900101',
          gender: '남성',
          ci: 'CI_' + Date.now(),
          di: 'DI_' + Date.now(),
        };
        onSuccess(mockResult);
        setIsLoading(false);
      }, 2000);
      return;
    }

    // 실제 서버 API 호출
    const response = await fetch('https://your-api-server.com/api/nice-auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'https://your-api-server.com/api/nice-auth/callback',
        errorUrl: 'https://your-api-server.com/api/nice-auth/error',
      }),
    });

    const result = await response.json();
    
    if (result.success && result.authUrl) {
      setAuthUrl(result.authUrl);
    } else {
      Alert.alert('오류', result.errorMessage || '본인인증을 시작할 수 없습니다.');
      setIsLoading(false);
    }
  } catch (error) {
    console.error('NICE 인증 시작 오류:', error);
    Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    setIsLoading(false);
  }
};
```

## 3. 환경 설정

### 3.1 서버 환경변수 (.env)

```env
NICE_SITE_CODE=YOUR_SITE_CODE
NICE_SITE_PASSWORD=YOUR_SITE_PASSWORD
NICE_ENCRYPT_KEY=YOUR_ENCRYPT_KEY
```

### 3.2 클라이언트 환경변수

```env
API_BASE_URL=https://your-api-server.com
```

## 4. 플로우 설명

### 4.1 전체 플로우

1. **클라이언트** → **서버**: 토큰 요청 (`/api/nice-auth/token`)
2. **서버** → **NICE API**: 토큰 요청
3. **NICE API** → **서버**: 토큰 반환
4. **서버** → **클라이언트**: NICE 본인인증 페이지 URL 반환
5. **클라이언트**: WebView로 NICE 본인인증 페이지 로드
6. **사용자**: NICE 본인인증 페이지에서 인증 진행
7. **NICE** → **서버**: 인증 결과를 콜백 URL로 전송
8. **서버** → **클라이언트**: 앱 스킴으로 리다이렉트
9. **클라이언트**: 인증 결과 처리

### 4.2 보안 고려사항

- **API 키 보안**: 서버에서만 NICE API 키 관리
- **HTTPS 통신**: 모든 통신은 HTTPS 사용
- **데이터 검증**: 서버에서 인증 결과 무결성 검증
- **세션 관리**: 요청 시퀀스로 중복 요청 방지

## 5. 테스트

### 5.1 개발 환경 테스트

```bash
# 서버 실행
npm start

# 클라이언트에서 테스트
# 개발 환경에서는 시뮬레이션 모드로 동작
```

### 5.2 운영 환경 테스트

1. 실제 NICE API 키 설정
2. 서버 배포
3. 실제 휴대폰번호로 인증 테스트
4. 인증 결과 검증

## 6. 에러 처리

### 6.1 주요 에러 케이스

- **토큰 요청 실패**: API 키, 네트워크 오류
- **인증 실패**: 사용자 취소, 잘못된 정보
- **무결성 검증 실패**: 데이터 변조 의심
- **네트워크 오류**: 서버 연결 실패

### 6.2 에러 처리 예시

```typescript
const handleAuthError = (errorCode: string, errorMessage: string) => {
  switch (errorCode) {
    case '0001':
      Alert.alert('설정 오류', '서버 설정을 확인해주세요.');
      break;
    case '0002':
      Alert.alert('인증 실패', '본인인증에 실패했습니다.');
      break;
    default:
      Alert.alert('오류', errorMessage || '알 수 없는 오류가 발생했습니다.');
  }
};
``` 