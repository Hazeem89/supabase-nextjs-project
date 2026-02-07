"use client";

import Link from "next/link";
import { SignupForm } from "./signup-form";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';

export default function SignupPage() {
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
            Registrera dig
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Skapa ett nytt konto
          </Typography>
          <SignupForm />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            Har du redan ett konto?{' '}
            <MuiLink component={Link} href="/login" underline="hover">
              Logga in
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
