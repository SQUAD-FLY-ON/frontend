import CustomButton from "@/conponents/CustomButton";
import FormInput from "@/conponents/FormInput";
import Header from "@/conponents/Header";
import { fetchEditProfile } from "@/libs/(tabs)/user/fetchEditProfile";
import { signUpSchema } from "@/schema/signupSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import z from "zod";

export default function Profile() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const router = useRouter();

  const memberId = useAuthStore((state) => state.memberInfo?.memberId);
  const editProfile = useAuthStore((state) => state.editProfile);
  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    console.log("[profile] Click onSubmit");
    const { passwordConfirm, ...apiData } = data;
    // 회원 정보 수정 API 연결
    const response = await fetchEditProfile(memberId as string, apiData);
    console.log(response);
    if (response?.httpStatusCode === 200) {
      editProfile(apiData.nickname);
      Alert.alert("프로필 수정이 완료되었습니다!");
      router.back();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="프로필 정보 수정" backButton={true} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 50}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <FormInput
                containerStyle={styles.input}
                name="nickname"
                errorMessage={errors.nickname?.message}
                control={control}
                placeholder="닉네임을 입력하세요"
                label="닉네임"
              />
              <FormInput
                containerStyle={styles.input}
                name="loginId"
                errorMessage={errors.loginId?.message}
                control={control}
                placeholder="아이디를 입력하세요"
                label="ID"
              />
              <FormInput
                containerStyle={styles.input}
                isPassword
                name="password"
                errorMessage={errors.password?.message}
                control={control}
                placeholder="비밀번호를 입력하세요"
                label="비밀번호"
              />
              <FormInput
                containerStyle={styles.input}
                isPassword
                name="passwordConfirm"
                errorMessage={errors.passwordConfirm?.message}
                control={control}
                placeholder="비밀번호를 입력하세요"
                label="비밀번호 확인"
              />
            </View>
            <CustomButton
              containerStyle={styles.button}
              onPress={handleSubmit(onSubmit)}
              text={"수정 완료"}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    gap: 8,
  },
  input: {
    width: "100%",
  },
  button: {
    width: "100%",
  },
});
