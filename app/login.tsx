import CustomButton from "@/conponents/CustomButton";
import FormInput from "@/conponents/FormInput";
import { loginSchema } from "@/schema/loginSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from "react-native";
import z from "zod";
import { useShallow } from 'zustand/shallow';

export default function Index() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const router = useRouter();
  const { login, isLoading } = useAuthStore(useShallow(state => ({
    login: state.login,
    isLoading: state.isLoading,
  })));
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const response = await login(data);
    if (response.success) {
      // await setAuth(
      //   response?.data.data
      // );
      router.push("/");
    }
  }
  return (
    <View style={styles.container}>
      <FormInput containerStyle={styles.input} name="loginId" errorMessage={errors.loginId?.message} control={control} placeholder='아이디를 입력하세요' label='ID' />
      <FormInput containerStyle={styles.input} isPassword name="password" errorMessage={errors.password?.message} control={control} placeholder='비밀번호를 입력하세요' label='비밀번호' />
      {
        isLoading? <Text style = {styles.loadingText}>로그인 중...</Text>:
        <CustomButton containerStyle={styles.button} onPress={handleSubmit(onSubmit)} text={"로그인"} />
      }
    </View>)
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 48,
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  input: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 32,
  },
  loadingText: {
    fontSize:24,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 600,
  }
})