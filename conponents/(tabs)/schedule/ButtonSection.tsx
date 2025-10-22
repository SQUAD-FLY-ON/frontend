import CustomButton from "@/conponents/CustomButton";
import { Screens } from "@/constants/screens";
import { fetchAddSchedule } from "@/libs/schedule/fetchAddSchedule";
import { transformDayDataToSchedules } from "@/libs/schedule/transformDayDataToSchedules";
import { validateNextStepEnabled } from "@/libs/schedule/validateNextStepEnabled";
import { useModalStore } from "@/store/useModalStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { AddScheduleRequest } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ButtonSection() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (apiData: AddScheduleRequest) => {
      return fetchAddSchedule(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
    },
    onError: (error) => {
      console.error("여행 일정 추가 실패: ", error);
    },
  });

  const currentStep = useScheduleStore((state) => state.currentStep);
  const nextEnabled = useScheduleStore(validateNextStepEnabled);
  const goToPrevStep = useScheduleStore((state) => state.goToPrevStep);
  const goToNextStep = useScheduleStore((state) => state.goToNextStep);
  const currentMarkedDates = useScheduleStore(
    (state) => state.currentMarkedDates
  );
  const setCurrentMarkedDates = useScheduleStore(
    (state) => state.setCurrentMarkedDates
  );
  const resetAllStates = useScheduleStore((state) => state.resetAllStates);
  const dayData = useScheduleStore((state) => state.dayData);
  const currentStepKey = Screens[currentStep].key;
  const isAddingSchedule = currentStepKey === "EditPlan";
  const isComplete = currentStepKey === "Complete";
  const isLoading = currentStepKey.includes("Loading");
  const prevButtonBackgroundColor = "#D2D2D2";
  const router = useRouter();
  if (isLoading) {
    return null;
  }
  const resetDates = () => {
    setCurrentMarkedDates({});
  };

  const handleNextButtonPress = () => {
    if (nextEnabled) {
      goToNextStep();
    }
  };

  const addSchedule = async () => {
    const confirmed = await useModalStore.getState().showConfirm({
      title: "일정 추가",
      description: "수정한 일정을 추가하시겠습니까?",
      pressButtonText: "예",
    });

    if (!confirmed) {
      return;
    }

    try {
      // 1. API에 보낼 데이터를 준비합니다.
      const newSchedule = transformDayDataToSchedules(dayData);
      const dates = Object.keys(currentMarkedDates);
      const apiData = {
        schedules: newSchedule,
        scheduleStart: dates[0],
        scheduleEnd: dates[dates.length - 1],
      };

      // 2. API 요청을 시도합니다.
      const response = await mutation.mutateAsync(apiData);

      // 3. 요청이 성공했을 때만 이 코드가 실행됩니다.
      console.log("일정 추가에 성공했습니다!");
      if (response.status === 201) {
        goToNextStep();
      } else {
        await useModalStore.getState().showAlert({
          title: "오류",
          description: "일정 저장에 실패했습니다.",
          description2: "잠시 후 다시 시도해주세요.",
          isError: true,
        });
      }
    } catch (error) {
      // 4. try 블록 안에서 에러가 발생하면 이 코드가 실행됩니다.
      console.error("일정 추가 중 오류 발생:", error);

      // 사용자에게 에러 상황을 알려줍니다.
      await useModalStore.getState().showAlert({
        title: "오류",
        description: "일정 저장에 실패했습니다.",
        description2: "잠시 후 다시 시도해주세요.",
        isError: true,
      });
    }
  };
  const LeftButton =
    currentStep > 0 ? (
      <CustomButton
        onPress={goToPrevStep}
        text="이전 단계"
        style={styles.prevButton}
        textStyle={styles.prevText}
        backgroundColor={prevButtonBackgroundColor}
      />
    ) : (
      <CustomButton
        undo
        onPress={resetDates}
        text="초기화"
        style={styles.prevButton}
        textStyle={styles.prevText}
        backgroundColor={prevButtonBackgroundColor}
      />
    );

  const RightButton = (
    <CustomButton
      text={isAddingSchedule ? "일정 추가하기" : "다음 단계"}
      onPress={isAddingSchedule ? addSchedule : handleNextButtonPress}
      containerStyle={{ flex: 1 }}
      textStyle={styles.rightButtonText}
      disabled={!nextEnabled}
    />
  );

  return (
    <View
      style={[
        styles.container,
        currentStepKey.includes("Loading") && { display: "none" },
      ]}
    >
      {isComplete ? (
        <CustomButton
          text="홈으로"
          onPress={() => {
            resetAllStates();
            router.push("/");
          }}
          containerStyle={{ flex: 1, maxWidth: 354 }}
        />
      ) : (
        <>
          {LeftButton}
          {RightButton}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  prevButton: {
    paddingHorizontal: 17.5,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  nextButton: {
    paddingHorizontal: 17.5,
    alignItems: "center",
  },
  prevText: {
    color: "#747474",
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 500,
    fontFamily: "Pretendard-Medium",
  },
  rightButtonText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 20,
    fontWeight: 500,
    lineHeight: 20,
  },
});
