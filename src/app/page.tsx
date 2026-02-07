import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: 'calc(100vh - 8rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Välkommen till LIA-Projekt
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 500, mb: 4 }}
        >
          En minimal Next.js-applikation med Supabase-autentisering
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {user ? (
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
              >
                Gå till profil
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                >
                  Logga in
                </Button>
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  size="large"
                >
                  Registrera dig
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
