import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';

const App = () => (
  <NavigationContainer>
    <AuthNavigator />
  </NavigationContainer>
);

export default App;
