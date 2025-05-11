import React from "react";
import Favorites from "../components/Favorites";
import { Container, Box } from "@mui/material";
import Navbar from "../components/Navbar";
const Home = () => {
  return (
    <>
      <Navbar />
      <Favorites />
    </>
  );
};

export default Home;
