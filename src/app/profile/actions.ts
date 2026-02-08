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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function uploadAvatar(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { url: null, error: 'Ej inloggad' };
  }

  const file = formData.get('avatar') as File | null;
  if (!file || file.size === 0) {
    return { url: null, error: 'Ingen fil vald' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { url: null, error: 'Ogiltigt filformat. Tillåtna: JPG, PNG, WebP, GIF' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { url: null, error: 'Filen är för stor. Max 2 MB' };
  }

  // Delete old avatar if exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  if (profile?.avatar_url) {
    const oldPath = profile.avatar_url.split('/avatars/').pop();
    if (oldPath) {
      await supabase.storage.from('avatars').remove([oldPath]);
    }
  }

  // Upload new avatar
  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  if (updateError) {
    return { url: null, error: updateError.message };
  }

  revalidatePath('/profile');
  return { url: publicUrl, error: null };
}

export async function deleteAvatar(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Ej inloggad' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  if (profile?.avatar_url) {
    const oldPath = profile.avatar_url.split('/avatars/').pop();
    if (oldPath) {
      await supabase.storage.from('avatars').remove([oldPath]);
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  return { error: null };
}
