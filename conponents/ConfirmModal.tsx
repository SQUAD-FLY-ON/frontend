import CheckIcon from "@/conponents/CheckIcon";
import { MainGradient } from "@/conponents/LinearGradients/MainGradient";
import { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type TProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
  description2?: string;
  onPressConfirm: () => void;
  pressButtonText: string;
};

const ConfirmModal = (props: TProps) => {
  const onPressClose = () => {
    props.setIsModalVisible(false);
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
            <Text style={styles.titleText}>{props.title}</Text>
          </View>
          <View style={styles.contentsView}>
            <Text style={styles.contentsText}>
              {props.description ? props.description : ""}
            </Text>
            <Text style={styles.contentsText}>
              {props.description2 ? props.description2 : ""}
            </Text>
          </View>
          <View style={styles.buttonsView}>
            <Pressable
              onPress={onPressClose}
              style={[styles.buttonStyle, { backgroundColor: "#D2D2D2" }]}
            >
              <Text style={styles.buttonText}>닫기</Text>
            </Pressable>

            <Pressable
              onPress={props.onPressConfirm} 
              style={{ width: 145, height: 52, borderRadius: 12 }}
            >
              <MainGradient style={styles.buttonStyle}>
                <Text style={styles.buttonText}>{props.pressButtonText}</Text>
              </MainGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

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
