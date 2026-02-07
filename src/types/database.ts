export interface Profile {
  id: string;
  email: string;
  name: string | null;
  city: string | null;
  last_sign_in_at: string | null;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}
