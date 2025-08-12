import { useEffect } from 'react';
import { getMapData } from '../services/MapsAPI';
import { useMapStore } from '../store/mapStore';

interface Store {
  storeId: number;
  name: string;
  latitude: number;
  longitude: number;
  likeCount: number;
  address: string;
  industryName: string;
  industryCode: string;
}

interface GetMapResponse {
  status: string;
  code: string;
  message: string;
  data: Store[];
}

export const useMapList = (latitude: number, longitude: number, zoomLevel: number) => {
  const {
    storeList,
    clusterMarkers,
    loading,
    error,
    setStoreList,
    setClusterMarkers,
    setLoading,
    setError,
    convertToClusterMarkers,
  } = useMapStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: GetMapResponse = await getMapData(latitude, longitude, zoomLevel);
        console.log('API 응답 데이터:', data);
        console.log('현재 위치 기준:', { latitude, longitude, zoomLevel });
        
        const stores = data.data || [];
        console.log('매장 데이터:', stores);
        console.log('매장 개수:', stores.length);
        
        setStoreList(stores);
        
        // Store 데이터를 클러스터 마커로 변환
        const markers = convertToClusterMarkers(stores);
        console.log('변환된 마커 데이터:', markers);
        console.log('마커 개수:', markers.length);
        
        setClusterMarkers(markers);
      } catch (err) {
        console.error('API 에러:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [latitude, longitude, zoomLevel, setStoreList, setClusterMarkers, setLoading, setError, convertToClusterMarkers]);

  return { storeList, clusterMarkers, loading, error };
};
