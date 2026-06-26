import { ThemeOptions } from "@mui/material/styles";

// ── Atelier de Resina · paleta de marca ──────────────────────────────
// Bronce y cobre como acento; neutros cálidos de galería; un dorado fino
// reservado para detalles. Inspirado en mármol, bronce envejecido y resina ámbar.
const brand = {
  sand: "#F4EDE1",       // fondo cálido de galería
  parchment: "#FCFAF5",  // superficie / papel
  ink: "#231A13",        // casi-negro cálido
  muted: "#6E6258",      // texto secundario
  copper: "#A8693A",     // acento principal (bronce/cobre)
  copperDeep: "#7C4421", // bronce profundo
  gold: "#C8941E",       // dorado fino para detalles
  olive: "#5E6B52",      // verde oliva sereno
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
      main: brand.copper,
      light: "#C2884F",
      dark: brand.copperDeep,
      contrastText: "#FFFDFA",
    },
    secondary: {
      main: brand.olive,
      contrastText: "#FFFDFA",
    },
    background: {
      default: brand.sand,
      paper: brand.parchment,
    },
    text: {
      primary: brand.ink,
      secondary: brand.muted,
    },
    divider: "rgba(35, 26, 19, 0.10)",
    error: { main: "#B44332" },
    warning: { main: "#D68A2D" },
    info: { main: "#4B6B8A" },
    success: { main: "#54714E" },
  },
  typography: sharedTypography,
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": { background: "rgba(168,105,58,0.20)" },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(252, 250, 245, 0.80)",
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
            "linear-gradient(135deg, #B5743F 0%, #7C4421 100%)",
          color: "#FFFDFA",
          boxShadow: "0 10px 24px rgba(124, 68, 33, 0.22)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #C2884F 0%, #7C4421 100%)",
            boxShadow: "0 14px 30px rgba(124, 68, 33, 0.30)",
          },
        },
        outlined: {
          borderColor: "rgba(35, 26, 19, 0.18)",
          "&:hover": { borderColor: brand.copper, backgroundColor: "rgba(168,105,58,0.06)" },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 18px 48px rgba(58, 41, 28, 0.07)",
          border: "1px solid rgba(35, 26, 19, 0.07)",
        },
      },
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#D9A36B",
      light: "#E8BE8F",
      dark: "#A56D3E",
      contrastText: "#16110C",
    },
    secondary: {
      main: "#A9B39B",
      contrastText: "#16110C",
    },
    background: {
      default: "#15100B",
      paper: "#1F1812",
    },
    text: {
      primary: "#F2EADF",
      secondary: "#BCAEA1",
    },
    divider: "rgba(242, 234, 223, 0.10)",
    error: { main: "#E67F73" },
    warning: { main: "#E2A652" },
    info: { main: "#8FB5D8" },
    success: { main: "#89B37D" },
  },
  typography: sharedTypography,
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": { background: "rgba(217,163,107,0.24)" },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(31, 24, 18, 0.78)",
          color: "#F2EADF",
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
            "linear-gradient(135deg, #D9A36B 0%, #A56D3E 100%)",
          color: "#16110C",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.35)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #E8BE8F 0%, #A56D3E 100%)",
          },
        },
        outlined: {
          borderColor: "rgba(242, 234, 223, 0.20)",
          "&:hover": { borderColor: "#D9A36B", backgroundColor: "rgba(217,163,107,0.08)" },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: "#1F1812",
          boxShadow: "0 18px 48px rgba(0, 0, 0, 0.30)",
          border: "1px solid rgba(242, 234, 223, 0.07)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: "#1F1812", backgroundImage: "none" },
      },
    },
  },
};

export default lightTheme;
