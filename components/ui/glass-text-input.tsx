import React, { memo, useState, useCallback } from 'react';
import { View, KeyboardTypeOptions } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { GLASS_COLORS } from '../../constants/theme-colors';

interface GlassTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  icon?: string;
  className?: string;
  accessibilityHint?: string;
}

const GLASS_INPUT_THEME = {
  colors: {
    primary: GLASS_COLORS.primaryLight,
    outline: 'rgba(255, 255, 255, 0.5)',
    background: 'rgba(255, 255, 255, 0.15)',
    onSurfaceVariant: 'rgba(255, 255, 255, 0.7)',
    onSurface: GLASS_COLORS.white,
    error: GLASS_COLORS.error,
    placeholder: 'rgba(255, 255, 255, 0.6)',
  },
};

/**
 * Glassmorphism-styled text input with a11y and error handling
 */
export const GlassTextInput = memo(function GlassTextInput({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  showToggle = false,
  keyboardType,
  autoCapitalize,
  disabled,
  icon,
  className = '',
  accessibilityHint,
}: GlassTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <View className={`mb-1 ${className}`}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry && !showPassword}
        disabled={disabled}
        error={!!error}
        theme={GLASS_INPUT_THEME}
        style={{
          minHeight: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        }}
        outlineStyle={{
          borderRadius: 14,
          borderWidth: 1.5,
        }}
        textColor={GLASS_COLORS.white}
        left={icon ? <TextInput.Icon icon={icon} color="rgba(255, 255, 255, 0.7)" /> : undefined}
        right={
          secureTextEntry && showToggle ? (
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={togglePassword}
              color="rgba(255, 255, 255, 0.7)"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            />
          ) : undefined
        }
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint || (error ? `Error: ${error}` : undefined)}
      />
      {error ? (
        <HelperText
          type="error"
          visible={!!error}
          style={{ color: GLASS_COLORS.error }}
        >
          {error}
        </HelperText>
      ) : null}
    </View>
  );
});
