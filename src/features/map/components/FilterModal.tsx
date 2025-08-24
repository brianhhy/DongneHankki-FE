import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../../shared/styles/globalStyles';
import { RATING_OPTIONS, TIME_RANGE_OPTIONS, COLORS, ICON_SIZES } from '../constants/constants';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (rating: number, timeRange: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleTimeRangeSelect = (timeRange: string) => {
    setSelectedTimeRange(timeRange);
  };

  const handleApplyFilter = () => {
    onApply(selectedRating, selectedTimeRange);
    onClose();
  };

  const handleResetFilter = () => {
    setSelectedRating(0);
    setSelectedTimeRange('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>평점</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>          
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingInstruction}>원하는 평점을 설정해보세요</Text>
                <Text style={styles.ratingDescription}>설정된 평점의 매장만 확인할 수 있어요</Text>
                
                <View style={styles.starsContainer}>
                  {RATING_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleRatingSelect(option.value)}
                      style={styles.starButton}
                    >
                      <Icon 
                        name={option.value <= selectedRating ? "star" : "star-outline"} 
                        size={ICON_SIZES.XLARGE} 
                        color={option.value <= selectedRating ? COLORS.WARNING : "#E5E5E5"} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={handleResetFilter} style={styles.resetButton}>
              <Ionicons name="reload" size={16} color="#000000" style={styles.resetIcon} />
              <Text style={styles.resetButtonText}>평점 재설정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApplyFilter} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>검색하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: FONTS.bold,
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: FONTS.bold,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
  },
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ratingInstruction: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: FONTS.bold,
  },
  ratingDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  timeContainer: {
    paddingVertical: 20,
  },
  timeInstruction: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: FONTS.bold,
  },
  timeDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 24,
  },
  timeOptions: {
    gap: 12,
  },
  timeOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: '#ffffff',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: {
    marginRight: 6,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3C35B',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#2E1404',
    fontWeight: 'bold',
  },
});

export default FilterModal; 