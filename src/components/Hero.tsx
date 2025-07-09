"use client";

import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import { useRandomImages } from "@/utils/useRandomImages";
import Image from "next/image";
import heroData from "@/data/hero.json";

export default function Hero() {
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("inicio", {
      threshold: 0.2,
      staggerDelay: 0.2,
      animationDuration: 0.8,
    });

  const { currentImage } = useRandomImages();

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
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            animation: "kenBurns 20s infinite linear",
            "@keyframes kenBurns": {
              "0%": {
                transform: "scale(1) translate(0, 0)",
              },
              "25%": {
                transform: "scale(1.08) translate(-2%, -1%)",
              },
              "50%": {
                transform: "scale(1.12) translate(-1%, -2%)",
              },
              "75%": {
                transform: "scale(1.06) translate(-3%, 0%)",
              },
              "100%": {
                transform: "scale(1) translate(0, 0)",
              },
            },
          }}
        >
          <Image
            src={currentImage.path}
            alt={`Peleti - ${currentImage.name}`}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center center",
              filter: "contrast(1.15) brightness(1.1) saturate(1.05)",
              transition: "opacity 2s cubic-bezier(0.4, 0.0, 0.2, 1)",
            }}
            priority
          />
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)",
          backdropFilter: "blur(0.5px)",
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
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                mb: 3,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
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
                textShadow: "0 2px 15px rgba(0,0,0,0.4)",
                mb: 5,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.4,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
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
                px: 6,
                py: 2.5,
                borderRadius: 6,
                fontSize: "1.2rem",
                fontWeight: 600,
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.3), 0 6px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow:
                    "0 15px 40px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.25)",
                  transform: "translateY(-3px)",
                },
              }}
            >
              {heroData.buttonText}
            </Button>
          </motion.div>
        </motion.div>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          right: 30,
          zIndex: 2,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          px: 2,
          py: 1,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "white",
            fontWeight: 500,
            opacity: 0.8,
            fontSize: "0.75rem",
          }}
        >
          {currentImage.name.replace(".jpeg", "").replace(".jpg", "")}
        </Typography>
      </Box>
    </Box>
  );
}
