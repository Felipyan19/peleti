"use client";

import { motion } from "framer-motion";
import { useEnhancedAnimation } from "@/utils/useScrollToSection";
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
import SectionHeading from "./SectionHeading";

interface WorkProcessProps {
  content?: {
    settings: {
      title: string;
      description: string;
      stepLabel: string;
    };
    steps: Array<{
      id: string;
      title: string;
      description: string;
      icon?: string;
    }>;
  };
}

const defaultWorkProcessContent = {
  settings: {
    title: workProcessData.title,
    description: workProcessData.description,
    stepLabel: workProcessData.step,
  },
  steps: workProcessData.stepsData.map((step) => ({
    ...step,
    id: String(step.id),
  })),
};

export default function WorkProcess({
  content = defaultWorkProcessContent,
}: WorkProcessProps) {
  const theme = useTheme();
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("proceso", {
      threshold: 0.15,
      staggerDelay: 0.2,
      animationDuration: 0.8,
    });

  const steps = content.steps;

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
      sx={{ py: { xs: 8, md: 14 }, backgroundColor: "background.paper" }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Nuestro proceso"
          index="03"
          title={content.settings.title}
          lead={content.settings.description}
        />

        <motion.div
          ref={ref}
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <Timeline position="alternate">
            {steps.map((step, idx) => {
              const Icon =
                IconComponent[step.icon as keyof typeof IconComponent] ??
                FaCheckCircle;
              return (
                <TimelineItem key={step.id}>
                  <TimelineOppositeContent
                    sx={{
                      m: "auto 0",
                      minWidth: 100,
                    }}
                    align={idx % 2 === 0 ? "right" : "left"}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        opacity: 0.7,
                      }}
                    >
                      {content.settings.stepLabel} {idx + 1}
                    </Typography>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <motion.div
                      variants={getStaggerVariants(idx + 1)}
                      whileHover={{
                        scale: 1.15,
                        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
                      }}
                    >
                      <TimelineDot
                        sx={{
                          p: 0,
                          m: 0,
                          width: 56,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid rgba(200,148,30,0.40)`,
                          boxShadow: "0 6px 16px rgba(35,26,19,0.10)",
                          color: theme.palette.primary.main,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            borderColor: "rgba(200,148,30,0.7)",
                            backgroundColor: theme.palette.mode === "dark"
                              ? "rgba(217,163,107,0.07)"
                              : "rgba(168,105,58,0.06)",
                          },
                        }}
                      >
                        <Icon size={22} style={{ color: theme.palette.primary.main }} />
                      </TimelineDot>
                    </motion.div>
                    {idx < steps.length - 1 && (
                      <TimelineConnector
                        sx={{
                          backgroundColor: theme.palette.divider,
                          width: 2,
                          opacity: 0.6,
                        }}
                      />
                    )}
                  </TimelineSeparator>

                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <motion.div variants={getStaggerVariants(idx + 1)}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 4,
                          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                          border: `1px solid ${
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)"
                          }`,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="span"
                          color="text.primary"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            lineHeight: 1.25,
                            letterSpacing: "-0.01em",
                            mb: 1,
                            display: "block",
                          }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            opacity: 0.85,
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </motion.div>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </motion.div>
      </Container>
    </Box>
  );
}
