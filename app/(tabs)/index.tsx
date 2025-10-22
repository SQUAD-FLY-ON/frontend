import { apiClient } from "@/api/apiClient";
import FooterSection from "@/conponents/(tabs)/index/FooterSection";
import MyStatusSection from "@/conponents/(tabs)/index/MyStatusSection";
import HomeLinearBackground from "@/conponents/(tabs)/index/MyStatusSection/LinearBackground/HomeLinearBackground";
import RecommendSection from "@/conponents/(tabs)/index/RecommendSection";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
  const refreshToken = useAuthStore(state => state.refreshToken);
  const showAlert = useModalStore((state) => state.showAlert);
  const fetch = async () => {
    const response = await apiClient.post('/tokens', { refreshToken });
    console.log(response);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
