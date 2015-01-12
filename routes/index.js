var express = require('express');
var router = express.Router();
var fs = require('fs')

var decoder = require('../utils/decoder.js');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'APK分析工具'});
});

router.post('/upload', function (req, res) {
    var name = req.files.fileUpload.name;
    var originalName = req.files.fileUpload.originalname
    decoder.isApk(originalName, function (err, isApk) {
        if (!isApk) {
            res.send('这个不是apk文件')
        } else {
            var apkFilePath = 'upload/' + name;
            decoder.extractFrom(apkFilePath, function (err, outPath) {
                if (err) {
                    throw err
                }

                decoder.parseTxt(outPath, function (err, info) {
                    console.log("info = " + info)
                    if (err) {
                        throw err
                    }

                    info.fileName = originalName
                    res.render('report', {apkInfo: info});
                });
            });
        }
    });

})

module.exports = router;
