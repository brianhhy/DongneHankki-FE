import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface StoreInfoProps {
  storeName: string;
  location: string;
  operatingHours: string;
  rating: number;
  onSubscribe: () => void;
}

// 더미 데이터를 StoreInfo 컴포넌트로 이동
export const storeData = [
  {
    storeId: 1,
    name: "맛있는 카페",
    address: "서울시 강남구 테헤란로 123",
    industryCode: "2502", // 커피 전문점
  },
  {
    storeId: 2,
    name: "스타벅스 강남점",
    address: "서울시 강남구 역삼동 456",
    industryCode: "2502", // 커피 전문점
  },
  {
    storeId: 3,
    name: "이탈리안 레스토랑",
    address: "서울시 강남구 논현동 789",
    industryCode: "2305", // 서양식전문점
  },
  {
    storeId: 4,
    name: "분식집",
    address: "서울시 강남구 삼성동 321",
    industryCode: "2301", // 일반 음식점
  },
  {
    storeId: 5,
    name: "고급 스시집",
    address: "서울시 강남구 청담동 654",
    industryCode: "2303", // 일식전문점
  },
  {
    storeId: 6,
    name: "치킨집",
    address: "서울시 강남구 신사동 987",
    industryCode: "2309", // 치킨전문점
  },
  {
    storeId: 7,
    name: "베이커리",
    address: "서울시 강남구 압구정동 147",
    industryCode: "2501", // 제과
  },
  {
    storeId: 8,
    name: "중국집",
    address: "서울시 강남구 도산동 258",
    industryCode: "2302", // 중식전문점
  },
  {
    storeId: 9,
    name: "피자집",
    address: "서울시 강남구 신사동 369",
    industryCode: "2305", // 서양식전문점
  },
  {
    storeId: 10,
    name: "커피빈",
    address: "서울시 강남구 역삼동 741",
    industryCode: "2502", // 커피 전문점
  },
];

const StoreInfo: React.FC<StoreInfoProps> = ({
  storeName,
  location,
  operatingHours,
  rating,
  onSubscribe,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        size={16}
        color={index < rating ? '#FF9500' : '#E0E0E0'}
        style={styles.star}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* 정보 컨테이너 */}
      <View style={styles.infoContainer}>
        {/* 상호명과 아이콘 */}
        <View style={styles.nameRow}>
          <Text style={styles.storeName}>{storeName}</Text>
          <Icon name="restaurant" size={16} color="#000000" />
        </View>

        {/* 위치 정보 */}
        <Text style={styles.location}>{location}</Text>

        {/* 운영 시간 */}
        <Text style={styles.operatingHours}>{operatingHours}</Text>

        {/* 별점 */}
        <View style={styles.ratingContainer}>
          {renderStars(rating)}
        </View>

        {/* 구독 버튼 */}
        <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
          <Text style={styles.subscribeText}>#구독</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 8,
  },
  location: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  operatingHours: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    marginRight: 2,
  },
  subscribeButton: {
    backgroundColor: '#F3C35B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  subscribeText: {
    color: '#2E1404',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StoreInfo;
