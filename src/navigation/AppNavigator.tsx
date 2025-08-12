import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import OwnerNavigator from './OwnerNavigator';
import { getTokenFromLocal } from '../shared/utils/tokenUtil';
import { useAuthStore } from '../shared/store/authStore';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Zustand store에서 인증 상태 가져오기
  const { isAuthenticated, role, accessToken } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getTokenFromLocal();
      
      if (token && token.accessToken && token.refreshToken) {
        console.log('인증된 사용자:', { role: token.role, userId: token.userId });
        // Zustand store 업데이트
        useAuthStore.getState().setAuth({
          role: token.role || 'customer',
          userId: token.userId || '',
          loginId: token.loginId || '',
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        });
      } else {
        console.log('인증되지 않은 사용자 - 로그인 화면으로 이동');

        useAuthStore.getState().clearAuth();
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      useAuthStore.getState().clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  const getInitialRouteName = () => {
    if (!isAuthenticated || !accessToken) {
      return 'Auth';
    }
    if (role === 'owner') {
      return 'Owner';
    }
    return 'Customer';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={getInitialRouteName()}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Customer" component={CustomerNavigator} />
        <Stack.Screen name="Owner" component={OwnerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
