"use client";

import { useState } from "react";
import { login } from "./actions";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
        autoComplete="current-password"
        required
        disabled={loading}
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
        {loading ? "Loggar in..." : "Logga in"}
      </Button>
    </Box>
  );
}
