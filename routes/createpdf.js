var express = require('express');
var router = express.Router();
var PDFDocument = require('pdfkit');
var fs = require("fs");

const names = [
    { fileName: "File 1"},
    { fileName: "File 2"},
    { fileName: "File 3"},
    { fileName: "File 4"},
]

router.post('/', function(req, res, next) {
    try {
        names.map(name => {
            const doc = new PDFDocument({
                layout: "landscape",
                size: "A4"
            });
        
            // const fileName = "TesteNomeArquivo";
            // const content = "Criando o certificado da Lari";
        
            // Quero colocar uma chave única para cada arquivo.
            //const timeStamp = "colocar um datenow aqui ou um navigator.location";
        
            // inline é o paramêtro que faz com que o pdf não baixe direto, mas sim abra no navegador, estou utilizando para o desenvolvimento.
            // No lugar de inline, se for para baixar direto, é attachment
            // res.setHeader("Content-disposition", 'inline; filename="' + fileName + ".pdf" + '"');
            // res.setHeader("Content-type", "application/pdf");
        
            const pdfStream = fs.createWriteStream(`public/certificateId/${name.fileName}.pdf`)
        
            doc.image("public/images/background_20220623105450912.png", 10, 10, { width: 825 });
            
            doc.fontSize(40).text(name.fileName, { align: "center"}, 315);
        
        
            doc.pipe(pdfStream);
            doc.end();
        })
    } catch (error) {
        console.error("Error: ", error.message)
    } finally {
        res.redirect("/")
    }
});

module.exports = router;
