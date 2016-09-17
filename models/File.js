
var mongoose = require('mongoose');
var fileSchema = require('../schemas/file');

var File = mongoose.model('File', fileSchema);

module.exports = File;