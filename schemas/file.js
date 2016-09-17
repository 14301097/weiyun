
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //pid
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        default: null
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    //文件夹或文件的名称
    name: String,
    type: {
        type: Boolean,
        default: true
    },
    //是否是在回收站
    isRecycleBin: {
        type: Boolean,
        default: false
    },
    createTime: {
        type: Date,
        default: Date.now()
    },

    originalname: {
        type: String,
        default: ''
    },
    encoding: {
        type: String,
        default: ''
    },
    mimetype: {
        type: String,
        default: ''
    },
    path: {
        type: String,
        default: ''
    },
    size: {
        type: Number,
        default: 0
    },
    suffix: {
        type: String,
        default: ''
    }
});