import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Profil
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Din kontoinformation
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              E-post
            </p>
            <p className="mt-1 text-zinc-900 dark:text-white">{user.email}</p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Användar-ID
            </p>
            <p className="mt-1 font-mono text-sm text-zinc-900 dark:text-white">
              {user.id}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Senast inloggad
            </p>
            <p className="mt-1 text-zinc-900 dark:text-white">
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString("sv-SE")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
