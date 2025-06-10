"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/utils/useScrollToSection";
import Image from "next/image";
import aboutData from "@/data/about.json";

export default function About() {
  const { ref, shouldAnimate } = useScrollToSection("sobre-nosotros", {
    threshold: 0.1,
  });

  return (
    <Box
      component="section"
      id="sobre-nosotros"
      sx={{ py: 10, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
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

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Image
              src="/images/taller-resina.jpg"
              alt="Taller de resina artesanal"
              width={800}
              height={450}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          </Box>

          {aboutData.paragraphs.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={
                shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
            >
              <Typography variant="body1" color="text.secondary" paragraph>
                {text}
              </Typography>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}
