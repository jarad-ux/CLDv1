/**
 * Error Text Component
 * Displays error messages with icon
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ErrorTextProps {
  message: string;
  style?: ViewStyle;
  icon?: boolean;
}

const ErrorText: React.FC<ErrorTextProps> = ({ message, style, icon = true }) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <Icon name="error-outline" size={16} color={theme.colors.error} />}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
});

export default ErrorText;
