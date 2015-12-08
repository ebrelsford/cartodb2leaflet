#!/usr/bin/env node

var cdbExport = require('cartodb-export');
var fs = require('fs');
var program = require('commander');

var cartodb2leaflet = require('../index');

program
    .version('0.0.1')
    .usage('[options] url')
    .option('-d, --dir [directory]', 'Specify the output directory [.]', '.')
    .parse(process.argv);

if (!program.args.length) {
    console.log('Please enter a url');
    program.outputHelp();
    process.exit(1);
}

fs.readFile('/dev/stdin', 'utf8', function (error, contents) {
    console.log(JSON.stringify(cartocss2leaflet(contents)));
});

var url = program.args[0];
console.log('Saving visualization in ' + program.dir);
cdbExport.exportVis(url, program.dir, function (err) {
    if (err) {
        console.error('Error while exporting visualization:', err);
        return;
    }

    console.log('Converting visualization to Leaflet');
    cartodb2leaflet.toLeaflet(program.dir, program.dir, function (err) {
        if (err) {
            console.error('Error while converting visualization to Leaflet:', err);
            return;
        }
        console.log('Done converting visualization to Leaflet');
        process.exit(0);
    });
});
