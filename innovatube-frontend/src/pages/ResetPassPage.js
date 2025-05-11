import React from "react";
import ResetPassword from "../components/ResetPassword";
import { Container, Box } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <ResetPassword />
      </Box>
    </Container>
  );
};

export default Home;
