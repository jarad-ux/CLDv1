/**
 * Section Header Component
 * Used for section titles throughout the app
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  required?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  iconColor,
  style,
  titleStyle,
  required = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        {icon && (
          <Icon
            name={icon}
            size={24}
            color={iconColor || theme.colors.primary.main}
            style={styles.icon}
          />
        )}
        <Text style={[styles.title, titleStyle]}>
          {title}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  required: {
    color: theme.colors.error,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    marginLeft: icon ? 32 : 0,
  },
});

export default SectionHeader;
