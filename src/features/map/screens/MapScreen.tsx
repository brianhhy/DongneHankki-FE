import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StatusBar, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapMarkerOverlay, type MarkerSymbol } from '@mj-studio/react-native-naver-map';
import { SearchInput } from '../components/SearchInput';
import { TabButton } from '../components/TabButton';
import CustomBottomSheet from '../components/BottomSheet';
import { useMapList } from '../hooks/useMapList';
import { useLocation } from '../hooks/useLocation';
import { getMarkerImage } from '../utils/markerUtils';
import { useMapStore } from '../store/mapStore';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 위치 버튼 아이콘 추가

const MapScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>(); // 단일 선택으로 변경
  const snapPoints = ['8%', '40%', '70%']; // snapPoints를 MapScreen에서 정의
  const [bottomSheetIndex, setBottomSheetIndex] = useState(1); // 기본 상태로 설정
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  
  // 카메라 상태 추가
  const [camera, setCamera] = useState({
    latitude: 37.4775,
    longitude: 126.8660,
    zoom: 15,
  });

  // 사용자 위치 가져오기
  const { location, loading: locationLoading, error: locationError } = useLocation();
  
  // 위치 받아오면 카메라 상태 갱신
  useEffect(() => {
    if (location) {
      setCamera({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 19,
      });
    }
  }, [location]);
  
  // API에서 마커 데이터 가져오기 (사용자 위치 기준)
  const { loading, error } = useMapList(
    camera.latitude,
    camera.longitude,
    camera.zoom
  );
  
  // 필터링된 마커 데이터 가져오기
  const { getFilteredClusterMarkers } = useMapStore();
  const clusterMarkers = getFilteredClusterMarkers();


  const handleSearch = () => {
    console.log('검색:', searchText);
  };

  const handleVoiceSearch = () => {
    console.log('음성 검색');
  };

  const handleTabPress = (tab: string) => {
    setSelectedTab(prev => prev === tab ? '' : tab);
  };

  const { setSelectedStore, getStoreById } = useMapStore();

  const handleMarkerPress = useCallback((marker: any) => {
    // 마커의 identifier로 해당 매장 정보 찾기
    const storeId = parseInt(marker.identifier);
    const selectedStore = getStoreById(storeId);
    
    if (selectedStore) {
      setSelectedStore(selectedStore);
      setBottomSheetIndex(2);
    }
  }, [setSelectedStore, getStoreById]);

  const handleBottomSheetChange = useCallback((index: number) => {
    setBottomSheetIndex(index);
  }, []);

  const handleCameraChange = useCallback((event: any) => {
    const { latitude, longitude, zoom } = event;
    console.log('카메라 변경:', { latitude, longitude, zoom });
  }, []);

  // 화면 정중앙 높이에 버튼 고정
  const screenHeight = Dimensions.get('window').height;
  const buttonHeight = 20; // 버튼 높이(패딩 포함) 대략값
  const fixedBottom = screenHeight / 1.25 - buttonHeight / 1.25;

  return (
    <View style={styles.container}>
      {/* 상태바를 투명하게 설정 */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* 전체 화면 지도 */}
      <NaverMapView
        ref={mapRef}
        style={styles.map}
        camera={camera}
        onCameraChanged={handleCameraChange}
        isShowLocationButton={true}
        isShowZoomControls={true}
        clusters={[
          {
            markers: clusterMarkers.map(marker => ({
              ...marker,
              image: getMarkerImage(marker.industryCode),
              width: 24,
              height: 24
            })),
            screenDistance: 100, // 화면상 100픽셀 거리 내의 마커들을 클러스터링
            minZoom: 0, // 최소 클러스터링
            maxZoom: 17, // 최대 클러스터링
            animate: true, // 애니메이션
          }
        ]}
      >
      </NaverMapView>
      
      <View style={styles.overlayContainer}>
        <View style={[styles.topContainer, { marginTop: insets.top + 20 }]}>
          <View style={styles.searchContainer}>
            <SearchInput
              value={searchText}
              onChangeText={setSearchText}
              onSearch={handleSearch}
              onVoiceSearch={handleVoiceSearch}
              placeholder="검색"
            />
          </View>
          
          <View style={styles.tabContainer}>
            <TabButton
              selectedTab={selectedTab}
              onTabPress={handleTabPress}
            />
          </View>
        </View>
      </View>
      <CustomBottomSheet 
        index={bottomSheetIndex}
        onChange={setBottomSheetIndex}
        selectedTab={selectedTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
  } as ViewStyle,
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '99%',
  } as ViewStyle,
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
  } as ViewStyle,
  topContainer: {
    paddingHorizontal: 16,
    zIndex: 1000,
  } as ViewStyle,
  searchContainer: {
    zIndex: 1000,
  } as ViewStyle,
  tabContainer: {
    marginTop: 16,
    zIndex: 1000,
  } as ViewStyle,
  markerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  markerInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  markerDescription: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    lineHeight: 24,
  },
  locationButtonContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 2000,
  },
  locationButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocationMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4FC3F7', // 밝은 파란색
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default MapScreen;
