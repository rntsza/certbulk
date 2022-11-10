var express = require('express');
var router = express.Router();
const app = express();

// var router = express.Router();
var PDFDocument = require('pdfkit');
var fs = require("fs");
var Joi = require('joi');
const { jsPDF } = require("jspdf")

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

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//create node.js http server and listen on port
http.createServer(app).listen(4000);

app.use(express.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


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

      // doc.moveDown();
      doc.fontSize(18).text(certificado.certificateText, {
        align: "center"
      }, 200)
      doc.pipe(pdfStream);
      doc.end();
    })
  } catch (error) {
    console.error("Error: ", error.message)
  } finally {
    res.send("Result: Ok");
  }
});


// PORT


// app.listen(port, () => console.log(`Listening on port ${port}...`));
// app.post()
// app.put()
// app.delete()

/*
Acaba aqui api
*/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
