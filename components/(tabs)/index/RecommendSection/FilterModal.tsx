import CustomButton from "@/components/CustomButton";
import { RadioButton } from "@/components/RadioButton";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import React, { SetStateAction, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RecommendSpotCreteria } from "@/types";

interface FilterModalProps {
  ref: React.RefObject<BottomSheetModal | null>;
  currentKey: RecommendSpotCreteria;
  setCurrentKey: React.Dispatch<SetStateAction<RecommendSpotCreteria>>;
  options: { key: string; label: string }[];
}
const FilterModal = ({
  ref,
  currentKey,
  setCurrentKey,
  options,
}: FilterModalProps) => {
  const [selectedKey, setSelectedKey] = useState<RecommendSpotCreteria>(currentKey);
  return (
    <BottomSheetModal
      ref={ref}
      onChange={(index) => {}}
      animateOnMount
      snapPoints={[300]}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      )}
    >
      <BottomSheetView
        style={styles.bottomSheetView}
      >
        <View style={styles.optionsContainer} >
          <Text style={styles.modalTitle}>체험장 추천 기준을 선택해주세요</Text>
          <View style={styles.modalRadios}>
            {options.map((opt) => (
              <RadioButton
                key={opt.key}
                label={opt.label}
                selected={selectedKey === opt.key}
                onPress={() => setSelectedKey(opt.key as RecommendSpotCreteria)}
              />
            ))}
          </View>
          <View style={styles.modalButton}>
            <CustomButton
              text="선택 완료"
              onPress={() => {
                setCurrentKey(selectedKey);
                ref?.current?.close();
              }}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
export default FilterModal;
const styles = StyleSheet.create({
  modalTitle: {
    fontFamily: "Pretendard-Bold",
    fontSize: 22,
  },
  modalRadios: {
    paddingHorizontal: 6,
  },
  modalButton: {
    marginTop: 27,
  },
  bottomSheetView: {
    padding: 18,
    backgroundColor: "white",
  },
  optionsContainer: {
    gap: 12,
  },
});
