import ConfirmModal from "@/conponents/ConfirmModal";
import { useScheduleStore } from "@/store/useScheduleStore";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import { useShallow } from "zustand/shallow";

export function ScheduleBackButton() {
    const { currentStep, goToPrevStep, resetAllStates } = useScheduleStore(useShallow(state => ({ currentStep: state.currentStep, goToPrevStep: state.goToPrevStep, resetAllStates: state.resetAllStates })))
    const isFirst = currentStep === 0;
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Pressable onPress={() => { setIsOpen(true); }} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Entypo name="chevron-left" size={26.67} color="black" />
            </Pressable>
            {isOpen && <ConfirmModal 
                isModalVisible={isOpen}
                setIsModalVisible={setIsOpen}
                title={'여행 계획을 그만두시겠어요?'}
                description="지금까지 선택한 여행 정보가"
                description2="저장되지 않습니다." 
                pressButtonText = '그만두기'
                onPressConfirm={() => {
                    setIsOpen(false);
                    resetAllStates();
                    router.back();
                }}            
                />}
        </>
    )
}