import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoreListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>가게 목록 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#2E1404',
  },
});

export default StoreListScreen;
