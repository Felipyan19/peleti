"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import { useRandomImages } from "@/utils/useRandomImages";
import Image from "next/image";
import aboutData from "@/data/about.json";

export default function About() {
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("sobre-nosotros", {
      threshold: 0.2,
      staggerDelay: 0.15,
      animationDuration: 0.8,
    });

  const { currentImage } = useRandomImages();

  return (
    <Box
      component="section"
      id="sobre-nosotros"
      sx={{ py: 10, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <motion.div
          ref={ref}
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.div variants={getStaggerVariants(0)}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "text.primary",
                mb: 4,
                textAlign: "center",
              }}
            >
              {aboutData.title}
            </Typography>
          </motion.div>

          <motion.div variants={getStaggerVariants(1)}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 6,
                position: "relative",
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "800px",
                  aspectRatio: "16/9",
                  borderRadius: "40px",
                  overflow: "hidden",
                  boxShadow:
                    "0 16px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <Image
                  src={currentImage.path}
                  alt={`Peleti - ${currentImage.name}`}
                  fill
                  style={{
                    borderRadius: "40px",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    filter: "contrast(1.05) brightness(1.02)",
                  }}
                />
              </motion.div>
            </Box>
          </motion.div>

          <Box sx={{ maxWidth: 700, mx: "auto" }}>
            {aboutData.paragraphs.map((text, i) => (
              <motion.div key={i} variants={getStaggerVariants(i + 2)}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    mb: 3,
                    textAlign: "justify",
                    opacity: 0.9,
                  }}
                >
                  {text}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
