import FooterSection from "@/components/(tabs)/index/FooterSection";
import MyStatusSection from "@/components/(tabs)/index/MyStatusSection";
import HomeLinearBackground from "@/components/(tabs)/index/MyStatusSection/LinearBackground/HomeLinearBackground";
import RecommendSection from "@/components/(tabs)/index/RecommendSection";
import { useTourSchedule } from "@/hooks/useTourSchedule";
import { useState } from "react";
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
   const [refreshing, setRefreshing] = useState(false);
  const {refetchSchedule} = useTourSchedule();
   const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetchSchedule();
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <HomeLinearBackground />
        <MyStatusSection />
        <RecommendSection />
      </View>
      {/* <CommunitySection /> */}
      <FooterSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: Dimensions.get("window").width,
    backgroundColor: "#EAF2FC",
    marginBottom: 80,
  },
});
