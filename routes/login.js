const express = require('express');
const router = express.Router();

// Ruta GET para mostrar el formulario de login
router.get('/login', (req, res) => {
  res.render('login'); // Asegúrate de tener una vista "login.ejs" en /views
});

// Ruta POST para procesar el login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Ejemplo de validación básica (debes adaptarlo a tu DB)
  if (email === 'admin@example.com' && password === '1234') {
    req.flash('success', '¡Bienvenido!');
    res.redirect('/books');
  } else {
    req.flash('error', 'Credenciales incorrectas');
    res.redirect('/auth/login');
  }
});

module.exports = router;