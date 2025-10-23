import CustomButton from "@/conponents/CustomButton";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

const FlightCard = ({
  id,
  name,
  date,
  data,
}: {
  id: string;
  name: string;
  date: string;
  data: any;
}) => {
  const router = useRouter();

  const onPress = () => {
    console.log(data);
    // 체험장 상세 페이지로 이동
    router.push({
      pathname: `/user/flight-detail/[id]`,
      params: { id, data: JSON.stringify(data) },
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/dummy_image_activity_area.png")}
        style={styles.image}
      />
      <View style={{ justifyContent: "center" }}>
        <Text style={[styles.text]}>{name}</Text>
        <Text style={[styles.subText]}>{date.slice(0, 10)}</Text>
      </View>
      <View style={styles.button}>
        <CustomButton onPress={onPress} buttonType="small" text="영상보기" />
      </View>
    </View>
  );
};

export default FlightCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 104,
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 8,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 8.8,
    marginRight: 12,
  },
  text: {
    fontFamily: "Pretendard-SemiBold",
    color: "#333",
    fontSize: 16,
    marginBottom: 4,
  },
  subText: {
    fontFamily: "Pretendard-Regular",
    color: "#747474",
    fontSize: 12,
    fontWeight: 300,
  },
  button: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
});
