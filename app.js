var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var exphbs = require('express-handlebars'); // Importe o pacote express-handlebars

const { default: mongoose } = require('mongoose');

//rotas |TODO
var indexRouter = require('./routes/index');
var UserRoutes = require('./routes/UserRoutes');
var StudentRoutes = require('./routes/StudentRoutes');


var app = express();

// Configurar o Handlebars como o mecanismo de visualização
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));

//routes TODO

app.use('/', indexRouter);
app.use('/user', UserRoutes);
app.use('/student', StudentRoutes);

//conectar no banco
mongoose.connect('mongodb://localhost/ChatEscola', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
