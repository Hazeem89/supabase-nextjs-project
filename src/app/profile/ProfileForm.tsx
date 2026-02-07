'use client';

import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { updateProfile } from './actions';
import type { Profile } from '@/types/database';

interface ProfileFormProps {
  profile: Profile;
  userEmail: string;
}

export default function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [name, setName] = useState(profile.name || '');
  const [city, setCity] = useState(profile.city || '');
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('city', city);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setEditing(false);
      }
    });
  };

  const handleCancel = () => {
    setName(profile.name || '');
    setCity(profile.city || '');
    setEditing(false);
    setSuccess(false);
    setError(null);
  };

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profilen har uppdaterats!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        {!editing ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
          >
            Redigera
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CloseIcon />}
            onClick={handleCancel}
          >
            Avbryt
          </Button>
        )}
      </Box>

      {editing ? (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Namn
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Stad
          </Typography>
          <TextField
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isPending}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isPending}
          >
            Spara ändringar
          </Button>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Namn
            </Typography>
            <Typography variant="body1">
              {name || '—'}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Stad
            </Typography>
            <Typography variant="body1">
              {city || '—'}
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ mb: 2, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          E-post
        </Typography>
        <Typography variant="body1">{userEmail}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Användar-ID
        </Typography>
        <Typography variant="body1" fontFamily="monospace" fontSize="0.875rem">
          {profile.id}
        </Typography>
      </Box>

      {profile.last_sign_in_at && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Senast inloggad
          </Typography>
          <Typography variant="body1">
            {new Date(profile.last_sign_in_at).toLocaleString('sv-SE')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
