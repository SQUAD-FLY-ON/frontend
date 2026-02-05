import { Text, View } from "react-native";

// Day 헤더 컴포넌트
interface DayHeaderProps {
  title: string;
  styles: any;
}
const DayHeader = ({ title, styles }: DayHeaderProps) => (
  <View style={styles.dayHeader}>
    <Text style={styles.dayTitle}>{title}</Text>
  </View>
);

export default DayHeader