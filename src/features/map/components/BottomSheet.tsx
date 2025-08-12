import React, { useCallback, useRef, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StoreInfo, { storeData } from './StoreInfo';
import FilterModal from './FilterModal';
import { useMapStore } from '../store/mapStore';

import { FONTS } from '../../../shared/styles/globalStyles';
import { TABS, LOCAL_CURRENCY_INFO, COLORS, ICON_SIZES } from '../constants/constants';

interface BottomSheetProps {
  children?: React.ReactNode;
  index?: number;
  onChange?: (index: number) => void;
  snapPoints?: string[];
  selectedTab?: string;
  selectedStore?: any;
}

const CustomBottomSheet: React.FC<BottomSheetProps> = ({
  children,
  index = 1,
  onChange,
  snapPoints = ['3%', '40%', '70%'],
  selectedTab,
  selectedStore,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const { selectedStore: storeSelectedStore } = useMapStore();
  
  // props로 받은 selectedStore가 있으면 사용, 없으면 store에서 가져온 것 사용
  const currentSelectedStore = selectedStore || storeSelectedStore;

  const handleSheetChange = useCallback((i: number) => {
    if (onChange) onChange(i);
    console.log("handleSheetChange", i);
  }, [onChange]);

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterApply = (rating: number, timeRange: string) => {
    console.log('적용된 필터:', { rating, timeRange });
  };

  // 선택된 탭에 따라 제목 결정
  const getTitle = () => {
    if (currentSelectedStore) {
      return currentSelectedStore.name;
    }
    if (selectedTab) {
      const selectedTabData = TABS.find(tab => tab.id === selectedTab);
      return selectedTabData ? selectedTabData.label : LOCAL_CURRENCY_INFO.title;
    }
    return LOCAL_CURRENCY_INFO.title;
  };

  return (
    <>
      <BottomSheet
          ref={bottomSheetRef}
          index={index}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          onChange={handleSheetChange}
          >
          <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <View style={styles.titleLeft}>
                <Icon name={LOCAL_CURRENCY_INFO.icon} size={ICON_SIZES.MEDIUM} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.titleText}>{getTitle()}</Text>
              </View>
              <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
                <Icon name="filter-variant" size={ICON_SIZES.MEDIUM} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            
            {currentSelectedStore ? (
              // 선택된 가게 정보 표시
              <StoreInfo
                key={currentSelectedStore.storeId}
                storeName={currentSelectedStore.name}
                location={currentSelectedStore.address}
                operatingHours={currentSelectedStore.industryName}
                rating={currentSelectedStore.likeCount || 4}
                onSubscribe={() => console.log(`${currentSelectedStore.name} 구독하기`)}
              />
            ) : (
              // 기본 가게 목록 표시
              storeData.map((store) => (
                <StoreInfo
                  key={store.storeId}
                  storeName={store.name}
                  location={store.address}
                  operatingHours="09:00-18:00"
                  rating={4}
                  onSubscribe={() => console.log(`${store.name} 구독하기`)}
                />
              ))
            )}
            
          </BottomSheetScrollView>
            </BottomSheet>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleFilterApply}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 10,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'left',
    fontFamily: FONTS.bold,
  },
  filterButton: {
    padding: 8,
  },
});

export default CustomBottomSheet;
