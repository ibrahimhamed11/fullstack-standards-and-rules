import React from 'react';
import { Box, Typography, Button, Alert, CircularProgress, useTheme } from '@mui/material';
import { useFeatureComponent } from './useFeatureComponent';
import {
  containerSx,
  headerSx,
  titleSx,
  actionButtonSx,
} from './FeatureComponent.styles';

export const FeatureComponent: React.FC = () => {
  const theme = useTheme();
  const { t, item, loading, error, handleToggle } = useFeatureComponent();

  return (
    <Box sx={containerSx(theme)}>
      <Box sx={headerSx(theme)}>
        <Typography sx={titleSx}>
          {t('feature.title')}
        </Typography>
        <Button
          variant="contained"
          onClick={handleToggle}
          disabled={loading}
          sx={actionButtonSx(theme)}
        >
          {loading ? <CircularProgress size={20} /> : (item?.enabled ? t('actions.disable') : t('actions.enable'))}
        </Button>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
    </Box>
  );
};
