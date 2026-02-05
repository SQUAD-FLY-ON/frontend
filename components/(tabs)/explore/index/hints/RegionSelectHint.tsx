import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const RegionSelectHint = ({ visible }: {visible: boolean}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={[styles.hintContainer, { opacity: fadeAnim }]}>
      <Text style={styles.hintText}>체험장을 탐색할 지역을 선택하세요.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hintContainer: {
    backgroundColor: '#ECF4FE',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'absolute',
    top: 16,
    zIndex: 200,
    alignSelf: 'center',
  },
  hintText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#333333',
  },
});

export default RegionSelectHint;
