const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const flash = require('express-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

//const dbSessionConfig = require('./lib/dbSession');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

const app = express();

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sesión
app.use(session({
    secret: 'secreto_seguro',
    resave: false,
    saveUninitialized: false,
    //store: new MySQLStore(dbSessionConfig),
    cookie: { secure: false, maxAge: 86400000 }
}));
app.use(flash());

// Rate limiting
app.use('/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/auth', loginRouter);
app.use('/auth', registerRouter);


// Errores
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
