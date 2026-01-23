import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Logga in
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Ange din e-post och lösenord
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Har du inget konto?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Registrera dig
          </Link>
        </p>
      </div>
    </div>
  );
}
