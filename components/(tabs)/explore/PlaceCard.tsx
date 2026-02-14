import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PlaceCardProps {
  id: string;
  image?: ImageSourcePropType;
  title: string;
  address: string;
}

const PlaceCard = ({ id, image, title, address }: PlaceCardProps) => {
  const router = useRouter();
  return (
    <View style={[styles.container]}>
      <Image style={styles.image} source={image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.address}>{address}</Text>
        {/* <View style={styles.scoreContainer}>
          <Image
            source={require("@/assets/images/star.png")}
            style={styles.star}Pl
          />
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.review}>({review})</Text>
        </View> */}
      </View>
      <CustomButton
        containerStyle={styles.buttonPosition}
        buttonType="small"
        text="자세히보기"
        textStyle={{ lineHeight: 14, fontSize: 14 }}
        onPress={() => {
          router.push({
            pathname: `/explore/detail/${id}` as any,
            params: { id: `${id}` },
          });
        }}
      />
    </View>
  );
};

export default PlaceCard;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: "row",
    gap: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 8.8,
  },
  contentContainer: {
    gap: 4,
  },
  title: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
  },
  address: {
    fontSize: 12,
    fontWeight: 300,
    color: "#747474",
  },
  scoreContainer: {
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    width: 18,
    height: 18,
    marginRight: -3,
  },
  score: {
    color: "#333333",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 14,
  },
  review: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: "#8E9297",
  },
  buttonPosition: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
});
