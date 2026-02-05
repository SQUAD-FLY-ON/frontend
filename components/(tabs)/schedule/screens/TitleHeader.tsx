import { StyleSheet, Text, View, ViewStyle } from "react-native";

export default function TitleHeader({ title, description, style }: { title: string; description: string, style?: ViewStyle }) {
  return (<View style={[styles.container,style]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>)
}
const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 28,
    gap: 8,
    alignItems: 'center',
  },
  title: {
    fontFamily:'Pretendard-Bold',
    fontWeight: 600,
    fontSize: 22,
  },
  description: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    fontWeight: 400,
    color: '#747474',
  }
})