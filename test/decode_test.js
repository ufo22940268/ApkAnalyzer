/**
 * Created by ccheng on 1/10/15.
 */

'use strict'

var decoder = require('../utils/decoder.js');
var fs = require('fs')
var expect = require('chai').expect

var spawn = require('child_process').spawn;
var path = require('path')
var generated_path = 'test/bin/a.txt';
var apk_file_path = 'test/bin/a.apk';

describe("Decode apk file ", function () {
    before(function () {
        fs.unlink(generated_path, null);
    });
    it('Should extract a AndroidManifest file', function (done) {
        decoder.extractFrom(apk_file_path, function (err) {
            fs.exists(generated_path, function (exists) {
                expect(exists).to.be.true()
                done()
            })
        })
    })

    it('Should return path of file', function () {
        expect(decoder.getPathOf('/a/b/c.apk')).to.equal('/a/b')
    })

    it('Should parse null xml file', function (done) {
        fs.createWriteStream(generated_path, 'w')
        decoder.parseTxt(generated_path, function (err, parseTxt) {
            expect(parseTxt).to.be.empty()
            done()
        });
    })

    it('Should parse xml file', function (done) {
        decoder.extractFrom(apk_file_path, function (err, path) {
            decoder.parseTxt(path, function (err, parseTxt) {
                expect(parseTxt).not.to.be.empty();
                expect(parseTxt).to.have.property('versionName');
                expect(parseTxt.versionName).to.be.equals('3.8');
                expect(parseTxt.versionCode).to.be.equals(0x4a);
                expect(parseTxt.packageName).to.be.equals('com.ushaqi.zhuishushenqi');
                expect(parseTxt.umengChannel).to.be.equals('Tencent');
                done()
            });
        })
    })

    it('Should detect the file is apk', function (done) {
        decoder.isApk('/test/bin/a.apk', function (err, isApk) {
            expect(isApk).to.be.true
            done()
        })
    })

    it('Should detect the file is not apk', function (done) {
        decoder.isApk('/test/bin/a.txt', function (err, isApk) {
            expect(isApk).to.be.false
            done()
        })
    })

});
