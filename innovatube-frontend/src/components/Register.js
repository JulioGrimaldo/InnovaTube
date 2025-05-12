import React, { useState } from "react";
import { CAPTCHA_KEY } from "../config";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  FormHelperText,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    recaptcha: false,
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setErrors({ ...errors, recaptcha: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los campos
    const newErrors = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      username: !formData.username,
      email:
        !formData.email ||
        !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email),
      password: !formData.password,
      confirmPassword: formData.password !== formData.confirmPassword,
      recaptcha: !recaptchaValue,
    };

    setErrors(newErrors); // Actualizamos el estado de los errores
    setErrorMessage("");

    if (Object.values(newErrors).every((error) => !error)) {
      try {
        const payload = {
          full_name: formData.firstName + " " + formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
        const res = await axios.post("/auth/register", payload);
        // Si todo va bien, redirigimos a login
        navigate("/login");
      } catch (err) {
        // Mostramos el mensaje de error devuelto por el backend
        setErrorMessage(err.response?.data?.error || "Error al registrar");
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Registrarme
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {errorMessage && (
            <FormHelperText error sx={{ mb: 2 }} align="center">
              {errorMessage}
            </FormHelperText>
          )}
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="filled"
                error={errors.firstName}
                required
                helperText={errors.firstName ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="filled"
                error={errors.lastName}
                required
                helperText={errors.lastName ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="filled"
                error={errors.username}
                required
                helperText={errors.username ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="filled"
                error={errors.email}
                required
                helperText={
                  errors.email ? "Introduce un correo electrónico válido" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="filled"
                error={errors.password}
                required
                helperText={errors.password ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmación de Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="filled"
                error={errors.confirmPassword}
                required
                helperText={
                  errors.confirmPassword ? "Las contraseñas no coinciden" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <ReCAPTCHA
                sitekey={CAPTCHA_KEY}
                onChange={handleRecaptchaChange}
              />
              {errors.recaptcha && (
                <FormHelperText error>
                  Por favor completa el ReCaptcha
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth size="large">
                Registrar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
