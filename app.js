const express = require('express');
const app = express();
const path = require('path');
//path için npm init yapmadan kullanabiliyoruz

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '.temp/index.html'));
  //resolve dosya yolunu çözümlemesi için
  //__dirname : proje klasörümün olduğu yer
});

app.listen(3000, () => {
  console.log('server 3000 portundan ayaklandı');
});
