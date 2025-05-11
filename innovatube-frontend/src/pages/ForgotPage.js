import React from "react";
import ForgotPassword from "../components/ForgotPassword";
import { Container, Box } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <ForgotPassword />
      </Box>
    </Container>
  );
};

export default Home;
