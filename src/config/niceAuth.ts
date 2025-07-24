// NICE 본인인증 API 설정
export const NICE_AUTH_CONFIG = {
  // 개발 환경 설정
  development: {
    siteCode: 'YOUR_DEV_SITE_CODE',
    sitePassword: 'YOUR_DEV_SITE_PASSWORD',
    returnUrl: 'https://your-dev-domain.com/auth/callback',
    errorUrl: 'https://your-dev-domain.com/auth/error',
    apiUrl: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
    encryptKey: 'YOUR_DEV_ENCRYPT_KEY',
  },
  
  // 운영 환경 설정
  production: {
    siteCode: process.env.NICE_SITE_CODE || 'YOUR_PROD_SITE_CODE',
    sitePassword: process.env.NICE_SITE_PASSWORD || 'YOUR_PROD_SITE_PASSWORD',
    returnUrl: process.env.NICE_RETURN_URL || 'https://your-prod-domain.com/auth/callback',
    errorUrl: process.env.NICE_ERROR_URL || 'https://your-prod-domain.com/auth/error',
    apiUrl: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
    encryptKey: process.env.NICE_ENCRYPT_KEY || 'YOUR_PROD_ENCRYPT_KEY',
  },
};

// 현재 환경에 따른 설정 반환
export const getNiceAuthConfig = () => {
  const isDevelopment = __DEV__;
  return isDevelopment ? NICE_AUTH_CONFIG.development : NICE_AUTH_CONFIG.production;
};

// NICE API 응답 코드
export const NICE_RESPONSE_CODES = {
  SUCCESS: '0000',
  INVALID_SITE_CODE: '0001',
  INVALID_SITE_PASSWORD: '0002',
  INVALID_REQUEST_DATA: '0003',
  INVALID_RETURN_URL: '0004',
  INVALID_ERROR_URL: '0005',
  INVALID_REQ_SEQ: '0006',
  INVALID_REQ_DATE: '0007',
  INVALID_REQ_TIME: '0008',
  INVALID_REQ_NAME: '0009',
  INVALID_REQ_BIRTH: '0010',
  INVALID_REQ_GENDER: '0011',
  INVALID_REQ_PHONE: '0012',
  INVALID_REQ_MOBILE: '0013',
  SYSTEM_ERROR: '9999',
};

// NICE API 응답 메시지
export const NICE_RESPONSE_MESSAGES = {
  [NICE_RESPONSE_CODES.SUCCESS]: '성공',
  [NICE_RESPONSE_CODES.INVALID_SITE_CODE]: '유효하지 않은 사이트 코드',
  [NICE_RESPONSE_CODES.INVALID_SITE_PASSWORD]: '유효하지 않은 사이트 비밀번호',
  [NICE_RESPONSE_CODES.INVALID_REQUEST_DATA]: '유효하지 않은 요청 데이터',
  [NICE_RESPONSE_CODES.INVALID_RETURN_URL]: '유효하지 않은 리턴 URL',
  [NICE_RESPONSE_CODES.INVALID_ERROR_URL]: '유효하지 않은 에러 URL',
  [NICE_RESPONSE_CODES.INVALID_REQ_SEQ]: '유효하지 않은 요청 시퀀스',
  [NICE_RESPONSE_CODES.INVALID_REQ_DATE]: '유효하지 않은 요청 날짜',
  [NICE_RESPONSE_CODES.INVALID_REQ_TIME]: '유효하지 않은 요청 시간',
  [NICE_RESPONSE_CODES.INVALID_REQ_NAME]: '유효하지 않은 요청자 이름',
  [NICE_RESPONSE_CODES.INVALID_REQ_BIRTH]: '유효하지 않은 생년월일',
  [NICE_RESPONSE_CODES.INVALID_REQ_GENDER]: '유효하지 않은 성별',
  [NICE_RESPONSE_CODES.INVALID_REQ_PHONE]: '유효하지 않은 전화번호',
  [NICE_RESPONSE_CODES.INVALID_REQ_MOBILE]: '유효하지 않은 휴대폰번호',
  [NICE_RESPONSE_CODES.SYSTEM_ERROR]: '시스템 오류',
};

// NICE API 사용 가이드
export const NICE_API_GUIDE = {
  // 1. NICE 본인인증 서비스 신청
  // - NICE평가정보(https://www.niceid.co.kr)에서 본인인증 서비스 신청
  // - 사이트 코드, 사이트 비밀번호, 암호화 키 발급
  
  // 2. 환경 설정
  // - 개발 환경: NICE_AUTH_CONFIG.development 설정
  // - 운영 환경: 환경변수 또는 NICE_AUTH_CONFIG.production 설정
  
  // 3. API 호출 순서
  // 1) requestNiceAuthToken(): 인증 토큰 요청
  // 2) 사용자가 NICE 본인인증 페이지에서 인증 진행
  // 3) verifyNiceAuthResult(): 인증 결과 검증
  
  // 4. 보안 주의사항
  // - 사이트 비밀번호와 암호화 키는 절대 클라이언트에 노출하지 않음
  // - 운영 환경에서는 반드시 환경변수로 관리
  // - HTTPS 통신 필수
  
  // 5. 테스트
  // - 개발 환경에서는 simulateNiceAuth() 함수 사용
  // - 운영 환경에서는 실제 NICE API 사용
}; 