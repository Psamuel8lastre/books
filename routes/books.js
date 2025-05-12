const express = require('express');
const router = express.Router();
const dbConn = require('../lib/db');

// Mostrar lista de libros
router.get('/', (req, res) => {
    dbConn.query('SELECT * FROM books ORDER BY id DESC', (err, rows) => {
        if (err) {
            req.flash('error', err.message);
            res.render('books', { data: [] });
        } else {
            res.render('books', { data: rows });
        }
    });
});

// Mostrar formulario para agregar libro
router.get('/add', (req, res) => {
    res.render('books/add', {
        name: '',
        author: ''
    });
});

// Agregar libro
router.post('/add', (req, res) => {
    const { name, author } = req.body;
    let errors = false;

    if (!name || !author) {
        errors = true;
        req.flash('error', 'Por favor ingrese el nombre y el autor');
        return res.render('books/add', { name, author });
    }

    const form_data = { name, author };

    dbConn.query('INSERT INTO books SET ?', form_data, (err) => {
        if (err) {
            req.flash('error', err.message);
            res.render('books/add', form_data);
        } else {
            req.flash('success', 'Libro agregado exitosamente');
            res.redirect('/books');
        }
    });
});

// Mostrar formulario para editar libro
router.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    dbConn.query('SELECT * FROM books WHERE id = ?', [id], (err, rows) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/books');
        }

        if (rows.length <= 0) {
            req.flash('error', `Book not found with id = ${id}`);
            return res.redirect('/books');
        }

        res.render('books/edit', {
            title: 'Edit Book',
            id: rows[0].id,
            name: rows[0].name,
            author: rows[0].author
        });
    });
});

// Actualizar libro
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const { name, author } = req.body;

    if (!name || !author) {
        req.flash('error', 'Por favor ingrese el nombre y el autor');
        return res.render('books/edit', { id, name, author });
    }

    const form_data = { name, author };

    dbConn.query('UPDATE books SET ? WHERE id = ?', [form_data, id], (err) => {
        if (err) {
            req.flash('error', err.message);
            return res.render('books/edit', { id, ...form_data });
        }

        req.flash('success', 'Libro actualizado exitosamente');
        res.redirect('/books');
    });
});

// Eliminar libro
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    dbConn.query('DELETE FROM books WHERE id = ?', [id], (err) => {
        if (err) {
            req.flash('error', err.message);
        } else {
            req.flash('success', `Libro eliminado correctamente! `);
        }
        res.redirect('/books');
    });
});

module.exports = router;
