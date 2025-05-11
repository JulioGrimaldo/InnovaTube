import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogout = () => {} }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/home"); // Nueva función para navegar a home
  };

  const handleFavoriteClick = () => {
    navigate("/favorites");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            cursor: "pointer", // Cambia el cursor para indicar que es clickeable
            "&:hover": {
              color: "primary.main", // Cambia el color al pasar el mouse
            },
          }}
          onClick={handleLogoClick} // Añade el onClick al logo
        >
          InnovaTube
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {user?.full_name || "Invitado"}
          </Typography>
          <Button color="inherit" onClick={handleFavoriteClick}>
            Mis Favoritos
          </Button>
          <Button color="error" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
