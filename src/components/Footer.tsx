"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.default",
        color: "text.secondary",
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="center">
          <Stack direction="row" spacing={3} justifyContent="center">
            {[
              {
                Icon: FaInstagram,
                href: "https://instagram.com",
                color: "#E4405F",
                label: "Instagram",
              },
              {
                Icon: FaFacebook,
                href: "https://facebook.com",
                color: "#1877F2",
                label: "Facebook",
              },
              {
                Icon: FaTwitter,
                href: "https://twitter.com",
                color: "#1DA1F2",
                label: "Twitter",
              },
            ].map(({ Icon, href, color, label }) => (
              <motion.div
                key={label}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    backgroundColor: "background.paper",
                    border: `1px solid ${theme.palette.divider}`,
                    color: "text.secondary",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: color,
                      color: "white",
                      borderColor: color,
                      boxShadow: `0 8px 25px ${color}33`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Icon size={20} />
                </IconButton>
              </motion.div>
            ))}
          </Stack>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              align="center"
              sx={{
                fontSize: "0.875rem",
                opacity: 0.7,
                fontWeight: 500,
              }}
            >
              &copy; {new Date().getFullYear()} Peleti. Todos los derechos
              reservados.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
