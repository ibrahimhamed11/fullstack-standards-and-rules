import { SxProps, Theme } from '@mui/material';

export const containerSx = (theme: Theme): SxProps => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  marginInlineStart: 'auto',
  marginInlineEnd: 'auto',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  maxWidth: 600,
  width: '100%',
});

export const headerSx = (theme: Theme): SxProps => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
});

export const titleSx: SxProps = {
  fontWeight: 700,
  fontSize: '1.25rem',
};

export const actionButtonSx = (theme: Theme): SxProps => ({
  marginInlineStart: theme.spacing(1),
});
