import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  style,
  textStyle,
  icon
}) => {
  let btnClasses = "h-12 rounded-xl flex-row items-center justify-center px-5 active:opacity-90 ";
  let textClasses = "text-sm font-bold tracking-wide ";

  if (disabled) {
    btnClasses += "bg-cream-200 border border-cream-300 ";
    textClasses += "text-charcoal-400 ";
  } else if (variant === 'secondary') {
    btnClasses += "bg-sage-100 border border-sage-200 ";
    textClasses += "text-forest-900 ";
  } else if (variant === 'accent') {
    btnClasses += "bg-clay-500 ";
    textClasses += "text-cream-50 ";
  } else if (variant === 'outline') {
    btnClasses += "bg-transparent border border-forest-900 ";
    textClasses += "text-forest-900 ";
  } else if (variant === 'danger') {
    btnClasses += "bg-danger-light border border-danger/20 ";
    textClasses += "text-danger ";
  } else {
    // primary
    btnClasses += "bg-forest-900 ";
    textClasses += "text-cream-50 ";
  }

  btnClasses += className;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      className={btnClasses.trim()}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'accent' ? '#FAF8F5' : '#122C23'} />
      ) : (
        <>
          {icon ? icon : null}
          <Text className={`${textClasses} ${icon ? 'ml-2' : ''}`} style={textStyle}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
