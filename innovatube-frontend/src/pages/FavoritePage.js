import React from "react";
import Favorites from "../components/Favorites";
import { Container, Box } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Favorites />
      </Box>
    </Container>
  );
};

export default Home;
