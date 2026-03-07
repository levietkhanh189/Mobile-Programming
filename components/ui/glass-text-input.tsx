import React, { memo, useState, useCallback } from 'react';
import { View, KeyboardTypeOptions } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { COLORS } from '../../constants/theme-colors';

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

const INPUT_THEME = {
  colors: {
    primary: COLORS.link,
    outline: COLORS.cardBorder,
    background: COLORS.white,
    onSurfaceVariant: COLORS.textSecondary,
    onSurface: COLORS.text,
    error: COLORS.error,
    placeholder: COLORS.textMuted,
  },
};

export const GlassTextInput = memo(function GlassTextInput({
  label, value, onChangeText, error, secureTextEntry = false, showToggle = false,
  keyboardType, autoCapitalize, disabled, icon, className = '', accessibilityHint,
}: GlassTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => setShowPassword(p => !p), []);

  return (
    <View className={`mb-1 ${className}`}>
      <TextInput
        label={label} value={value} onChangeText={onChangeText} mode="outlined"
        keyboardType={keyboardType} autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry && !showPassword} disabled={disabled}
        error={!!error} theme={INPUT_THEME}
        style={{ minHeight: 46, backgroundColor: COLORS.white }}
        outlineStyle={{ borderRadius: 4, borderWidth: 1 }}
        textColor={COLORS.text}
        left={icon ? <TextInput.Icon icon={icon} color={COLORS.textMuted} /> : undefined}
        right={secureTextEntry && showToggle ? (
          <TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={togglePassword}
            color={COLORS.textMuted} accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} />
        ) : undefined}
        accessibilityLabel={label} accessibilityHint={accessibilityHint || (error ? `Error: ${error}` : undefined)}
      />
      {error ? <HelperText type="error" visible={!!error} style={{ color: COLORS.error }}>{error}</HelperText> : null}
    </View>
  );
});
