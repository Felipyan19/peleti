"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error ?? "No fue posible iniciar sesión.");
      return;
    }

    if (payload.user?.role !== "ADMIN") {
      await fetch("/api/auth/session", { method: "DELETE" });
      setError("Solo los administradores pueden ingresar al panel.");
      return;
    }

    startTransition(() => {
      router.replace("/admin");
      router.refresh();
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              px: { xs: 3, md: 5 },
              py: { xs: 4, md: 5 },
              background:
                "linear-gradient(135deg, #20130c 0%, #493122 65%, #7b4f32 100%)",
              color: "white",
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: { xs: "2.2rem", md: "2.8rem" },
                lineHeight: 1,
                mb: 1.5,
              }}
            >
              Administrador Peleti
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
              Ingresa con una cuenta de administrador para actualizar el contenido del
              sitio en tiempo real.
            </Typography>
          </Box>
          <CardContent sx={{ p: { xs: 3, md: 5 }, background: "transparent" }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  name="email"
                  label="Correo"
                  type="email"
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" } },
                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
                  }}
                />
                <TextField
                  name="password"
                  label="Contraseña"
                  type="password"
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" } },
                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
                  }}
                />
                {error ? <Alert severity="error">{error}</Alert> : null}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isPending}
                  sx={{
                    py: 1.5,
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    background: "linear-gradient(135deg, #8a5b36 0%, #c8853a 100%)",
                    "&:hover": { background: "linear-gradient(135deg, #9e6a40 0%, #d9943e 100%)" },
                  }}
                >
                  {isPending ? "Ingresando..." : "Entrar al panel"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
