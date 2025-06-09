"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Alert,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
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
      id="contacto"
      sx={{ py: 8, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" gutterBottom>
              Contáctanos
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ¿Tienes alguna consulta o proyecto? Escríbenos.
            </Typography>
          </Box>

          <Grid
            container
            spacing={6}
            justifyContent="center"
            alignItems="flex-start"
          >
            {/* Formulario */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  width: "100%",
                  maxWidth: 480,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <TextField
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="medium"
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="medium"
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
                  size="medium"
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ textTransform: "none", mt: 2, py: 1.5 }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
                {submitStatus === "success" && (
                  <Alert severity="success">¡Enviado!</Alert>
                )}
                {submitStatus === "error" && (
                  <Alert severity="error">Error. Intenta de nuevo.</Alert>
                )}
              </Box>
            </Grid>

            {/* Redes & Contacto */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  width: "100%",
                  maxWidth: 480,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  {[
                    { Icon: FaInstagram, href: "https://instagram.com" },
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
                        mx: 1,
                        color: theme.palette.text.primary,
                        "&:hover": {
                          transform: "scale(1.1)",
                          transition: "transform 0.2s ease-in-out",
                        },
                      }}
                    >
                      <Icon size={24} />
                    </IconButton>
                  ))}
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 2 }}
                >
                  📍 Ciudad, País
                  <br />
                  📞 +1 234 567 890
                  <br />
                  ✉️ contacto@resinart.com
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
