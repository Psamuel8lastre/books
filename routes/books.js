const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// Mostrar todos los libros
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books ORDER BY id DESC');
    res.render('books', { data: rows });
  } catch (err) {
    req.flash('error', err.message);
    res.render('books', { data: [] });
  }
});

// Formulario agregar
router.get('/add', (req, res) => {
  res.render('books/add', { name: '', author: '' });
});

// Agregar libro
router.post('/add', async (req, res) => {
  const { name, author } = req.body;
  if (!name || !author) {
    req.flash('error', 'Todos los campos son requeridos');
    return res.render('books/add', { name, author });
  }
  try {
    await db.query('INSERT INTO books (name, author) VALUES (?, ?)', [name, author]);
    req.flash('success', 'Libro agregado');
    res.redirect('/books');
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/add', { name, author });
  }
});

// Formulario editar
router.get('/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      req.flash('error', 'Libro no encontrado');
      return res.redirect('/books');
    }
    res.render('books/edit', rows[0]);
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/books');
  }
});

// Actualizar libro
router.post('/update/:id', async (req, res) => {
  const { name, author } = req.body;
  try {
    await db.query('UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, req.params.id]);
    req.flash('success', 'Libro actualizado');
    res.redirect('/books');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/books');
  }
});

// Eliminar libro
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    req.flash('success', 'Libro eliminado');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/books');
});

module.exports = router;
