const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// Mostrar todas las categorías
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias ORDER BY id DESC');
    res.render('books/categorias', { data: rows, messages: req.flash() });
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/categorias', { data: [], messages: req.flash() });
  }
});

// Formulario agregar categoría
router.get('/add', (req, res) => {
  res.render('books/categorias_add', { name: '', description: '', messages: req.flash() });
});

// Agregar categoría
router.post('/add', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    req.flash('error', 'El nombre es requerido');
    return res.render('books/categorias_add', { name, description, messages: req.flash() });
  }
  try {
    await db.query('INSERT INTO categorias (name, description) VALUES (?, ?)', [name, description]);
    req.flash('success', 'Categoría agregada');
    res.redirect('/categorias');
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/categorias_add', { name, description, messages: req.flash() });
  }
});

// Formulario editar categoría
router.get('/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      req.flash('error', 'Categoría no encontrada');
      return res.redirect('/categorias');
    }
    res.render('books/categorias_edit', { ...rows[0], messages: req.flash() });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/categorias');
  }
});

// Actualizar categoría
router.post('/update/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    await db.query('UPDATE categorias SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
    req.flash('success', 'Categoría actualizada');
    res.redirect('/categorias');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/categorias');
  }
});

// Eliminar categoría
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
    req.flash('success', 'Categoría eliminada');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/categorias');
});

module.exports = router;
