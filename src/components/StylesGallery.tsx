"use client";

import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import { Box, Button, Container, Typography, useTheme, Chip, Stack } from "@mui/material";
import { FaUniversity, FaShieldAlt, FaLeaf, FaCheck, FaWhatsapp } from "react-icons/fa";
import type { IconType } from "react-icons";
import Image from "next/image";
import styleGalleryData from "@/data/styleGallery.json";
import SectionHeading from "./SectionHeading";
import { withWhatsAppMessage } from "@/utils/whatsapp";
import { BLUR_DATA_URL } from "@/utils/imagePlaceholder";

const IconComponents: Record<string, IconType> = {
  FaUniversity,
  FaShieldAlt,
  FaLeaf,
};

// Imagen representativa de cada estilo (piezas reales del taller)
const STYLE_IMAGE: Record<number, string> = {
  0: "/images/virgen.jpg",
  1: "/images/guerrero.jpg",
  2: "/images/elefantes.jpg",
};

interface StyleData {
  id: string;
  name: string;
  description: string;
  icon?: string;
  techniques: string[];
  examples?: string;
}

interface StylesGalleryProps {
  content?: {
    settings: {
      title: string;
      description: string;
    };
    styles: StyleData[];
  };
  whatsappUrl?: string;
}

const defaultStyleGalleryContent = {
  settings: {
    title: styleGalleryData.title,
    description: styleGalleryData.description,
  },
  styles: styleGalleryData.styles.map((style) => ({
    ...style,
    id: String(style.id),
  })),
};

export default function StylesGallery({
  content = defaultStyleGalleryContent,
  whatsappUrl,
}: StylesGalleryProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("estilos", {
      threshold: 0.1,
      staggerDelay: 0.2,
      animationDuration: 0.8,
    });

  const styles = content.styles;

  return (
    <Box
      component="section"
      id="estilos"
      sx={{
        py: { xs: 8, md: 14 },
        backgroundColor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Técnicas y estilos"
          index="02"
          title={content.settings.title}
          lead={content.settings.description}
        />

        <motion.div
          ref={ref}
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <Stack spacing={{ xs: 5, md: 7 }}>
            {styles.map((style, index) => {
              const IconComponent =
                style.icon && style.icon in IconComponents
                  ? IconComponents[style.icon]
                  : FaLeaf;
              const reversed = index % 2 === 1;
              const num = String(index + 1).padStart(2, "0");
              const examples = (style.examples ?? "")
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean);

              return (
                <motion.div
                  key={style.id}
                  variants={getStaggerVariants(index + 1)}
                >
                  <Box
                    component={motion.div}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        md: reversed ? "row-reverse" : "row",
                      },
                      borderRadius: "18px",
                      overflow: "hidden",
                      border: `1px solid ${theme.palette.divider}`,
                      background: isDark
                        ? "linear-gradient(180deg, rgba(15,34,38,0.98) 0%, rgba(8,22,25,0.98) 100%)"
                        : "linear-gradient(180deg, #fcfefe 0%, #e9f6f5 100%)",
                      boxShadow: "0 18px 48px rgba(18,38,42,0.10)",
                      transition: "border-color 0.35s ease, box-shadow 0.35s ease",
                      "&:hover": {
                        borderColor: "rgba(233,180,48,0.35)",
                        boxShadow: "0 30px 70px rgba(18,38,42,0.16)",
                      },
                    }}
                  >
                    {/* ── Panel de imagen (placa de galería) ── */}
                    <Box
                      sx={{
                        position: "relative",
                        flex: { md: "0 0 42%" },
                        aspectRatio: { xs: "16 / 11", md: "auto" },
                        minHeight: { md: 380 },
                        overflow: "hidden",
                        background: isDark
                          ? "radial-gradient(circle at 50% 32%, rgba(53,201,206,0.14), transparent 38%), #06090a"
                          : "radial-gradient(circle at 50% 30%, rgba(233,180,48,0.14), transparent 40%), #ddf3f4",
                      }}
                    >
                      <Image
                        src={STYLE_IMAGE[index] ?? "/images/art.jpg"}
                        alt={style.name}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        sizes="(max-width: 900px) 100vw, 42vw"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                          padding: "28px",
                          filter: "contrast(1.06) brightness(1.03)",
                        }}
                      />
                      {/* Marco turquesa */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 14,
                          borderRadius: "12px",
                          border: "1px solid rgba(233,180,48,0.18)",
                          pointerEvents: "none",
                        }}
                      />
                      {/* Numeral de catálogo */}
                      <Typography
                        sx={{
                          position: "absolute",
                          top: 18,
                          left: 22,
                          fontFamily: 'var(--font-display), Georgia, serif',
                          fontSize: "3rem",
                          fontWeight: 600,
                          lineHeight: 1,
                          color: "rgba(233,180,48,0.55)",
                          textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                        }}
                      >
                        {num}
                      </Typography>
                    </Box>

                    {/* ── Panel de contenido ── */}
                    <Box
                      sx={{
                        flex: 1,
                        p: { xs: 3, md: 5 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(233,180,48,0.40)",
                            backgroundColor: isDark
                              ? "rgba(53,201,206,0.07)"
                              : "rgba(15,163,168,0.06)",
                            color: "primary.main",
                          }}
                        >
                          <IconComponent size={22} />
                        </Box>
                        <Box>
                          <Typography
                            variant="overline"
                            sx={{ color: "text.secondary", display: "block", lineHeight: 1.4, opacity: 0.7 }}
                          >
                            Estilo {num}
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{
                              color: "text.primary",
                              fontSize: { xs: "1.55rem", md: "1.9rem" },
                              lineHeight: 1.1,
                            }}
                          >
                            {style.name}
                          </Typography>
                        </Box>
                      </Stack>

                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "1rem",
                          lineHeight: 1.7,
                          mb: 3,
                        }}
                      >
                        {style.description}
                      </Typography>

                      <Box
                        sx={{
                          height: "1px",
                          background:
                            "linear-gradient(90deg, rgba(233,180,48,0.4), transparent)",
                          mb: 3,
                        }}
                      />

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                          gap: { xs: 3, sm: 4 },
                        }}
                      >
                        {/* Técnicas */}
                        <Box>
                          <Typography
                            variant="overline"
                            sx={{ color: "text.secondary", display: "block", mb: 1.5 }}
                          >
                            Técnicas especializadas
                          </Typography>
                          <Stack spacing={1.2}>
                            {style.techniques.map((technique, i) => (
                              <Box
                                key={i}
                                sx={{ display: "flex", alignItems: "baseline", gap: 1.2 }}
                              >
                                <FaCheck
                                  size={11}
                                  color={theme.palette.primary.main}
                                  style={{ flexShrink: 0, opacity: 0.7, transform: "translateY(1px)" }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                                >
                                  {technique}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>

                        {/* Ejemplos */}
                        <Box>
                          <Typography
                            variant="overline"
                            sx={{ color: "text.secondary", display: "block", mb: 1.5 }}
                          >
                            Ejemplos de aplicación
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {examples.map((ex, i) => (
                              <Chip
                                key={i}
                                label={ex}
                                size="small"
                                sx={{
                                  height: 28,
                                  borderRadius: "999px",
                                  fontSize: "0.78rem",
                                  fontWeight: 500,
                                  textTransform: "capitalize",
                                  color: "text.primary",
                                  backgroundColor: isDark
                                    ? "rgba(53,201,206,0.10)"
                                    : "rgba(15,163,168,0.08)",
                                  border: `1px solid ${
                                    isDark
                                      ? "rgba(53,201,206,0.22)"
                                      : "rgba(15,163,168,0.18)"
                                  }`,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Stack>

          {/* ── CTA: pieza personalizada ── */}
          <motion.div variants={getStaggerVariants(styles.length + 1)}>
            <Box
              sx={{
                mt: { xs: 6, md: 8 },
                p: { xs: 3.5, md: 5 },
                borderRadius: "18px",
                textAlign: "center",
                border: "1px solid rgba(233,180,48,0.30)",
                background: isDark
                  ? "linear-gradient(135deg, rgba(53,201,206,0.10) 0%, rgba(15,34,38,0.6) 100%)"
                  : "linear-gradient(135deg, rgba(15,163,168,0.08) 0%, rgba(233,180,48,0.06) 100%)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "text.primary",
                  mb: 1.5,
                  fontSize: { xs: "1.45rem", md: "1.7rem" },
                }}
              >
                ¿Tienes una idea en mente?
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  maxWidth: 480,
                  mx: "auto",
                  mb: 3,
                  lineHeight: 1.7,
                }}
              >
                Creamos piezas personalizadas en cualquiera de estos estilos,
                diseñadas contigo desde el primer boceto.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={whatsappUrl ? <FaWhatsapp /> : undefined}
                href={
                  whatsappUrl
                    ? withWhatsAppMessage(
                        whatsappUrl,
                        "Hola Peleti 👋 Quiero cotizar una pieza personalizada en resina."
                      )
                    : "#contacto"
                }
                {...(whatsappUrl
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
              >
                Cotiza tu pieza personalizada
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
