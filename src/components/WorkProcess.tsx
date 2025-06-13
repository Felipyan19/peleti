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

export default function WorkProcess() {
  const theme = useTheme();
  const { ref, shouldAnimate, getContainerVariants, getStaggerVariants } =
    useEnhancedAnimation("proceso", {
      threshold: 0.15,
      staggerDelay: 0.2,
      animationDuration: 0.8,
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
          variants={getContainerVariants()}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.div variants={getStaggerVariants(0)}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
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
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  opacity: 0.9,
                }}
              >
                {workProcessData.description}
              </Typography>
            </Box>
          </motion.div>

          <Timeline position="alternate">
            {steps.map((step, idx) => {
              const Icon =
                IconComponent[step.icon as keyof typeof IconComponent];
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
                      {workProcessData.step} {step.id}
                    </Typography>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <motion.div
                      variants={getStaggerVariants(idx + 1)}
                      whileHover={{
                        scale: 1.15,
                        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                      }}
                    >
                      <TimelineDot
                        color="primary"
                        sx={{
                          p: 2,
                          width: 56,
                          height: 56,
                          boxShadow:
                            "0 8px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)",
                          border: `3px solid ${theme.palette.background.paper}`,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow:
                              "0 12px 35px rgba(0,0,0,0.2), 0 6px 15px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <Icon size={24} style={{ color: "#fff" }} />
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
