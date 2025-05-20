const express = require('express');
const router = express.Router();
const db = require('../lib/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const [books] = await db.query('SELECT * FROM books ORDER BY id DESC');
    res.render('index', { title: 'Node.js Simple CRUD with Express.js and MySQL Tutorial', books });
  } catch (err) {
    res.render('index', { title: 'Node.js Simple CRUD with Express.js and MySQL Tutorial', books: [] });
  }
});

module.exports = router;


