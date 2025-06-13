"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  Chip,
} from "@mui/material";
import { FaExpand } from "react-icons/fa";
import styleGalleryData from "@/data/styleGallery.json";

const MotionCard = motion(Card);

export default function StylesGalleryVento() {
  const theme = useTheme();
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("estilos", {
      threshold: 0.1,
      staggerDelay: 0.1,
      animationDuration: 0.6,
    });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const styles = styleGalleryData.styles;
  const filteredStyles =
    selectedCategory === "all"
      ? styles
      : styles.filter((style) => style.category === selectedCategory);

  return (
    <Box
      component="section"
      id="estilos"
      sx={{ py: 12, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.div variants={getStaggerVariants(0)}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "text.primary",
                  mb: 2,
                }}
              >
                {styleGalleryData.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mx="auto"
                maxWidth={600}
              >
                {styleGalleryData.description}
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={getStaggerVariants(1)}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 6,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant={selectedCategory === "all" ? "contained" : "outlined"}
                onClick={() => setSelectedCategory("all")}
                sx={{
                  textTransform: "none",
                  borderRadius: 3,
                  px: 3,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {styleGalleryData.categories.all}
              </Button>
              <Button
                variant={
                  selectedCategory === "natural" ? "contained" : "outlined"
                }
                onClick={() => setSelectedCategory("natural")}
                sx={{
                  textTransform: "none",
                  borderRadius: 3,
                  px: 3,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {styleGalleryData.categories.natural}
              </Button>
              <Button
                variant={
                  selectedCategory === "modern" ? "contained" : "outlined"
                }
                onClick={() => setSelectedCategory("modern")}
                sx={{
                  textTransform: "none",
                  borderRadius: 3,
                  px: 3,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {styleGalleryData.categories.modern}
              </Button>
            </Box>
          </motion.div>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              mx: -2,
            }}
          >
            {filteredStyles.map((style, index) => (
              <Box
                key={style.id}
                sx={{ width: { xs: "100%", sm: "50%", md: "33.33%" }, p: 2 }}
              >
                <motion.div variants={getStaggerVariants(index + 2)}>
                  <MotionCard
                    elevation={1}
                    whileHover={{
                      y: -8,
                      scale: 1.015,
                      boxShadow:
                        "0 16px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
                      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                    }}
                    whileTap={{ scale: 0.985 }}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 5,
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      background: theme.palette.background.paper,
                      border: `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)"
                      }`,
                      position: "relative",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        "& .expand-icon": {
                          opacity: 1,
                          transform: "scale(1) rotate(0deg)",
                        },
                        "& .image-overlay": {
                          opacity: 1,
                        },
                        "& .category-chip": {
                          transform: "scale(1.05)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          "& .MuiChip-label": {
                            color: "black",
                          },
                        },
                        "& .card-image": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        pt: "70%",
                        borderRadius: "40px 40px 0 0",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        className="card-image"
                        src={style.image}
                        alt={style.name}
                        width={500}
                        height={375}
                        style={{
                          objectFit: "cover",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          transition:
                            "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                      <Box
                        className="image-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
                          opacity: 0,
                          transition:
                            "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "40px 40px 0 0",
                        }}
                      >
                        <FaExpand
                          className="expand-icon"
                          style={{
                            color: "white",
                            fontSize: "22px",
                            opacity: 0,
                            transform: "scale(0.7) rotate(-15deg)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                          }}
                        />
                      </Box>
                      <Chip
                        className="category-chip"
                        label={style.category}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          height: 28,
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.3)",
                          color: "white",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "& .MuiChip-label": {
                            px: 1.5,
                            color: "white",
                          },
                        }}
                      />
                    </Box>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: { xs: 2.5, sm: 3 },
                        pb: { xs: 2.5, sm: 3 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1.5,
                            fontSize: { xs: "1.05rem", sm: "1.15rem" },
                            lineHeight: 1.25,
                            color: "text.primary",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {style.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.5,
                            fontSize: "0.875rem",
                            opacity: 0.85,
                          }}
                        >
                          {style.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: "auto",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            color: "text.secondary",
                            opacity: 0.7,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Estilo {style.category}
                        </Typography>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            opacity: 0.3,
                          }}
                        />
                      </Box>
                    </CardContent>
                  </MotionCard>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
