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
  res.render('books/add', {
    isbn: '',
    name: '',
    author: '',
    editorial: '',
    year: '',
    pages: '',
    copies: '',
    category: '',
    messages: { fieldErrors: {} }
  });
});

// Agregar libro
router.post('/add', async (req, res) => {
  const { isbn, name, author, editorial, year, pages, copies, category } = req.body;
  let fieldErrors = {};
  if (!isbn) fieldErrors.isbn = 'El ISBN es requerido';
  if (!name) fieldErrors.name = 'El título es requerido';
  if (!author) fieldErrors.author = 'El autor es requerido';
  if (!editorial) fieldErrors.editorial = 'La editorial es requerida';
  if (!year) fieldErrors.year = 'El año es requerido';
  if (!pages) fieldErrors.pages = 'El número de páginas es requerido';
  if (!copies) fieldErrors.copies = 'El número de ejemplares es requerido';
  if (!category) fieldErrors.category = 'La categoría es requerida';
  if (Object.keys(fieldErrors).length > 0) {
    return res.render('books/add', {
      isbn, name, author, editorial, year, pages, copies, category,
      messages: { fieldErrors }
    });
  }
  try {
    await db.query(
      'INSERT INTO books (isbn, name, author, editorial, year, pages, copies, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [isbn, name, author, editorial, year, pages, copies, category]
    );
    req.flash('success', 'Libro agregado');
    res.redirect('/books');
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/add', {
      isbn, name, author, editorial, year, pages, copies, category,
      messages: { fieldErrors }
    });
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
    res.render('books/edit', { ...rows[0], messages: { fieldErrors: {} } });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/books');
  }
});

// Actualizar libro
router.post('/update/:id', async (req, res) => {
  const { isbn, name, author, editorial, year, pages, copies, category } = req.body;
  let fieldErrors = {};
  if (!isbn) fieldErrors.isbn = 'El ISBN es requerido';
  if (!name) fieldErrors.name = 'El título es requerido';
  if (!author) fieldErrors.author = 'El autor es requerido';
  if (!editorial) fieldErrors.editorial = 'La editorial es requerida';
  if (!year) fieldErrors.year = 'El año es requerido';
  if (!pages) fieldErrors.pages = 'El número de páginas es requerido';
  if (!copies) fieldErrors.copies = 'El número de ejemplares es requerido';
  if (!category) fieldErrors.category = 'La categoría es requerida';
  if (Object.keys(fieldErrors).length > 0) {
    return res.render('books/edit', {
      id: req.params.id,
      isbn, name, author, editorial, year, pages, copies, category,
      messages: { fieldErrors }
    });
  }
  try {
    await db.query(
      'UPDATE books SET isbn = ?, name = ?, author = ?, editorial = ?, year = ?, pages = ?, copies = ?, category = ? WHERE id = ?',
      [isbn, name, author, editorial, year, pages, copies, category, req.params.id]
    );
    req.flash('success', 'Libro actualizado');
    res.redirect('/books');
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/edit', {
      id: req.params.id,
      isbn, name, author, editorial, year, pages, copies, category,
      messages: { fieldErrors }
    });
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
