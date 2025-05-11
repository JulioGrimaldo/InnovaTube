import React from "react";
import Login from "../components/Login";
import { Container, Box } from "@mui/material";

const LoginPage = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Login />
      </Box>
    </Container>
  );
};

export default LoginPage;
