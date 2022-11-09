var express = require('express');
var router = express.Router();
const app = express();

var router = express.Router();
var PDFDocument = require('pdfkit');
var fs = require("fs");
var Joi = require('joi');

/* lib connect */
var connect = require('connect');
var http = require('http');
// var app = connect();

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
/* */


const port = process.env.PORT || 4000;
app.use(express.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


app.post('/api/certificados', (req, res) => {
  // console.log('Data', JSON.stringify(req.body))
  certificados = [];
  certificados.push(JSON.stringify(req.body));
  // console.log('Data certificados', certificados)
  // var certificado = {
  //   user_name: req.body.user_name,
  //   description: req.body.description,
  //   url: req.body.url,
  //   customCssUrl: req.body.customCssUrl,
  //   certificateId: req.body.certificateId,
  //   backgroundUrl: req.body.backgroundUrl,
  //   title: req.body.title,
  //   certificateText: req.body.certificateText,
  //   verse_background_url: req.body.verse_background_url,
  //   certificateContent: req.body.certificateContent
  // };
  
  certificados.forEach(element => {
    console.log('dentro do foreach', element);
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

      doc.fontSize(40).text(certificado.user_name, { align: "center"}, 315);
      doc.pipe(pdfStream);
      doc.end();
    })
  } catch (error) {
    console.error("Error: ", error.message)
  } finally {
    // res.redirect("/")
    // console.log('terminou');
    // res.send(certificados);
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
