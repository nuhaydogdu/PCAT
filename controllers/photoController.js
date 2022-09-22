const Photo = require('../models/Photo');
const fs = require('fs');
//fs'i dosya işlemleri için kullanıyoruz

exports.getAllPhotos = async (req, res) => {
  /*res.sendFile(path.resolve(__dirname, '.temp/index.html'));
    //resolve dosya yolunu çözümlemesi için
    //__dirname : proje klasörümün olduğu yer
    //public dosyasını static yaparak bunu sağladık
   */

  /*const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
*/

const  page=req.query.page || 1;                             //href="/?page=<%= i %>" index.ejs 84
const photosPerPage= 3;

const totalPhotos= await Photo.find().countDocuments();      //countDocuments(): sayfalama(pagination) için db deki dökümanların sayısını aldık              

const photos = await Photo.find({})
.sort('-dateCreated')                                       //oluşturulma tahine göre sıralıyor 
.skip((page-1)*photosPerPage)                               //hangi sayfada olduğumuza göre kaç tane foto atlayacağımızı belirledik
.limit(photosPerPage)                                       //her sayfada kaç tane gösterileceğini belirledik
  
res.render('index',{
  photos:photos,
  current:page,                                           //o anki sayfa 
  pages:Math.ceil(totalPhotos/photosPerPage)              //toplam sayfa sayısı -Math.ceil küsürlü ifadeleri üste yuvarlıyor
})

};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  // await Photo.create(req.body);
  // res.redirect('/');

  //fs ile dosya kontrolümüzü  yapıyoruz eğer yoksa oluşturuyoruz
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;

  //upload move(mv) ile resmi yüklemesini istediğim kladörü belirtmiş oluyorum. Resim adresini de db ye kaydediyor
  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect('/photos/' + req.params.id);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  let deleteImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deleteImage); //burada fs ile klasörden silme işlemini yaptık sync asenkron işlem yapmasını sağlıyor önce kalasörden seonra db den

  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
