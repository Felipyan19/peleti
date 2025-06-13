"use client";

import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import Image from "next/image";
import heroData from "@/data/hero.json";

export default function Hero() {
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("inicio", {
      threshold: 0.2,
      staggerDelay: 0.2,
      animationDuration: 0.8,
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
          src={heroData.image}
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
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)",
          backdropFilter: "blur(1px)",
          zIndex: 1,
        }}
      />

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
          ref={ref}
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.div variants={getStaggerVariants(0)}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                mb: 3,
              }}
            >
              {heroData.title}
            </Typography>
          </motion.div>

          <motion.div variants={getStaggerVariants(1)}>
            <Typography
              variant="h5"
              component="p"
              gutterBottom
              sx={{
                fontWeight: 400,
                opacity: 0.95,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                mb: 5,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.4,
              }}
            >
              {heroData.description}
            </Typography>
          </motion.div>

          <motion.div
            variants={getStaggerVariants(2)}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              color="primary"
              href="#catalogo"
              size="large"
              sx={{
                textTransform: "none",
                px: 5,
                py: 2,
                borderRadius: 5,
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow:
                    "0 12px 35px rgba(0,0,0,0.25), 0 6px 15px rgba(0,0,0,0.15)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {heroData.buttonText}
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
}
