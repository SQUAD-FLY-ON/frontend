import CustomButton from "@/conponents/CustomButton";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (<View style={styles.container}>
    <View style={styles.topContainer}>
      <Text style={styles.title}>
        반가워요! Fly:on과 함께{"\n"}
        나만의 비행을 기록해볼까요?
      </Text>
      <Text style={styles.description}>로그인하고 나만의 비행 여행을 계획하고 기록하세요</Text>
    </View>
    <View style={styles.images}>
      <Image source={require('@/assets/images/cloud2.png')} style={styles.cloud2} />
      <Image source={require('@/assets/images/cloud3.png')} style={styles.cloud3} />
      <Image source={require('@/assets/images/glider_charactor.png')} style={styles.charactor} />
    </View>
    <View style={styles.buttons}>
      <CustomButton onPress={() => {router.push('/signup')}} style={{ width: '100%' }} text="Fly:on 계정 생성하기" />
      {/* <CustomButton onPress={() => {router.push('/signup')}}style={{ width: '100%' }} text="카카오 로그인" /> */}
      <CustomButton onPress={() => {router.push('/login')}} style={{ width: '100%', backgroundColor: '#ffffff' }} textStyle={{color: '#747474'}} backgroundColor="#ffffff" text="기존 계정으로 로그인" />
    </View>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 24,
    alignItems: 'center',
    flex: 1,
  },
  topContainer: {
    gap: 12,
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    fontWeight: 600,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    fontWeight: 400,
    color: '#747474',
  },
  images: {
    marginTop: 27,
    position: 'relative',
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  cloud2: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cloud3: {
    position: 'absolute',
    top: 84,
    right: 0,
  },
  charactor: {
    alignSelf: 'center',
  },
  middleContainer: {
    marginTop: 39,
  },
  buttons: {
    gap: 12,
    marginTop: 38,
    width: '100%',
  }
})