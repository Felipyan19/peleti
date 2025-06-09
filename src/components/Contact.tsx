"use client";

import { useState } from "react";
import { Box, Container, Typography, TextField, Button, IconButton, Grid, Alert, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000)); // Simula envío
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="section"
      id="contact"
      sx={{ py: 10, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Título */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h2" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
              ¿Interesado en una pieza personalizada? ¡Contáctanos!
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Formulario */}
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Mensaje"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ textTransform: "none", py: 1.5 }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>

                {submitStatus === "success" && <Alert severity="success">¡Mensaje enviado con éxito!</Alert>}
                {submitStatus === "error" && <Alert severity="error">Error al enviar el mensaje. Por favor, intenta de nuevo.</Alert>}
              </Box>
            </Grid>

            {/* Redes & Contacto */}
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={6}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Síguenos
                  </Typography>
                  <Box display="flex" gap={2}>
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
                          bgcolor: "text.primary",
                          color: "common.white",
                          "&:hover": { bgcolor: theme.palette.primary.main },
                        }}
                      >
                        <Icon />
                      </IconButton>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Información de Contacto
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📍 Ciudad, País<br />
                    📞 +1 234 567 890<br />
                    ✉️ contacto@resinart.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
