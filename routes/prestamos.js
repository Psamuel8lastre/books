const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// Mostrar todos los préstamos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM prestamos ORDER BY id DESC');
    const totalPrestamos = rows.length;
    const prestamosActivos = rows.filter(p =>
      p.estado && p.estado.toLowerCase().includes('activo')
    ).length;
    const prestamosVencidos = rows.filter(p =>
      p.estado && p.estado.toLowerCase().includes('vencid')
    ).length;
    res.render('books/prestamos', {
      data: rows,
      totalPrestamos,
      prestamosActivos,
      prestamosVencidos,
      messages: req.flash()
    });
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/prestamos', { data: [], totalPrestamos: 0, prestamosActivos: 0, prestamosVencidos: 0, messages: req.flash() });
  }
});

// Formulario agregar préstamo
router.get('/add', async (req, res) => {
  try {
    const [libros] = await db.query('SELECT id, name FROM books ORDER BY name ASC');
    res.render('books/prestamos_add', { libro: '', usuario: '', fecha_prestamo: '', fecha_devolucion: '', estado: '', libros, messages: req.flash() });
  } catch (err) {
    req.flash('error', 'No se pudieron cargar los libros');
    res.render('books/prestamos_add', { libro: '', usuario: '', fecha_prestamo: '', fecha_devolucion: '', estado: '', libros: [], messages: req.flash() });
  }
});

// Agregar préstamo
router.post('/add', async (req, res) => {
  const { libro, usuario, fecha_prestamo, fecha_devolucion, estado } = req.body;
  if (!libro || !usuario || !fecha_prestamo || !fecha_devolucion) {
    req.flash('error', 'Todos los campos son requeridos');
    return res.render('books/prestamos_add', { libro, usuario, fecha_prestamo, fecha_devolucion, estado, messages: req.flash() });
  }
  try {
    await db.query('INSERT INTO prestamos (libro, usuario, fecha_prestamo, fecha_devolucion, estado) VALUES (?, ?, ?, ?, ?)', [libro, usuario, fecha_prestamo, fecha_devolucion, estado]);
    req.flash('success', 'Préstamo agregado');
    res.redirect('/prestamos');
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/prestamos_add', { libro, usuario, fecha_prestamo, fecha_devolucion, estado, messages: req.flash() });
  }
});

// Formulario editar préstamo
router.get('/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM prestamos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      req.flash('error', 'Préstamo no encontrado');
      return res.redirect('/prestamos');
    }
    res.render('books/prestamos_edit', { ...rows[0], messages: req.flash() });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/prestamos');
  }
});

// Actualizar préstamo
router.post('/update/:id', async (req, res) => {
  const { libro, usuario, fecha_prestamo, fecha_devolucion, estado } = req.body;
  try {
    await db.query('UPDATE prestamos SET libro = ?, usuario = ?, fecha_prestamo = ?, fecha_devolucion = ?, estado = ? WHERE id = ?', [libro, usuario, fecha_prestamo, fecha_devolucion, estado, req.params.id]);
    req.flash('success', 'Préstamo actualizado');
    res.redirect('/prestamos');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/prestamos');
  }
});

// Eliminar préstamo
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM prestamos WHERE id = ?', [req.params.id]);
    req.flash('success', 'Préstamo eliminado');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/prestamos');
});

module.exports = router;
