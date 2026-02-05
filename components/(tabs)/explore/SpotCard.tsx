import CustomButton from "@/components/CustomButton";
import useExploreStore from "@/store/exploreStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useShallow } from "zustand/shallow";
import CalendarModal from "./CalendarModal";
import LinkIcon from "./icons/LinkIcon";
import MapPinIcon from "./icons/MapPinIcon";
import PhoneIcon from "./icons/PhoneIcon";

const SpotCard = ({
  address,
  phoneNumber,
  webURL,
}: {
  address: string;
  phoneNumber: string;
  webURL: string;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const { selectedMarkerSpot, selectedRegion } = useExploreStore(useShallow(state => ({ selectedMarkerSpot: state.selectedMarkerSpot, selectedRegion: state.selectedRegion })))
  const openSite = async () => {
    const supported = await Linking.canOpenURL(webURL);

    if (supported) {
      await Linking.openURL(webURL);
    } else {
      Alert.alert(`이 URL을 열 수 없습니다: ${webURL}`);
    }
  };
  useEffect(() => {
    const backAction = () => {
      if(selectedMarkerSpot.id === ''  && selectedRegion.name === '') {
      router.push('/(tabs)/explore');
      return true; // true를 반환하면 기본 백버튼 동작을 막습니다
      }
      router.push('/(tabs)/explore/map');
      return true; // false를 반환하면 기본 백버튼 동작을 유지합니다
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // cleanup
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>체험장 정보</Text>
        { selectedMarkerSpot.id !== ''  && selectedRegion.name !== '' && <CustomButton text={"일정 생성하기"} buttonType="small" onPress={() => { setIsModalVisible(prev => !prev) }} />}
      </View>
      <View style={styles.contentsContainer}>
        <View style={styles.contents}>
          <MapPinIcon />
          <Text style={styles.contentsText}>{address}</Text>
        </View>
        <View style={styles.contents}>
          <PhoneIcon />
          <Text style={styles.contentsText}>{phoneNumber}</Text>
        </View>
        <View style={styles.contents}>
          <LinkIcon />
          <TouchableOpacity onPress={openSite}>
            <Text style={[styles.contentsText, styles.linkText]}>
              체험장 사이트 바로가기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CalendarModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
    </View>
  );
};

export default SpotCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  titleContainer: {
    paddingBottom: 12,
    borderBottomColor: "rgba(208, 208, 208, 0.50)",
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: "Pretendard-Bold",
    fontSize: 20,
  },
  contentsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    gap: 8,
  },
  contents: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  contentsText: {
    fontFamily: "Pretendrad-Regular",
    fontSize: 16,
  },
  linkText: {
    color: "#3A88F4",
    textDecorationLine: "underline",
  },
  
});
