import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import EyeIcon from './icons/EyeIcon';

interface FormInputProps {
  label: string;
  placeholder: string;
  isPassword?: boolean;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  control: Control<any>; // React Hook Form의 Control 객체 타입
  errorMessage?: string;
  name: string;
}
const FormInput = ({ label, placeholder, isPassword = false, inputStyle, containerStyle, control, errorMessage, name }: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContaier}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, inputStyle]}
              onBlur={onBlur}
              secureTextEntry={isPassword && !showPassword ? true : false}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#8E9297"
            />


          )
          }
        />
        {
          isPassword && (
            <EyeIcon activated={showPassword} onPress={() => { setShowPassword(prev => !prev) }} style={[styles.icon]} />
          )
        }
      </View>
      {errorMessage && (
      <Text style = {styles.errorMessage}>{errorMessage}</Text>
      )}
    </View >
  );
};

const styles = StyleSheet.create({
  container:{
    width: '100%',
  },
  inputContaier: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    fontFamily: 'Pretendard-Regular',
    paddingVertical: 20,
    paddingHorizontal: 16,
    fontSize: 20,
    color: '#8E9297',
    width: '100%',
    backgroundColor: '#fff',
  },
  icon: {
    position: 'absolute',
    right: 16
  },
  errorMessage: {
    color: 'red',
    fontFamily: 'Pretendard-Regular',
    fontSize:12,
  }
});

export default FormInput;