'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export async function getProfile(): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Ej inloggad' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: null,
          city: null,
        })
        .select()
        .single();

      if (insertError) {
        return { data: null, error: insertError.message };
      }
      return { data: newProfile, error: null };
    }
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateProfile(
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Ej inloggad' };
  }

  const name = formData.get('name') as string;
  const city = formData.get('city') as string;

  const { error } = await supabase
    .from('profiles')
    .update({
      name: name || null,
      city: city || null,
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  return { error: null };
}
