import api from '../../../shared/services/api';

export const getMapData = async (latitude: number, longitude: number, zoomLevel: number) => {
  try {
    console.log('API 호출 시작 - URL:', `/api/maps`);
    console.log('요청 파라미터:', { latitude, longitude, zoomLevel });
    
    const response = await api.get('/api/maps', {
      params: {
        latitude,
        longitude,
        zoomLevel
      },
    });
    
    console.log('API 응답 성공:', response.status);
    console.log('응답 데이터:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('에러 응답 데이터:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};
