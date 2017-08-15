
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  models = require('./models'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/classmanager',
  db = mongoose.connect(dbUrl, {safe: true})

var session = require('express-session'),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

var app = express();
app.locals.appTitle = "classmanager";

app.use(function(req, res, next) {
  if (!models.Classroom || ! models.User) return next(new Error("No models."))
  req.models = models;
  return next();
});



// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}))
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
app.use(function(req, res, next) {
  if (req.session && req.session.admin)
    res.locals.admin = true;
  next();
});

// Authorization
var authorize = function(req, res, next) {
  if (req.session && req.session.admin)
    return next();
  else
    return res.send(401);
};

// Development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}


// Pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize, routes.classroom.admin);
app.get('/post', authorize, routes.classroom.post);
app.post('/post', authorize, routes.classroom.postClassroom);
app.get('/classrooms/:slug', routes.classroom.show);
app.get('/professor/', authorize, routes.professor.index);

// REST API routes
app.all('/api', authorize);
app.get('/api/classrooms', routes.classroom.list);
app.post('/api/classrooms', routes.classroom.add);
app.put('/api/classrooms/:id', routes.classroom.edit);
app.delete('/api/classrooms/:id', routes.classroom.del);



app.all('*', function(req, res) {
  res.send(404);
})

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function(){
    console.info('Express server listening on port ' + app.get('port'));
  });
}
var shutdown = function() {
  server.close();
}
if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
