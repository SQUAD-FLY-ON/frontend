import CustomButton from "@/components/CustomButton";
import { RadioButton } from "@/components/RadioButton";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import React, { SetStateAction, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface FilterModalProps {
  ref: React.RefObject<BottomSheetModal | null>;
  currentKey: string;
  setCurrentKey: React.Dispatch<SetStateAction<string>>;
  options: { key: string; label: string }[];
}
const FilterModal = ({
  ref,
  currentKey,
  setCurrentKey,
  options,
}: FilterModalProps) => {
  const [selectedKey, setSelectedKey] = useState<string>(currentKey);
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
        style={{ padding: 18, backgroundColor: "white"}}
      >
        <View style={{ gap: 12 }} >
          <Text style={styles.modalTitle}>체험장 추천 기준을 선택해주세요</Text>
          <View style={styles.modalRadios}>
            {options.map((opt) => (
              <RadioButton
                key={opt.key}
                label={opt.label}
                selected={selectedKey === opt.key}
                onPress={() => setSelectedKey(opt.key)}
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
});
