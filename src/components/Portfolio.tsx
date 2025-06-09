"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
} from "@mui/material";
import { FaTimes } from "react-icons/fa";

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
    image: "/images/portfolio/geode-blue.jpg",
    dimensions: "30x30 cm",
    technique: "Resina epoxi con pigmentos minerales",
    category: "Natural",
  },
  {
    id: 2,
    title: "Océano Profundo",
    description:
      "Recreación de un paisaje marino con efectos de profundidad y movimiento",
    image: "/images/portfolio/ocean-deep.jpg",
    dimensions: "40x60 cm",
    technique: "Resina epoxi con efectos de olas",
    category: "Marino",
  },
  {
    id: 3,
    title: "Abstracción Moderna",
    description: "Diseño contemporáneo con formas fluidas y colores vibrantes",
    image: "/images/portfolio/abstract-modern.jpg",
    dimensions: "50x50 cm",
    technique: "Resina epoxi con pigmentos metálicos",
    category: "Abstracto",
  },
  {
    id: 4,
    title: "Minimalista Blanco",
    description: "Pieza minimalista con líneas limpias y diseño esencial",
    image: "/images/portfolio/minimal-white.jpg",
    dimensions: "35x35 cm",
    technique: "Resina epoxi con acabado mate",
    category: "Minimalista",
  },
];

const VISIBLE_COUNT = 3;

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Calcula categorías únicas
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
    <Box component="section" id="catalogo" sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <Typography variant="h2" gutterBottom>
            Catálogo
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mx="auto"
            maxWidth={600}
          >
            Explora nuestra colección de piezas únicas, cada una con su propia historia y técnica especial.
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory(cat)}
              sx={{ textTransform: 'none' }}
            >
              {cat}
            </Button>
          ))}
        </Box>

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
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              >
                <Card sx={{ cursor: "pointer" }} onClick={() => setSelectedItem(item)}>
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
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>

        {filteredByCategory.length > VISIBLE_COUNT && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button variant="outlined" onClick={() => setShowAll((prev) => !prev)}>
              {showAll ? "Ver menos" : `Ver más (${filteredByCategory.length - VISIBLE_COUNT})`}
            </Button>
          </Box>
        )}

        <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)} maxWidth="md" fullWidth>
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
                <Box sx={{ position: "relative", width: "100%", height: 400, mb: 2 }}>
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
