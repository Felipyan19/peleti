"use client";

import { motion } from "framer-motion";
import { useScrollToSection } from "@/utils/useScrollToSection";
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
import {
  FaFlask,
  FaPaintBrush,
  FaMagic,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";
import workProcessData from "@/data/workProcess.json";

export default function WorkProcess() {
  const theme = useTheme();
  const { ref, shouldAnimate } = useScrollToSection("proceso", {
    threshold: 0.2,
  });

  const steps = workProcessData.stepsData;

  const IconComponent = {
    FaFlask,
    FaPaintBrush,
    FaMagic,
    FaCheckCircle,
    FaSearch,
  };

  return (
    <Box
      component="section"
      id="proceso"
      sx={{ py: 10, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: theme.spacing(8) }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "text.primary",
              mb: 2,
            }}
          >
            {workProcessData.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mx="auto"
            maxWidth={600}
          >
            {workProcessData.description}
          </Typography>
        </motion.div>

        <Timeline position="alternate">
          {steps.map((step, idx) => {
            const Icon = IconComponent[step.icon as keyof typeof IconComponent];
            return (
              <TimelineItem key={step.id}>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align={idx % 2 === 0 ? "right" : "left"}
                  variant="body2"
                  color="text.secondary"
                >
                  {workProcessData.step} {step.id}
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
                    animate={
                      shouldAnimate
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: idx % 2 === 0 ? -20 : 20 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                  >
                    <Typography
                      variant="h6"
                      component="span"
                      color="text.primary"
                    >
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
