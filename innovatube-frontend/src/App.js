import logo from "./logo.svg";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Register from "./components/Register";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Register /> {/* Coloca el componente de Registro */}
      </div>
    </ThemeProvider>
  );
}

export default App;
