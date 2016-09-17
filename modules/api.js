
// express 模块
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var File = require('../models/File');
var Tree = require('../tools/tree');
//上传
var multer  = require('multer');
var fs = require('fs');

/*
 * 上传初始化
 * */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var saveDir = './data/' + req.userInfo._id;
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir);
        }
        cb(null, saveDir);
    },
    filename: function (req, file, cb) {
        var dotIndex = file.originalname.lastIndexOf('.');
        var filename = file.originalname.substring(0, dotIndex);
        var suffix = file.originalname.substring( dotIndex );
        file.suffix = suffix;
        cb(null, filename + '_' +Date.now() + suffix);
    }
});

var upload = multer({ storage: storage });

router.use(function(req, res, next) {

    res.responseData = {
        code: 0,
        message: ''
    };

    res.sendJSON = function() {
        this.json(this.responseData);
    };

    next();
});

/*
* 用户名验证
* method: GET
* params:
*   <string>username : 用户要注册的用户名
* */
router.get('/user/checkUserName', function(req, res) {
    var username = req.query.username || '';

    //用户名验证
    if ( username.length < 3 || username.length > 16 ) {
        res.responseData.code = 1;
        res.responseData.message = '用户名长度必须在3-16个字符之间';
        res.sendJSON();
        return;
    }

    //验证用户名是否已经被注册
    User.findOne({
        username: username
    }).then(function(result) {
        if (result) {
            res.responseData.code = 2;
            res.responseData.message = '用户名已经被注册';
        } else {
            res.responseData.message = '用户名可以注册';
        }
        res.sendJSON();
    });

});

/*
* 用户注册
* method: POST
* params:
*   <string>username : 用户要注册的用户名
*   <string>password : 用户要注册的密码
*   <string>repassword : 重复密码
* */
router.post('/user/register', function(req, res) {

    var username = req.body.username || '';
    var password = req.body.password || '';
    var repassword = req.body.repassword || '';

    //用户名验证
    if ( username.length < 3 || username.length > 16 ) {
        res.responseData.code = 1;
        res.responseData.message = '用户名长度必须在3-16个字符之间';
        res.sendJSON();
        return;
    }
    //密码验证
    if (password.length == '') {
        res.responseData.code = 2;
        res.responseData.message = '密码不能为空';
        res.sendJSON();
        return;
    }
    if ( password != repassword ) {
        res.responseData.code = 3;
        res.responseData.message = '两次输入密码不一致';
        res.sendJSON();
        return;
    }

    //验证用户名是否已经被注册
    User.findOne({
        username: username
    }).then(function(result) {
        if (result) {
            res.responseData.code = 4;
            res.responseData.message = '用户名已经被注册';
            res.sendJSON();
            return;
        }
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUser) {
        if (newUser) {
            res.responseData.message = '注册成功';
            res.sendJSON();
        }
    }).catch(function() {
        res.responseData.code = 5;
        res.responseData.message = '注册失败';
        res.sendJSON();
    });

});

/*
 * 用户登录
 * method: POST
 * params:
 *   <string>username : 用户要登录的用户名
 *   <string>password : 用户要登录的密码
 * */
router.post('/user/login', function(req, res) {

    var username = req.body.username || '';
    var password = req.body.password || '';

    //用户名和密码的验证
    if ( username == '' || password == '' ) {
        res.responseData.code = 1;
        res.responseData.message = '用户名和密码不能为空';
        res.sendJSON();
        return;
    }

    //验证用户名和密码是否是匹配的
    User.findOne({
        username: username
    }).then(function(userInfo) {
        if (!userInfo) {
            res.responseData.code = 2;
            res.responseData.message = '用户名不存在';
            res.sendJSON();
            return;
        }
        if (userInfo.password != password) {
            res.responseData.code = 3;
            res.responseData.message = '密码错误';
            res.sendJSON();
            return;
        }

        //把登录用户的信息记录到cookie中，发送给客户端
        var cookieUserInfo = {
            _id: userInfo._id.toString(),
            username: userInfo.username
        };

        req.cookies.set('userInfo', JSON.stringify(cookieUserInfo));

        res.responseData.message = '登录成功';
        res.sendJSON();
    })

});


//网盘业务操作API

/*
* 新建文件夹 - 完成
* method: POST
* params:
*   <string>name : 文件夹的名称
*   <number>pid : 父级ID
* */
router.post('/createFolder', checkAuth, function(req, res) {

    var name = req.body.name || '';
    var pid = req.body.pid || null;

    if ( name == '' ) {
        res.responseData.code = 1;
        res.responseData.message = '文件夹名称不能为空';
        res.sendJSON();
        return;
    }

    if ( pid !== null ) {
        var parentInfo = req.filesTree.get(pid);
        if ( !parentInfo ) {
            res.responseData.code = 2;
            res.responseData.message = '所在父级不存在';
            res.sendJSON();
            return;
        }
        if ( !parentInfo.type ) {
            res.responseData.code = 3;
            res.responseData.message = '目标父级不是一个文件夹';
            res.sendJSON();
            return;
        }
    }

    if ( req.filesTree.samenameDirInList( pid, name ) ) {
        res.responseData.code = 4;
        res.responseData.message = '目标父级下已存在同名目录';
        res.sendJSON();
        return;
    }

    //保存文件夹
    var folder = new File({
        pid: pid,
        name: name,
        uid: req.userInfo._id
    });
    folder.save().then(function(newFolder) {
        res.responseData.message = '文件夹创建成功';
        res.sendJSON();
    });

});

/*
* 上传文件 - ...
* */
router.post('/upload', checkAuth, upload.single('file'), function(req, res) {

    var pid = req.body.pid || null;

    if ( pid !== null ) {
        var parentInfo = req.filesTree.get(pid);
        if ( !parentInfo ) {
            res.responseData.code = 1;
            res.responseData.message = '所在父级不存在';
            res.sendJSON();
            return;
        }
        if ( !parentInfo.type ) {
            res.responseData.code = 2;
            res.responseData.message = '目标父级不是一个文件夹';
            res.sendJSON();
            return;
        }
    }

    //获取文件夹下的一级子文件
    var list = req.filesTree.getList(pid, false);
    req.file.name = req.file.originalname;
    for (var i=0; i<list.length; i++) {
        if ( list[i].name == req.file.originalname ) {
            req.file.name = req.file.originalname + Date.now();
            break;
        }
    }

    //保存文件
    var file = new File({
        pid: pid,
        name: req.file.name,
        uid: req.userInfo._id,
        type: false,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        path: req.file.path,
        size: req.file.size,
        suffix: req.file.suffix
    });
    file.save().then(function(newFile) {
        res.responseData.message = '文件上传成功';
        res.sendJSON();
    });
});

/*
 * 获取指定pid下的一级子文件/文件夹 - 完成
 * method: GET
 * params:
 *   <number>pid : 父级ID
 * */
router.get('/getList', checkAuth, function(req, res) {
    var pid = req.query.pid || null;
    res.responseData.data = req.filesTree.getList(pid);
    res.sendJSON();
});

/*
 * 获取回收站中的数据 - 完成
 * method: GET
 * params:
 *   <number>pid : 父级ID
 * */
router.get('/getRecycleBinList', checkAuth, function(req, res) {
    res.responseData.data = req.filesTree.getRecycleBinList();
    res.sendJSON();

});

/*
* 面包屑 - 完成
* */
router.get('/crumbs', checkAuth, function(req, res) {
    console.log(111)
    var id = req.query.id || null;
    var parents = req.filesTree.getParents(id);
    if (id) {
        parents.push( req.filesTree.get(id) );
    }
    res.responseData.data = parents;
    res.sendJSON();

});

/*
* 文件重命名 - 完成
* */
router.get('/rename', checkAuth, function(req, res) {
    var id = req.query.id || null;
    var name = req.query.name || null;

    var file = req.filesTree.get(id);
    if (!file) {
        res.responseData.code = 1;
        res.responseData.message = '文件/文件夹不存在';
        res.sendJSON();
        return;
    }

    //file.type表示是否是文件夹
    if (file.type) {
        //文件夹
        var list = req.filesTree.getList( file.pid, true );
        for (var i=0; i<list.length; i++) {
            if (list[i].name == name) {
                if (list[i]._id.toString() != file._id.toString()) {
                    res.responseData.code = 2;
                    res.responseData.message = '该目录下已经存在同名的目录';
                } else {
                    res.responseData.code = 3;
                    res.responseData.message = '操作成功，但没有发生任何改变';
                }
                res.sendJSON();
                return;
            }
        }
    } else {
        //文件
    }

    file.name = name;
    file.save().then(function(newFile) {
        res.responseData.message = '重命名成功';
        res.sendJSON();
    })

});

/*
* 移动 - 完成
* */
router.post('/move', checkAuth, function(req, res) {
    var targetId = req.body.targetId || '';
    var checkedId = req.body.checkedId ? req.body.checkedId.split(',') : [];

    if (!targetId || !checkedId.length) {
        res.responseData.code = 1;
        res.responseData.message = '源id和目标id不存在';
        res.sendJSON();
        return;
    }

    //检测目标和源是否都存在
    var targetInfo = req.filesTree.get( targetId );
    if ( !targetInfo ) {
        res.responseData.code = 2;
        res.responseData.message = '目标不存在';
        res.sendJSON();
        return;
    }
    for (var i=0; i<checkedId.length; i++) {
        if ( !req.filesTree.get(checkedId[i]) ) {
            res.responseData.code = 3;
            res.responseData.message = '需要移动的文件/文件夹不存在';
            res.sendJSON();
            return;
        }
    }

    //检测目标是否在移动的源列表中
    if ( checkedId.indexOf( targetId ) != -1 ) {
        res.responseData.code = 4;
        res.responseData.message = '目标错误';
        res.sendJSON();
        return;
    }

    //检测目标是否是移动源列表中的子级
    for (var i=0; i<checkedId.length; i++) {
        if ( req.filesTree.isChild( checkedId[i], targetId, true ) ) {
            res.responseData.code = 5;
            res.responseData.message = '目标是子级，不能移动';
            res.sendJSON();
            return;
        }
    }

    //检测目标类型是否为文件夹
    if (!targetInfo.type) {
        res.responseData.code = 6;
        res.responseData.message = '目标不是文件夹';
        res.sendJSON();
    }

    File.update({
        _id: {$in: checkedId}
    }, {
        pid: targetId
    }, {
        multi: true
    }).then(function(result) {
        res.responseData.message = '移动成功';
        res.sendJSON();
    });

});

/*
* 删除 - 完成
* */
router.get('/remove', checkAuth, function(req, res) {
    var id = req.query.id || '';
    var ids = id.split(',');

    if (!ids.length) {
        res.responseData.code = 1;
        res.responseData.message = '缺少文件id';
        res.sendJSON();
        return;
    }

    //要删除的id的集合
    var removeIds = [];
    var filesList = [];

    //检测要删除的文件是否存在
    for (var i=0; i<ids.length;) {
        var file = req.filesTree.get(ids[i]);
        if (!file) {
            ids.splice(i, 1);
        } else {
            if (file.type) {
                //如果要删除的是目录
                var children = req.filesTree.getChildren(ids[i]);
                for (var j=0; j<children.length; j++) {
                    removeIds.push(children[j]._id);
                }
            }
            removeIds.push(ids[i]);
            i++;
        }
    }

    for (var i=0; i<removeIds.length; i++) {
        filesList.push( req.filesTree.get(removeIds[i]) );
    }

    if (!removeIds.length) {
        res.responseData.code = 2;
        res.responseData.message = '要删除的文件或者文件夹不存在';
        res.sendJSON();
        return;
    }

    File.remove({
        _id: {$in: removeIds}
    }).then(function() {

        //删除实体文件
        for (var i=0; i<filesList.length; i++) {
            try {
                fs.unlinkSync('./' + filesList[i].path);
            } catch(e) {}
        }

        res.responseData.message = '删除成功';
        res.sendJSON();
    });
});

/*
* 移动到回收站 - 完成
* */
router.get('/moveToRecycleBin', function(req, res) {
    var id = req.query.id || '';
    id = id.split(',');

    if (!id.length) {
        res.responseData.code = 1;
        res.responseData.message = '缺少文件id';
        res.sendJSON();
        return;
    }

    File.update({
        _id: {$in: id}
    }, {
        isRecycleBin: true
    }, {
        multi: true
    }).then(function() {
        res.responseData.message = '移动到回收站成功';
        res.sendJSON();
    });
});

/*
 * 从回收站还原 - 完成
 * */
router.get('/recovery', function(req, res) {
    var id = req.query.id || '';
    id = id.split(',');

    if (!id.length) {
        res.responseData.code = 1;
        res.responseData.message = '缺少文件id';
        res.sendJSON();
        return;
    }

    File.update({
        _id: {$in: id}
    }, {
        isRecycleBin: false
    }, {
        multi: true
    }).then(function() {
        res.responseData.message = '还原成功';
        res.sendJSON();
    });
});


function checkAuth(req, res, next) {
    if (!req.userInfo._id) {
        res.responseData.code = -1;
        res.responseData.message = '你没有访问该接口的权限';
        res.sendJSON();
    } else {

        //数据初始化
        File.find({
            uid: req.userInfo._id
        }).then(function(result) {
            req.filesTree = new Tree(result);
            next();
        });

    }
}

module.exports = router;