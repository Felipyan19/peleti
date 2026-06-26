"use client";

import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import { useRandomImages } from "@/utils/useRandomImages";
import Image from "next/image";
import heroData from "@/data/hero.json";

// Fondo oscuro cálido del hero: escenario donde la imagen se funde hacia el texto.
const STAGE = "#19110b";

export default function Hero() {
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("inicio", {
      threshold: 0.2,
      staggerDelay: 0.2,
      animationDuration: 0.8,
    });

  const { currentImage, isTransitioning } = useRandomImages();

  return (
    <Box
      component="section"
      id="inicio"
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: STAGE,
        // Resplandor de bronce sutil sobre el escenario
        backgroundImage:
          "radial-gradient(58vw 54vh at 82% 22%, rgba(168,105,58,0.20), transparent 64%), radial-gradient(42vw 44vh at 0% 88%, rgba(94,107,82,0.10), transparent 62%)",
      }}
    >
      {/* ── Imagen a la derecha, fundida hacia el texto ── */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: { xs: 0, md: "42%" },
          zIndex: 0,
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: { xs: "8% 4% 18%", md: "13% 8% 12% 9%" },
            borderRadius: { xs: "32% 68% 42% 58% / 42% 36% 64% 58%", md: "38% 62% 44% 56% / 46% 36% 64% 54%" },
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(200,148,30,0.06) 44%, rgba(25,17,11,0.20))",
            border: "1px solid rgba(200,148,30,0.22)",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.06), 0 38px 90px rgba(0,0,0,0.30)",
            backdropFilter: "blur(2px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: { xs: "18%", md: "20%" },
            left: { xs: "12%", md: "0%" },
            width: { xs: "76%", md: "72%" },
            height: { xs: "48%", md: "54%" },
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(217,163,107,0.24), rgba(217,163,107,0.08) 34%, transparent 68%)",
            filter: "blur(30px)",
            opacity: 0.72,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: { xs: "7% 2% 14%", md: "10% 7% 8% 5%" },
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 28px 54px rgba(0,0,0,0.42))",
            clipPath:
              "polygon(8% 12%, 58% 0%, 95% 20%, 100% 68%, 72% 100%, 20% 92%, 0% 56%)",
            borderRadius: 4,
          }}
        >
          <Image
            src={currentImage.path}
            alt={`Peleti - ${currentImage.name}`}
            fill
            sizes="(max-width: 900px) 100vw, 64vw"
            style={{
              objectFit: "contain",
              objectPosition: "center center",
              filter: "contrast(1.08) brightness(1.04) saturate(0.98)",
              padding: "18px",
            }}
            priority
          />
        </Box>

        {/* Degradado que funde la imagen con el escenario:
            horizontal hacia el texto en desktop, vertical en móvil */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: `linear-gradient(to top, ${STAGE} 4%, rgba(25,17,11,0.78) 35%, rgba(25,17,11,0.30) 70%, rgba(25,17,11,0.12) 100%)`,
              md: `linear-gradient(100deg, ${STAGE} 0%, rgba(25,17,11,0.96) 16%, rgba(25,17,11,0.70) 31%, rgba(25,17,11,0.28) 49%, rgba(25,17,11,0.04) 70%, transparent 100%)`,
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: { xs: 0, md: "-18%" },
            width: { xs: "100%", md: "46%" },
            background: {
              xs: "transparent",
              md: `linear-gradient(to right, ${STAGE} 0%, rgba(25,17,11,0.82) 42%, rgba(25,17,11,0.22) 76%, transparent 100%)`,
            },
            pointerEvents: "none",
          }}
        />
        {/* Viñeta superior e inferior para integrar bordes */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, rgba(25,17,11,0.55) 0%, transparent 20%, transparent 78%, rgba(25,17,11,0.62) 100%)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: { xs: "15% 10% 16%", md: "16% 12% 12% 18%" },
            border: "1px solid rgba(200,148,30,0.18)",
            borderRadius: { xs: "34% 66% 46% 54% / 42% 38% 62% 58%", md: "40% 60% 46% 54% / 48% 38% 62% 52%" },
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* ── Contenido a la izquierda ── */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          color: "common.white",
          display: "flex",
          alignItems: "center",
          minHeight: "100vh",
          pt: { xs: 14, md: 18 },
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            ref={ref}
            variants={getContainerVariants()}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
          >
            <Stack spacing={4} sx={{ maxWidth: { xs: 760, md: 600 } }}>
              <motion.div variants={getStaggerVariants(0)}>
                <Chip
                  label="Taller artesanal de piezas en resina"
                  sx={{
                    height: 38,
                    borderRadius: 999,
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(200,148,30,0.35)",
                    backdropFilter: "blur(12px)",
                    "& .MuiChip-label": {
                      px: 2,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    },
                  }}
                />
              </motion.div>

              <motion.div variants={getStaggerVariants(1)}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontFamily: 'var(--font-display), Georgia, serif',
                    fontWeight: 600,
                    lineHeight: 0.98,
                    letterSpacing: "-0.025em",
                    textWrap: "balance",
                    textShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    fontSize: { xs: "3.2rem", sm: "4.4rem", md: "5rem" },
                    maxWidth: 640,
                  }}
                >
                  Arte en resina con presencia, textura y{" "}
                  <Box
                    component="em"
                    sx={{ color: "primary.light", fontStyle: "italic" }}
                  >
                    alma
                  </Box>
                  .
                </Typography>
              </motion.div>

              <motion.div variants={getStaggerVariants(2)}>
                <Typography
                  component="p"
                  sx={{
                    maxWidth: 520,
                    fontSize: { xs: "1.05rem", sm: "1.15rem", md: "1.2rem" },
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.86)",
                    textShadow: "0 2px 18px rgba(0,0,0,0.35)",
                  }}
                >
                  {heroData.description}. Diseñamos piezas decorativas, regalos y
                  colecciones personalizadas para hogares, marcas y momentos que
                  merecen verse especiales.
                </Typography>
              </motion.div>

              <motion.div variants={getStaggerVariants(3)}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%", maxWidth: 460 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    href="#catalogo"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.75,
                      fontSize: "1rem",
                      boxShadow: "0 18px 36px rgba(0,0,0,0.28)",
                    }}
                  >
                    {heroData.buttonText}
                  </Button>
                  <Button
                    variant="outlined"
                    href="#contacto"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.75,
                      color: "white",
                      borderColor: "rgba(255,255,255,0.28)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        borderColor: "rgba(200,148,30,0.6)",
                        backgroundColor: "rgba(255,255,255,0.12)",
                      },
                    }}
                  >
                    Hablar por WhatsApp
                  </Button>
                </Stack>
              </motion.div>

              <motion.div variants={getStaggerVariants(4)}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ pt: 1 }}>
                  {[
                    "Piezas hechas a mano",
                    "Diseños personalizados",
                    "Catálogo en constante renovación",
                  ].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        px: 2,
                        py: 1.2,
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.14)",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: "rgba(255,255,255,0.84)",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ── Pieza destacada ── */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 24, md: 36 },
          right: { xs: 20, md: 36 },
          zIndex: 2,
          maxWidth: 260,
          display: { xs: "none", sm: "block" },
          background: "rgba(25,17,11,0.45)",
          backdropFilter: "blur(14px)",
          borderRadius: 4,
          px: 2.2,
          py: 1.5,
          border: "1px solid rgba(200,148,30,0.28)",
        }}
      >
        <Typography
          sx={{
            color: "rgba(255,255,255,0.72)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Pieza destacada
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontSize: "0.95rem",
            lineHeight: 1.45,
          }}
        >
          Inspirada en texturas orgánicas y acabados brillantes, como{" "}
          {currentImage.name.replace(".jpeg", "").replace(".jpg", "")}.
        </Typography>
      </Box>
    </Box>
  );
}
