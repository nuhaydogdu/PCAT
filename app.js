const express = require('express'); //schema (skima: şablon)
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
//fileUpload: Simple express middleware for uploading files.
const ejs = require('ejs');
const fs = require('fs');
//fs'i dosya işlemleri için kullanıyoruz
const path = require('path');
//path için npm init yapmadan kullanabiliyoruz

const Photo = require('./models/Photo');

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

//ROUTERS
app.get('/', async (req, res) => {
  /* res.sendFile(path.resolve(__dirname, '.temp/index.html'));
  //resolve dosya yolunu çözümlemesi için
  //__dirname : proje klasörümün olduğu yer
  //public dosyasını static yaparak bunu sağladık
 */
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  // await Photo.create(req.body);
  // res.redirect('/');

  //fs ile dosya kontrolümüzü  yapıyoruz eğer yoksa oluşturuyoruz
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadImage.name;

  //upload move(mv) ile resmi yüklemesini istediğim kladörü belirtmiş oluyorum. Resim adresini de db ye kaydediyor
  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});

app.listen(3000, () => {
  console.log('server 3000 portundan ayaklandı');
});
