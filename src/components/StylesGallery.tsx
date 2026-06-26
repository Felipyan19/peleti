"use client";

import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import { Box, Container, Typography, useTheme, Chip, Stack } from "@mui/material";
import { FaUniversity, FaShieldAlt, FaLeaf, FaCheck } from "react-icons/fa";
import type { IconType } from "react-icons";
import Image from "next/image";
import styleGalleryData from "@/data/styleGallery.json";
import SectionHeading from "./SectionHeading";

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
                        ? "linear-gradient(180deg, rgba(31,24,18,0.98) 0%, rgba(21,16,11,0.98) 100%)"
                        : "linear-gradient(180deg, #fffdf8 0%, #f8f1e6 100%)",
                      boxShadow: "0 18px 48px rgba(35,26,19,0.10)",
                      transition: "border-color 0.35s ease, box-shadow 0.35s ease",
                      "&:hover": {
                        borderColor: "rgba(200,148,30,0.35)",
                        boxShadow: "0 30px 70px rgba(35,26,19,0.16)",
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
                          ? "radial-gradient(circle at 50% 32%, rgba(217,163,107,0.14), transparent 38%), #0d0a08"
                          : "radial-gradient(circle at 50% 30%, rgba(200,148,30,0.14), transparent 40%), #eee4d6",
                      }}
                    >
                      <Image
                        src={STYLE_IMAGE[index] ?? "/images/art.jpg"}
                        alt={style.name}
                        fill
                        sizes="(max-width: 900px) 100vw, 42vw"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                          padding: "28px",
                          filter: "contrast(1.06) brightness(1.03)",
                        }}
                      />
                      {/* Marco de bronce */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 14,
                          borderRadius: "12px",
                          border: "1px solid rgba(200,148,30,0.18)",
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
                          color: "rgba(200,148,30,0.55)",
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
                            border: "1px solid rgba(200,148,30,0.40)",
                            backgroundColor: isDark
                              ? "rgba(217,163,107,0.07)"
                              : "rgba(168,105,58,0.06)",
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
                            "linear-gradient(90deg, rgba(200,148,30,0.4), transparent)",
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
                                    ? "rgba(217,163,107,0.10)"
                                    : "rgba(168,105,58,0.08)",
                                  border: `1px solid ${
                                    isDark
                                      ? "rgba(217,163,107,0.22)"
                                      : "rgba(168,105,58,0.18)"
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
        </motion.div>
      </Container>
    </Box>
  );
}
