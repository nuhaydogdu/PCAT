const express = require('express'); //schema (skima: şablon)
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
//fileUpload: Simple express middleware for uploading files.
const methodOverride = require('method-override');
//methodOverride: put requesti post request şeklinde smüle edeceğiz
const ejs = require('ejs');

const path = require('path');
//path için npm init yapmadan kullanabiliyoruz

const Photo = require('./models/Photo');
const photoControlller=require('./controllers/photoController');

const app = express();

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//TEMPPLATE ENGİNE
app.set('view engine', 'ejs');

//MİDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    //burada override ederken ikisi üzerinden de yapabilelim diye tanımladık.
    methods: ['GET', 'POST'],
  })
);

//ROUTERS
app.get('/', photoControlller.getAllPhotos);
app.get('/photos/:id', photoControlller.getPhoto);
app.post('/photos', photoControlller.createPhoto ); 
app.put('/photos/:id', photoControlller.updatePhoto );
app.delete('/photos/:id', photoControlller.deletePhoto);


app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('edit', {
    photo,
  });
});

app.listen(3000, () => {
  console.log('server 3000 portundan ayaklandı');
});
