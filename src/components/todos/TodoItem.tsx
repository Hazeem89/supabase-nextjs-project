'use client';

import { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { Todo } from '@/types/database';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  disabled?: boolean;
}

const MAX_TODO_LENGTH = 200;

export default function TodoItem({ todo, onToggle, onDelete, onEdit, disabled }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editError = editTitle.length > MAX_TODO_LENGTH
    ? `Titel får vara max ${MAX_TODO_LENGTH} tecken`
    : '';

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== todo.title && !editError) {
      onEdit(todo.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <ListItem
      sx={{
        bgcolor: 'background.paper',
        mb: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
      secondaryAction={
        isEditing ? (
          <Box>
            <IconButton onClick={handleSaveEdit} disabled={disabled || !!editError || !editTitle.trim()} color="success">
              <CheckIcon />
            </IconButton>
            <IconButton onClick={handleCancelEdit} disabled={disabled}>
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <IconButton onClick={() => setIsEditing(true)} disabled={disabled}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(todo.id)} disabled={disabled} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        )
      }
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          disabled={disabled || isEditing}
        />
      </ListItemIcon>
      {isEditing ? (
        <TextField
          fullWidth
          size="small"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          error={!!editError}
          helperText={editError || `${editTitle.length}/${MAX_TODO_LENGTH}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !editError) handleSaveEdit();
            if (e.key === 'Escape') handleCancelEdit();
          }}
          autoFocus
          sx={{ mr: 10 }}
        />
      ) : (
        <ListItemText
          primary={todo.title}
          sx={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? 'text.secondary' : 'text.primary',
          }}
        />
      )}
    </ListItem>
  );
}
