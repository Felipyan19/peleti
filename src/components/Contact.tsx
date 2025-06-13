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
  Card,
  CardContent,
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
      sx={{ py: 10, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={8}>
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
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.6,
                opacity: 0.9,
                maxWidth: 500,
                mx: "auto",
              }}
            >
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
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 480,
                    borderRadius: 5,
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)"
                    }`,
                    background: theme.palette.background.paper,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-1px)",
                            },
                          },
                        }}
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-1px)",
                            },
                          },
                        }}
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-1px)",
                            },
                          },
                        }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                          fullWidth
                          sx={{
                            textTransform: "none",
                            mt: 2,
                            py: 2,
                            borderRadius: 3,
                            fontSize: "1rem",
                            fontWeight: 600,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                              transform: "translateY(-2px)",
                            },
                            "&:disabled": {
                              backgroundColor: "action.disabled",
                            },
                          }}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar"}
                        </Button>
                      </motion.div>
                      {submitStatus === "success" && (
                        <Alert
                          severity="success"
                          sx={{
                            borderRadius: 3,
                            fontWeight: 500,
                          }}
                        >
                          {contactData.submit.success}
                        </Alert>
                      )}
                      {submitStatus === "error" && (
                        <Alert
                          severity="error"
                          sx={{
                            borderRadius: 3,
                            fontWeight: 500,
                          }}
                        >
                          {contactData.submit.error}
                        </Alert>
                      )}
                    </Box>
                  </CardContent>
                </Card>
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
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 480,
                    borderRadius: 5,
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)"
                    }`,
                    background: theme.palette.background.paper,
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "text.primary",
                      }}
                    >
                      Síguenos en redes sociales
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mb: 4,
                      }}
                    >
                      {[
                        {
                          Icon: IconComponent[
                            contactData.social.instagram
                              .icon as keyof typeof IconComponent
                          ],
                          href: contactData.social.instagram.url,
                          color: "#E4405F",
                        },
                        {
                          Icon: IconComponent[
                            contactData.social.facebook
                              .icon as keyof typeof IconComponent
                          ],
                          href: contactData.social.facebook.url,
                          color: "#1877F2",
                        },
                        {
                          Icon: IconComponent[
                            contactData.social.whatsapp
                              .icon as keyof typeof IconComponent
                          ],
                          href: contactData.social.whatsapp.url,
                          color: "#25D366",
                        },
                      ].map(({ Icon, href, color }) => (
                        <motion.div
                          key={href}
                          whileHover={{
                            scale: 1.1,
                            transition: {
                              duration: 0.2,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconButton
                            component="a"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 4,
                              backgroundColor: "background.default",
                              border: `2px solid ${theme.palette.divider}`,
                              color: theme.palette.text.primary,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                backgroundColor: color,
                                color: "white",
                                borderColor: color,
                                boxShadow: `0 8px 25px ${color}33`,
                              },
                            }}
                          >
                            <Icon size={24} />
                          </IconButton>
                        </motion.div>
                      ))}
                    </Box>

                    <Box sx={{ textAlign: "left", space: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.8,
                          fontSize: "0.95rem",
                          opacity: 0.85,
                        }}
                      >
                        <strong>{contactData.social.instagram.title}:</strong>{" "}
                        {contactData.social.instagram.info}
                        <br />
                        <strong>
                          {contactData.social.facebook.title}:
                        </strong>{" "}
                        {contactData.social.facebook.info}
                        <br />
                        <strong>
                          {contactData.social.whatsapp.title}:
                        </strong>{" "}
                        {contactData.social.whatsapp.info}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
