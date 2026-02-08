'use client';

import { useState, useTransition, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateProfile, uploadAvatar, deleteAvatar } from './actions';
import type { Profile } from '@/types/database';

interface ProfileFormProps {
  profile: Profile;
  userEmail: string;
}

const MAX_NAME_LENGTH = 50;
const MAX_CITY_LENGTH = 50;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return email[0]?.toUpperCase() || '?';
}

export default function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [name, setName] = useState(profile.name || '');
  const [city, setCity] = useState(profile.city || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nameError = name.length > MAX_NAME_LENGTH
    ? `Namn får vara max ${MAX_NAME_LENGTH} tecken`
    : '';
  const cityError = city.length > MAX_CITY_LENGTH
    ? `Stad får vara max ${MAX_CITY_LENGTH} tecken`
    : '';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Ogiltigt filformat. Tillåtna: JPG, PNG, WebP, GIF');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Filen är för stor. Max 2 MB');
      return;
    }

    setError(null);
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    startTransition(async () => {
      // Upload avatar if a new file was selected
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);
        const avatarResult = await uploadAvatar(avatarFormData);
        if (avatarResult.error) {
          setError(avatarResult.error);
          return;
        }
        if (avatarResult.url) {
          setAvatarUrl(avatarResult.url);
        }
      }

      // Update name/city
      const formData = new FormData();
      formData.append('name', name);
      formData.append('city', city);

      const result = await updateProfile(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    });
  };

  const handleDeleteAvatar = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteAvatar();
      if (result.error) {
        setError(result.error);
      } else {
        setAvatarUrl(null);
        setAvatarPreview(null);
        setAvatarFile(null);
        setSuccess(true);
      }
    });
  };

  const handleCancel = () => {
    setName(profile.name || '');
    setCity(profile.city || '');
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditing(false);
    setSuccess(false);
    setError(null);
  };

  const displayedAvatar = avatarPreview || avatarUrl;
  const initials = getInitials(name || profile.name, userEmail);

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

      {/* Avatar section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative', mb: 1 }}>
          <Avatar
            src={displayedAvatar || undefined}
            sx={{ width: 96, height: 96, fontSize: '2rem', bgcolor: 'secondary.main' }}
          >
            {initials}
          </Avatar>
          {editing && (
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              size="small"
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            onChange={handleFileSelect}
          />
        </Box>
        {editing && (avatarUrl || avatarPreview) && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={avatarPreview ? () => { setAvatarPreview(null); setAvatarFile(null); } : handleDeleteAvatar}
            disabled={isPending}
          >
            Ta bort bild
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
            error={!!nameError}
            helperText={nameError || `${name.length}/${MAX_NAME_LENGTH} tecken`}
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
            error={!!cityError}
            helperText={cityError || `${city.length}/${MAX_CITY_LENGTH} tecken`}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
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

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={isPending || !!nameError || !!cityError}
            >
              Spara ändringar
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={handleCancel}
              disabled={isPending}
            >
              Avbryt
            </Button>
          </Box>
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

          <Box sx={{ mb: 2 }}>
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

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
            >
              Redigera
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
