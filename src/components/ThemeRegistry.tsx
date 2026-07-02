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
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
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

  // Prevent hydration mismatch by showing loading state on initial render
  if (!mounted) {
    return (
      <CacheProvider value={cache}>
        <ThemeContext.Provider value={{ mode: "light", toggleTheme: () => {} }}>
          <ThemeProvider theme={createTheme(lightTheme)}>
            <CssBaseline />
            <Box
              sx={{
                minHeight: "100vh",
                width: "100%",
                position: "relative",
                backgroundColor: "background.default",
                color: "text.primary",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
            </Box>
          </ThemeProvider>
        </ThemeContext.Provider>
      </CacheProvider>
    );
  }

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
              backgroundColor: "background.default",
              color: "text.primary",
            }}
          >
            {/* Atmósfera cálida — resplandor turquesa, coherente con la marca */}
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                background:
                  mode === "dark"
                    ? "radial-gradient(60vw 40vh at 50% -5%, rgba(53,201,206,0.10), transparent 70%), radial-gradient(50vw 50vh at 100% 100%, rgba(255,107,87,0.06), transparent 70%)"
                    : "radial-gradient(60vw 40vh at 50% -5%, rgba(15,163,168,0.08), transparent 70%), radial-gradient(50vw 50vh at 100% 100%, rgba(255,107,87,0.05), transparent 70%)",
              }}
            />

            {/* Contenido principal */}
            <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
          </Box>
        </ThemeProvider>
      </ThemeContext.Provider>
    </CacheProvider>
  );
}
