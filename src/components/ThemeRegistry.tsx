"use client";

import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../utils/theme";

// Crear el contexto para el tema
type ThemeContextType = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado para el modo del tema
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Efecto para inicializar el tema desde localStorage o preferencias del sistema
  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setMode(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // Si no hay preferencia guardada, usar la preferencia del sistema
      setMode("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };

  // Crear el tema basado en el modo
  const theme = useMemo(
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  // Proporcionar el contexto y el tema
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
