import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { MainGradient } from "./LinearGradients/MainGradient";

interface ButtonProps {
    backgroundColor?: 'main' | string;
    containerStyle?: ViewStyle;
    onPress?: () => void;
    text: string;
    disabled?: boolean;
    buttonType?: 'small' | 'default';
    style?: ViewStyle;
    rightArrow?: boolean;
    textStyle?: TextStyle,
    bottomArrow?: boolean;
    undo?: boolean;
}

export default function CustomButton({ onPress, buttonType = 'default', backgroundColor = 'main', containerStyle, style, textStyle, rightArrow = false, bottomArrow = false, undo = false, text, disabled }: ButtonProps) {
    const Wrapper = backgroundColor !== 'main' || disabled ? View : MainGradient;
    return (
        <Pressable onPress={onPress} style={containerStyle}>
            <Wrapper style={[
                buttonType === 'small' && styles.small,
                buttonType === 'default' && styles.default,
                { backgroundColor: backgroundColor }, style,
                disabled && styles.disabled
                ]} >

                {undo && <Image source={require('@/assets/images/undo.png')} style={{ width: 20, height: 20 }} />}
                <Text style={[styles.text, buttonType === 'small' && styles.smallText, textStyle]}>{text}</Text>

                {rightArrow && <MaterialIcons name="keyboard-arrow-right" size={18} color="#ffffff" />}
                {bottomArrow && <Image source={require('@/assets/images/arrow_down.png')} style={{ width: 18, height: 18 }} />}
            </Wrapper>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    small: {
        flexDirection: "row",
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: "center",
        gap: 4,
        borderRadius: 100,
    },
    default: {
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontWeight: 400,
        fontSize: 14,
    },
    smallText: {
        lineHeight: 17,
        textAlign: 'center',
        height: 17,
    },
    disabled: {
        backgroundColor: "#D2D2D2",
    }
});
