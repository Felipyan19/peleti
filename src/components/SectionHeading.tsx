"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  /** Etiqueta corta en versalitas sobre el título */
  eyebrow?: string;
  title: string;
  /** Párrafo introductorio opcional */
  lead?: string;
  align?: "center" | "left";
  /** Número de pieza decorativo, ej. "02" */
  index?: string;
}

/**
 * Encabezado de sección editorial: eyebrow en versalitas con regla de bronce,
 * título en serif de display y lead opcional. Da una jerarquía consistente
 * a todas las secciones del sitio sin caer en el h2 centrado genérico.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  index,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isCenter ? "center" : "flex-start",
        textAlign: isCenter ? "center" : "left",
        gap: 2,
        mb: { xs: 6, md: 8 },
      }}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: isCenter ? "center" : "flex-start",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 2,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, transparent, var(--primary))",
              }}
            />
            <Typography
              variant="overline"
              sx={{ color: "primary.main", lineHeight: 1 }}
            >
              {index ? `${index} · ${eyebrow}` : eyebrow}
            </Typography>
            <Box
              sx={{
                width: 28,
                height: 2,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, var(--primary), transparent)",
                display: isCenter ? "block" : "none",
              }}
            />
          </Box>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            color: "text.primary",
            textWrap: "balance",
            fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3rem" },
          }}
        >
          {title}
        </Typography>
      </motion.div>

      {lead && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "1.02rem", md: "1.12rem" },
              lineHeight: 1.7,
              maxWidth: 620,
              mx: isCenter ? "auto" : 0,
            }}
          >
            {lead}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
}
