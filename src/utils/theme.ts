import { ThemeOptions } from "@mui/material/styles";

// ── Océano de Resina · paleta de marca ───────────────────────────────
// Turquesa vibrante como acento; marfil luminoso de galería; coral encendido
// y un oro brillante para detalles. Inspirado en el ocean pour de resina.
const brand = {
  ivory: "#FBF8F0",      // fondo luminoso de galería
  parchment: "#FEFDFA",  // superficie / papel
  ink: "#12262A",        // azul-tinta profundo
  muted: "#4E6468",      // texto secundario
  teal: "#0FA3A8",       // acento principal (turquesa vivo)
  tealDeep: "#0B6E74",   // petróleo profundo
  gold: "#E9B430",       // oro brillante para detalles
  coral: "#FF6B57",      // coral encendido
};

const display = 'var(--font-display), "Cormorant Garamond", Georgia, serif';
const body = 'var(--font-body), "Segoe UI", system-ui, sans-serif';

const sharedTypography: ThemeOptions["typography"] = {
  fontFamily: body,
  h1: {
    fontFamily: display,
    fontSize: "2.5rem",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: 1.02,
  },
  h2: {
    fontFamily: display,
    fontSize: "2.4rem",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: 1.1,
  },
  h3: {
    fontFamily: display,
    fontSize: "1.85rem",
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontFamily: display,
    fontSize: "1.55rem",
    fontWeight: 600,
    letterSpacing: "-0.005em",
  },
  h5: { fontFamily: display, fontSize: "1.3rem", fontWeight: 600 },
  h6: { fontSize: "1rem", fontWeight: 700, letterSpacing: "0.01em" },
  overline: {
    fontFamily: body,
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    lineHeight: 1.6,
  },
  button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
};

export const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: brand.teal,
      light: "#2CBDC3",
      dark: brand.tealDeep,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: brand.coral,
      contrastText: "#FFFFFF",
    },
    background: {
      default: brand.ivory,
      paper: brand.parchment,
    },
    text: {
      primary: brand.ink,
      secondary: brand.muted,
    },
    divider: "rgba(18, 38, 42, 0.10)",
    error: { main: "#D94A38" },
    warning: { main: "#D68A2D" },
    info: { main: "#3A7CA5" },
    success: { main: "#1E9E6A" },
  },
  typography: sharedTypography,
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": { background: "rgba(15,163,168,0.20)" },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(254, 253, 250, 0.80)",
          color: brand.ink,
          backdropFilter: "blur(20px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
          padding: "10px 20px",
          fontWeight: 600,
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #0FA3A8 0%, #0B6E74 100%)",
          color: "#FFFFFF",
          boxShadow: "0 10px 24px rgba(11, 110, 116, 0.22)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #2CBDC3 0%, #0B6E74 100%)",
            boxShadow: "0 14px 30px rgba(11, 110, 116, 0.30)",
          },
        },
        outlined: {
          borderColor: "rgba(18, 38, 42, 0.18)",
          "&:hover": { borderColor: brand.teal, backgroundColor: "rgba(15,163,168,0.06)" },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 18px 48px rgba(12, 45, 50, 0.07)",
          border: "1px solid rgba(18, 38, 42, 0.07)",
        },
      },
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#35C9CE",
      light: "#6ADCE0",
      dark: "#1C8A90",
      contrastText: "#081619",
    },
    secondary: {
      main: "#FF8A78",
      contrastText: "#081619",
    },
    background: {
      default: "#081619",
      paper: "#0F2226",
    },
    text: {
      primary: "#EAF4F4",
      secondary: "#9FB8BA",
    },
    divider: "rgba(234, 244, 244, 0.10)",
    error: { main: "#FF8577" },
    warning: { main: "#F2C34D" },
    info: { main: "#7FC4E8" },
    success: { main: "#4DC998" },
  },
  typography: sharedTypography,
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": { background: "rgba(53,201,206,0.24)" },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 34, 38, 0.78)",
          color: "#EAF4F4",
          backdropFilter: "blur(20px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
          padding: "10px 20px",
          fontWeight: 600,
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #35C9CE 0%, #1C8A90 100%)",
          color: "#081619",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.35)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #6ADCE0 0%, #1C8A90 100%)",
          },
        },
        outlined: {
          borderColor: "rgba(234, 244, 244, 0.20)",
          "&:hover": { borderColor: "#35C9CE", backgroundColor: "rgba(53,201,206,0.08)" },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: "#0F2226",
          boxShadow: "0 18px 48px rgba(0, 0, 0, 0.30)",
          border: "1px solid rgba(234, 244, 244, 0.07)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: "#0F2226", backgroundImage: "none" },
      },
    },
  },
};

export default lightTheme;
