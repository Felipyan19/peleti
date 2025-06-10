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
import { useScrollToSection } from "@/utils/useScrollToSection";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import contactData from "@/data/contact.json";

const IconComponent = {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
};

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
  const { ref, shouldAnimate } = useScrollToSection("contacto", {
    threshold: 0.1,
  });

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
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "text.primary",
                mb: 2,
              }}
            >
              {contactData.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {contactData.description}
            </Typography>
          </Box>

          <Grid
            container
            spacing={6}
            justifyContent="center"
            alignItems="flex-start"
          >
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={
                  shouldAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ width: "100%" }}
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
                    label={contactData.form.name}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="medium"
                  />
                  <TextField
                    label={contactData.form.email}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="medium"
                  />
                  <TextField
                    label={contactData.form.message}
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
                    <Alert severity="success">{contactData.submit.success}</Alert>
                  )}
                  {submitStatus === "error" && (
                    <Alert severity="error">{contactData.submit.error}</Alert>
                  )}
                </Box>
              </motion.div>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={
                  shouldAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ width: "100%" }}
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
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                  >
                    {[
                      {
                        Icon: IconComponent[contactData.social.instagram.icon as keyof typeof IconComponent],
                        href: contactData.social.instagram.url,
                      },
                      {
                        Icon: IconComponent[contactData.social.facebook.icon as keyof typeof IconComponent],
                        href: contactData.social.facebook.url,
                      },
                      { Icon: IconComponent[contactData.social.whatsapp.icon as keyof typeof IconComponent], href: contactData.social.whatsapp.url },
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
                    {contactData.social.instagram.title}: {contactData.social.instagram.info}
                    <br />
                    {contactData.social.facebook.title}: {contactData.social.facebook.info}
                    <br />
                    {contactData.social.whatsapp.title}: {contactData.social.whatsapp.info}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
