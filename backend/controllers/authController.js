const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');

const registerUser = async (req, res) => {
  const { full_name, username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, username, email, password: hash }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'Usuario registrado' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !users) return res.status(400).json({ error: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, users.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: users.id, username: users.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
};

module.exports = { registerUser, loginUser };
