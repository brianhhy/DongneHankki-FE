import React, { useRef } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Postcode from '@actbase/react-daum-postcode';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (zonecode: string, address: string) => void;
};

const PostcodeSearchModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const webviewRef = useRef<WebView>(null);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      onSelect(data.zonecode, data.address);
      onClose();
    } catch (e) {
      console.error('주소 메시지 처리 중 에러:', e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="overFullScreen" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ fontSize: 18 }}>닫기</Text>
          </TouchableOpacity>
          <Postcode
            style={{ width: '100%', height: '100%' }}
            onSelected={(data: any) => {
              onSelect(data.zonecode, data.address);
              onClose();
            }}
            onError={(error: unknown) => {
              console.error('주소 검색 중 에러:', error);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 16,
    backgroundColor: '#eee',
  },
  webview: {
    flex: 1,
  },
});

export default PostcodeSearchModal;
