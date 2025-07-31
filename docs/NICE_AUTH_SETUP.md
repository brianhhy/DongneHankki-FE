# NICE 본인인증 API 연동 가이드

## 1. NICE 본인인증 서비스 신청

### 1.1 서비스 신청
- [NICE평가정보 본인인증](https://www.niceid.co.kr)에서 본인인증 서비스 신청
- 사이트 코드, 사이트 비밀번호, 암호화 키 발급

### 1.2 필요한 정보
- 사이트 코드 (Site Code)
- 사이트 비밀번호 (Site Password)
- 암호화 키 (Encrypt Key)
- 리턴 URL (Return URL)
- 에러 URL (Error URL)

## 2. 프로젝트 설정

### 2.1 환경변수 설정

#### 개발 환경 (.env.development)
```env
NICE_SITE_CODE=YOUR_DEV_SITE_CODE
NICE_SITE_PASSWORD=YOUR_DEV_SITE_PASSWORD
NICE_ENCRYPT_KEY=YOUR_DEV_ENCRYPT_KEY
NICE_RETURN_URL=https://your-dev-domain.com/auth/callback
NICE_ERROR_URL=https://your-dev-domain.com/auth/error
```

#### 운영 환경 (.env.production)
```env
NICE_SITE_CODE=YOUR_PROD_SITE_CODE
NICE_SITE_PASSWORD=YOUR_PROD_SITE_PASSWORD
NICE_ENCRYPT_KEY=YOUR_PROD_ENCRYPT_KEY
NICE_RETURN_URL=https://your-prod-domain.com/auth/callback
NICE_ERROR_URL=https://your-prod-domain.com/auth/error
```

### 2.2 설정 파일 수정

`src/config/niceAuth.ts` 파일에서 실제 값으로 교체:

```typescript
export const NICE_AUTH_CONFIG = {
  development: {
    siteCode: '실제_개발_사이트_코드',
    sitePassword: '실제_개발_사이트_비밀번호',
    returnUrl: 'https://your-dev-domain.com/auth/callback',
    errorUrl: 'https://your-dev-domain.com/auth/error',
    apiUrl: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
    encryptKey: '실제_개발_암호화_키',
  },
  // ... production 설정도 동일하게 수정
};
```

## 3. 사용 방법

### 3.1 컴포넌트에서 사용

```typescript
import NiceAuthModal from '../components/NiceAuthModal';

const [showNiceAuthModal, setShowNiceAuthModal] = useState(false);
const [authData, setAuthData] = useState(null);

// 본인인증 모달 열기
const openAuthModal = () => {
  setShowNiceAuthModal(true);
};

// 인증 성공 처리
const handleAuthSuccess = (data) => {
  setAuthData(data);
  setShowNiceAuthModal(false);
  console.log('인증 성공:', data);
};

// 컴포넌트 렌더링
<NiceAuthModal
  visible={showNiceAuthModal}
  onClose={() => setShowNiceAuthModal(false)}
  onSuccess={handleAuthSuccess}
/>
```

### 3.2 인증 데이터 구조

```typescript
interface AuthData {
  name: string;      // 인증된 이름
  phone: string;     // 인증된 휴대폰번호
  birth: string;     // 생년월일 (YYYYMMDD)
  gender: string;    // 성별 (남성/여성)
  ci: string;        // 연결정보 (Connection Information)
  di: string;        // 중복가입확인정보 (Duplicate Information)
}
```

## 4. 개발/운영 환경 전환

### 4.1 개발 환경 (시뮬레이션)
- `simulateNiceAuth()` 함수 사용
- 실제 API 호출 없이 테스트 가능
- 2초 후 성공 응답 시뮬레이션

### 4.2 운영 환경 (실제 API)
- 실제 NICE API 호출
- `requestNiceAuthToken()` 및 `verifyNiceAuthResult()` 함수 사용
- 보안을 위해 서버 사이드에서 처리 권장

## 5. 보안 주의사항

### 5.1 클라이언트 보안
- 사이트 비밀번호와 암호화 키는 절대 클라이언트에 노출하지 않음
- 운영 환경에서는 반드시 환경변수로 관리
- HTTPS 통신 필수

### 5.2 서버 사이드 처리 권장
```typescript
// 권장: 서버에서 NICE API 호출
const authResult = await fetch('/api/nice-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, phone, birth, gender })
});

// 비권장: 클라이언트에서 직접 API 호출
const authResult = await requestNiceAuthToken({ name, phone, birth, gender });
```

## 6. 에러 처리

### 6.1 주요 에러 코드
- `0000`: 성공
- `0001`: 유효하지 않은 사이트 코드
- `0002`: 유효하지 않은 사이트 비밀번호
- `9999`: 시스템 오류

### 6.2 에러 처리 예시
```typescript
const handleAuthError = (errorCode, errorMessage) => {
  switch (errorCode) {
    case '0001':
      Alert.alert('설정 오류', '사이트 코드를 확인해주세요.');
      break;
    case '0002':
      Alert.alert('설정 오류', '사이트 비밀번호를 확인해주세요.');
      break;
    default:
      Alert.alert('인증 실패', errorMessage || '본인인증에 실패했습니다.');
  }
};
```

## 7. 테스트

### 7.1 개발 환경 테스트
1. 앱 실행
2. 회원가입 화면에서 "인증하기" 버튼 클릭
3. 본인인증 모달에서 정보 입력
4. "본인인증 시작" 버튼 클릭
5. 2초 후 성공 응답 확인

### 7.2 운영 환경 테스트
1. 실제 NICE API 키 설정
2. 실제 휴대폰번호로 인증 테스트
3. 인증 결과 검증

## 8. 트러블슈팅

### 8.1 자주 발생하는 문제

#### 모달이 열리지 않는 경우
- WebView 권한 확인
- react-native-webview 패키지 설치 확인

#### 인증이 실패하는 경우
- NICE API 키 설정 확인
- 네트워크 연결 상태 확인
- 리턴 URL 설정 확인

#### 암호화 오류가 발생하는 경우
- crypto-js 패키지 설치 확인
- 암호화 키 설정 확인

### 8.2 로그 확인
```typescript
// 개발 환경에서 로그 확인
console.log('NICE 인증 요청:', authRequest);
console.log('NICE 인증 결과:', authResult);
```

## 9. 추가 리소스

- [NICE 본인인증 API 문서](https://www.niceid.co.kr)
- [NICE 개발자 센터](https://developers.niceid.co.kr)
- [React Native WebView 문서](https://github.com/react-native-webview/react-native-webview) 