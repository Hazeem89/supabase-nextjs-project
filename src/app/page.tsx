import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
          Välkommen till LIA-Projekt
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          En minimal Next.js-applikation med Supabase-autentisering
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {user ? (
            <Link
              href="/profile"
              className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Gå till profil
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Logga in
              </Link>
              <Link
                href="/signup"
                className="rounded-md border border-zinc-300 px-6 py-3 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Registrera dig
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
