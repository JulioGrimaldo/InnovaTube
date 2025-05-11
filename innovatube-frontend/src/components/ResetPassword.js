import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate(); //

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password: newPassword }
      );
      setSuccess("Contraseña restablecida con éxito");

      // Redirige al login luego de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Hubo un error al restablecer la contraseña";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "300px", margin: "0 auto", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Restablecer Contraseña
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nueva Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirmar Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography
            color="success.main"
            variant="body2"
            sx={{ marginTop: 2 }}
          >
            {success}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Restablecer Contraseña"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ResetPasswordForm;
