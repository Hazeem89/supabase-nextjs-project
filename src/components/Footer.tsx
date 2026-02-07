import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; 2026 LIA-Projekt
      </Typography>
    </Box>
  );
}
