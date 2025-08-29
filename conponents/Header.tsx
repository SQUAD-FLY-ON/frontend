import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { BackButton } from "./BackButton";

export default function Header({title}: {title: string;}) {
  const router = useRouter();
  return (<View style={styles.container}>
    <BackButton onPress={() => {router.back()}}/>
    <Text style={styles.text}>{title}</Text>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
  },
  text: {
    //Heading1
    fontWeight: 700,
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
  }
});