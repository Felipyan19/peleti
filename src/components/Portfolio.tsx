"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  useTheme,
  Chip,
} from "@mui/material";
import { FaTimes, FaExpand } from "react-icons/fa";
import portfolioData from "@/data/portfolio.json";
import SectionHeading from "./SectionHeading";

const MotionCard = motion(Card);

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  dimensions: string;
  technique: string;
  category: string;
}

const ITEMS_PER_PAGE = 6;

export default function Portfolio() {
  const theme = useTheme();
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("catalogo", {
      threshold: 0.1,
      staggerDelay: 0.1,
      animationDuration: 0.6,
    });

  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const items: PortfolioItem[] = portfolioData.dataPortfolio;
  const categories = [
    "Todas",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  const filteredItems = useMemo(() => {
    return selectedCategory === "Todas"
      ? items
      : items.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, items]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory]);

  return (
    <Box
      component="section"
      id="catalogo"
      sx={{ py: { xs: 8, md: 14 }, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Catálogo"
          index="04"
          title={portfolioData.title}
          lead={portfolioData.description}
        />

        <motion.div
          ref={ref}
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.div variants={getStaggerVariants(1)}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 4,
                flexWrap: "wrap",
              }}
            >
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "contained" : "outlined"}
                  onClick={() => setSelectedCategory(cat)}
                  size="small"
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Box>
          </motion.div>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              mx: { xs: -1.25, md: -2 },
            }}
          >
            {visibleItems.map((item, idx) => (
              <Box
                key={item.id}
                sx={{
                  width: { xs: "100%", sm: "50%", md: "33.33%" },
                  p: { xs: 1.25, md: 2 },
                }}
              >
                <motion.div variants={getStaggerVariants(idx + 2)}>
                  <MotionCard
                    elevation={1}
                    whileHover={{
                      y: -6,
                      scale: 1.008,
                      boxShadow:
                        "0 24px 56px rgba(35,26,19,0.14), 0 8px 18px rgba(35,26,19,0.08)",
                      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
                    }}
                    whileTap={{ scale: 0.985 }}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "14px",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      background:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(180deg, rgba(31,24,18,0.98) 0%, rgba(21,16,11,0.98) 100%)"
                          : "linear-gradient(180deg, #fffdf8 0%, #f8f1e6 100%)",
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
                          transform: "scale(1.025)",
                        },
                      },
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "4 / 5",
                        borderRadius: "14px 14px 0 0",
                        overflow: "hidden",
                        background:
                          theme.palette.mode === "dark"
                            ? "radial-gradient(circle at 50% 30%, rgba(217,163,107,0.12), transparent 34%), #0d0a08"
                            : "radial-gradient(circle at 50% 28%, rgba(200,148,30,0.13), transparent 36%), #eee4d6",
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 12,
                          borderRadius: "10px",
                          border: "1px solid rgba(200,148,30,0.16)",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      />
                      <Image
                        className="card-image"
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                        style={{
                          objectFit: "contain",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          padding: "18px",
                          filter: "contrast(1.04) brightness(1.04) saturate(0.96)",
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
                            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.34) 100%)",
                          opacity: 0,
                          transition:
                            "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "14px 14px 0 0",
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
                        label={item.category}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 14,
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          height: 28,
                          borderRadius: "999px",
                          border: "1px solid rgba(255,255,255,0.22)",
                          backgroundColor: "rgba(18,12,8,0.48)",
                          backdropFilter: "blur(8px)",
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
                          {item.title}
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
                          {item.description}
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
                          {item.dimensions}
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

          {visibleItems.length < filteredItems.length && (
            <motion.div variants={getStaggerVariants(visibleItems.length + 2)}>
              <Box sx={{ textAlign: "center", mt: 6 }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  Mostrar más
                </Button>
              </Box>
            </motion.div>
          )}
        </motion.div>

        <Dialog
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.3, ease: "easeOut" },
            sx: {
              borderRadius: 4,
              maxHeight: "90vh",
              overflow: "hidden",
            },
          }}
          BackdropProps={{
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.6)",
            },
          }}
        >
          {selectedItem && (
            <>
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  pb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedItem.title}
                  </Typography>
                  <Chip
                    label={selectedItem.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <IconButton
                  onClick={() => setSelectedItem(null)}
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <FaTimes />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: "62vh", md: "68vh" },
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      theme.palette.mode === "dark"
                        ? "radial-gradient(circle at 50% 35%, rgba(217,163,107,0.10), transparent 34%), #0d0a08"
                        : "radial-gradient(circle at 50% 30%, rgba(200,148,30,0.12), transparent 36%), #eee4d6",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: { xs: 16, md: 24 },
                      borderRadius: 3,
                      border: "1px solid rgba(200,148,30,0.16)",
                      zIndex: 0,
                    }}
                  />

                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: { xs: 3, md: 5 },
                    }}
                  >
                    <Image
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      width={900}
                      height={1100}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "6px",
                        filter: "contrast(1.04) brightness(1.04) saturate(0.96)",
                        boxShadow: "0 24px 54px rgba(0,0,0,0.20)",
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ p: 4 }}>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: "1.1rem",
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {selectedItem.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 3,
                      p: 3,
                      backgroundColor: "rgba(0,0,0,0.02)",
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          fontSize: "0.75rem",
                        }}
                      >
                        Dimensiones
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedItem.dimensions}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          fontSize: "0.75rem",
                        }}
                      >
                        Técnica
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedItem.technique}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}
