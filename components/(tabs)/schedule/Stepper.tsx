import StepCircle from "@/components/(tabs)/schedule/StepCircle";
import { Screens } from "@/constants/screens";
import { useScheduleStore } from "@/store/useScheduleStore";
import { Fragment, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
const stepLabels = [
  '날짜 선택',
  '여행 지역 선택',
  '체험장/장소 선택',
  '여행계획 추천',
  '여행계획 확정',
];

export default function Stepper() {
  const animatedValues = useRef(
    stepLabels.map(() => new Animated.Value(0))
  ).current;

  const currentStep = useScheduleStore(state => state.currentStep); // 0~7
  const currentStepperIndex = Screens[currentStep].step; // 0~4
  const currentStepKey = Screens[currentStep].key;
  useEffect(() => {
    animatedValues.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: currentStepperIndex > index ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  }, [currentStepperIndex]);

  return (
    <View style={[styles.stepper, currentStepKey.includes('Loading') && styles.hidden]}>
      {stepLabels.map((label, index) => {
        const animatedScale = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });

        const animatedOpacity = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        const lineAnimatedWidth = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        });

        return (
          <Fragment key={label}>
            <View style={styles.stepContainer}>
               <StepCircle
                isCompleted={currentStepperIndex > index}
                isCurrent={currentStepperIndex === index}
                animatedScale={animatedScale}
                animatedOpacity={animatedOpacity}
              />

              {currentStepperIndex === index && (
                <Text style={styles.label} numberOfLines={1}>
                  {label}
                </Text>
              )}
            </View>

            {index < stepLabels.length - 1 && (
              <View style={styles.line}>
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    styles.lineAnimated,
                    { width: lineAnimatedWidth },
                  ]}
                />
              </View>
            )}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
	stepper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		width: '100%',
		paddingVertical: 9,
		paddingHorizontal: 15,
		position: 'relative',
	},
	stepContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		position: 'relative',
	},
	circle: {
		width: 14,
		height: 14,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#A1AEBE',
		backgroundColor: '#FFF',
		marginBottom: 4,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	innerCircle: {
		width: 7,
		height: 7,
		borderRadius: 10,
		backgroundColor: '#007AFF',
		borderColor: '#007AFF',
	},
	line: {
		flex: 1,
		backgroundColor: '#A1AEBE',
		height: 1.5,
		marginHorizontal: 4,
		overflow: 'hidden',
		position: 'relative',
	},
	label: {
		fontSize: 10,
		color: '#3A88F4',
		fontWeight: 700,
		top: 18,
		position: 'absolute',
		textAlign: 'center',
		flexWrap: 'nowrap',
		width: 67,
	},
	activeLabel: {
		color: '#007AFF',
		fontWeight: 'bold',
	},
	hidden: {
		display: 'none',
	},
	lineAnimated: {
		backgroundColor: '#007AFF',
	},
});
