const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// Mostrar todos los autores
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM autores ORDER BY id DESC');
    res.render('books/autores', { data: rows, messages: req.flash() });
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/autores', { data: [], messages: req.flash() });
  }
});

// Formulario agregar autor
router.get('/add', (req, res) => {
  res.render('books/autores_add', { name: '', country: '', birthdate: '', messages: req.flash() });
});

// Agregar autor
router.post('/add', async (req, res) => {
  const { name, country, birthdate } = req.body;
  if (!name) {
    req.flash('error', 'El nombre es requerido');
    return res.render('books/autores_add', { name, country, birthdate, messages: req.flash() });
  }
  try {
    await db.query('INSERT INTO autores (name, country, birthdate) VALUES (?, ?, ?)', [name, country, birthdate]);
    req.flash('success', 'Autor agregado');
    res.redirect('/autores');
  } catch (err) {
    req.flash('error', err.message);
    res.render('books/autores_add', { name, country, birthdate, messages: req.flash() });
  }
});

// Formulario editar autor
router.get('/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM autores WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      req.flash('error', 'Autor no encontrado');
      return res.redirect('/autores');
    }
    res.render('books/autores_edit', { ...rows[0], messages: req.flash() });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/autores');
  }
});

// Actualizar autor
router.post('/update/:id', async (req, res) => {
  const { name, country, birthdate } = req.body;
  try {
    await db.query('UPDATE autores SET name = ?, country = ?, birthdate = ? WHERE id = ?', [name, country, birthdate, req.params.id]);
    req.flash('success', 'Autor actualizado');
    res.redirect('/autores');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/autores');
  }
});

// Eliminar autor
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM autores WHERE id = ?', [req.params.id]);
    req.flash('success', 'Autor eliminado');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/autores');
});

module.exports = router;
