/**
 * Tag/Chip Component
 * Used for tags, badges, and selectable chips
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TagChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: string;
  onRemove?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const TagChip: React.FC<TagChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  onRemove,
  variant = 'default',
  style,
  textStyle,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return { bg: theme.colors.success + '20', text: theme.colors.success, border: theme.colors.success };
      case 'warning':
        return { bg: theme.colors.warning + '20', text: theme.colors.warning, border: theme.colors.warning };
      case 'error':
        return { bg: theme.colors.error + '20', text: theme.colors.error, border: theme.colors.error };
      default:
        return selected
          ? { bg: theme.colors.primary.main, text: theme.colors.primary.contrast, border: theme.colors.primary.main }
          : { bg: theme.colors.gray[100], text: theme.colors.text.primary, border: theme.colors.border.light };
    }
  };

  const colors = getVariantColors();

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[
        styles.chip,
        { backgroundColor: colors.bg, borderColor: colors.border },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Icon name={icon} size={16} color={colors.text} style={styles.icon} />}
      <Text style={[styles.label, { color: colors.text }, textStyle]}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="close" size={16} color={colors.text} />
        </TouchableOpacity>
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  removeButton: {
    marginLeft: theme.spacing.xs,
  },
});

export default TagChip;
