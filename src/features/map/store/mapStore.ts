import { create } from 'zustand';

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

interface ClusterMarker {
  identifier: string;
  latitude: number;
  longitude: number;
  industryCode: string;
}

interface MapState {
  // 상태
  storeList: Store[];
  clusterMarkers: ClusterMarker[];
  loading: boolean;
  error: Error | null;
  selectedStore: Store | null;
  selectedIndustryCode: string | null; // 선택된 업종 코드
  
  // 액션
  setStoreList: (stores: Store[]) => void;
  setClusterMarkers: (markers: ClusterMarker[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setSelectedStore: (store: Store | null) => void;
  setSelectedIndustryCode: (industryCode: string | null) => void;
  
  // Store 데이터를 ClusterMarker 형태로 변환하는 함수
  convertToClusterMarkers: (stores: Store[]) => ClusterMarker[];
  
  // 선택된 매장 정보 가져오기
  getSelectedStore: () => Store | null;
  
  // 매장 ID로 매장 정보 가져오기
  getStoreById: (storeId: number) => Store | undefined;
  
  // 선택된 업종 코드로 필터링된 매장 목록 가져오기
  getFilteredStores: () => Store[];
  
  // 선택된 업종 코드로 필터링된 클러스터 마커 가져오기
  getFilteredClusterMarkers: () => ClusterMarker[];
}

export const useMapStore = create<MapState>((set, get) => ({
  // 초기 상태
  storeList: [],
  clusterMarkers: [],
  loading: false,
  error: null,
  selectedStore: null,
  selectedIndustryCode: null,
  
  // 액션들
  setStoreList: (stores) => set({ storeList: stores }),
  setClusterMarkers: (markers) => set({ clusterMarkers: markers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedStore: (store) => set({ selectedStore: store }),
  setSelectedIndustryCode: (industryCode) => set({ selectedIndustryCode: industryCode }),
  
  // Store 데이터를 ClusterMarker 형태로 변환하는 함수
  convertToClusterMarkers: (stores) => {
    return stores.map(store => ({
      identifier: store.storeId.toString(),
      latitude: store.latitude,
      longitude: store.longitude,
      industryCode: store.industryCode,
    }));
  },
  
  // 선택된 매장 정보 가져오기
  getSelectedStore: () => get().selectedStore,
  
  // 매장 ID로 매장 정보 가져오기
  getStoreById: (storeId) => {
    const { storeList } = get();
    return storeList.find(store => store.storeId === storeId);
  },
  
  // 선택된 업종 코드로 필터링된 매장 목록 가져오기
  getFilteredStores: () => {
    const { storeList, selectedIndustryCode } = get();
    if (!selectedIndustryCode) return storeList;
    return storeList.filter(store => store.industryCode === selectedIndustryCode);
  },
  
  // 선택된 업종 코드로 필터링된 클러스터 마커 가져오기
  getFilteredClusterMarkers: () => {
    const { clusterMarkers, selectedIndustryCode } = get();
    if (!selectedIndustryCode) return clusterMarkers;
    return clusterMarkers.filter(marker => marker.industryCode === selectedIndustryCode);
  },
}));
