"use client";

import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
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
      {/* Fondo */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/hero-bg.jpg"
          alt="Resin art background"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      {/* Contenido */}
      <Box
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            Arte en Resina
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h5" component="p" gutterBottom>
            Piezas únicas y personalizadas
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            variant="contained"
            color="primary"
            href="#portfolio"
            size="large"
            sx={{
              textTransform: "none",
              px: 4,
              py: 1.5,
              borderRadius: "9999px",
            }}
          >
            Ver Catálogo
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
