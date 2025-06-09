"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/utils/useScrollToSection";
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
} from "@mui/material";
import { FaTimes } from "react-icons/fa";

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

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Geoda Azul",
    description:
      "Pieza inspirada en formaciones geológicas naturales con tonos azules profundos",
    image: "/images/taller-resina.jpg",
    dimensions: "30x30 cm",
    technique: "Resina epoxi con pigmentos minerales",
    category: "Natural",
  },
  {
    id: 2,
    title: "Océano Profundo",
    description:
      "Recreación de un paisaje marino con efectos de profundidad y movimiento",
    image: "/images/taller-resina.jpg",
    dimensions: "40x60 cm",
    technique: "Resina epoxi con efectos de olas",
    category: "Marino",
  },
  {
    id: 3,
    title: "Abstracción Moderna",
    description: "Diseño contemporáneo con formas fluidas y colores vibrantes",
    image: "/images/taller-resina.jpg",
    dimensions: "50x50 cm",
    technique: "Resina epoxi con pigmentos metálicos",
    category: "Abstracto",
  },
  {
    id: 4,
    title: "Minimalista Blanco",
    description: "Pieza minimalista con líneas limpias y diseño esencial",
    image: "/images/taller-resina.jpg",
    dimensions: "35x35 cm",
    technique: "Resina epoxi con acabado mate",
    category: "Minimalista",
  },
];

const VISIBLE_COUNT = 3;

export default function Portfolio() {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const { ref, shouldAnimate } = useScrollToSection("catalogo", {
    threshold: 0.1,
  });
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo<string[]>(() => {
    const cats = Array.from(new Set(portfolioItems.map((i) => i.category)));
    return ["All", ...cats];
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [selectedCategory]);

  const filteredByCategory = useMemo<PortfolioItem[]>(() => {
    return selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((i) => i.category === selectedCategory);
  }, [selectedCategory]);

  const visibleItems = showAll
    ? filteredByCategory
    : filteredByCategory.slice(0, VISIBLE_COUNT);

  return (
    <Box
      component="section"
      id="catalogo"
      sx={{ py: 10, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "text.primary",
              mb: 2,
            }}
          >
            Nuestro catálogo
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mx="auto"
            maxWidth={600}
          >
            Explora algunas de nuestras creaciones favoritas. Haz clic en cada
            imagen para ver detalles, dimensiones y técnicas utilizadas.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}
          >
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "contained" : "outlined"}
                onClick={() => setSelectedCategory(cat)}
                sx={{ textTransform: "none" }}
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
            mx: -2,
          }}
        >
          {visibleItems.map((item, idx) => (
            <Box
              key={item.id}
              sx={{ width: { xs: "100%", sm: "50%", md: "33.33%" }, p: 2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  shouldAnimate
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
              >
                <MotionCard
                  elevation={3}
                  whileHover={{ y: -8, boxShadow: theme.shadows[8] }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  <Box sx={{ position: "relative", width: "100%", pt: "75%" }}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={500}
                      height={375}
                      style={{
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </motion.div>
            </Box>
          ))}
        </Box>

        {filteredByCategory.length > VISIBLE_COUNT && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll
                  ? "Ver menos"
                  : `Ver más (${filteredByCategory.length - VISIBLE_COUNT})`}
              </Button>
            </Box>
          </motion.div>
        )}

        <Dialog
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedItem && (
            <>
              <DialogTitle sx={{ m: 0, p: 2 }}>
                {selectedItem.title}
                <IconButton
                  aria-label="close"
                  onClick={() => setSelectedItem(null)}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (t) => t.palette.grey[500],
                  }}
                >
                  <FaTimes />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 400,
                    mb: 2,
                  }}
                >
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    width={800}
                    height={600}
                    style={{
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
                <Typography variant="body1" paragraph>
                  {selectedItem.description}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", mx: -2 }}>
                  <Box sx={{ width: "50%", p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Dimensiones
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedItem.dimensions}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "50%", p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Técnica
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedItem.technique}
                    </Typography>
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
