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
    verifyTokens(navigation);
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
