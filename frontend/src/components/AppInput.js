import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

export const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-sand-100 rounded-xl px-4 border ${
          error
            ? 'border-danger'
            : isFocused
            ? 'border-forest-900 bg-white'
            : 'border-cream-200'
        } ${multiline ? 'min-h-[90px] items-start py-3' : 'h-12'}`}
      >
        {leftIcon ? <View className="mr-2.5">{leftIcon}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A9AE"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 text-sm text-charcoal-900 font-medium ${
            multiline ? 'pt-0' : ''
          }`}
          style={inputStyle}
        />
      </View>
      {error ? <Text className="text-danger text-xs mt-1 font-medium">{error}</Text> : null}
    </View>
  );
};

export default AppInput;
