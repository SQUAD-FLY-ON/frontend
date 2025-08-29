import { fetchSignup } from "@/libs/(tabs)/signup/fetchSignup";
import { signUpSchema } from "@/schema/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import z from "zod";
import CustomButton from "../CustomButton";
import FormInput from "../FormInput";

export default function SignupForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });
  const router = useRouter();
  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    const { passwordConfirm, ...apiData } = data;
    const response = await fetchSignup(apiData);
    console.log(response);
    if (response?.status === 201) {
      Alert.alert('회원가입이 완료되었습니다!');
      router.push("/login");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.inputContaier}>
        <FormInput containerStyle={styles.input} name="loginId" errorMessage={errors.loginId?.message} control={control} placeholder='아이디를 입력하세요' label='ID' />
        <FormInput containerStyle={styles.input} isPassword name="password" errorMessage={errors.password?.message} control={control} placeholder='비밀번호를 입력하세요' label='비밀번호' />
        <FormInput containerStyle={styles.input} isPassword name="passwordConfirm" errorMessage={errors.passwordConfirm?.message} control={control} placeholder='비밀번호를 입력하세요' label='비밀번호 확인' />
        <FormInput containerStyle={styles.input} name="nickname" errorMessage={errors.nickname?.message} control={control} placeholder='닉네임을 입력하세요' label='닉네임' />
      </View>
      <CustomButton containerStyle={styles.button} onPress={handleSubmit(onSubmit)} text={"회원가입"} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  inputContaier: {
    width: '100%',
    gap: 8,
  },
  input: {
    width: '100%',
  },
  button: {
    width: '100%',
  }
})