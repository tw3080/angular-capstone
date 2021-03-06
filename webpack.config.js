var path = require('path');

var webpack = require('webpack');

var packageData = require('./package.json');

// var filename = [packageData.name, packageData.version, 'js'];

module.exports = {
    entry: path.resolve(__dirname, packageData.main),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'weather-mood.js',
    },
    devtool: 'source-map'
};
