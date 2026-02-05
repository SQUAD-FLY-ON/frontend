import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function LoadingComponent() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const bounce = (dot: Animated.Value) => {
    return Animated.sequence([
      Animated.timing(dot, {
        toValue: -6,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(dot, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
  };

  const runSequence = () => {
    Animated.sequence([
      bounce(dots[0]),
      Animated.delay(10),   // 점 간 간격 더 짧게
      bounce(dots[1]),
      Animated.delay(10),
      bounce(dots[2]),
      Animated.delay(80),   // 전체 반복 텀 (총 주기 = 약 600ms)
    ]).start(() => {
      runSequence();
    });
  };

  useEffect(() => {
    runSequence();
  }, []);

  return (
    <View style={styles.container}>
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            { transform: [{ translateY: dot }] },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop:90,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2F80ED',
  },
});
