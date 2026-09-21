import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface FeatureData {
  id: string;
  name: string;
  enabled: boolean;
}

export const useFeatureComponent = (initialItem?: FeatureData) => {
  const { t } = useTranslation();
  const [item, setItem] = useState<FeatureData | null>(initialItem || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = useCallback(async () => {
    if (!item) return;

    setLoading(true);
    setError(null);
    try {
      // Simulate API call using path alias pattern
      setItem(prev => prev ? { ...prev, enabled: !prev.enabled } : null);
    } catch (err: any) {
      setError(err?.message || t('errors.genericSave'));
    } finally {
      setLoading(false);
    }
  }, [item, t]);

  return {
    t,
    item,
    loading,
    error,
    handleToggle,
  };
};
