'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Todo } from '@/types/database';

export async function getTodos(): Promise<{ data: Todo[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Ej inloggad' };
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function createTodo(formData: FormData): Promise<{ data: Todo | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Ej inloggad' };
  }

  const title = formData.get('title') as string;

  if (!title || title.trim() === '') {
    return { data: null, error: 'Titel krävs' };
  }

  const { data, error } = await supabase
    .from('todos')
    .insert({
      user_id: user.id,
      title: title.trim(),
      completed: false,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath('/todos');
  return { data, error: null };
}

export async function updateTodo(
  id: string,
  updates: { title?: string; completed?: boolean }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Ej inloggad' };
  }

  const { error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/todos');
  return { error: null };
}

export async function deleteTodo(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Ej inloggad' };
  }

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/todos');
  return { error: null };
}

export async function toggleTodoComplete(
  id: string,
  completed: boolean
): Promise<{ error: string | null }> {
  return updateTodo(id, { completed });
}
