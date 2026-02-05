import { useScheduleStore } from "@/store/useScheduleStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Animated, BackHandler, Image, StyleSheet, Text, View } from "react-native";
import CompleteCircle from "../CompleteCircle";

export default function CompleteScreen() {
  
  const router = useRouter();
  const resetAllStates = useScheduleStore(state => state.resetAllStates);

  const animatedValue = new Animated.Value(0); // Animated.Value 인스턴스

  const animatedScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const animatedOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePressBack = () => {
    resetAllStates();
    router.push('/');
    return true;
  }
  // 애니메이션 실행
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false, // scale과 opacity 모두 사용하므로
    }).start();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    handlePressBack,
  );
  return () => {
    backHandler.remove();
  };
  }, [handlePressBack])
  return (<View style={styles.container}>
    <View style={styles.icon}>
      <View style={styles.circle}>
        <CompleteCircle animatedScale={animatedScale} animatedOpacity={animatedOpacity} />
      </View>
      <Image style={styles.image} source={require('@/assets/images/charactor_face.png')} />
      <View style={styles.textContainer}>
        <Text style={styles.bold}>일정 생성 완료!</Text>
        <View ><Text style={styles.regular}>일정 생성이 완료 되었어요 [나의 일정]에서</Text>
          <Text style={styles.regular}>생성된 일정을 확인 해보세요.</Text></View>
      </View>
    </View>
  </View>)
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    marginBottom: -22,
  },
  image: {
    width: 312,
    height: 286,
  },
  textContainer: {
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:-12,
},
  bold: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    fontWeight: 600,
  },
  regular: {
    color: '#747474',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    alignSelf: 'center',
  }
})