"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Box, Container, Typography, useTheme } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";
import { FaFlask, FaPaintBrush, FaMagic, FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Preparación",
    description: "Selección de materiales y preparación del espacio de trabajo",
    icon: FaFlask,
  },
  {
    id: 2,
    title: "Diseño",
    description: "Planificación del diseño y selección de colores",
    icon: FaPaintBrush,
  },
  {
    id: 3,
    title: "Creación",
    description: "Proceso de mezcla y aplicación de la resina",
    icon: FaMagic,
  },
  {
    id: 4,
    title: "Acabado",
    description: "Pulido y detalles finales para un acabado perfecto",
    icon: FaCheckCircle,
  },
];

export default function WorkProcess() {
  const theme = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Box
      component="section"
      id="proceso"
      sx={{ py: 10, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="lg">
        {/* Encabezado */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: theme.spacing(8) }}
        >
          <Typography variant="h2" gutterBottom>
            Proceso de Trabajo
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mx="auto"
            maxWidth={600}
          >
            Cada pieza es creada con dedicación y atención al detalle, siguiendo
            un proceso cuidadosamente planificado.
          </Typography>
        </motion.div>

        {/* Timeline */}
        <Timeline position="alternate">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <TimelineItem key={step.id}>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align={idx % 2 === 0 ? "right" : "left"}
                  variant="body2"
                  color="text.secondary"
                >
                  Paso {step.id}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot color="primary" sx={{ p: 1.5 }}>
                    <Icon size={20} style={{ color: "#fff" }} />
                  </TimelineDot>
                  {idx < steps.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ py: "12px", px: 2 }}>
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <Typography variant="h6" component="span">
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Container>
    </Box>
  );
}
