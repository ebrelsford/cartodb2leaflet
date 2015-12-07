'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.toLeaflet = toLeaflet;
exports.copyExistingFiles = copyExistingFiles;
exports.generateFiles = generateFiles;
exports.generateHtml = generateHtml;
exports.generateJavaScript = generateJavaScript;
exports.generateStyles = generateStyles;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _cartocss2leaflet = require('cartocss2leaflet');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function toLeaflet(src, dest, callback) {
    _fsExtra2['default'].mkdir(dest, function (err) {
        if (err && err.code !== 'EEXIST') {
            callback(err);
            return;
        }
        _async2['default'].applyEach([copyExistingFiles, generateFiles], src, dest, callback);
    });
}

function copyExistingFiles(src, dest, callback) {
    // If src !== dest, copy layers and vis
    if (src === dest) {
        callback();
        return;
    }
    _fsExtra2['default'].readdir(src, function (err, files) {
        if (err) {
            callback(err);
            return;
        }
        _async2['default'].each(files, function (file, asyncCallback) {
            _fsExtra2['default'].copy(_path2['default'].join(src, file), _path2['default'].join(dest, file), asyncCallback);
        }, callback);
    });
}

function generateFiles(src, dest, callback) {
    _fsExtra2['default'].readFile(_path2['default'].join(src, 'viz.json'), function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        var visJson = JSON.parse(data);
        _async2['default'].applyEach([generateHtml, generateJavaScript, generateStyles], visJson, src, dest, callback);
    });
}

function generateHtml(visJson, src, dest, callback) {
    _fsExtra2['default'].readFile('templates/index.hbs', function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        var html = _mustache2['default'].render(data.toString(), visJson);
        _fsExtra2['default'].writeFile(_path2['default'].join(dest, 'index.html'), html, callback);
    });
}

function generateJavaScript(visJson, src, dest, callback) {
    _fsExtra2['default'].readFile('templates/index.js.hbs', function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        var js = _mustache2['default'].render(data.toString(), visJson);
        _fsExtra2['default'].writeFile(_path2['default'].join(dest, 'index.js'), js, callback);
    });
}

function generateStyles(visJson, src, dest, callback) {
    _async2['default'].forEachOf(visJson.layers, function (layer, layerIndex, callback) {
        if (layer.type !== 'layergroup') {
            callback();
            return;
        }
        generateLayerStyles(layer, layerIndex, dest, callback);
    }, callback);
}

function generateLayerStyles(layer, layerIndex, dest, callback) {
    _async2['default'].forEachOf(layer.options.layer_definition.layers, function (sublayer, sublayerIndex, callback) {
        var style = (0, _cartocss2leaflet.cartocss2leaflet)(sublayer.options.cartocss),
            destFile = _path2['default'].join(dest, 'layers', layerIndex.toString(), 'sublayers', sublayerIndex.toString(), 'style.json');

        _fsExtra2['default'].ensureFile(destFile, function (err) {
            if (err) return callback(err);
            _fsExtra2['default'].writeJson(destFile, style, callback);
        });
    }, callback);
}
