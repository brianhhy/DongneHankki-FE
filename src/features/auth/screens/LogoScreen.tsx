import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { verifyTokens } from '../../../shared/utils/tokenUtil';

type LogoScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LogoScreen = ({ navigation }: LogoScreenProps) => {
  useEffect(() => {
    const checkTokens = async () => {
      try {
        console.log("LogoScreen: 토큰 검증 시작");
        await verifyTokens(navigation);
      } catch (error) {
        console.error("LogoScreen: 토큰 검증 오류", error);
        // 오류 발생 시 로그인 화면으로 이동
        try {
          navigation.reset({ routes: [{ name: "Login" }] });
        } catch (navError) {
          console.error("LogoScreen: 네비게이션 오류", navError);
        }
      }
    };

    checkTokens();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../shared/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default LogoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 200,
    width: 200,
  },
  text: {
    fontSize: 24,
    marginTop: 20,
  },
});
