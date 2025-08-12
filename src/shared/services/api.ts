import axios from 'axios';
import { API_BASE_URL } from '@env';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터: 모든 요청에 자동으로 토큰 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().getRefreshToken();
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/refresh`, {
            refresh: refreshToken
          });
          
          if (response.data?.data?.accessToken) {
            const newAccessToken = response.data.data.accessToken;
            
            // Zustand store 업데이트
            useAuthStore.getState().setTokens({
              accessToken: newAccessToken,
              refreshToken: refreshToken,
            });
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        useAuthStore.getState().clearAuth();
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 