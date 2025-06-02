const express = require('express');
const router = express.Router();
const db = require('../lib/db');

/* GET home page. */
// Ruta landing page Home
router.get('/home', (req, res) => {
  res.render('home');
});

// Ruta principal: dashboard con contadores
router.get('/', async function(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/home');
  }
  try {
    // Contar libros
    const [booksCount] = await db.query('SELECT COUNT(*) as total FROM books');
    const totalLibros = booksCount[0]?.total || 0;
    // Contar préstamos activos y vencidos
    const [prestamos] = await db.query('SELECT estado FROM prestamos');
    let prestamosActivos = 0;
    let prestamosVencidos = 0;
    prestamos.forEach(p => {
      if (p.estado && p.estado.toLowerCase().includes('activo')) prestamosActivos++;
      if (p.estado && p.estado.toLowerCase().includes('vencid')) prestamosVencidos++;
    });
    // Contar autores
    const [autores] = await db.query('SELECT COUNT(*) as total FROM autores');
    const totalAutores = autores[0]?.total || 0;
    // Obtener todos los libros para el catálogo
    const [libros] = await db.query('SELECT * FROM books ORDER BY id DESC');
    res.render('index', {
      totalLibros,
      prestamosActivos,
      prestamosVencidos,
      totalAutores,
      libros,
      user: req.session.user // asegurar que user siempre esté disponible
    });
  } catch (err) {
    res.render('index', {
      totalLibros: 0,
      prestamosActivos: 0,
      prestamosVencidos: 0,
      totalAutores: 0,
      libros: [],
      user: req.session.user
    });
  }
});

module.exports = router;


