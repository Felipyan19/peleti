"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/utils/useScrollToSection";
import Image from "next/image";

export default function About() {
  const { ref, shouldAnimate } = useScrollToSection("sobre-nosotros", {
    threshold: 0.1,
  });

  const paragraphs = [
    "En Peleti combinamos tradición y creatividad para transformar resina en arte, ofreciendo piezas únicas que cuentan historias.",
    "Desde 20XX, nuestro taller familiar en [Ciudad] ha evolucionado gracias al amor por el detalle y la dedicación de cada miembro del equipo.",
    "Nuestra misión es llevar inspiración y color a tu hogar con diseños personalizados, respetando siempre técnicas artesanales y procesos sostenibles.",
    "Cada figura es el resultado de un cuidadoso proceso de selección de materiales: resinas ecológicas, pigmentos minerales y acabados de alta durabilidad.",
    "Valoramos la cercanía con nuestros clientes: por eso ofrecemos asesoría personalizada para adaptar cada proyecto a tus gustos y espacios.",
    "Nuestra visión es convertirnos en un referente de arte en resina a nivel nacional, fusionando innovación y tradición en cada creación.",
    "En Peleti creemos en el poder de las pequeñas cosas: un detalle puede cambiar la atmósfera de un espacio y provocar emociones inolvidables.",
  ];

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
            Nuestra historia
          </Typography>

          {/* Imagen ilustrativa del taller */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Image
              src="/images/taller-resina.jpg"
              alt="Taller de resina artesanal"
              width={800}
              height={450}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          </Box>

          {paragraphs.map((text, i) => (
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
