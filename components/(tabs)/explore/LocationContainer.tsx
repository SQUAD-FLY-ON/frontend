import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ILocationContainerProps {
  image: ImageSourcePropType;
  title: string;
}
export default function LocationContainer({
  image,
  title,
}: ILocationContainerProps) {
  return (
    <View style={styles.container}>
      <Image source={image} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 168,
    flexDirection: "column",
    gap: 4.2,
  },
  text: {
    fontWeight: 600,
    fontSize: 16.8,
  },
});
