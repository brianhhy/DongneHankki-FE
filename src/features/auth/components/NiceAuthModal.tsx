import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { simulateNiceAuth, NiceAuthRequest } from '../services/niceAuthService';

interface NiceAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (data: {
    name: string;
    phone: string;
    birth: string;
    gender: string;
    ci: string;
    di: string;
  }) => void;
}

const NiceAuthModal: React.FC<NiceAuthModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  // NICE 공식 본인인증 페이지 URL
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // NICE 본인인증 시작
  const startNiceAuth = async () => {
    setIsLoading(true);
    try {
      //개발 환경에서는 시뮬레이션
      if (__DEV__) {
        setTimeout(() => {
          const mockResult = {
            success: true,
            name: '홍길동',
            phone: '01012345678',
            birth: '19900101',
            gender: '남성',
            ci: 'CI_' + Date.now(),
            di: 'DI_' + Date.now(),
          };
          onSuccess(mockResult);
          setIsLoading(false);
        }, 2000);
        return;
      }

      // 실제 NICE API 호출 (운영 환경)
      const response = await fetch('https://your-api-server.com/nice-auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: 'https://your-domain.com/auth/callback',
          errorUrl: 'https://your-domain.com/auth/error',
        }),
      });

      const result = await response.json();
      
      if (result.success && result.authUrl) {
        setAuthUrl(result.authUrl);
      } else {
        Alert.alert('오류', '본인인증을 시작할 수 없습니다.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('NICE 인증 시작 오류:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 자동으로 인증 시작
  React.useEffect(() => {
    if (visible) {
      startNiceAuth();
    }
  }, [visible]);

  const handleMessage = (event: WebViewMessageEvent) => {
    // NICE 공식 페이지에서는 메시지 통신이 필요 없음
    console.log('WebView 메시지:', event.nativeEvent.data);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>본인인증</Text>
          <View style={styles.placeholder} />
        </View>

        {authUrl ? (
          <WebView
            ref={webViewRef}
            source={{ uri: authUrl }}
            onMessage={handleMessage}
            onLoadEnd={handleLoadEnd}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
            onNavigationStateChange={(navState) => {
              // NICE 인증 완료 후 리턴 URL로 돌아왔을 때 처리
              if (navState.url.includes('auth/callback')) {
                // URL 파라미터에서 인증 결과 파싱
                const urlParams = new URLSearchParams(navState.url.split('?')[1]);
                const encData = urlParams.get('enc_data');
                const integrityValue = urlParams.get('integrity_value');
                
                if (encData && integrityValue) {
                  // 인증 결과 검증 (실제로는 서버에서 처리)
                  const mockResult = {
                    success: true,
                    name: '홍길동',
                    phone: '01012345678',
                    birth: '19900101',
                    gender: '남성',
                    ci: 'CI_' + Date.now(),
                    di: 'DI_' + Date.now(),
                  };
                  onSuccess(mockResult);
                }
              }
            }}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {isLoading ? '본인인증을 준비 중입니다...' : '본인인증을 시작할 수 없습니다.'}
            </Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E1404',
  },
  placeholder: {
    width: 40,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default NiceAuthModal; 