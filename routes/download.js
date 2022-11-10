var express = require('express');
var router = express.Router();
var fs = require("fs");
var archiver = require("archiver");

router.post('/', function(req, res, next) {
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
        res.redirect("/")
    }
});

module.exports = router;
