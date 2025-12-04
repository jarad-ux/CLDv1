/**
 * Card Component
 * Clean white card with subtle shadow matching gogreenga.org style
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ children, style, padding = 'md', elevation = 'md' }) => {
  const paddingSize = theme.components.card.padding[padding];
  const shadow = theme.shadows[elevation];

  return <View style={[styles.card, { padding: paddingSize }, shadow, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.components.card.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
});

export default Card;
