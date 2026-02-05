import AntDesign from "@expo/vector-icons/AntDesign";
import { Animated, StyleSheet } from "react-native";

interface StepCircleProps {
  animatedScale: Animated.AnimatedInterpolation<number>;
  animatedOpacity: Animated.AnimatedInterpolation<number>;
}

export default function CompleteCircle({
  animatedScale,
  animatedOpacity,
}: StepCircleProps) {
  return (
    <Animated.View
      style={[
        styles.circle,
        { transform: [{ scale: animatedScale }] },
      ]}
    >
      <Animated.View style={{ opacity: animatedOpacity }}>
        <AntDesign name="check" size={32} color="white" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    borderColor: '#A1AEBE',
    backgroundColor: '#007AFF',
    borderWidth: 0,
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
});