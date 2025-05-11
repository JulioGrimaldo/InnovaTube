// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Home";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import FavoritesPage from "./pages/FavoritePage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordPage from "./components/ResetPassword";

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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
};

export default AppRouter;
