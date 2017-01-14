var express = require('express'),
    handlebars = require('handlebars'),
    layouts = require('handlebars-layouts'),
    fs = require('fs'),
    bodyParser = require('body-parser');

// Register layouts` helpers 
handlebars.registerHelper(layouts(handlebars));

var app = express(),
    exphbs  = require('express-handlebars');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.use( bodyParser.json() );       // для поддержки JSON
app.use(bodyParser.urlencoded({     // для поддержки URL кодировки
  extended: true
}));

// Register partials via Handlebars
handlebars.registerPartial('layout', fs.readFileSync('./views/layouts/layout.hbs', 'utf8'));
handlebars.registerPartial('top', fs.readFileSync('./views/layouts/top.hbs', 'utf8'));
handlebars.registerPartial('head', fs.readFileSync('./views/layouts/head.hbs', 'utf8'));
handlebars.registerPartial('table', fs.readFileSync('./views/layouts/table.hbs', 'utf8'));

// create instance of hbs-expr with specify propertys
var hbs = exphbs.create({
    handlebars: require('handlebars'),
    extname: '.hbs',
    defaultLayout: false
});

// Встановлення маршруту до шаблонів
app.set('views', './views');
//Встановлення корневого шаблону і обробщика шаблонів
// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

/*Вказано шлях до статичних файлів*/
app.use(express.static('./public'));

//Маршрутизація сторінок, запаковування даними із DB ======
require('./routes')(app);

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
