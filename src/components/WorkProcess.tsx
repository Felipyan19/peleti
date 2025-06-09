"use client";

import { Box, Container, Typography, Grid, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaFlask, FaPaintBrush, FaMagic, FaCheckCircle } from "react-icons/fa";

const steps = [
  { id: 1, title: "Preparación", description: "Selección de materiales y preparación del espacio de trabajo", icon: FaFlask },
  { id: 2, title: "Diseño", description: "Planificación del diseño y selección de colores", icon: FaPaintBrush },
  { id: 3, title: "Creación", description: "Proceso de mezcla y aplicación de la resina", icon: FaMagic },
  { id: 4, title: "Acabado", description: "Pulido y detalles finales para un acabado perfecto", icon: FaCheckCircle },
];

export default function WorkProcess() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Box component="section" id="process" sx={{ py: 10, backgroundColor: "background.paper" }}>
      <Container maxWidth="lg">
        {/* Encabezado */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <Typography variant="h2" gutterBottom>
            Proceso de Trabajo
          </Typography>
          <Typography variant="body1" color="text.secondary" mx="auto" maxWidth={600}>
            Cada pieza es creada con dedicación y atención al detalle, siguiendo
            un proceso cuidadosamente planificado.
          </Typography>
        </motion.div>

        {/* Pasos */}
        <Grid container spacing={4}>
          {steps.map((step, idx) => (
            <Grid item xs={12} sm={6} md={3} key={step.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              >
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "background.default",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64, mb: 2 }}>
                    <step.icon size={32} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
