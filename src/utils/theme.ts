import { ThemeOptions } from "@mui/material/styles";

// Azul elegante
const elegantBlue = {
  main: "#0D47A1",
  light: "#5472D3",
  dark: "#002171",
  contrastText: "#FFFFFF",
};

export const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: elegantBlue,
    secondary: {
      main: "#757575", // gris medio
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F5F5F5",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    error:   { main: "#D32F2F" },
    warning: { main: "#FFA000" },
    info:    { main: elegantBlue.main },
    success: { main: "#388E3C" },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem",   fontWeight: 600 },
    h3: { fontSize: "1.75rem",fontWeight: 600 },
    h4: { fontSize: "1.5rem", fontWeight: 600 },
    h5: { fontSize: "1.25rem",fontWeight: 600 },
    h6: { fontSize: "1rem",   fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: { backgroundColor: "#FFFFFF", color: "#212121" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
        },
        containedPrimary: {
          backgroundColor: elegantBlue.main,
          "&:hover": { backgroundColor: elegantBlue.dark },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 2 },
      styleOverrides: {
        root: { borderRadius: 12, padding: 8 },
      },
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: elegantBlue.light,   // un poco más claro sobre fondo oscuro
      light: elegantBlue.main,
      dark: elegantBlue.dark,
      contrastText: "#000000",
    },
    secondary: {
      main: "#B0BEC5", // gris claro para acentos secundarios
      contrastText: "#000000",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0BEC5",
    },
    error:   { main: "#EF5350" },
    warning: { main: "#FFA000" },
    info:    { main: elegantBlue.light },
    success: { main: "#66BB6A" },
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: { backgroundColor: "#1E1E1E", color: "#FFFFFF" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
        },
        containedPrimary: {
          backgroundColor: elegantBlue.light,
          "&:hover": { backgroundColor: elegantBlue.main },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 2 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: 8,
          backgroundColor: "#1E1E1E",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: "#1E1E1E" },
      },
    },
  },
};

export default lightTheme;
