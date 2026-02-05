import { TourismSchedule } from "@/types";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import CardContents from "./CardContents";


const DetailTravelCard = ({ 
  containerStyle, 
  onPress,
  schedule,
  loading = false
}: { 
  containerStyle?: ViewStyle, 
  onPress?: () => void,
  schedule: TourismSchedule | undefined,
  loading?: boolean
}) => {

  return (
    <Pressable onPress = {onPress} style={[styles.travelCard, containerStyle]}>
      {schedule && <CardContents loading={loading} schedule={schedule} />}
    </Pressable>
  );
};

export default DetailTravelCard;

const styles = StyleSheet.create({
  travelCard: {
    height: "auto",
    flexShrink: 0,
    borderRadius: 12,
    zIndex: 4,
    backgroundColor: '#ffffff',
  },

});

