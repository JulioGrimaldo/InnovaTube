import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // Modo oscuro
    background: {
      default: "#121212", // Fondo muy oscuro para el modo oscuro
      paper: "#1E1E1E", // Fondo de los componentes en gris muy oscuro
    },
    text: {
      primary: "#E0E0E0", // Texto principal en un gris muy claro para visibilidad
      secondary: "#B0B0B0", // Texto secundario en gris suave
    },
    primary: {
      main: "#00796B", // Verde azulado suave para botones y acentos
    },
    secondary: {
      main: "#0288D1", // Azul brillante para elementos secundarios
    },
    error: {
      main: "#D32F2F", // Rojo brillante para errores
    },
    info: {
      main: "#0288D1", // Azul para información
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif", // Tipografía moderna y limpia
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordes redondeados suaves
          textTransform: "none", // Sin transformación en mayúsculas
          fontWeight: 500, // Peso de fuente más firme
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordes redondeados en los campos de texto
          backgroundColor: "#333333", // Fondo gris oscuro en campos de texto
          border: "1px solid #444444", // Bordes finos en gris más oscuro
          color: "#E0E0E0", // Texto en los campos de texto en color claro
        },
      },
    },
  },
});

export default theme;
