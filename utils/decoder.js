var spawn = require('child_process').spawn;
var path = require('path')
var fs = require('fs')

var getPathOf = function (apk) {
    return path.dirname(apk)
};

var extractFrom = function (apk, cb) {
    var outPath = getPathOf(apk) + '/' + path.basename(apk, "apk") + 'txt'
    var aapt = spawn('aapt', ['dump', 'xmltree', apk, 'AndroidManifest.xml'])

    var outStream = fs.createWriteStream(outPath, {flags: 'w'});
    outStream = fs.createWriteStream(outPath, {flags: 'a+'});
    aapt.stdout.pipe(outStream);

    aapt.on('close', function (err) {
        cb(err, outPath)
    })
};

var parseTxt = function (path, cb) {
    fs.readFile(path, function (err, data) {
        if (data) {
            data = data.toString()

            var apkInfo = {}
            getVersionName(data, apkInfo);
            getVersionCode(data, apkInfo)
            getPackageName(data, apkInfo)
            getUmengChannel(data, apkInfo)
            cb(null, apkInfo)
        } else
            cb(err, {})
    })

    function getUmengChannel(data, apkInfo) {
        getRegexGroup(data, apkInfo, /UMENG_CHANNEL.*\n.+?"(.+?)"/, 'umengChannel')
    }

    function getVersionCode(data, apkInfo) {
        var reg = /android:versionCode.*=[^\)]+\)(.+)/
        var match = data.match(reg)
        if (match) {
            var m = match[1]
            apkInfo.versionCode = parseInt(m)
        }
    }

    function getRegexGroup(data, apkInfo, vnReg, tag) {
        var match = data.match(vnReg);
        if (match) {
            apkInfo[tag] = match[1]
        }
    }

    function getVersionName(data, apkInfo) {
        var vnReg = /android:versionName.*="(.+?)"/
        var tag = 'versionName';
        getRegexGroup(data, apkInfo, vnReg, tag);
    }

    var getPackageName = function (data, apkInfo) {
        getRegexGroup(data, apkInfo, 'package="(.*?)"', 'packageName')
    };
};

exports.isApk = function (p, f) {
    var match = p.match(/\.apk$/);
    var b;
    if (match) {
        b = true;
    } else {
        b = false;
    }

    return f(null, b);
};

exports.extractFrom = extractFrom
exports.getPathOf = getPathOf
exports.parseTxt = parseTxt
