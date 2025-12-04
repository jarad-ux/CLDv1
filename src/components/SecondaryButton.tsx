/**
 * Secondary Button Component
 * Outlined button using primary green from gogreenga.org
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SecondaryButtonProps {
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

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconSize = 20,
  style,
  textStyle,
  size = 'md',
  fullWidth = false,
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
        <ActivityIndicator color={theme.colors.primary.main} size="small" />
      ) : (
        <>
          {icon && <Icon name={icon} size={iconSize} color={theme.colors.primary.main} style={styles.icon} />}
          <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    borderColor: theme.colors.gray[300],
  },
  text: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  textDisabled: {
    color: theme.colors.gray[400],
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
});

export default SecondaryButton;
