/**
 * Form Field Component
 * Labeled text input with error state and validation
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  icon?: string;
  containerStyle?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  helperText,
  icon,
  containerStyle,
  size = 'md',
  ...textInputProps
}) => {
  const inputHeight = theme.components.input.height[size];
  const paddingHorizontal = theme.components.input.paddingHorizontal[size];

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <Icon name={icon} size={20} color={theme.colors.gray[500]} style={styles.icon} />}
        <TextInput
          style={[
            styles.input,
            {
              height: inputHeight,
              paddingHorizontal: icon ? paddingHorizontal - 12 : paddingHorizontal,
            },
          ]}
          placeholderTextColor={theme.colors.text.hint}
          {...textInputProps}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 1.5,
  },
  icon: {
    marginLeft: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
  },
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});

export default FormField;
