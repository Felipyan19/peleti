"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/utils/useScrollToSection";
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

const MotionCard = motion(Card);

const styles = [
  {
    id: 1,
    name: "Geodas",
    description: "Recreaciones minerales con contrastes de color y brillo.",
    image: "/images/taller-resina.jpg",
    category: "natural",
  },
  {
    id: 2,
    name: "Océanos",
    description: "Escenas marinas con efecto de profundidad y movimiento.",
    image: "/images/taller-resina.jpg",
    category: "natural",
  },
  {
    id: 3,
    name: "Abstracto",
    description: "Diseños contemporáneos que juegan con formas y texturas.",
    image: "/images/taller-resina.jpg",
    category: "modern",
  },
];

export default function StylesGalleryVento() {
  const theme = useTheme();
  const { ref, shouldAnimate } = useScrollToSection("estilos", {
    threshold: 0.1,
  });
  const [selectedCategory, setSelectedCategory] = useState("all");

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
          initial={{ opacity: 0, y: 30 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
            Estilos disponibles
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mx="auto"
            maxWidth={600}
          >
            Descubre nuestra variedad de estilos, pensados para todos los gustos
            y ambientes.
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
            <Button
              variant={selectedCategory === "all" ? "contained" : "outlined"}
              onClick={() => setSelectedCategory("all")}
            >
              Todos
            </Button>
            <Button
              variant={
                selectedCategory === "natural" ? "contained" : "outlined"
              }
              onClick={() => setSelectedCategory("natural")}
            >
              Natural
            </Button>
            <Button
              variant={selectedCategory === "modern" ? "contained" : "outlined"}
              onClick={() => setSelectedCategory("modern")}
            >
              Moderno
            </Button>
          </Box>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {filteredStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                shouldAnimate
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <MotionCard
                elevation={3}
                whileHover={{ y: -8, boxShadow: theme.shadows[8] }}
                transition={{ type: "spring", stiffness: 300 }}
                sx={{
                  width: 300,
                  height: 380,
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
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
