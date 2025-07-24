import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RegisterHeader from '../components/RegisterHeader';
import PostcodeSearchModal from '../components/PostcodeSearchModal';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { common } from '../../../shared/styles/commonStyles';

interface OwnerRegisterScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'OwnerRegister'>;
}

const OwnerRegisterScreen: React.FC<OwnerRegisterScreenProps> = ({ navigation }) => {
  const [storeName, setStoreName] = useState('');
  const [zonecode, setZonecode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [addressDetailError, setAddressDetailError] = useState('');
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);
  const route = useRoute<RouteProp<AuthStackParamList, 'OwnerRegister'>>();
  const { id, password, name, userType, phone } = route.params;
  const onNext = () => {
    let valid = true;
    console.log("HIHI");
    if (!storeName) {
      setStoreNameError('상호명을 입력하세요.');
      valid = false;
    } else {
      setStoreNameError('');
    }
    if (!address) {
      setAddressError('가게 위치를 입력하세요.');
      valid = false;
    } else {
      setAddressError('');
    }
    
    if (!addressDetail) {
      setAddressDetailError('가게 상세위치를 입력하세요.');
      valid = false;
    } else {
      setAddressDetailError('');
    }
    if (valid) {
      navigation.navigate('RegisterTerms', {
        id, 
        password,
        name,
        phone,
        userType: 'owner',
        address,
        addressDetail,
        storeName
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={common.container}>
      <RegisterHeader title="회원가입" step={3} onBack={() => navigation.goBack()} />
      <Text style={styles.subtitle}>가게의 위치정보와{"\n"}상호명을 기입해주세요!</Text>
      <View style={styles.formWrapper}>
        <Text style={common.label}>주소 <Text style={styles.star}>*</Text></Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => setPostcodeModalVisible(true)}>
          <Text style={styles.searchButtonText}>우편번호 검색</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPostcodeModalVisible(true)}>
          <TextInput
            style={common.input}
            value={zonecode ? `${zonecode} ${address}` : ''}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        <TextInput
          style={common.input}
          placeholder="상세주소 기입"
          value={addressDetail}
          onChangeText={setAddressDetail}
        />
        {!!addressError && <Text style={common.errorMsg}>{addressError}</Text>}
        {!!addressDetailError && <Text style={common.errorMsg}>{addressDetailError}</Text>}

        <Text style={common.label}>상호명 <Text style={common.star}>*</Text></Text>
        <View style={common.row}>
          <TextInput
            style={[common.input, { flex: 1 }]}
            value={storeName}
            onChangeText={setStoreName}
          />
          
        </View>
        {!!storeNameError && <Text style={common.errorMsg}>{storeNameError}</Text>}

        <TouchableOpacity style={common.brownButton} onPress={onNext}>
          <Text style={common.brownButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
      <PostcodeSearchModal
        visible={postcodeModalVisible}
        onClose={() => setPostcodeModalVisible(false)}
        onSelect={(zone: string, addr: string) => {
          setZonecode(zone);
          setAddress(addr);
          setPostcodeModalVisible(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'stretch',
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  formWrapper: {
    paddingHorizontal: 24,
    flex: 1,
  },
  subtitle: {
    fontSize: 30,
    color: '#222',
    textAlign: 'center',
    marginVertical: 48,
    fontWeight: '400',
  },
  star: {
    color: '#FF0000',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 1,
    height: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 63,
    marginVertical: 5,
  },
  searchButton: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E1404',
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 63,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    fontSize: 16,
  },
  searchButtonText: {
    color: '#2E1404',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OwnerRegisterScreen;
