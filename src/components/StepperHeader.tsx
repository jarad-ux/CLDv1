/**
 * Stepper Header Component
 * Shows step number, title, and progress for assessment workflow
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface StepperHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  completed?: boolean;
  style?: ViewStyle;
}

const StepperHeader: React.FC<StepperHeaderProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  completed = false,
  style,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={[styles.stepBadge, completed && styles.stepBadgeCompleted]}>
          {completed ? (
            <Icon name="check" size={20} color={theme.colors.primary.contrast} />
          ) : (
            <Text style={styles.stepNumber}>{currentStep}</Text>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <Text style={styles.progressText}>
          {currentStep}/{totalSteps}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.secondary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeCompleted: {
    backgroundColor: theme.colors.success,
  },
  stepNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  titleContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary.main,
    borderRadius: 2,
  },
});

export default StepperHeader;
