"use client";

import { Box, Container, Typography, IconButton, Stack } from "@mui/material";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.default",
        color: "text.secondary",
        py: 4,
        borderTop: 1,
        borderColor: "divider",
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          {/* <Stack direction="row" spacing={6} justifyContent="center">
            <Link href="/privacidad">
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Política de Privacidad
              </Typography>
            </Link>
            <Link href="/terminos">
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Términos de Servicio
              </Typography>
            </Link>
            <Link href="#contact">
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Contacto
              </Typography>
            </Link>
          </Stack> */}

          <Stack direction="row" spacing={2} justifyContent="center">
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <FaInstagram />
            </IconButton>
            <IconButton
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <FaFacebook />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <FaTwitter />
            </IconButton>
          </Stack>

          <Typography variant="body2" align="center" sx={{ fontSize: 13 }}>
            &copy; {new Date().getFullYear()} Peleti. Todos los derechos
            reservados.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
