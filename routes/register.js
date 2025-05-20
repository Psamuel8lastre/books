const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../lib/db');

// Mostrar formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Procesar registro
router.post('/register', async (req, res) => {
    console.log(req.body); 
  const { nombre, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length > 0) {
      req.flash('error', 'El correo ya está registrado');
      return res.redirect('/auth/register');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword]);

    req.flash('success', '¡Registro exitoso! Ahora puedes iniciar sesión.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Error al registrar:', err);
    req.flash('error', 'Hubo un error al registrarse');
    res.redirect('/auth/register');
  }
});

module.exports = router;
