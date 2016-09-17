
// express 模块
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

    if (req.userInfo._id) {
        //已经登录了
        res.redirect('/disk');
    } else {
        res.render('main/index');
    }

});

router.get('/disk', function(req, res) {

    //判断用户是否是登录的状态
    if (!req.userInfo._id) {
        res.redirect('/');
    } else {
        res.render('main/disk');
    }

});

router.get('/user/logout', function(req, res) {
    req.cookies.set('userInfo', null);
    res.redirect('/');
})

module.exports = router;