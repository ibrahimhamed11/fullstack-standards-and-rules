import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface ScreenTemplateProps {
  onActionPress?: () => void;
}

export const ScreenTemplate: React.FC<ScreenTemplateProps> = ({ onActionPress }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('screen.title', 'Screen Title')}</Text>
        <Text style={styles.description}>
          {t('screen.description', 'Clean React Native template adhering to strict standards.')}
        </Text>

        <TouchableOpacity style={styles.button} onPress={onActionPress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{t('actions.continue', 'Continue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#0092BE',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScreenTemplate;
