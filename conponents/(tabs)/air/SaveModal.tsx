import CheckIcon from "@/conponents/CheckIcon";
import { MainGradient } from "@/conponents/LinearGradients/MainGradient";
import { useRouter } from "expo-router";
import { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type TProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
};

const SaveModal = (props: TProps) => {
  const router = useRouter();

  const onPressClose = () => {
    props.setIsModalVisible(false);
    router.navigate("/(tabs)");
  };

  return (
    <Modal
      animationType="slide"
      visible={props.isModalVisible}
      transparent={true}
    >
      <View style={styles.backgroundView}>
        <View style={styles.modalView}>
          <View style={styles.titleView}>
            <CheckIcon />
            <Text style={styles.titleText}>비행기록 저장 완료!</Text>
          </View>
          <View style={styles.contentsView}>
            <Text style={styles.contentsText}>
              비행 데이터가 성공적으로 저장되었습니다.
            </Text>
            <Text style={styles.contentsText}>3D 비행 영상을 확인할까요?</Text>
          </View>
          <View style={styles.buttonsView}>
            <Pressable
              onPress={onPressClose}
              style={[styles.buttonStyle, { backgroundColor: "#D2D2D2" }]}
            >
              <Text style={styles.buttonText}>닫기</Text>
            </Pressable>
            <Pressable
              onPress={onPressClose}
              style={{ width: 145, height: 52, borderRadius: 12 }}
            >
              <MainGradient style={styles.buttonStyle}>
                <Text style={styles.buttonText}>영상 확인하기</Text>
              </MainGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SaveModal;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlignVertical: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    alignItems: "center",
    width: 338,
    height: 243,
    borderRadius: 24,
  },
  titleView: {
    marginTop: 48,
    textAlign: "center",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  titleText: {
    color: "#333",
    fontFamily: "Pretendard-Semibold",
    fontSize: 22,
  },
  contentsView: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 33,
  },
  contentsText: {
    color: "#747474",
    textAlign: "center",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
  },
  buttonsView: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: 145,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Pretendard-Medium",
    fontSize: 18,
  },
});
