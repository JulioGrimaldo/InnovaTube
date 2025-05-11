const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const supabase = require("../services/supabase");
const nodemailer = require("nodemailer");

// Configuración de MailerSend
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Enviar correo de recuperación
const sendRecoveryEmail = async (email, token) => {
  const recoveryLink = `http://localhost:3000/reset-password/${token}`;

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
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user)
    return res.status(400).json({ error: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
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
