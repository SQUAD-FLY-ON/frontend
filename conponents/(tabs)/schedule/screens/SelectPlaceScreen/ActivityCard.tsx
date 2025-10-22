import CustomButton from "@/conponents/CustomButton";
import { useScheduleStore } from "@/store/useScheduleStore";
import { Spot } from "@/types";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function ActivityCard({ data }: { data: Spot }) {
  const { selectedActivities, setSelectedActivities } = useScheduleStore(
    useShallow(state => ({
      selectedActivities: state.selectedActivities,
      setSelectedActivities: state.setSelectedActivities,
    }))
  );
  const router = useRouter();
  const onPress = () => {
    setSelectedActivities(data);
  };

  // selectedActivities가  단일 객체인 경우를 가정
  const selected =
    selectedActivities?.id === data.id;
  console.log(selectedActivities);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected ? styles.activated : null, { backgroundColor: selected ? '#ECF4FE' : '#ffffff' }]}
    >
      <Image
        style={styles.image}
        source={data?.imgUrl
          ? { uri: data?.imgUrl }
          : require('@/assets/images/dummy_image_activity_area.png')
        }
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.name}</Text>
        <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail" >{data.fullAddress}</Text>
      </View>
      <CustomButton
        containerStyle={styles.buttonPosition}
        buttonType="small"
        text="자세히보기"
        textStyle={{ lineHeight: 14, fontSize: 14 }}
        onPress={() => { router.push(`/explore/detail/${data.id}`) }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  activated: {
    borderColor: '#93BEF9',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 8.8,
  },
  contentContainer: {
    gap: 4,
    flex: 1,
    flexShrink: 1,
  },
  title: {
    // heading4
    fontWeight: 600,
    fontSize: 16,
  },
  address: {
    fontSize: 12,
    color: '#747474',
    fontWeight: 300,
  },
  star: {
    width: 18,
    height: 18,
    marginRight: -3,
  },
  scoreContainer: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  score: {
    // Paragraph3
    color: '#333333',
    fontSize: 14,
    fontWeight: 600,
  },
  review: {
    fontSize: 12,
    color: '#8E9297',
    fontWeight: 400
  },
  buttonPosition: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  }
})