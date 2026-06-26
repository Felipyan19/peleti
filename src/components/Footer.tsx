"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const NAV = [
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
  { label: "Estilos", href: "#estilos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Contacto", href: "#contacto" },
];

const SOCIAL = {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
};

interface FooterProps {
  socialLinks: Array<{
    id: string;
    platform: "INSTAGRAM" | "FACEBOOK" | "WHATSAPP";
    title: string;
    url: string;
    icon?: string | null;
  }>;
}

export default function Footer({ socialLinks }: FooterProps) {
  const theme = useTheme();
  const socialItems = socialLinks.map((link) => ({
    id: link.id,
    label: link.title,
    href: link.url,
    Icon:
      (link.icon && SOCIAL[link.icon as keyof typeof SOCIAL]) ||
      SOCIAL[
        ({
          INSTAGRAM: "FaInstagram",
          FACEBOOK: "FaFacebook",
          WHATSAPP: "FaWhatsapp",
        } as const)[link.platform]
      ],
    color:
      link.platform === "INSTAGRAM"
        ? "#E4405F"
        : link.platform === "FACEBOOK"
          ? "#1877F2"
          : "#25D366",
  }));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.default",
        color: "text.secondary",
        pt: { xs: 7, md: 9 },
        pb: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 5,
            pb: 5,
          }}
        >
          {/* Marca + tagline */}
          <Box sx={{ maxWidth: 360 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Box
                aria-hidden="true"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid",
                  borderColor: "rgba(168,105,58,0.4)",
                  background: "rgba(168,105,58,0.08)",
                  color: "primary.main",
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontWeight: 700,
                  fontSize: "1.05rem",
                }}
              >
                P
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "text.primary",
                }}
              >
                Peleti
              </Typography>
            </Stack>
            <Typography
              sx={{ fontSize: "0.95rem", lineHeight: 1.7, opacity: 0.85 }}
            >
              Arte en resina hecho a mano. Piezas decorativas, regalos y
              colecciones personalizadas con alma artesanal.
            </Typography>
          </Box>

          {/* Navegación */}
          <Stack
            component="nav"
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            sx={{ flexWrap: "wrap", gap: 1.5 }}
          >
            {NAV.map((item) => (
              <MuiLink
                key={item.href}
                href={item.href}
                underline="none"
                sx={{
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {item.label}
              </MuiLink>
            ))}
          </Stack>

          {/* Redes */}
          <Stack direction="row" spacing={1.5}>
            {socialItems.map(({ Icon, href, color, label, id }) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    backgroundColor: "background.paper",
                    border: `1px solid ${theme.palette.divider}`,
                    color: "text.secondary",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: color,
                      color: "white",
                      borderColor: color,
                      boxShadow: `0 8px 22px ${color}40`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Icon size={19} />
                </IconButton>
              </motion.div>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            pt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: "0.82rem", opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} Peleti. Todos los derechos
            reservados.
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", opacity: 0.7 }}>
            Hecho a mano en Colombia
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
