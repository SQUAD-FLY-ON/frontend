// /components/schedule/PlaceList.tsx (새 파일)

import { Spot } from "@/types";
import { FlatList, StyleSheet, View } from "react-native";
import TitleHeader from "../TitleHeader";
import ActivityCard from "./ActivityCard";


interface ActivityListProps {
  title: string;
  description: string;
  filters: { key: string; text: string }[];
  data: Spot[]; // 실제로는 Activity 또는 Place 타입으로 지정
}

export default function ActivityList({ title, description, data }: ActivityListProps) {
  return (
    <View style={styles.container}>
      <TitleHeader title={title} description={description} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.placeContainer}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    marginVertical: 14,
  },
  placeContainer: {
    gap: 8,
  },
})