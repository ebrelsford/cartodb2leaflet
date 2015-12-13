import async from 'async';
import { cartocss2leaflet } from 'cartocss2leaflet';
import fs from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';

export function toLeaflet(src, dest, callback) {
    fs.mkdir(dest, (err) => {
        if (err && err.code !== 'EEXIST') {
            callback(err);
            return;
        }
        async.applyEach([ copyExistingFiles, generateFiles ], src, dest, callback);
    });
}

export function copyExistingFiles(src, dest, callback) {
    // If src !== dest, copy layers and vis
    if (src === dest) {
        callback();
        return;
    }
    fs.readdir(src, (err, files) => {
        if (err) {
            callback(err);
            return;
        }
        async.each(files, (file, asyncCallback) => {
            fs.copy(path.join(src, file), path.join(dest, file), asyncCallback);
        }, callback);
    });
}

export function generateFiles(src, dest, callback) {
    fs.readFile(path.join(src, 'viz.json'), (err, data) => {
        if (err) {
            callback(err);
            return;
        }
        var visJson = JSON.parse(data);
        async.applyEach([
            generateHtml,
            generateJavaScript,
            generateStyles
        ], visJson, src, dest, callback);
    });
}

export function generateHtml(visJson, src, dest, callback) {
    fs.readFile(path.join(__dirname, 'templates/index.hbs'), function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        var html = Mustache.render(data.toString(), visJson);
        fs.writeFile(path.join(dest, 'index.html'), html, callback);
    });
}

export function generateJavaScript(visJson, src, destDir, callback) {
    var jsFiles = [
        'cartodb2leaflet.js',
        path.join('node_modules', 'leaflet-jsonstyles', 'src', 'leaflet.jsonstyles.js')
    ];
    async.each(jsFiles, (file, cb) => {
        var src = path.join(__dirname, file),
            filename = file.split(path.sep).pop(),
            dest = path.join(destDir, filename);
        fs.copy(src, dest, { replace: true }, cb);
    }, callback);
}

export function generateStyles(visJson, src, dest, callback) {
    async.forEachOf(visJson.layers, (layer, layerIndex, callback) => {
        if (layer.type !== 'layergroup') {
            callback();
            return;
        }
        generateLayerStyles(layer, layerIndex, dest, callback);
    }, callback);
}

function generateLayerStyles(layer, layerIndex, dest, callback) {
    async.forEachOf(layer.options.layer_definition.layers, (sublayer, sublayerIndex, callback) => {
        var style = cartocss2leaflet(sublayer.options.cartocss),
            destFile = path.join(dest, 'layers', layerIndex.toString(), 'sublayers', sublayerIndex.toString(), 'style.json');

        fs.ensureFile(destFile, (err) => {
            if (err) return callback(err);
            fs.writeJson(destFile, style, callback);
        });
    }, callback);
}
