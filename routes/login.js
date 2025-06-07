const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../lib/db'); // tu conexión a la base de datos

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Procesar login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      req.flash('error', 'Correo o contraseña incorrectos');
      return res.redirect('/auth/login');
    }

    const user = rows[0];

    // Comparar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      req.flash('error', 'Correo o contraseña incorrectos');
      return res.redirect('/auth/login');
    }

    // Guardar usuario en sesión
    req.session.user = { id: user.id, nombre: user.nombre, email: user.email };

    req.flash('success', `¡Bienvenido, ${user.nombre}!`);
    res.redirect('/');
  } catch (err) {
    console.error('Error en login:', err);
    req.flash('error', 'Error del servidor, intenta más tarde');
    res.redirect('/auth/login');
  }
});

// Recuperar contraseña - mostrar formulario
router.get('/recuperar', (req, res) => {
  res.render('recuperar', { messages: req.flash() });
});

// Recuperar contraseña - procesar formulario
router.post('/recuperar', async (req, res) => {
  const { email } = req.body;
  // Aquí deberías buscar el usuario y enviar el correo real
  // Por ahora solo simula el proceso
  req.flash('success', 'Si el correo existe, se ha enviado un enlace de recuperación.');
  res.redirect('/auth/recuperar');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('login', { messages: { success: 'Cerraste sesión correctamente.' } });
  });
});

module.exports = router;
