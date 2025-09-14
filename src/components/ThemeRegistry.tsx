"use client";

import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../utils/theme";

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
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Emotion cache + SSR style flush
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "mui", prepend: true });
    const prevInsert = cache.insert;
    let insertedNames: string[] = [];
    cache.insert = (...args: unknown[]) => {
      const serialized = args[1] as { name?: string };
      if (serialized && serialized.name && cache.inserted[serialized.name] === undefined) {
        insertedNames.push(serialized.name);
      }
      // @ts-expect-error: emotion insert signature
      return prevInsert(...args);
    };
    const flush = () => {
      const prev = insertedNames;
      insertedNames = [];
      return prev;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: names.map((name) => cache.inserted[name]).join(""),
        }}
      />
    );
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setMode(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setMode("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };

  const theme = useMemo(
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <CacheProvider value={cache}>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              minHeight: "100vh",
              width: "100%",
              position: "relative",
              backgroundColor: mode === "dark" ? "#020617" : "#fafafa",
              color: mode === "dark" ? "#ffffff" : "#212121",
            }}
          >
            {/* Fondo modo oscuro - Dark Radial Glow */}
            {mode === "dark" && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                  background: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
                }}
              />
            )}

            {/* Fondo modo claro - Diagonal Grid */}
            {mode === "light" && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                  backgroundImage: `
                    repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
                    repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
            )}

            {/* Contenido principal */}
            <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
          </Box>
        </ThemeProvider>
      </ThemeContext.Provider>
    </CacheProvider>
  );
}
