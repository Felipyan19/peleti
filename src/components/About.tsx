"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import Image from "next/image";
import aboutData from "@/data/about.json";
import SectionHeading from "./SectionHeading";

export default function About() {
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("sobre-nosotros", {
      threshold: 0.2,
      staggerDelay: 0.15,
      animationDuration: 0.8,
    });

  const [lead, ...rest] = aboutData.paragraphs;

  return (
    <Box
      component="section"
      id="sobre-nosotros"
      sx={{ py: { xs: 8, md: 14 }, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <SectionHeading
          eyebrow="Sobre nosotros"
          index="01"
          title={aboutData.title}
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
                mb: { xs: 5, md: 7 },
                position: "relative",
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.015,
                  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "680px",
                  aspectRatio: "4/5",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow:
                    "0 28px 60px rgba(35,26,19,0.16), 0 10px 20px rgba(35,26,19,0.08)",
                  background:
                    "radial-gradient(circle at 50% 28%, rgba(200,148,30,0.13), transparent 36%), #eee4d6",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 18,
                    borderRadius: "12px",
                    border: "1px solid rgba(200,148,30,0.18)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <Image
                  src={aboutData.image}
                  alt={aboutData.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 680px"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    padding: "18px",
                    filter: "contrast(1.04) brightness(1.04) saturate(0.96)",
                  }}
                />
                {/* Marco de bronce sutil */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "16px",
                    boxShadow: "inset 0 0 0 1px rgba(200,148,30,0.22)",
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            </Box>
          </motion.div>

          <Box sx={{ maxWidth: 680, mx: "auto" }}>
            {/* Bajada destacada con capitular */}
            <motion.div variants={getStaggerVariants(2)}>
              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", md: "1.35rem" },
                  lineHeight: 1.6,
                  color: "text.primary",
                  mb: 4,
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontWeight: 500,
                  "&::first-letter": {
                    float: "left",
                    fontSize: "3.9rem",
                    lineHeight: 0.66,
                    pr: 1.4,
                    mt: "0.02em",
                    color: "primary.main",
                    fontWeight: 700,
                  },
                }}
              >
                {lead}
              </Typography>
            </motion.div>

            {rest.map((text, i) => (
              <motion.div key={i} variants={getStaggerVariants(i + 3)}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{
                    fontSize: "1.08rem",
                    lineHeight: 1.8,
                    mb: 2.5,
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
