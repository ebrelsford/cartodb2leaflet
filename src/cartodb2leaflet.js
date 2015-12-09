var map = null;
var visJson = null;

function onReady() {
    map = L.map('map');
}

function onVisJson(visJson) {
    L.tileLayer(visJson.layers[0].options.urlTemplate).addTo(map);
    map.fitBounds(visJson.bounds);
    loadLayers(visJson);
}

function loadLayers(visJson) {
    visJson.layers.forEach((layer, layerIndex) => {
        if (layer.type !== 'layergroup') return;
        layer.options.layer_definition.layers.forEach((sublayer, sublayerIndex) => {
            var base = 'layers/' + layerIndex + '/sublayers/' + sublayerIndex,
                dataUrl = base + '/layer.geojson',
                styleUrl = base + '/style.json';

            loadLayer(dataUrl, styleUrl);
        });
    });
}

function loadLayer(dataUrl, styleUrl) {
    var request = new XMLHttpRequest();
    request.open('GET', dataUrl, true);

    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            var styleRequest = new XMLHttpRequest();
            styleRequest.open('GET', styleUrl, true);

            styleRequest.onload = () => {
                if (styleRequest.status >= 200 && styleRequest.status < 400) {
                    var geojson = JSON.parse(request.responseText);
                    var styleResponse = JSON.parse(styleRequest.responseText);
                    var style;
                    for (var key in styleResponse) {
                        if (styleResponse.hasOwnProperty(key)) {
                            style = styleResponse[key][0].style;
                            break;
                        }
                    }
                    L.geoJson(geojson, {
                        // TODO only with points
                        pointToLayer: (feature, latlng) => {
                            return L.circleMarker(latlng);
                        },
                        style: style
                    }).addTo(map);
                }
                else {
                    console.error('Could not load ', dataUrl);
                }
            };

            styleRequest.onerror = () => {
                console.error('Could not load', dataUrl);
            };

            styleRequest.send();
        }
        else {
            console.error('Could not load ', dataUrl);
        }
    };

    request.onerror = () => {
        console.error('Could not load', dataUrl);
    };

    request.send();
}

function loadVisJson() {
    var request = new XMLHttpRequest();
    request.open('GET', 'viz.json', true);

    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            visJson = JSON.parse(request.responseText);
            onVisJson(visJson);
        }
        else {
            console.error('Could not load viz.json');
        }
    };

    request.onerror = () => {
        console.error('Could not load viz.json');
    };

    request.send();
}

loadVisJson();

if (document.readyState !== 'loading') {
    onReady();
} 
else {
    document.addEventListener('DOMContentLoaded', onReady);
}
