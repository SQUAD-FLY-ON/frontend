import { privicyPolicy } from "@/constants/privacyPolicy";
import { SetStateAction } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../CustomButton";

export default function PrivacyPolicy({setAgree}: {setAgree: React.Dispatch<SetStateAction<boolean>>;}) {
  return (<View style={styles.container}>
    <Text style={styles.title}>개인정보처리방침</Text>
    <ScrollView style={styles.descriptionContainer}>
      <Text style={styles.description}>
        {privicyPolicy}
      </Text>
    </ScrollView>
    <CustomButton containerStyle={styles.button} onPress={() => {setAgree(true)}} text={"네, 동의합니다."} />
  </View>)
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 16,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: 600,
    fontSize: 24,
  },
  descriptionView: {
    paddingBottom: 24,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  description: {
    color: '#747474',
    fontFamily: 'Pretendard-Regular',
    fontWeight: 400,
    fontSize: 14,
  },
  button: {
    width: '100%',
    marginTop:8,
  }
})