"use client";

import { useState } from "react";
import { signup } from "../login/actions";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import EmailIcon from '@mui/icons-material/Email';

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Alert
        severity="success"
        icon={<EmailIcon fontSize="large" />}
        sx={{ mt: 2 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          Bekräfta din e-post
        </Typography>
        <Typography variant="body2">
          Vi har skickat ett bekräftelsemail till din e-postadress. 
          Klicka på länken i mailet för att aktivera ditt konto.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box component="form" action={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        fullWidth
        id="email"
        name="email"
        type="email"
        label="E-post"
        autoComplete="email"
        required
        disabled={loading}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        type="password"
        label="Lösenord"
        autoComplete="new-password"
        required
        disabled={loading}
        inputProps={{ minLength: 6 }}
        helperText="Minst 6 tecken"
        sx={{ mb: 3 }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? "Skapar konto..." : "Registrera"}
      </Button>
    </Box>
  );
}
