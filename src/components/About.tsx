"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
import Image from "next/image";
import aboutData from "@/data/about.json";
import SectionHeading from "./SectionHeading";
import { BLUR_DATA_URL } from "@/utils/imagePlaceholder";

interface AboutContent {
  title: string;
  paragraphs: string[];
  imageUrl?: string;
}

interface AboutProps {
  content?: AboutContent;
}

export default function About({ content = aboutData }: AboutProps) {
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("sobre-nosotros", {
      threshold: 0.2,
      staggerDelay: 0.15,
      animationDuration: 0.8,
    });

  const [lead, ...rest] = content.paragraphs;

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
          title={content.title}
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
                  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "680px",
                }}
              >
                {/* Filo del marco: degradado turquesa → oro */}
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "4/5",
                    borderRadius: "20px",
                    p: "3px",
                    background:
                      "linear-gradient(155deg, rgba(15,163,168,0.95) 0%, rgba(11,110,116,0.5) 45%, rgba(233,180,48,0.9) 100%)",
                    boxShadow:
                      "0 28px 60px rgba(6,20,23,0.32), 0 6px 20px rgba(15,163,168,0.18)",
                  }}
                >
                  {/* Paspartú que se adapta al tema claro/oscuro */}
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      borderRadius: "17px",
                      overflow: "hidden",
                      background:
                        "radial-gradient(circle at 50% 28%, rgba(233,180,48,0.12), transparent 42%), var(--primary-light)",
                    }}
                  >
                    <Image
                      src={content.imageUrl ?? "/images/animal.jpg"}
                      alt={content.title}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 900px) 100vw, 680px"
                      style={{
                        objectFit: "contain",
                        objectPosition: "center",
                        padding: "22px",
                        filter: "contrast(1.04) brightness(1.04) saturate(0.96)",
                      }}
                    />
                    {/* Bisel dorado interior */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 14,
                        borderRadius: "10px",
                        border: "1px solid rgba(233,180,48,0.35)",
                        pointerEvents: "none",
                      }}
                    />
                  </Box>
                </Box>
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
                    mt: "-0.08em",
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
