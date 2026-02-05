// SelectPlaceScreen.tsx
import { StyleSheet } from "react-native";
import PlaceList from "./PlaceList";

export default function SelectPlaceScreen() {
  return (
    <>
        <PlaceList
          title="체험장/장소 선택하기(2/2)"
          description="일정에 추가하고 싶은 장소를 선택해주세요."
        />
    </>
  );
}

const styles = StyleSheet.create({
  
});