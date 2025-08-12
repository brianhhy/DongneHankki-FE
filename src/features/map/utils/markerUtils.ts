// industryCode에 따라 마커 이미지를 결정하는 함수

export const getMarkerImage = (industryCode: string | number): any => {
  console.log('getMarkerImage 호출됨, industryCode:', industryCode, '타입:', typeof industryCode);
  
  // 문자열로 변환
  const code = String(industryCode);
  
  // 카페 관련 업종 (제과, 커피 전문점)
  if (code === '2501' || code === '2502') {
    console.log('카페 아이콘 반환');
    return require('../assets/images/coffee.png');
  }
  
  // 소매품점 관련 업종 (마트 & 슈퍼마켓, 편의점)
  if (code === '5201' || code === '5202') {
    console.log('소매점 아이콘 반환');
    return require('../assets/images/retail.png');
  }
  
  // 나머지 업종 (음식점, 식료품점 등)
  console.log('음식점 아이콘 반환');
  return require('../assets/images/restaurant.png');
};