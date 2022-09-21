const express = require('express'); //schema (skima: şablon)
const app = express();
const path = require('path');
//path için npm init yapmadan kullanabiliyoruz
const ejs = require('ejs');

//TEMPPLATE ENGİNE
app.set('view engine', 'ejs');

//MİDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 


//ROUTERS
app.get('/', (req, res) => {
  /* res.sendFile(path.resolve(__dirname, '.temp/index.html'));
  //resolve dosya yolunu çözümlemesi için
  //__dirname : proje klasörümün olduğu yer
  //public dosyasını static yaparak bunu sağladık
 */
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/photos', (req, res) => {
  console.log(req.body);
});


app.listen(3000, () => {
  console.log('server 3000 portundan ayaklandı');
});
