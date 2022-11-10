var express = require('express');
var router = express.Router();
const app = express();
var archiver = require("archiver");
var PDFDocument = require('pdfkit');
var fs = require("fs");

/* lib connect */
var http = require('http');

// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

http.createServer(app).listen(4000);

app.use(express.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// download request
const request = require('request');

app.post('/api/certificados', (req, res) => {
  certificados = [];
  req.body.forEach(element => {
    var certificado = {
      user_name: element.user_name,
      description: element.description,
      url: element.url,
      customCssUrl: element.customCssUrl,
      certificateId: element.certificateId,
      backgroundUrl: element.backgroundUrl,
      title: element.title,
      certificateText: element.certificateText,
      verse_background_url: element.verse_background_url,
      certificateContent: element.certificateContent
    };
    certificados.push(certificado);
  });

  try {
    certificados.map(certificado => {
      
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4"
      });
      const timeStamp = Date.now();
      const pdfStream = fs.createWriteStream(`public/certificateId/${certificado.user_name}.pdf`)
      doc.image("public/images/background_20220623105450912.png", 10, 10, { width: 825 });
      doc.fontSize(18).text(certificado.description, {
        align: "center"
      }, 200)
      doc.fontSize(14).text(certificado.certificateText, {
        align: "center"
      }, 250)

      doc.fontSize(8).text(timeStamp, {
        align: "bottom"
      }, 510, 100)

      // Conteúdo programatico?
      doc.addPage()
      // doc.image(`${certificado.verse_background_url}`, 10, 10, { width: 825 });
      doc.image("public/images/verseBackgroundUrl_20220707141956057.jpg", 10, 10, { width: 825 });
      doc.fontSize(18).text(certificado.certificateContent, {
        align: "center"
      }, 200)
      
      doc.pipe(pdfStream);
      doc.end();
    })
  } catch (error) {
    console.error("Error: ", error.message)
  } finally {
    res.redirect('/download')
  }
});

/* GET download. */
app.get('/download', function(req, res, next) {
  try {
      const archive = archiver("zip", {
          zlib: { level: 9 }
      });

      // Salvando dados em um local, provavelmente o S3 do cliente
      archive.pipe(
          fs.createWriteStream(`public/certificateMass/certificates.zip`)
      );

      dataPath = `public/CertificateId`
      archive.directory(dataPath + '/', false);
      archive.finalize();
  } catch (error) {
      console.error("Error: ", error.message)
  } finally {
      // res.redirect("/")
      console.log('Download disponível em: public/certificateMass/certificates.zip')
      res.send('Done')
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
