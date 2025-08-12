import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TABS, COLORS, ICON_SIZES } from '../constants/constants';

interface TabButtonProps {
  selectedTab?: string;
  onTabPress: (tab: string) => void;
  tabs?: Array<{ id: string; label: string; icon: string; iconType: string }>;
}

export const TabButton: React.FC<TabButtonProps> = ({ 
  selectedTab, 
  onTabPress, 
  tabs = TABS 
}) => {
  const handleTabPress = (tabId: string) => {
    // 단일 선택: 현재 탭이 이미 선택되어 있다면 해제, 아니면 선택
    if (selectedTab === tabId) {
      // 현재 탭이 선택되어 있으면 해제
      onTabPress(tabId);
    } else {
      // 다른 탭을 선택
      onTabPress(tabId);
    }
  };

  const isSelected = (tabId: string) => {
    return selectedTab === tabId;
  };

  const renderIcon = (tab: { id: string; label: string; icon: string; iconType: string }) => {
    const iconColor = isSelected(tab.id) ? '#FFFFFF' : COLORS.TEXT_PRIMARY;
    const iconSize = ICON_SIZES.SMALL;

    if (tab.iconType === 'fontawesome5') {
      return (
        <FontAwesome5
          name={tab.icon}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      );
    } else {
      return (
        <Icon
          name={tab.icon}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              isSelected(tab.id) && styles.selectedTab,
            ]}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={1}
          >
            {renderIcon(tab)}
            <Text
              style={[
                styles.tabText,
                isSelected(tab.id) && styles.selectedTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent', // 투명 배경
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.TRANSPARENT_WHITE,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTab: {
    backgroundColor: COLORS.TRANSPARENT_PRIMARY,
  },
  icon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  selectedTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default TabButton; 