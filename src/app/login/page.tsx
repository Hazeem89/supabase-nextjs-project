"use client";

import Link from "next/link";
import { LoginForm } from "./login-form";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: 'calc(100vh - 8rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" component="h1" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
            Logga in
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Ange din e-post och lösenord
          </Typography>
          <LoginForm />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            Har du inget konto?{' '}
            <MuiLink component={Link} href="/signup" underline="hover">
              Registrera dig
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
