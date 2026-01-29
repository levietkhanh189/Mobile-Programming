import React, { useState } from 'react';
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
}

/**
 * Glassmorphism-styled text input with error handling
 *
 * @param showToggle - Show eye icon for password visibility toggle
 * @param icon - Left icon name (MaterialCommunityIcons)
 * @param error - Error message to display below input
 */
export function GlassTextInput({
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
}: GlassTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const glassTheme = {
    colors: {
      primary: GLASS_COLORS.primary,
      outline: 'rgba(255, 255, 255, 0.5)',
      background: 'rgba(255, 255, 255, 0.15)',
      onSurfaceVariant: 'rgba(255, 255, 255, 0.7)', // label color
      onSurface: GLASS_COLORS.white, // text color
      error: GLASS_COLORS.error,
      placeholder: 'rgba(255, 255, 255, 0.6)',
    },
  };

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
        theme={glassTheme}
        style={{
          minHeight: 48,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        }}
        outlineStyle={{
          borderRadius: 12,
          borderWidth: 1.5,
        }}
        textColor={GLASS_COLORS.white}
        left={icon ? <TextInput.Icon icon={icon} color="rgba(255, 255, 255, 0.7)" /> : undefined}
        right={
          secureTextEntry && showToggle ? (
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
              color="rgba(255, 255, 255, 0.7)"
            />
          ) : undefined
        }
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
}
