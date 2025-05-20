const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// Mostrar todas las editoriales
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM editoriales ORDER BY id DESC');
    res.render('books/editoriales', { data: rows, messages: req.flash() });
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/editoriales', { data: [], messages: req.flash() });
  }
});

// Formulario agregar editorial
router.get('/add', (req, res) => {
  res.render('books/editoriales_add', { name: '', country: '', messages: req.flash() });
});

// Agregar editorial
router.post('/add', async (req, res) => {
  const { name, country } = req.body;
  if (!name) {
    req.flash('error', 'El nombre es requerido');
    return res.render('books/editoriales_add', { name, country, messages: req.flash() });
  }
  try {
    await db.query('INSERT INTO editoriales (name, country) VALUES (?, ?)', [name, country]);
    req.flash('success', 'Editorial agregada');
    res.redirect('/editoriales');
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/editoriales_add', { name, country, messages: req.flash() });
  }
});

// Formulario editar editorial
router.get('/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM editoriales WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      req.flash('error', 'Editorial no encontrada');
      return res.redirect('/editoriales');
    }
    res.render('books/editoriales_edit', { ...rows[0], messages: req.flash() });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/editoriales');
  }
});

// Actualizar editorial
router.post('/update/:id', async (req, res) => {
  const { name, country } = req.body;
  try {
    await db.query('UPDATE editoriales SET name = ?, country = ? WHERE id = ?', [name, country, req.params.id]);
    req.flash('success', 'Editorial actualizada');
    res.redirect('/editoriales');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/editoriales');
  }
});

// Eliminar editorial
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM editoriales WHERE id = ?', [req.params.id]);
    req.flash('success', 'Editorial eliminada');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/editoriales');
});

module.exports = router;
