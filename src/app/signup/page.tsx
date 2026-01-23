import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Registrera dig
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Skapa ett nytt konto
          </p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Har du redan ett konto?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
}
