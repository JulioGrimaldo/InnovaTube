const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  JWT_SECRET,
  RECOVER_LINK,
} = require("../config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const supabase = require("../services/supabase");
const nodemailer = require("nodemailer");

// Configuración de MailerSend
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Enviar correo de recuperación
const sendRecoveryEmail = async (email, token) => {
  const recoveryLink = RECOVER_LINK + token;

  const mailOptions = {
    from: '"InnovaTube" <MS_bedcRK@test-r83ql3pp17zgzw1j.mlsender.net>',
    to: email,
    subject: "Recuperación de contraseña",
    text: `Hola, recibimos una solicitud para restablecer tu contraseña.\n\nHaz clic en este enlace para cambiarla:\n\n${recoveryLink}\n\nEste enlace expirará en 1 hora.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de recuperación enviado");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de recuperación");
  }
};

// Registro de usuario
const registerUser = async (req, res) => {
  const { full_name, username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from("users")
    .insert([{ full_name, username, email, password: hash }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Usuario registrado" });
};

// Login
const loginUser = async (req, res) => {
  const { identifier, password } = req.body; // Cambiamos a identifier (puede ser email o username)

  if (!identifier || !password) {
    return res.status(400).json({
      error: "Se requieren ambos campos: identificador y contraseña",
      details: {
        required: ["identifier", "password"],
        received: req.body,
      },
    });
  }

  try {
    // Buscar usuario por email o username
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();

    if (error || !user) {
      return res.status(400).json({
        error: "Credenciales inválidas",
        suggestion: "Verifica tu email/usuario y contraseña",
      });
    }

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        suggestion: "Verifica tu contraseña",
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Eliminar password de la respuesta
    const { password: _, ...userData } = user;

    res.json({
      success: true,
      token,
      user: userData,
      message: "Inicio de sesión exitoso",
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Recuperación de contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: "El correo es obligatorio" });

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    const { error: updateError } = await supabase
      .from("users")
      .update({ reset_token: resetToken, reset_token_expires: expiresAt })
      .eq("id", user.id);

    if (updateError)
      return res
        .status(500)
        .json({ error: "No se pudo guardar el token de recuperación" });

    await sendRecoveryEmail(email, resetToken);

    res.json({
      message:
        "Correo de recuperación enviado. Revisa tu bandeja de entrada o spam.",
    });
  } catch (err) {
    console.error("Error general:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ error: "Token y nueva contraseña son obligatorios" });
  }

  try {
    // Buscar usuario por el token
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("reset_token", token)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    // Verificar si el token ha expirado
    const tokenExpired = new Date(user.reset_token_expires) < new Date();
    if (tokenExpired) {
      return res.status(400).json({ error: "El token ha expirado" });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña y limpiar el token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    if (updateError) {
      return res
        .status(500)
        .json({ error: "No se pudo actualizar la contraseña" });
    }

    res.json({ message: "Contraseña restablecida correctamente" });
  } catch (err) {
    console.error("Error al restablecer la contraseña:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
