import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { BackButton } from "./BackButton";

export default function Header({title, backButton = true}: {title: string; backButton?: boolean}) {
  const router = useRouter();
  return (<View style={[styles.container,!backButton && {paddingHorizontal:24, paddingVertical: 18}]}>
    {backButton && <BackButton onPress={() => {router.back()}}/>}
    <Text style={styles.text}>{title}</Text>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#fff",
  },
  text: {
    //Heading1
    fontWeight: 700,
    fontSize: 24,
    height:28,
    lineHeight:24,
    fontFamily: "Pretendard-Bold",
    justifyContent: 'center',
    alignItems: 'center',
  },
});
