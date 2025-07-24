import CryptoJS from 'crypto-js';
import { getNiceAuthConfig, NICE_RESPONSE_CODES, NICE_RESPONSE_MESSAGES } from '../../../config/niceAuth';

// NICE 본인인증 API 설정
const NICE_CONFIG = getNiceAuthConfig();

export interface NiceAuthRequest {
  name: string;
  phone: string;
  birth: string;
  gender: string;
}

export interface NiceAuthResponse {
  success: boolean;
  token?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface NiceAuthResult {
  success: boolean;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  ci: string;
  di: string;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * NICE 본인인증 토큰 요청
 */
export const requestNiceAuthToken = async (data: NiceAuthRequest): Promise<NiceAuthResponse> => {
  try {
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
      returnUrl: NICE_CONFIG.returnUrl,
      errorUrl: NICE_CONFIG.errorUrl,
      reqSeq: generateReqSeq(), // 요청 시퀀스 (고유값)
      reqDate: timestamp,
      reqTime: timestamp,
      reqName: data.name,
      reqBirth: data.birth,
      reqGender: data.gender,
      reqPhone: data.phone,
      reqMobile: data.phone,
    };

    // 데이터 암호화
    const encryptedData = encryptNiceData(requestData);

    // API 요청
    const response = await fetch(NICE_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        data: encryptedData,
      }),
    });

    const result = await response.json();

    if (result.resultCode === '0000') {
      return {
        success: true,
        token: result.token,
      };
    } else {
      return {
        success: false,
        errorCode: result.resultCode,
        errorMessage: result.resultMessage || '인증 토큰 요청 실패',
      };
    }
  } catch (error) {
    console.error('NICE 인증 토큰 요청 오류:', error);
    return {
      success: false,
      errorCode: '9999',
      errorMessage: '네트워크 오류가 발생했습니다.',
    };
  }
};

/**
 * NICE 본인인증 결과 검증
 */
export const verifyNiceAuthResult = async (encData: string, integrityValue: string): Promise<NiceAuthResult> => {
  try {
    // 데이터 복호화
    const decryptedData = decryptNiceData(encData);
    
    // 무결성 검증
    if (!verifyIntegrity(decryptedData, integrityValue)) {
      return {
        success: false,
        name: '',
        phone: '',
        birth: '',
        gender: '',
        ci: '',
        di: '',
        errorCode: '0001',
        errorMessage: '데이터 무결성 검증 실패',
      };
    }

    // 인증 결과 파싱
    const authResult = parseAuthResult(decryptedData);

    return {
      success: true,
      name: authResult.name,
      phone: authResult.phone,
      birth: authResult.birth,
      gender: authResult.gender,
      ci: authResult.ci,
      di: authResult.di,
    };
  } catch (error) {
    console.error('NICE 인증 결과 검증 오류:', error);
    return {
      success: false,
      name: '',
      phone: '',
      birth: '',
      gender: '',
      ci: '',
      di: '',
      errorCode: '9999',
      errorMessage: '인증 결과 검증 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 요청 시퀀스 생성 (고유값)
 */
const generateReqSeq = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `REQ_${timestamp}_${random}`;
};

/**
 * NICE 데이터 암호화
 */
const encryptNiceData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, NICE_CONFIG.encryptKey).toString();
    return encrypted;
  } catch (error) {
    console.error('데이터 암호화 오류:', error);
    throw new Error('데이터 암호화 실패');
  }
};

/**
 * NICE 데이터 복호화
 */
const decryptNiceData = (encryptedData: string): any => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, NICE_CONFIG.encryptKey);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('데이터 복호화 오류:', error);
    throw new Error('데이터 복호화 실패');
  }
};

/**
 * 무결성 검증
 */
const verifyIntegrity = (data: any, integrityValue: string): boolean => {
  try {
    // 실제 구현에서는 NICE에서 제공하는 무결성 검증 로직 사용
    // 여기서는 간단한 예시로 구현
    const dataHash = CryptoJS.SHA256(JSON.stringify(data)).toString();
    return dataHash === integrityValue;
  } catch (error) {
    console.error('무결성 검증 오류:', error);
    return false;
  }
};

/**
 * 인증 결과 파싱
 */
const parseAuthResult = (data: any): any => {
  return {
    name: data.name || '',
    phone: data.phone || data.mobile || '',
    birth: data.birth || '',
    gender: data.gender || '',
    ci: data.ci || '',
    di: data.di || '',
  };
};

/**
 * 개발/테스트용 시뮬레이션 함수
 */
export const simulateNiceAuth = async (data: NiceAuthRequest): Promise<NiceAuthResult> => {
  // 개발 환경에서만 사용
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        gender: data.gender === '1' ? '남성' : '여성',
        ci: 'CI_' + Date.now(),
        di: 'DI_' + Date.now(),
      });
    }, 2000);
  });
}; 