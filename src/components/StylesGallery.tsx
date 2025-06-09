"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
} from "@mui/material";

// Componente animado a partir de Card
const MotionCard = motion(Card);

const styles = [
  {
    id: 1,
    name: "Geodas",
    description: "Piezas inspiradas en formaciones geológicas naturales",
    image: "/images/geode.jpg",
    category: "natural",
  },
  {
    id: 2,
    name: "Océanos",
    description: "Recreaciones de paisajes marinos con efectos de profundidad",
    image: "/images/ocean.jpg",
    category: "natural",
  },
  {
    id: 3,
    name: "Abstracto",
    description: "Diseños modernos y contemporáneos",
    image: "/images/abstract.jpg",
    category: "modern",
  },
  {
    id: 4,
    name: "Minimalista",
    description: "Piezas con líneas limpias y diseño esencial",
    image: "/images/minimal.jpg",
    category: "modern",
  },
  {
    id: 5,
    name: "Metálico",
    description: "Acabados con efectos metálicos y brillantes",
    image: "/images/metallic.jpg",
    category: "modern",
  },
];

const categories = [
  { id: "all", name: "Todos" },
  { id: "natural", name: "Natural" },
  { id: "modern", name: "Moderno" },
];

export default function StylesGalleryVento() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filteredStyles =
    selectedCategory === "all"
      ? styles
      : styles.filter((s) => s.category === selectedCategory);

  return (
    <Box
      component="section"
      id="styles"
      sx={{ py: 12, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        {/* Título */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: theme.spacing(6) }}
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
            Estilos de Figuras
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mx="auto"
            maxWidth={600}
          >
            Explora nuestra colección de estilos únicos, cada uno con su propia
            personalidad y técnica especial.
          </Typography>
        </motion.div>

        {/* Filtros tipo “pill” */}
        <Box display="flex" justifyContent="center" gap={2} mb={8}>
          {categories.map((cat) => {
            const selected = selectedCategory === cat.id;
            return (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selected ? "contained" : "outlined"}
                color="primary"
                sx={{
                  textTransform: "none",
                  borderRadius: "50px",
                  px: 3,
                  py: 1,
                  transition: "all 0.3s",
                }}
              >
                {cat.name}
              </Button>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {filteredStyles.map((style) => (
            <MotionCard
              key={style.id}
              elevation={3}
              whileHover={{ y: -8, boxShadow: theme.shadows[8] }}
              transition={{ type: "spring", stiffness: 300 }}
              sx={{
                width: 300,        // ancho fijo
                height: 380,       // alto fijo
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                  }}
                >
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {style.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {style.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </MotionCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
