**EXPERIMENTAL**

cartodb2leaflet
================

A node module for converting CartoDB maps to pure Leaflet maps.

Puts together the following modules in order to download and convert maps from a
CartoDB account into HTML, JavaScript, and GeoJSON:

 * [cartodb-export](https://github.com/ebrelsford/cartodb-export) downloads the
   map from CartoDB to disk
 * [cartocss2leaflet](https://github.com/ebrelsford/cartocss2leaflet) converts
   the map's CartoCSS to styles that work in Leaflet
 * [Leaflet.jsonstyles](https://github.com/ebrelsford/Leaflet.jsonstyles) uses
   the output from cartocss2leaflet to add fun things like zoom-based styles
   (not the easiest to do in Leaflet).

Right now only basic SVG styles are supported (ie fill and stroke) as well as
zoom-based styles.


Usage
-----

You can use it as a module or as a command line script. To do the latter, clone
this repo, `npm install -g` and invoke the script:

    cartodb2leaflet -d <output_directory> <viz_json_url>


Contributing
------------

All code changes should be made in `src/index.js` and compiled using Babel into
the resulting `index.js`. Run `npm run watch` while editing to continuously
compile using Babel.


License
-------

MIT.
