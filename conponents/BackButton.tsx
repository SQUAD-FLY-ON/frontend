import Entypo from "@expo/vector-icons/Entypo";
import { Pressable } from "react-native";

interface BackButtonProps {
  onPress: () => void
}
export function BackButton({onPress}: BackButtonProps) {
    return (<Pressable onPress = {onPress} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
        <Entypo name="chevron-left" size={26.67} color="black" />
    </Pressable>)
}