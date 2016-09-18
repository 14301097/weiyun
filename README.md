# 基于nodejs + mongoose + jquery搭建的微云网盘demo
##简介:

###1.项目后端搭建:

使用nodejs完成网盘后台的搭建;</br>
使用mongoose完成对mongodb数据的操作以及构建;</br>

###2.项目前端搭建:

使用html及css编写网盘的结构及样式;</br>
部分使用了HTML5以及CSS3，可能会造成部分浏览器的不兼容;</br>
使用js原生完成网盘登陆首页的行为;</br>
通过ajax与后端交互实现用户的注册与登陆;</br>
使用jQuery完成网盘应用页面的前端JS脚本;</br>
通过ajax请求完成应用页面与后台的数据交互;</br>

###3.网站整体功能:

登陆首页

网站打开为登陆首页，需要登录或者注册并登录才能使用网盘应用功能。</br>
登陆首页同时也是微云产品介绍页面，有定点滚动效果，以及功能介绍的自动移入效果。</br>

网盘应用页

网盘应用页的使用需要登陆进入才能使用。</br>
登入后会保存用户信息cookies，再次打开免登录;</br>
文件的上传功能;</br>
新建文件夹功能；</br>
文件重命名；</br>
移动到；</br>
移动到回收站；</br>
显示文件夹树状目录；</br>
面包屑导航；</br>
自定义右键菜单；</br>
文件查看方式：</br>
  图标查看；</br>
  列表查看；</br>
文件操作：</br>
  点击文件夹进入；</br>
  单选/多选/全选/复选框选择；</br>
  拖拽文件夹移动；</br>


###4.效果演示

这是一个用js操作模拟数据的静态网页，包含了此项目大部分的操作功能，可以大致预览此项目的实际效果：</br>
<a href="https://sikychen.github.io/weiyun_demo/login.html">点我查看</a></br>

  
##运行需要安装:

安装node(https://nodejs.org/en/);</br>
安装express框架(npm install express -g);</br>
安装mongodb(https://www.mongodb.org/downloads#production)查看说明完成相关环境以及配置搭建;</br>

##运行与使用:

开启node app.js后台，默认是使用8888端口</br>
启动数据库mongod</br>


##项目结构:
```
├── models
│   ├── File.js
│   └── User.js
├── schemas
│   ├── file.js                                    文件数据结构
│   └── user.js                                  用户信息数据结构
├── Tools
│   └── tree.js                                   树形结构的方法
├── modules                                         路由目录
│   ├── api                                         api路由
│   └── main                                      普通用户路由
├── node_modules                                node模块目录
├── public                                        静态文件目录
│   ├── css                                         样式目录
│   │   ├── disk.css                        
│   │   ├── index.css                    
│   │   ├── base.css                   
│   │   └── reset.css              
│   ├── img                                    图片目录(文件夹)
│   │   ├── index                                          
│   │   └── login                                          
│   └── js                                        JS脚本目录
│   │   ├── disk.js
│   │   ├── index.js
│   │   ├── jquery.min.js
│   │   └── mTween2.js
├── app.js                                        项目入口文件
└── package.json                            项目所需模块以及配置信息
```
##后期完善:

回收站的进入以及回收站内文件的还原;</br>
文件下载功能;</br>
用户退出登录;</br>
按类型分类查看;</br>
不同文件类型的图标需完善;</br>
重命名成功时会提示失败的bug;</br>
优化项目代码。</br>
