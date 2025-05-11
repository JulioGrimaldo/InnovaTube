import React from "react";
import RegisterForm from "../components/Register";
import { Container, Box } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default Home;
