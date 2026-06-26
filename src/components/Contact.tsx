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
import SectionHeading from "./SectionHeading";

const IconComponent = {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
};

interface ContactProps {
  content: {
    settings: {
      title: string;
      description: string;
      formNameLabel: string;
      formEmailLabel: string;
      formMessageLabel: string;
      submitSuccessText: string;
      submitErrorText: string;
    };
    socialLinks: Array<{
      id: string;
      platform: "INSTAGRAM" | "FACEBOOK" | "WHATSAPP";
      title: string;
      info?: string | null;
      url: string;
      icon?: string | null;
    }>;
  };
}

export default function Contact({ content }: ContactProps) {
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
  const [submitMessage, setSubmitMessage] = useState("");
  const socialLinks = content.socialLinks;
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
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSubmitStatus("success");
      setSubmitMessage(content.settings.submitSuccessText);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitStatus("error");
      setSubmitMessage(content.settings.submitErrorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="section"
      id="contacto"
      sx={{ py: { xs: 8, md: 14 }, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <SectionHeading
          eyebrow="Hablemos"
          index="05"
          title={content.settings.title}
          lead={content.settings.description}
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
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
                        label={content.settings.formNameLabel}
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
                        label={content.settings.formEmailLabel}
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
                        label={content.settings.formMessageLabel}
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
                          role="status"
                          sx={{
                            borderRadius: 3,
                            fontWeight: 500,
                          }}
                        >
                          {submitMessage}
                        </Alert>
                      )}
                      {submitStatus === "error" && (
                        <Alert
                          severity="error"
                          role="alert"
                          sx={{
                            borderRadius: 3,
                            fontWeight: 500,
                          }}
                        >
                          {submitMessage}
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
                      {socialLinks.map((link) => {
                        const Icon =
                          (link.icon && IconComponent[link.icon as keyof typeof IconComponent]) ||
                          IconComponent[
                            ({
                              INSTAGRAM: "FaInstagram",
                              FACEBOOK: "FaFacebook",
                              WHATSAPP: "FaWhatsapp",
                            } as const)[link.platform]
                          ];
                        const color =
                          link.platform === "INSTAGRAM"
                            ? "#E4405F"
                            : link.platform === "FACEBOOK"
                              ? "#1877F2"
                              : "#25D366";

                        return (
                        <motion.div
                          key={link.id}
                          whileHover={{
                            scale: 1.1,
                            transition: {
                              duration: 0.2,
                              ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
                            },
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconButton
                            component="a"
                            href={link.url}
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
                        );
                      })}
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
                        {socialLinks.map((link) => (
                          <Box key={link.id} component="span" sx={{ display: "block" }}>
                            <strong>{link.title}:</strong> {link.info}
                          </Box>
                        ))}
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
