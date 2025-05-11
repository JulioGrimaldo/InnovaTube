const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const supabase = require("../services/supabase");

const registerUser = async (req, res) => {
  const { full_name, username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ full_name, username, email, password: hash }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Usuario registrado" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !users)
    return res.status(400).json({ error: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, users.password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: users.id, username: users.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

// Función para recuperación de contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El correo es obligatorio" });
  }

  try {
    // Verificar si el usuario existe
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !users) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Generar un token de recuperación
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Establecer una fecha de expiración para el token (1 hora desde ahora)
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    // Guardar el token y la fecha de expiración en la base de datos
    const { error: updateError } = await supabase
      .from("users")
      .update({ reset_token: resetToken, reset_token_expires: expiresAt })
      .eq("id", users.id);

    if (updateError) {
      return res
        .status(500)
        .json({ error: "No se pudo guardar el token de recuperación" });
    }

    // Aquí iría la lógica para enviar el correo con el enlace de recuperación
    // Simulamos el enlace de recuperación
    console.log(
      `Enlace de recuperación: http://localhost:3000/reset-password/${resetToken}`
    );

    res.json({
      message:
        "Revisa tu correo, el correo de recuperacion de contraseña expira en una hora.",
    });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { registerUser, loginUser, forgotPassword };
