import Logo from "@/components/icons/Logo";
import Colors from "@/constants/colors";
import { StyleSheet, View } from "react-native";

export default function FooterSection() {
  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        {/* <View style={styles.footerRow}>
          <Text style={styles.text}>이용약관</Text>
          <Text style={styles.text}>고객센터</Text>
          <Text style={styles.text}>운영정책</Text>
          <Text style={styles.text}>신고센터</Text>
        </View> */}
        <Logo />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ECF4FE",
    marginBottom: 98,
  },
  footerContainer: {
    gap: 12,
    marginTop: 41,
    alignItems: "center",
    marginBottom: 50,
  },
  footerRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.text.text70,
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    height: 17,
    lineHeight: 17,
  },
});
