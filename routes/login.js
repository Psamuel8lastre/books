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
    res.redirect('/books');
  } catch (err) {
    console.error('Error en login:', err);
    req.flash('error', 'Error del servidor, intenta más tarde');
    res.redirect('/auth/login');
  }
});

module.exports = router;
