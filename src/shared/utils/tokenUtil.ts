import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
const URL = 'https://dh.porogramr.site/api';

const showToast = (text: string) =>{
    Toast.show({
        type: 'error',
        position: 'bottom',
        text1: text,
      });
};

export const getTokens = async (
  id: string,
  password: string
): Promise<void> => {
  try {
    const res = await axios.post(`${URL}/login`, {
      loginId: id,
      password,
    });

    if (res.status === 200 && res.data.status === 'success') {
      await AsyncStorage.setItem(
        'Tokens',
        JSON.stringify({
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
        }),
      );
    } else {
      throw new Error(res.data.message || '로그인에 실패했습니다.');
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error(error.response.data.message || '가입되지 않은 id,pw 입니다');
    } else {
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
};

const getTokenFromLocal = async (): Promise<{
  accessToken: string;
  refreshToken: string;
  userId: string;
} | null> => {
  try {
    console.log("GETTOKEN");
    const value = await AsyncStorage.getItem("Tokens");
    if (value !== null) {
      return JSON.parse(value)
    } else {
      return null;
    }
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};


export const verifyTokens = async (
  navigation: NativeStackNavigationProp<any>
) => {
  const Token = await getTokenFromLocal();
  console.log("VERIFYTOKEN");

  // 최초 접속
  if (Token === null){
    navigation.reset({routes: [{name: "Login"}]});
  }
  // 로컬 스토리지에 Token데이터가 있으면 -> 토큰들을 헤더에 넣어 검증 
  else{
    const headers_config = {
      "refresh": Token.refreshToken,
      Authorization: `Bearer ${Token.accessToken}`   
    };

    try {
      const res = await axios.get(`${URL}/refresh`, {headers: headers_config})

      // accessToken 만료, refreshToken 정상 -> 재발급된 accessToken 저장 후 자동 로그인
      AsyncStorage.setItem('Tokens', JSON.stringify({
        ...Token,
        'accessToken': res.data.data.accessToken,
      }))
      navigation.reset({routes: [{name: "RegisterComplete"}]});

    } catch(error: any){
      const code = error.response?.data?.code; 

      // accessToken 만료, refreshToken 만료 -> 로그인 페이지
      if(code === 401){
        navigation.reset({routes: [{name: "Login"}]});
      }
      // accessToken 정상, refreshToken 정상 -> 자동 로그인
      else{
        navigation.reset({routes: [{name: "RegisterComplete"}]});
      }
    }

  }
};