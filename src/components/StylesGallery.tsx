"use client";

import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  Chip,
  Stack,
} from "@mui/material";
import { FaUniversity, FaShieldAlt, FaLeaf, FaCheck } from "react-icons/fa";
import styleGalleryData from "@/data/styleGallery.json";

const MotionCard = motion(Card);

const IconComponents = {
  FaUniversity,
  FaShieldAlt,
  FaLeaf,
};

interface StyleData {
  id: number;
  name: string;
  description: string;
  icon: keyof typeof IconComponents;
  techniques: string[];
  examples: string;
}

export default function StylesGallery() {
  const theme = useTheme();
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("estilos", {
      threshold: 0.1,
      staggerDelay: 0.2,
      animationDuration: 0.8,
    });

  const styles = styleGalleryData.styles as StyleData[];

  return (
    <Box
      component="section"
      id="estilos"
      sx={{
        py: 12,
        backgroundColor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div variants={getStaggerVariants(0)}>
            <Box sx={{ textAlign: "center", mb: 10 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "text.primary",
                  mb: 3,
                }}
              >
                {styleGalleryData.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mx="auto"
                maxWidth={700}
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                {styleGalleryData.description}
              </Typography>
            </Box>
          </motion.div>

          {/* Styles Cards */}
          <Stack spacing={6}>
            {styles.map((style, index) => {
              const IconComponent = IconComponents[style.icon];

              return (
                <motion.div
                  key={style.id}
                  variants={getStaggerVariants(index + 1)}
                >
                  <MotionCard
                    elevation={2}
                    whileHover={{
                      y: -8,
                      scale: 1.01,
                      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                    }}
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      position: "relative",
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        "& .main-icon": {
                          transform: "scale(1.1)",
                        },
                        "& .category-chip": {
                          transform: "scale(1.05)",
                          backgroundColor: theme.palette.primary.main,
                          "& .MuiChip-label": {
                            color: "white",
                          },
                        },
                      },
                    }}
                  >
                    {/* Category Chip - Estilo del Portfolio */}
                    <Chip
                      className="category-chip"
                      label={`Estilo ${style.id}`}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        height: 28,
                        borderRadius: "14px",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        zIndex: 2,
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                      }}
                    />

                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: 4,
                          alignItems: { xs: "center", md: "flex-start" },
                        }}
                      >
                        {/* Icon Section */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minWidth: 120,
                          }}
                        >
                          <Box
                            className="main-icon"
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                              transition: "transform 0.3s ease",
                              boxShadow: theme.shadows[3],
                            }}
                          >
                            <IconComponent size={28} color="white" />
                          </Box>
                        </Box>

                        {/* Content Section */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                              mb: 2,
                              fontSize: { xs: "1.5rem", md: "1.8rem" },
                            }}
                          >
                            {style.name}
                          </Typography>

                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                            sx={{
                              fontSize: "1rem",
                              lineHeight: 1.6,
                              mb: 4,
                            }}
                          >
                            {style.description}
                          </Typography>

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                              gap: 4,
                            }}
                          >
                            {/* Techniques */}
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  mb: 2,
                                  fontSize: "1rem",
                                }}
                              >
                                Técnicas Especializadas
                              </Typography>
                              <Stack spacing={1}>
                                {style.techniques.map((technique, i) => (
                                  <Box
                                    key={i}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <FaCheck
                                      size={12}
                                      color={theme.palette.primary.main}
                                    />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ fontSize: "0.9rem" }}
                                    >
                                      {technique}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>

                            {/* Examples */}
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  mb: 2,
                                  fontSize: "1rem",
                                }}
                              >
                                Ejemplos de Aplicación
                              </Typography>
                              <Chip
                                label={style.examples}
                                size="small"
                                sx={{
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  height: 28,
                                  borderRadius: "14px",
                                  border: `1px solid ${theme.palette.divider}`,
                                  backgroundColor:
                                    theme.palette.background.default,
                                  color: theme.palette.text.secondary,
                                  "& .MuiChip-label": {
                                    px: 1.5,
                                    whiteSpace: "normal",
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </motion.div>
              );
            })}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
