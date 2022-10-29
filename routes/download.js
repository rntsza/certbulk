var express = require('express');
var router = express.Router();
var fs = require("fs");
var archiver = require("archiver");

const names = [
    { fileName: "File 1"},
    { fileName: "File 2"},
    { fileName: "File 3"},
    { fileName: "File 4"},
]
router.post('/', function(req, res, next) {
    try {

        // Quero colocar uma chave única para cada arquivo.
        const timeStamp = Date.now();

        const archive = archiver("zip", {
            zlib: { level: 9 }
        });

        // Salvando dados em um local, provavelmente o S3 do cliente
        archive.pipe(
            fs.createWriteStream(`public/certificateMass/certificates.zip`)
        );

        names.map(name => {
            archive.file(`public/CertificateId/${ names.fileName }.pdf`, {
                name: `${name.fileName}.pdf`
            });
        });
        archive.finalize();
    } catch (error) {
        console.error("Error: ", error.message)
    } finally {
        res.redirect("/")
    }
});

module.exports = router;
