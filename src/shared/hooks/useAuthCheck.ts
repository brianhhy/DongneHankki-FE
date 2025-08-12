import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { getTokenFromLocal } from '../utils/tokenUtil';

export const useAuthCheck = () => {
  const { accessToken, isAuthenticated, clearAuth } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await getTokenFromLocal();
        
        if (!token || !token.accessToken || !token.refreshToken) {
          console.log('토큰이 없음 - 인증 상태 초기화');
          clearAuth();
          return;
        }
        
        // Zustand store의 인증 상태도 확인
        if (!isAuthenticated || !accessToken) {
          console.log('인증 상태 불일치 - 인증 상태 초기화');
          clearAuth();
          return;
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        clearAuth();
      }
    };

    // 초기 체크
    checkAuthStatus();

    // 주기적으로 체크 (30초마다)
    intervalRef.current = setInterval(checkAuthStatus, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, accessToken, clearAuth]);

  return {
    isAuthenticated,
    accessToken,
  };
};


