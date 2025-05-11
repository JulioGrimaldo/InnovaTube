// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import FavoritesPage from "./pages/FavoritePage";
import ForgotPassword from "./pages/ForgotPage";
import ResetPasswordPage from "./pages/ResetPassPage";

// Aquí irán más páginas conforme avances
import Favorites from "./components/Favorites"; // Página de favoritos

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
};

export default AppRouter;
