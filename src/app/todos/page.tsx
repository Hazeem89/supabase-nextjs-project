import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TodoList from '@/components/todos/TodoList';
import { getTodos } from './actions';

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: todos, error } = await getTodos();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Att göra
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Hantera dina uppgifter
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TodoList initialTodos={todos || []} />
        )}
      </Paper>
    </Container>
  );
}
