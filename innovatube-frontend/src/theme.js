import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1D1D1D",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
    primary: {
      main: "#00B0FF",
    },
    secondary: {
      main: "#FF5722",
    },
    error: {
      main: "#FF4081",
    },
    info: {
      main: "#BB86FC",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordes redondeados en los campos de texto
        },
      },
    },
  },
});

export default theme;
