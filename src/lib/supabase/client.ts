import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          const match = document.cookie
            .split("; ")
            .find((c) => c.startsWith(`${name}=`));
          return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
        },
        set(name: string, value: string) {
          // No maxAge or expires — browser treats these as session cookies
          document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
        },
        remove(name: string) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
    }
  );
}
