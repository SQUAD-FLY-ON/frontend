import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface NextStepHintProps {
  visible: boolean;
}

const NextStepHint= ({ visible }: NextStepHintProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>버튼을 눌러 다음 단계로 넘어가세요.</Text>
      </View>
      <Svg width="9" height="13" viewBox="0 0 9 13" fill="none">
        <Path
          d="M7.5 4.33013C8.83333 5.09993 8.83333 7.02443 7.5 7.79423L0 12.1244V0L7.5 4.33013Z"
          fill="white"
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    zIndex: 200,
    flexDirection: 'row',
  },
  hintContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hintText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFFFFF', // 말풍선 배경색과 동일
    marginLeft: -1, // 겹침 보정
  },
});

export default NextStepHint;
