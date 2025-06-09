"use client";

import Link from "next/link";
import { Box, Container, Typography, Grid, IconButton, useTheme } from "@mui/material";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box component="footer" sx={{ backgroundColor: "background.default", color: "text.secondary", py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Descripción */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Resin Art
            </Typography>
            <Typography variant="body2">
              Creando piezas únicas en resina con pasión y dedicación.
            </Typography>
          </Grid>

          {/* Enlaces Rápidos */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom color="text.primary">
              Enlaces Rápidos
            </Typography>
            {[
              { label: "Sobre Nosotros", href: "#about" },
              { label: "Estilos", href: "#styles" },
              { label: "Catálogo", href: "#portfolio" },
              { label: "Contacto", href: "#contact" },
            ].map(({ label, href }) => (
              <Box key={href} mb={1}>
                <Link href={href} passHref legacyBehavior>
                  <Typography
                    component="a"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "none",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Legal */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom color="text.primary">
              Legal
            </Typography>
            {[
              { label: "Política de Privacidad", href: "/privacidad" },
              { label: "Términos y Condiciones", href: "/terminos" },
              { label: "Política de Cookies", href: "/cookies" },
            ].map(({ label, href }) => (
              <Box key={href} mb={1}>
                <Link href={href} passHref legacyBehavior>
                  <Typography
                    component="a"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "none",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Redes Sociales */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom color="text.primary">
              Síguenos
            </Typography>
            <Box display="flex" gap={1}>
              {[{ Icon: FaInstagram, href: "https://instagram.com" },
                { Icon: FaFacebook, href: "https://facebook.com" },
                { Icon: FaWhatsapp, href: "https://wa.me/1234567890" },
              ].map(({ Icon, href }) => (
                <IconButton
                  key={href}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Derechos reservados */}
        <Box textAlign="center" borderTop={1} borderColor="divider" mt={6} pt={3}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Resin Art. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
