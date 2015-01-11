var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'APK分析工具' });
});

router.post('/upload', function (req, res) {
  res.render('report');
})

module.exports = router;
