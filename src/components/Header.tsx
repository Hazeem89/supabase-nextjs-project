import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DarkModeToggle from './DarkModeToggle';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Link href="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold' }}
          >
            LIA-Projekt
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <DarkModeToggle />
          {user ? (
            <>
              <Link href="/todos" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<ChecklistIcon />}
                  color="primary"
                >
                  Att göra
                </Button>
              </Link>
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <Button color="inherit">
                  Profil
                </Button>
              </Link>
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Logga ut
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button color="inherit">
                  Logga in
                </Button>
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Registrera
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
