/**
 * Primary Button Component
 * Uses CTA green from gogreenga.org for primary actions
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconSize?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconSize = 20,
  style,
  textStyle,
  size = 'md',
  fullWidth = true,
}) => {
  const buttonHeight = theme.components.button.height[size];
  const paddingHorizontal = theme.components.button.paddingHorizontal[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height: buttonHeight,
          paddingHorizontal,
          width: fullWidth ? '100%' : 'auto',
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.cta.contrast} size="small" />
      ) : (
        <>
          {icon && <Icon name={icon} size={iconSize} color={theme.colors.cta.contrast} style={styles.icon} />}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.cta.main,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  disabled: {
    backgroundColor: theme.colors.gray[400],
    ...theme.shadows.none,
  },
  text: {
    color: theme.colors.cta.contrast,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
});

export default PrimaryButton;
