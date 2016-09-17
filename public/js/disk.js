

$(function() {


    var WeiYun = {

        //接口列表
        API: {
            //获取当前目录下的一级子文件夹/文件
            getList: '/api/getList',
            //获取回收站中的数据
            getRecycleBinList: '/api/getRecycleBinList',
            //移动
            move: '/api/move',
            //面包屑导航
            crumbs: 'api/crumbs',
            //新建文件夹
            createFolder: 'api/createFolder',
            //重命名
            rename: 'api/rename',
            //移动到回收站
            moveToRecycleBin: 'api/moveToRecycleBin',
            //删除文件
            remove: 'api/remove',
            //上传文件
            upload: 'api/upload'
        },

        //获取元素
        element: {
            $uploadBtn: $('#uploadbtn'),
            $uploadMsg: $('#upload-msg'),
            $uploadName: $('#uploadname'),
            $movetoBtn: $('#moveto-btn'),
            $renameBtn: $('#rename-btn'),
            $renameIn: $('.rename-in'),
            $msgBg: $('.msg-bg'),
            $msgInfo: $('.msg-info'),
            $deleteMsg: $('#delete-msg'),
            $moveMsg: $('#move-msg'),
            $controlMsg: $('.control-msg'),
            $controlInfo: $('.control-info'),
            $deleteBtn: $('#delete-btn'),
            $newfileBtn: $('#newfile-btn'),
            $treeBtn: $('#tree-btn'),
            $howshowBtn: $('#howshow-btn'),
            $fileWrap: $('#file-wrap'),
            $recycleBinContainer: $('#recycleBinContainer'),
            $checkAllBtn: $('.checkall-btn'),
            $weiyunBtn: $('.weiyun-btn'),
            $breadCrumb: $('.breadcrumb'),
            $contextMenu: $('.contextmenu'),
            $fileItem: null
        },

        //当前所在目录的id
        currentId: '',

        //当前显示模式
        howShow: '',

        //当前所在目录的文件夹/文件个数
        currentCount: 0,

        //当前选中的个数
        currentCheckedCount: 0,

        //回收站
        recycleBinCount : 0,

        /*
         * 获取当前目录下的所有文件/文件夹，并显示在主区域中
         * */
        renderMainList: function() {
            $.ajax({
                url: this.API.getList,
                data: {
                    pid: this.currentId
                },
                dataType: 'json',
                success: function(result) {
                    if ( result.code || !result.data.length ) {
                        //如果出错或者没有数据
                        WeiYun.currentCount = 0;
                        WeiYun.element.$fileWrap.html('');
                        $('.g-empty').show();
                        WeiYun.showParentsTreeMenu();
                    } else {
                        WeiYun.currentCount = result.data.length;
                        WeiYun.element.$fileWrap.html('');
                        if(WeiYun.howShow == 'filelist') {
                            $(document).data('howShow$li', 'filelistback').data('howShow$div0', 'filelist');
                        }else {
                            $(document).data('howShow$li', 'fileitemback').data('howShow$div0', '');
                        }
                        for (var i=0; i<result.data.length; i++) {

                            var $li = $('<li>').addClass($(document).data('howShow$li')).appendTo(WeiYun.element.$fileWrap);
                            var $div0 = $('<div>').attr('_id', result.data[i]._id).attr('_type', result.data[i].type).addClass('fileitem').addClass($(document).data('howShow$div0')).appendTo($li);
                            var $span = $('<span>').addClass('check_icon').appendTo($div0);
                            var $div1 = $('<div>').addClass('icon').appendTo($div0);
                            if (result.data[i].mimetype.indexOf('image') != -1) {
                                var $img = $('<img>').attr('src', '/' + result.data[i].path).css({
                                    width: '100%',
                                    height: '100%',
                                    background: 'white'
                                }).appendTo($div1);
                            }

                            var $div2 = $('<div>').html(result.data[i].name).addClass('name').appendTo($div0);
                            if(WeiYun.howShow == 'filelist') {
                                var ct = result.data[i].createTime;
                                console.dir(ct)
                                // var t = ct.getFullYear() + '-' + (ct.getMonth() + 1) + '-' + ct.getData() + ' ' + ct.getHours() + ':' + ct.getMinutes() + ':' + ct.getSeconds();
                                var $div3 = $('<div>').html(ct).addClass('createtime').appendTo($div0);
                            }

                        }
                        WeiYun.element.$fileItem = $('.fileitem');
                        $('.g-empty').hide();
                        WeiYun.showParentsTreeMenu();
                    }

                },
                error: function() {
                    $('.g-empty').show();
                }
            });
        },

        /*
         * 获取指定目录下的所有文件夹，并显示在指定位置
         * */
        renderTreeList: function(id, showArea) {
            $.ajax({
                url: this.API.getList,
                data: {
                    pid: id
                },
                dataType: 'json',
                success: function(result) {
                    if ( result.code || !result.data.length ) {
                        //如果出错或者没有数据
                        showArea.html('');
                    } else {
                        showArea.html('');
                        if($('i', showArea.parent())) {
                            $('i', showArea.parent()).addClass('closed-icon');
                            $('header', showArea.parent()).attr('hasChild', true);
                        }
                        for (var i=0; i<result.data.length; i++) {
                            //如果是文件夹才显示
                            if( result.data[i].type ) {

                                var $li = $('<li>').addClass('treeitem').appendTo(showArea);
                                var $header = $('<header>').attr('_id', result.data[i]._id).attr('_type', result.data[i].type).addClass('header').html(result.data[i].name).appendTo($li);
                                var $ul = $('<ul>').addClass('listContent').appendTo($li);
                                var $i = $('<i>').appendTo($li);
                                WeiYun.renderTreeList(result.data[i]._id, $ul);

                            }

                        }
                    }

                },
                error: function() {
                    showArea.html('');
                }
            });
        },

        /*
         * 回收站
         * */
        renderRecycleBinList: function() {
            $.ajax({
                url: this.API.getRecycleBinList,
                dataType: 'json',
                success: function(result) {

                    if ( result.code || !result.data.length ) {
                        //如果出错或者没有数据
                        WeiYun.recycleBinCount = 0;
                        WeiYun.element.$recycleBinContainer.find('.g-empty').show();
                    } else {
                        WeiYun.recycleBinCount = result.data.length;
                        var html = '';
                        for (var i=0; i<result.data.length; i++) {

                            html += `<li _id="${result.data[i]._id}" class="item folder">
            <span class="check_icon"></span>
            <div class="icon"></div>
            <div class="name">${result.data[i].name}</div>
        </li>`;

                        }
                        WeiYun.element.$recycleBinContainer.html(html);
                    }

                },
                error: function() {
                    WeiYun.element.$recycleBinContainer.find('.g-empty').show();
                }
            })
        },

        //上传文件
        upload: function() {
            // $.ajax({
            //     type: 'POST',
            //     url: this.API.upload,
            //     data: {
            //         pid: this.currentId
            //     },
            //     dataType: 'json',
            //     start: function() {
            //         $('#progressText').html('0%').show;
            //         $('#progressBg').css({
            //             width: 0
            //         });
            //     },
            //     success: function(result) {
            //         console.log('result.message');
            //     }
            // });
            //由于jq没有onprogress属性，使用原生ajax方法
            var xhr = new XMLHttpRequest();

            xhr.open('post', '/api/upload', true);

            xhr.upload.onloadstart = function() {
                $('#progressBar').show();
                $('#progressText').html('0%');
                $('#progressBg').css({
                    width: 0
                });
                console.log(111)
                $('.ok-btn', WeiYun.element.$uploadMsg).hide();
            }

            xhr.upload.onprogress = function(e) {

                var n = e.loaded / e.total;

                //toFixed保留指定位数的小数点
                $('#progressText').html((n * 100).toFixed(2) + '%');
                $('#progressBg').css({
                    width: 300 * n
                });
            }

            xhr.onload = function() {
                console.log(this.responseText)
                $('#progressText').html('上传成功');
                $('#progressBg').css({
                    width: 300
                });
                setTimeout(function(){
                    $('#progressBar').hide();
                    WeiYun.hideMsgBg();
                    $('.ok-btn', WeiYun.element.$uploadMsg).show();
                    WeiYun.renderMainList();
                }, 1000);
            }

            var fd = new FormData();
            fd.append('file', WeiYun.element.$uploadBtn[0].files[0]);
            fd.append('pid', WeiYun.currentId);

            xhr.send(fd);
        },

        //新建文件夹
        createFolder: function(name, callback) {
            $.ajax({
                type: 'POST',
                url: this.API.createFolder,
                data: {
                    name: name,
                    pid: this.currentId
                },
                dataType: 'json',
                success: function(result) {
                    if( result.code ) {
                        WeiYun.controlMsgAnimate(false, '文件夹名有冲突，请重新命名');
                    }else {
                        WeiYun.controlMsgAnimate(true, '新建文件夹成功');
                        WeiYun.renderMainList();
                        WeiYun.renderTreeList(null, $('.listContent', '.tree-menu'));
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                }
            });
        },

        //重命名
        rename: function(id, name, callback) {
            $.ajax({
                url: this.API.rename,
                data: {
                    id: id,
                    name: name
                },
                dataType: 'json',
                success: function(result) {
                    console.log(result);
                    if( result.code ) {
                        WeiYun.controlMsgAnimate(false, '文件夹名有冲突，请重新命名');
                    }else {
                        // WeiYun.renderMainList();
                        WeiYun.renderTreeList(null, $('.listContent', '.tree-menu'));
                        WeiYun.controlMsgAnimate(true, result.message);
                    }
                    if(typeof callback == 'function') {
                        callback( result.code );
                    }
                }
            });
        },

        //移动到回收站
        moveToRecycleBin: function(id) {
            $.ajax({
                url: this.API.moveToRecycleBin,
                data: {
                    id: id,
                },
                dataType: 'json',
                success: function(result) {
                    console.log(result);
                    WeiYun.renderMainList();
                    WeiYun.renderTreeList(null, $('.listContent', '.tree-menu'));
                    WeiYun.controlMsgAnimate(true, '删除文件成功');
                }
            });
        },

        //删除文件
        remove: function(id) {
            $.ajax({
                url: this.API.remove,
                data: {
                    id: id,
                },
                dataType: 'json',
                success: function(result) {
                    console.log(result);
                    WeiYun.renderMainList();
                    WeiYun.renderTreeList(null, $('.listContent', '.tree-menu'));
                    WeiYun.controlMsgAnimate(true, '删除文件成功');
                }
            });
        },

        //移动
        move: function(checkedId, targetId) {
            $.ajax({
                type: 'POST',
                url: this.API.move,
                data: {
                    checkedId: checkedId.join(','),
                    targetId: targetId
                },
                dataType: 'json',
                success: function(result) {
                    WeiYun.renderMainList();
                    WeiYun.renderTreeList(null, $('.listContent', '.tree-menu'));
                }
            });
        },

        //面包屑导航
        crumbs: function() {
            $.ajax({
                url: this.API.crumbs,
                data: {
                    id: this.currentId
                },
                dataType: 'json',
                success: function(result) {
                    WeiYun.element.$breadCrumb.html('');
                    var parentsData = result.data;
                    for(var i = 0; i < parentsData.length; i++) {
                        var $a = $('<a href="javascirpt:;">').attr('_id', parentsData[i]._id).appendTo(WeiYun.element.$breadCrumb);
                        $a.html(parentsData[i].name);
                    }
                }
            });
        },

        /*
         * 改变某个元素的选中状态
         * @param fileElement [element object] 要设置状态的元素
         * @param status [boolaen] 表示状态，true为设置为选中，false设置为未选中
         */
        setStatus: function(fileEle, status) {
            fileEle.data('_isChecked', status);
            status ? fileEle.addClass('checked') : fileEle.removeClass('checked');
        },

        /*
         * 在树状菜单中，打开当前文件夹的所有父级目录
         */
        showParentsTreeMenu: function() {
            $('header', '.tree-menu').each(function() {
                if($(this).attr('_id') == WeiYun.currentId) {
                    $('header', '.tree-menu').removeClass('checked');
                    $(this).addClass('checked');
                    $('.listContent:first', $(this).parent()).show();

                    $(this).parents().each(function(){
                        if($(this).hasClass('listContent')) {
                            $(this).show();
                            $('.closed-icon', $(this).parent()).addClass('opened-icon');
                        }
                    })
                }
            })
        },

        /*
         * 获取当前选中的文件元素
         */
        getcurrentCheckedElements: function() {

            WeiYun.currentCheckedElements = [];
            WeiYun.element.$fileItem.each( function(){
                if( $(this).data('_isChecked') ) {
                    WeiYun.currentCheckedElements.push( $(this) );
                }
            });

            return WeiYun.currentCheckedElements;
        },

        /*
         * 获取当前选中文件的id
         */
        getcurrentCheckedIds: function() {

            WeiYun.currentCheckedIds = [];
            WeiYun.element.$fileItem.each( function(){
                if( $(this).data('_isChecked') ) {
                    WeiYun.currentCheckedIds.push( $(this).attr('_id') );
                }
            });

            return WeiYun.currentCheckedIds;
        },

        /*
         * 获取当前选中文件数量
         */
        getcurrentCheckedCount: function() {

            WeiYun.currentCheckedCount = 0;
            WeiYun.element.$fileItem.each( function(){
                if( $(this).data('_isChecked') ) {
                    WeiYun.currentCheckedCount++;
                }
            });

            return WeiYun.currentCheckedCount;
        },
        /*
         * 并设定全选按钮的选中状态
         */
        setCheckAllBtn: function() {

            if ( WeiYun.getcurrentCheckedCount() == WeiYun.currentCount && WeiYun.currentCount) {
                WeiYun.setStatus(WeiYun.element.$checkAllBtn, true);
            } else {
                WeiYun.setStatus(WeiYun.element.$checkAllBtn, false);
            }
        },
        /**
         * 顶部操作提示框
         */
        controlMsgAnimate: function(isSuccess, html) {
            aclass = isSuccess ? 'success' : 'fail';
            WeiYun.element.$controlInfo.html(html);
            WeiYun.element.$controlMsg.addClass(aclass).css('margin-left', - WeiYun.element.$controlMsg.width() / 2).animate({
                top: 0
            }, 400, function() {
                setTimeout(function(){
                    WeiYun.element.$controlMsg.animate({
                        top: -WeiYun.element.$controlMsg.height()
                    }, 400, function(){
                        WeiYun.element.$controlMsg.removeClass(aclass);
                    });
                }, 1500);
            });
        },

        /**
         * 隐藏提示框
         */
        hideMsgBg: function() {
            WeiYun.element.$msgBg.hide();
            WeiYun.element.$deleteMsg.hide();
            WeiYun.element.$moveMsg.hide();
            WeiYun.element.$uploadMsg.hide();
        },

        /**
         * 隐藏右键菜单
         */
        hideContextMenu: function(ev) {
            if( ev.which == 1 ) {
                WeiYun.element.$contextMenu.removeClass('show').hide();
            }
        },

        /**
         * 阻止冒泡
         */
        stopPropagation: function(ev) {
            WeiYun.hideContextMenu(ev);
            ev.stopPropagation();
        }
    }


    /*
     * 初始化
     */
    //渲染主区域列表
    WeiYun.renderMainList();
    //渲染回收站
    WeiYun.renderRecycleBinList();
    //渲染树状菜单
    WeiYun.renderTreeList(null, $('.listContent', '.tree-menu'));

    /*
     * 绑定事件
     */

    //上传文件
    WeiYun.element.$uploadBtn.on('change', function() {
        if( WeiYun.element.$uploadBtn.val() ) {
            WeiYun.element.$msgBg.show();
            WeiYun.element.$uploadMsg.show();
            var uploadFileName = WeiYun.element.$uploadBtn.val().split('\\');
            WeiYun.element.$uploadName.html(uploadFileName[uploadFileName.length - 1]);
        }
    });
    $('.ok-btn', WeiYun.element.$uploadMsg).on('click', WeiYun.upload);
    $('.close-btn', WeiYun.element.$uploadMsg).on('click', WeiYun.hideMsgBg);
    $('.cancle-btn', WeiYun.element.$uploadMsg).on('click', WeiYun.hideMsgBg);

    //移动到
    WeiYun.movetoFun = function(ev) {
        if( WeiYun.getcurrentCheckedCount() ) {
            WeiYun.element.$msgBg.show();
            WeiYun.element.$moveMsg.show();
            WeiYun.element.$msgInfo.show();
            WeiYun.renderTreeList(null, $('ul', WeiYun.element.$msgInfo));
        }else {
            WeiYun.controlMsgAnimate(false, '请选择文件')
        }
        ev.stopPropagation();
    }

    $('#context-moveto').on('mousedown', WeiYun.movetoFun).on('mousedown mousemove mouseup', WeiYun.stopPropagation);
    
    WeiYun.element.$movetoBtn.on('click', WeiYun.movetoFun).on('mousedown mousemove mouseup', WeiYun.stopPropagation);

    WeiYun.element.$msgInfo.delegate('.header', 'click', function() {
        console.log($(this).attr('_id'));
        $('.header', WeiYun.element.$msgInfo).each(function() {
            $(this).removeClass('checked');
        });
        $(this).addClass('checked');
        WeiYun.element.$msgInfo.data('targetId', $(this).attr('_id'));
    }).on('mousedown mousemove mouseup', WeiYun.stopPropagation);
    WeiYun.element.$msgInfo.delegate('.closed-icon', 'click', function() {
        if( $(this).hasClass('closed-icon') ) {
            if( $(this).hasClass('opened-icon') ) {
                $('.listContent:first', $(this).parent()).hide();
                $(this).removeClass('opened-icon');
            }else {
                $('.listContent:first', this.parentNode).show();
                $(this).addClass('opened-icon');
            }
        }
    }).on('mousedown mousemove mouseup', WeiYun.stopPropagation);
    $('.ok-btn', WeiYun.element.$moveMsg).on('click', function() {

        var checkedIds = WeiYun.getcurrentCheckedIds();
        var targetId = WeiYun.element.$msgInfo.data('targetId');

        console.log( checkedIds)
        if (targetId && checkedIds.length && checkedIds.indexOf(targetId) == -1 ) {
            WeiYun.move(checkedIds, targetId);
            WeiYun.hideMsgBg();
        }

    });
    $('.close-btn', WeiYun.element.$moveMsg).on('click', WeiYun.hideMsgBg);
    $('.cancle-btn', WeiYun.element.$moveMsg).on('click', WeiYun.hideMsgBg);

    //重命名
    WeiYun.reNameFun = function() {
        if( WeiYun.getcurrentCheckedCount() == 1 ) {
            $('.name', WeiYun.getcurrentCheckedElements()[0]).hide();
            WeiYun.element.$renameIn.appendTo(WeiYun.getcurrentCheckedElements()[0]).val($('.name', WeiYun.getcurrentCheckedElements()[0]).html()).on('keydown', function(ev) {
                if( ev.keyCode == 13 && $(this).val() != '' ) {
                    WeiYun.rename( WeiYun.getcurrentCheckedElements()[0].attr('_id'), $(this).val(), function( code ){
                        if( !code ) {
                            $('.name', WeiYun.getcurrentCheckedElements()[0]).html(WeiYun.element.$renameIn.val()).show();
                            WeiYun.element.$renameIn.html('').hide();
                        }

                    });
                }else if( ev.keyCode == 13 && $(this).val() == '' ){
                    WeiYun.controlMsgAnimate(false, '文件名不能为空，请重新命名')
                }else if( ev.keyCode == 27 ){
                    $(this).hide();
                    $('.name', WeiYun.getcurrentCheckedElements()[0]).show();
                }
            }).show().focus();

        }else if( WeiYun.getcurrentCheckedCount() == 0 ){
            WeiYun.controlMsgAnimate(false, '请选择文件')
        }else if( WeiYun.getcurrentCheckedCount() > 1 ){
            WeiYun.controlMsgAnimate(false, '只能对单个文件重命名')
        }
    }
    WeiYun.element.$renameBtn.on('click', WeiYun.reNameFun).on('click mousedown mousemove mouseup', WeiYun.stopPropagation);
    $('#context-rename').on('mousedown', WeiYun.reNameFun).on('click mousedown mousemove mouseup', WeiYun.stopPropagation);
    
    //移动到回收站
    WeiYun.deleteFun = function(ev) {
        if( WeiYun.getcurrentCheckedCount() ) {
            WeiYun.element.$msgBg.show();
            WeiYun.element.$deleteMsg.show();
        }else {
            WeiYun.controlMsgAnimate(false, '请选择文件')
        }
        ev.stopPropagation();
    }
    WeiYun.element.$deleteBtn.on('click', WeiYun.deleteFun).on('mousedown mousemove mouseup', WeiYun.stopPropagation);
    $('#context-delet').on('mousedown', WeiYun.deleteFun).on('mousedown mousemove mouseup', WeiYun.stopPropagation);

    $('.ok-btn', WeiYun.element.$deleteMsg).on('click', function() {
        WeiYun.moveToRecycleBin(WeiYun.getcurrentCheckedIds().join(","));
        WeiYun.hideMsgBg();
    });
    $('.close-btn', WeiYun.element.$deleteMsg).on('click', WeiYun.hideMsgBg);
    $('.cancle-btn', WeiYun.element.$deleteMsg).on('click', WeiYun.hideMsgBg);
    WeiYun.element.$msgBg.on('click mousedown mousemove mouseup', function(ev) {
        WeiYun.stopPropagation(ev);
        return false;
    });

    //创建文件夹
    WeiYun.element.$newfileBtn.on('click', function() {
        var $li = $('<li>').addClass('fileitemback').prependTo(WeiYun.element.$fileWrap);
        WeiYun.element.$newfileBtn.data('$li', $li);
        var $div0 = $('<div>').addClass('fileitem').appendTo($li);
        var $div1 = $('<div>').addClass('icon').appendTo($div0);
        var $input = $('<input type="text" />').appendTo($div0).show().focus().on('keydown', function(ev) {
            if( ev.keyCode == 13 ) {
                WeiYun.createFolder($input.val(), function(){
                    $li.html('').remove();
                });
            }else if( ev.keyCode == 27 ){
                $li.html('').remove();
            }
        }).on('click mousedown mouseup', WeiYun.stopPropagation);
    });

    //显示树状菜单
    WeiYun.element.$treeBtn.on('click', function(ev) {
        if( $('.tree-menu').width() == 0 ) {
            $('.tree-menu').addClass('tree-menu-show');
            $('.wrap-r').addClass('wrap-r-ml');
            $('.listContent:first', '.tree-menu').show();
            WeiYun.showParentsTreeMenu();
        }else {
            $('.tree-menu').removeClass('tree-menu-show');
            $('.wrap-r').removeClass('wrap-r-ml');
        }
    }).on('mousedown mousemove mouseup', WeiYun.stopPropagation);
        //点击名字，在主区域显示此文件夹的内容
    $('.tree-menu').delegate('.header', 'click', function() {
        WeiYun.currentId = $(this).attr('_id');
        WeiYun.crumbs();
        WeiYun.renderMainList();
    }).on('mousedown mousemove mouseup', WeiYun.stopPropagation);
        //点击icon打开或者关闭此文件夹的目录树
    $('.tree-menu').delegate('i', 'click', function() {
        if( $(this).hasClass('closed-icon') ) {
            if( $(this).hasClass('opened-icon') ) {
                $('.listContent:first', $(this).parent()).hide();
                $(this).removeClass('opened-icon');
            }else {
                $('.listContent:first', this.parentNode).show();
                $(this).addClass('opened-icon');
            }
        }
    }).on('mousedown mousemove mouseup', WeiYun.stopPropagation);

    //显示模式切换
    WeiYun.element.$howshowBtn.on('click', function(ev) {
        if( WeiYun.howShow == '' ) {
            WeiYun.howShow = 'filelist';
        }else {
            WeiYun.howShow = '';
        }
        WeiYun.renderMainList();
        ev.stopPropagation();
    }).on('mousedown mousemove mouseup', WeiYun.stopPropagation);


    //面包屑导航——点击任意父级，回到该层
    WeiYun.element.$breadCrumb.delegate('a', 'click', function() {
        WeiYun.currentId = $(this).attr('_id');
        WeiYun.crumbs();
        WeiYun.renderMainList();
    });

    //面包屑导航——点击微云按钮，回到顶层
    WeiYun.element.$weiyunBtn.on('click', function() {
        WeiYun.currentId = '';
        WeiYun.element.$breadCrumb.html('');
        WeiYun.renderMainList();
    })
    WeiYun.element.$weiyunBtn.parent().delegate('.weiyun-btn', 'mousedown mouseup', WeiYun.stopPropagation);

    //全选按钮的点击事件
    WeiYun.element.$checkAllBtn.on('click', function(ev){
        //点击改变自己的选中状态
        WeiYun.setStatus($(this), !$(this).data('_isChecked'));
        //点击改变住区域中所有文件的选中状态
        WeiYun.setStatus(WeiYun.element.$fileItem, $(this).data('_isChecked'));
        // WeiYun.currentCheckedCount = $(this).data('_isChecked') ? WeiYun.currentCount : 0;

        ev.stopPropagation();
        return false;
    });
    WeiYun.element.$checkAllBtn.parent().delegate('.checkall-btn', 'mousedown mouseup', WeiYun.stopPropagation);

    //处理主区域的文件选中和取消
    //用delegate为一个$fileWrap元素下的所有check_icon元素 绑定click事件
    WeiYun.element.$fileWrap.delegate('.fileitem .check_icon', 'click', function() {

        if ( $(this).parent().data('_isChecked') ) {
            WeiYun.setStatus($(this).parent(), false);
            // WeiYun.currentCheckedCount--;
        } else {
            WeiYun.setStatus($(this).parent(), true);
            // WeiYun.currentCheckedCount++;
        }

        WeiYun.setCheckAllBtn();

    });

    //阻止冒泡
    WeiYun.element.$fileWrap.delegate('.fileitem .check_icon', 'click mousedown mouseup', WeiYun.stopPropagation);
    WeiYun.element.$fileWrap.delegate('.fileitem', 'click mousedown', WeiYun.stopPropagation);
    $('input', $(document)).on('click mousedown mousemove mouseup', WeiYun.stopPropagation);

    //拖拽选择/扩选框
    $(document).on('mousedown', function(ev) {
        $(document).data('selectbox', true);
        $(document).data('isDown', true);
        $(document).data('mouseX', ev.clientX);
        $(document).data('mouseY', ev.clientY);

        return false;
    });
    //拖拽文件
    WeiYun.element.$fileWrap.delegate('.fileitem', 'mousedown', function(ev) {
        $(document).data('isDown', true);
        $(document).data('mouseX', ev.clientX);
        $(document).data('mouseY', ev.clientY);
        $(document).data('element', $(this));

        ev.stopPropagation();
        return false;
    });
    //鼠标移动
    $(document).on('mousemove', function(ev) {
        //如果是拖拽文件，不是扩选框时
        if ($(document).data('isDown')) {
            if (!$(document).data('selectbox') && ( Math.abs(ev.clientX - $(document).data('mouseX')) > 10 || Math.abs(ev.clientY - $(document).data('mouseY')) > 10 )) {
                $(document).data('isMove', true);

                if (!$(document).data('element').data('_isChecked')) {
                    //若按下的文件未选中，则选中此文件，
                    //取消选中其它文件
                    WeiYun.setStatus(WeiYun.element.$fileItem, false);
                    //选中此文件
                    WeiYun.setStatus($(document).data('element'), true);
                    // WeiYun.currentCheckedCount = 1;$('.fileitem')
                }

                $('.drag_wrap').show();
                $('.drag_wrap .num').html(WeiYun.getcurrentCheckedCount());
                $('.drag_wrap .drag').html('');
                for (var i = 0; i < WeiYun.currentCheckedCount && i < 5; i++) {
                    $('<li>').addClass('dragico').css({
                        left: 5 * (i + 1),
                        top: 5 * (i + 1),
                        zIndex: 5 - i
                    }).appendTo($('.drag_wrap .drag'))
                }

                $('.drag_wrap').css({
                    left: ev.clientX + 20,
                    top: ev.clientY + 20
                });

                WeiYun.element.$fileItem.on('mousemove', function(){
                    if( !$(this).data('_isChecked') && $(document).data('isMove') )
                    {
                        $(this).addClass('movehover');
                    }
                });
                WeiYun.element.$fileItem.on('mouseout', function(){
                    if( !$(this).data('_isChecked') && $(document).data('isMove') )
                    {
                        $(this).removeClass('movehover');
                    }
                });

            }


            //如果是拖拽选择/扩选框
            if ($(document).data('selectbox') && ( Math.abs(ev.clientX - $(document).data('mouseX')) > 10 || Math.abs(ev.clientY - $(document).data('mouseY')) > 10 )) {
                $(document).data('isSelectboxMove', true);
                //确定扩选框的top和left值
                $('.selectbox').data('top', (ev.clientY > $(document).data('mouseY') ?
                        $(document).data('mouseY') : ev.clientY));
                $('.selectbox').data('left', (ev.clientX > $(document).data('mouseX') ?
                        $(document).data('mouseX') : ev.clientX));

                //设定扩选框的盒模型
                $('.selectbox').css({
                    top: $('.selectbox').data('top'),
                    left: $('.selectbox').data('left'),
                    height: Math.abs(ev.clientY - $(document).data('mouseY')),
                    width: Math.abs(ev.clientX - $(document).data('mouseX'))
                }).show();

                //碰撞检测(九宫格)
                if( WeiYun.element.$fileItem ) {
                    WeiYun.element.$fileItem.each( function(){
                        var thisOffset = $(this).offset();
                        var selectOffset = $('.selectbox').offset();

                        if( thisOffset.left > selectOffset.left + $('.selectbox').width()
                            || thisOffset.top > selectOffset.top + $('.selectbox').height()
                            || thisOffset.left + $(this).width() < selectOffset.left
                            || thisOffset.top + $(this).height() < selectOffset.top )
                        {
                            //取消选中其它文件
                            if( !ev.ctrlKey ) {
                                // WeiYun.setStatus($('.checkall-btn'), false);
                                WeiYun.setStatus($(this), false);
                                WeiYun.setCheckAllBtn();
                            }
                        }else {
                            //选中此文件
                            WeiYun.setStatus($(this), true);
                            WeiYun.setCheckAllBtn();
                        }
                    });
                }
            }
        }
    });
    $(document).on('mouseup', function(ev) {
        //当左键点击一个文件时，要如何处理
        if ($(document).data('isDown') && !$(document).data('selectbox') && !$(document).data('isMove') && ev.which == 1) {
            //若是一个文件夹
            if( $(document).data('element').attr('_type') == 'true' ) {
                WeiYun.currentId = $(document).data('element').attr('_id');

                WeiYun.crumbs();

                WeiYun.renderMainList();
            }
            //若不是一个文件夹

        }
        //当点击空白区域时
        if( WeiYun.element.$fileItem && $(document).data('selectbox') && !$(document).data('isSelectboxMove')) {
            WeiYun.setStatus(WeiYun.element.$fileItem, false);
            WeiYun.setCheckAllBtn();
        }

        //取消掉新建
        if( WeiYun.element.$newfileBtn.data('$li') ) {
            WeiYun.element.$newfileBtn.data('$li').html('').remove();
        }
        //取消掉重命名
        if( $(document).data('isDown') ) {
            WeiYun.element.$renameIn.hide();
            $('.name', WeiYun.getcurrentCheckedElements()[0]).show();
        }


        $(document).data('isSelectboxMove', false);
        $(document).data('isMove', false);
        $(document).data('isDown', false);
        $(document).data('selectbox', false);
        $('.selectbox').hide();

        $('.drag_wrap').hide();

    });

    WeiYun.element.$fileWrap.delegate('.fileitem', 'mouseup', function() {
        //拖拽了哪些，目标是谁
        if ($(document).data('isMove')) {
            var checkedId = [];

            WeiYun.element.$fileItem.each(function() {
                if ($(this).data('_isChecked')) {
                    checkedId.push( $(this).attr('_id') );
                }
            })

            var targetId = $(this).attr('_id');
            console.log($(this).attr('_type'))

            if (targetId && checkedId.length && checkedId.indexOf(targetId) == -1 && $(this).attr('_type') == 'true') {
                WeiYun.move(checkedId, targetId);
                // WeiYun.renderMainList();
            }
        }
    });

    //右键菜单
        //禁用右键默认行为
    $(document).bind("contextmenu", function(ev){
        return false;
    }).on('mousedown',WeiYun.hideContextMenu);

    WeiYun.element.$fileWrap.delegate('.fileitem', 'mousedown', function(ev) {
        if( ev.which == 3 ) {
            //取消选中其它文件
            WeiYun.setStatus(WeiYun.element.$fileItem, false);
            //选中此文件
            WeiYun.setStatus($(document).data('element'), true);

            WeiYun.element.$contextMenu.css({
                top: ev.clientY + 10,
                left: ev.clientX + 10
            }).addClass('show').show();
        }
    });

});
