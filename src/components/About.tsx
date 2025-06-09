"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const paragraphs = [
    "Somos apasionados artistas especializados en la creación de piezas únicas en resina. Nuestro viaje comenzó hace más de 5 años, cuando descubrimos la magia de transformar materiales simples en obras de arte extraordinarias.",
    "Nuestra misión es crear piezas que no solo sean visualmente impresionantes, sino que también cuenten una historia y evoquen emociones en quienes las contemplan. Cada creación es única, hecha a mano con amor y atención al detalle.",
    "Nos especializamos en una amplia variedad de técnicas, desde geodas y océanos hasta piezas abstractas y personalizadas. Cada proyecto es una oportunidad para explorar nuevos límites y crear algo verdaderamente especial.",
  ];

  return (
    <Box
      component="section"
      id="about"
      sx={{ py: 10, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="md">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            gutterBottom
          >
            Sobre Nosotros
          </Typography>

          {paragraphs.map((text, i) => (
            <Typography
              key={i}
              variant="body1"
              color="text.secondary"
              paragraph
            >
              {text}
            </Typography>
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}
