// PlaceCard.tsx
import { getSecureImageUrl } from "@/libs/getSecureUrl";
import { useModalStore } from "@/store/useModalStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { TourismItem } from "@/types";
import React, { memo, useCallback } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

const PlaceCard = memo(function PlaceCard({ data }: { data: TourismItem }) {
  const { selectedPlaces, setSelectedPlaces } = useScheduleStore(
    useShallow(state => ({
      selectedPlaces: state.selectedPlaces,
      setSelectedPlaces: state.setSelectedPlaces,
    }))
  );
  const showAlert = useModalStore(state => state.showAlert);

  const selected = Array.isArray(selectedPlaces) &&
    selectedPlaces.some(place => (place.fullAddress === data.fullAddress && place.name === data.name))

  const onPress = useCallback(() => {
    if (selectedPlaces.length >= 10 && !selected) {
      showAlert({
        title: "경고",
        description: "최대 10개의 장소를 선택할 수 있습니다.",
        description2: "다른 장소를 선택하거나 일정을 생성해주세요.",
        isError: true,
      })
    }
    setSelectedPlaces(data);
  }, [selectedPlaces, selected, data, showAlert, setSelectedPlaces]);

  const secureUrl = getSecureImageUrl(data?.imgUrl)

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected ? styles.activatedBg : null, selected ? styles.activated : null]}
    >
      <Image
        style={styles.image}
        source={data?.imgUrl
          ? { uri:secureUrl }
          : require('@/assets/images/dummy_image_place.png')
        }
        onError={(error) => {
        }}
        onLoad={() => {
        }}
        defaultSource={require('@/assets/images/dummy_image_place.png')}

      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.name}</Text>
        <Text
          style={styles.address}
          numberOfLines={2}
          ellipsizeMode="tail"
        >{data.fullAddress}</Text>
      </View>
      {/* <CustomButton 
        containerStyle={styles.buttonPosition} 
        buttonType="small" 
        text="자세히보기" 
        textStyle={{ lineHeight: 14, fontSize: 14 }} 
        onPress={() => {
          router.push(`/(tabs)/explore/detail/${data.id}`);
        }} 
      /> */}
    </Pressable>
  );
});

export default PlaceCard;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    gap: 12,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
  },
  activated: {
    borderColor: '#93BEF9',
    borderWidth: 1,
  },
  activatedBg: {
    backgroundColor: '#ECF4FE',
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
  buttonPosition: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  }
})