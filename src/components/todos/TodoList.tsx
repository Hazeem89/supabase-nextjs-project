'use client';

import { useState, useTransition } from 'react';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import TodoItem from './TodoItem';
import { createTodo, deleteTodo, toggleTodoComplete, updateTodo } from '@/app/todos/actions';
import type { Todo } from '@/types/database';

interface TodoListProps {
  initialTodos: Todo[];
}

const MAX_TODO_LENGTH = 200;

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTitle, setNewTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const titleError = newTitle.length > MAX_TODO_LENGTH
    ? `Titel får vara max ${MAX_TODO_LENGTH} tecken`
    : '';

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || titleError) return;

    setError(null);
    const formData = new FormData();
    formData.append('title', newTitle);

    const tempId = `temp-${Date.now()}`;
    const optimisticTodo: Todo = {
      id: tempId,
      user_id: '',
      title: newTitle.trim(),
      completed: false,
      created_at: new Date().toISOString(),
    };

    setTodos((prev) => [optimisticTodo, ...prev]);
    setNewTitle('');

    startTransition(async () => {
      const result = await createTodo(formData);
      if (result.error) {
        setTodos((prev) => prev.filter((t) => t.id !== tempId));
        setError(result.error);
      } else if (result.data) {
        setTodos((prev) => prev.map((t) => (t.id === tempId ? result.data! : t)));
      }
    });
  };

  const handleToggle = async (id: string, completed: boolean) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));

    startTransition(async () => {
      const result = await toggleTodoComplete(id, completed);
      if (result.error) {
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
        setError(result.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    const todoToDelete = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));

    startTransition(async () => {
      const result = await deleteTodo(id);
      if (result.error) {
        if (todoToDelete) {
          setTodos((prev) => [...prev, todoToDelete]);
        }
        setError(result.error);
      }
    });
  };

  const handleEdit = async (id: string, title: string) => {
    const originalTodo = todos.find((t) => t.id === id);
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

    startTransition(async () => {
      const result = await updateTodo(id, { title });
      if (result.error) {
        if (originalTodo) {
          setTodos((prev) => prev.map((t) => (t.id === id ? originalTodo : t)));
        }
        setError(result.error);
      }
    });
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleAddTodo} sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Lägg till ny uppgift..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isPending}
          error={!!titleError}
          helperText={titleError || (newTitle ? `${newTitle.length}/${MAX_TODO_LENGTH}` : '')}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          disabled={isPending || !newTitle.trim() || !!titleError}
          sx={{ minWidth: 140 }}
        >
          Lägg till
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {todos.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Inga uppgifter att visa. Lägg till din första uppgift!
        </Typography>
      ) : (
        <List disablePadding>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
              disabled={isPending}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
