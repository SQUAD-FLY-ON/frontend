import AntDesign from "@expo/vector-icons/AntDesign";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

interface StepCircleProps {
  isCompleted: boolean;
  isCurrent: boolean;
  animatedScale: Animated.AnimatedInterpolation<number>;
  animatedOpacity: Animated.AnimatedInterpolation<number>;
  style?: ViewStyle
}

export default function StepCircle({ 
  isCompleted = true, 
  isCurrent= false, 
  animatedScale, 
  animatedOpacity,
  style,
}: StepCircleProps) {
  return (
    <Animated.View
      style={[
        styles.circle,
        isCompleted && {
          backgroundColor: '#007AFF',
          borderWidth: 0,
        },
        { transform: [{ scale: animatedScale }] },
        style
      ]}
    >
      {isCompleted && (
        <Animated.View style={{ opacity: animatedOpacity }}>
          <AntDesign name="check" size={10} color="white" />
        </Animated.View>
      )}
      {isCurrent && <View style={styles.innerCircle} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
});