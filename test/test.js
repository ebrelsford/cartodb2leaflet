var async = require('async');
var chai = require('chai');
var assert = chai.assert;
var fs = require('fs-extra');
var path = require('path');
var temp = require('temp');
var c2l = require('../index');

temp.track();

describe('copyExistingFiles', function () {
    it('should work on export0', function (done) {
        temp.mkdir('export0-shouldwork', function (err, dirPath) {
            if (err) return done(err);
            c2l.copyExistingFiles('test/files/export0', dirPath, function (err) {
                if (err) return done(err);
                fs.readdir(dirPath, function (err, files) {
                    async.each(files, function (file, callback) {
                        fs.stat(path.join(dirPath, file), function (err, stats) {
                            // Assert file exists
                            assert.isNull(err);
                            callback();
                        });
                    }, function (err) { done(err); });
                });
            });
        });
    });
});

describe('generateHtml', function () {
    it('should work on export0', function (done) {
        temp.mkdir('export0-shouldwork', function (err, dirPath) {
            if (err) return done(err);
            var src = 'test/files/export0';
            fs.readFile(path.join(src, 'viz.json'), function (err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                var visJson = JSON.parse(data);
                c2l.generateHtml(visJson, src, dirPath, function (err) {
                    if (err) return done(err);
                    fs.stat(path.join(dirPath, 'index.html'), function (err, stats) {
                        // Assert file exists
                        assert.isNull(err);
                        done();
                    });
                });
            });
        });
    });
});

describe('generateJavaScript', function () {
    it('should work on export0', function (done) {
        temp.mkdir('export0-shouldwork', function (err, dirPath) {
            if (err) return done(err);
            var src = 'test/files/export0';
            fs.readFile(path.join(src, 'viz.json'), function (err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                var visJson = JSON.parse(data);
                c2l.generateJavaScript(visJson, src, dirPath, function (err) {
                    if (err) return done(err);
                    fs.stat(path.join(dirPath, 'cartodb2leaflet.js'), function (err, stats) {
                        // Assert file exists
                        assert.isNull(err);
                        done();
                    });
                });
            });
        });
    });
});

describe('generateStyles', function () {
    it('should call callback on export0', function (done) {
        temp.mkdir('export0-shouldwork', function (err, dirPath) {
            if (err) return done(err);
            var src = 'test/files/export0';
            fs.readFile(path.join(src, 'viz.json'), function (err, data) {
                if (err) {
                    return done(err);
                }
                var visJson = JSON.parse(data);
                c2l.generateStyles(visJson, src, dirPath, function (err) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });
});

describe('generateFiles', function () {
    it('should call callback on export0', function (done) {
        temp.mkdir('export0-shouldwork', function (err, dirPath) {
            if (err) return done(err);
            var src = 'test/files/export0';
            c2l.generateFiles(src, dirPath, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
});

describe('toLeaflet', function () {
    it('should call callback on export0', function (done) {
        temp.mkdir('export0-shouldwork', function (err, dirPath) {
            if (err) return done(err);
            var src = 'test/files/export0';
            c2l.toLeaflet(src, dirPath, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
});
