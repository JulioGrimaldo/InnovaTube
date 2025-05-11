import React from "react";
import LoginForm from "../components/Login";
import { Container, Box } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default Home;
