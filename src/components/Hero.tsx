"use client";

import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/utils/useScrollToSection";
import Image from "next/image";

export default function Hero() {
  const { ref, shouldAnimate } = useScrollToSection("inicio", {
    threshold: 0.1,
  });

  return (
    <Box
      component="section"
      id="inicio"
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/taller-resina.jpg"
          alt="Resin art background"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      <Box
        ref={ref}
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "common.white",
          px: 2,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            Peleti – Artesanías en Resina
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h5" component="p" gutterBottom>
            Lleva belleza y color a tu espacio con piezas únicas hechas a mano
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            color="primary"
            href="#catalogo"
            size="large"
            sx={{
              textTransform: "none",
              px: 4,
              py: 1.5,
              borderRadius: "9999px",
            }}
          >
            Explora nuestro catálogo
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
