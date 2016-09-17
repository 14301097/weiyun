/*
 * 选项卡
 * @param btns(event) 选项卡的按钮集
 * @param divs(event) 选项卡的内容集
 */
var ChangeTab = function(btns, divs) {
	this.btns = btns;
	this.divs = divs;
	
	this.init();
	this.bindEvents();
}

//初始化
ChangeTab.prototype.init = function() {
	for (var i = 0; i < this.btns.length; i++) {
		this.btns[i].oldClass = this.btns[i].className;
		this.divs[i].oldClass = this.divs[i].className;
	}
	this.btns[0].className += ' checked';
	this.divs[0].className += ' show';
}

//绑定事件
ChangeTab.prototype.bindEvents = function() {
	var that = this;
	for (var i = 0; i < this.btns.length; i++) {
		this.btns[i].index = i;
		this.btns[i].addEventListener('click', function() {
			
			for (var j = 0; j < that.btns.length; j++) {
				that.btns[j].className = that.btns[j].oldClass;
				that.divs[j].className = that.divs[j].oldClass;
			}
			
			that.btns[this.index].className += ' checked';
			that.divs[this.index].className += ' show';
			
		});
	}
}


/*
 * 轮播图
 * @param box(event) 显示和限制轮播图的盒子
 * @param ul(event) 盒子的子元素，被移动的元素
 * @param lis(arr) 包含图片的元素的集合
 * @param times(num) 图片轮播的间隔时间
 * @param duration(num) 切换一张图片所用时间
 * @param fx(string) 运动方式
 */
var AutoImg = function(box, ul, lis, times, duration, fx, callback) {
	
	this.bannerBox = box;
	this.bannerList = ul;
	this.bannerItems = lis;
	this.beginLeft = this.bannerList.offsetLeft;
	this.duration = duration;
	this.fx = fx;
	this.callback = callback;
	
	this.timer = null;
	this.num = 0;
	this.windowWidth = window.innerWidth;
	this.times = times;
	
	this.bindEvents();
	this.init();
}

//初始化 重绘结构
AutoImg.prototype.init = function() {
	for (var i = 0; i < this.bannerItems.length; i++) {
		this.bannerItems[i].style.left = i * this.windowWidth + 'px';
		this.bannerItems[i].style.width = this.windowWidth + 'px';
	}
	this.autoPlay();
}

//绑定事件
AutoImg.prototype.bindEvents = function() {
	var that = this;
	//鼠标移入停止
	this.bannerBox.addEventListener('mouseover', function() {
		clearInterval(that.timer);
	});
	//鼠标移出开始
	this.bannerBox.addEventListener('mouseout', function() {
		that.autoPlay();
	});
}

//自动轮播
AutoImg.prototype.autoPlay = function() {
	var that = this;
	//定时器自动播放
	this.timer = setInterval(function() {
		that.num++;
		that.num %= that.bannerItems.length;
		if( that.num == 0 ) {
			that.bannerList.style.left = that.beginLeft + 'px';
			that.num = 1;
		}
		that.move();
	},that.times);
}
	
//运动函数
AutoImg.prototype.move = function() {
	mTween(this.bannerList, 'left', - this.windowWidth * this.num , this.duration, this.fx, this.callback);
}


/*
 * 点击滚动到页面指定位置
 * @param obj(ele) 点击哪一个元素跳转
 * @param targetEle(ele) 跳转到的目标位置
 * @param duration(num) 跳转到的目标位置所需时间
 * @param fx(str) 滚动速度模式
 */
var AutoScroll = function(obj, targetEle, duration, fx) {
	this.obj = obj;
	this.targetEle = targetEle;
	this.duration = duration;
	this.fx = fx;

	this.bindEvents();
}

//绑定事件
AutoScroll.prototype.bindEvents = function() {
	var that = this;
	//点击obj元素时，跳转到target元素位置
	this.obj.addEventListener('click', function() {
		that.target = that.getTargetBoundTop(that.targetEle);
		that.move();
	});
}

//获取targetEle距离页面可见区域顶部距离
AutoScroll.prototype.getTargetBoundTop = function() {
	return this.targetEle.getBoundingClientRect().top;
}

//运动函数
AutoScroll.prototype.move = function() {
	sTween(document.body, 'scrollTop', this.target, this.duration, this.fx);
}



/*
 * 页面滚到指定节点，触发移入动画，和aside的hover效果
 * @param option(object) 滚动到指定的节点
 * 
 */
var ScrollCarton = function() {
	
	this.dlT = getEleBoundTop($('#download'));
	this.funT = getEleBoundTop($('#fun_introduce'));
	this.feaT =  getEleBoundTop($('#feature_intro'));
	
	this.asideNav = $('#aside_nav');
	this.lis = $('li', this.asideNav);
	
	this.init();
	this.getData();
	this.bindEvents();
}

//初始化
ScrollCarton.prototype.init = function() {
	for (var i = 0; i < this.lis.length; i++) {
		this.lis[i].oldClass = this.lis[i].className;
	}
	this.setClassHover(asideIndex);
}

//获取数据
ScrollCarton.prototype.getData = function() {
		
	this.funa = $('#fun_intro_a');
	this.funb = $('#fun_intro_b');
	this.func = $('#fun_intro_c');
	this.fund = $('#fun_intro_d');
	this.fune = $('#fun_intro_e');
	
	this.funaT = getEleBoundTop(this.funa);
	this.funbT = getEleBoundTop(this.funb);
	this.funcT = getEleBoundTop(this.func);
	this.fundT = getEleBoundTop(this.fund);
	this.funeT = getEleBoundTop(this.fune);
	
}

//绑定事件
//hover效果实现
ScrollCarton.prototype.bindEvents = function() {
	var that = this;
	//aside的hover效果
	window.addEventListener('scroll', function() {
		
		var sT = document.body.scrollTop;
		var wH = window.innerHeight;
		
		if(sT<that.dlT) {
			that.setClassHover(asideIndex);
		} else 
		if(that.dlT-10<sT && sT<that.funT) {
			that.setClassHover(asideIownload);
		} else 
		if(that.funT-10<sT && sT<that.feaT) {
			that.setClassHover(asideFun_intro);
		} else 
		if(that.feaT-10<sT) {
			that.setClassHover(asideVip);
		} 
		
	});
	//页面滚动啊到功能介绍部分时，触发动画效果
	window.addEventListener('scroll', function() {
		
		var sT = document.body.scrollTop;
		var wH = window.innerHeight;
		
		if( sT >= that.funaT - (wH*3/4) && !that.funa.onOff ) {
			that.moveWordImgIn($('.icon_bg', that.funa), 'left');
			that.moveImgIn($('img', that.funa)[0]);
			that.funa.onOff = true;
		} else if( sT >= that.funbT - (wH*3/4) && !that.funb.onOff ) {
			that.moveWordImgIn($('.icon_bg', that.funb), 'right');
			that.moveImgIn($('img', that.funb)[0]);
			that.funb.onOff = true;
		} else if( sT >= that.funcT - (wH*3/4) && !that.func.onOff ) {
			that.moveWordImgIn($('.icon_bg', that.func), 'left');
			that.moveImgIn($('img', that.func)[0]);
			that.func.onOff = true;
		} else if( sT >= that.fundT - (wH*3/4) && !that.fund.onOff ) {
			that.moveWordImgIn($('.icon_bg', that.fund), 'right');
			that.moveImgIn($('img', that.fund)[0]);
			that.fund.onOff = true;
		} else if( sT >= that.funeT - (wH*3/4) && !that.fune.onOff ) {
			that.moveWordImgIn($('.icon_bg', that.fune), 'left');
			that.moveImgIn($('img', that.fune)[0]);
			that.fune.onOff = true;
		}
		
	});
}

//渲染数据
//方法setclasshover
ScrollCarton.prototype.setClassHover = function(obj) {
	for (var i = 0; i < this.lis.length; i++) {
		this.lis[i].className = this.lis[i].oldClass;
	}
	obj.className += " hover";
}

//渲染数据
//方法 图片移入的动画
ScrollCarton.prototype.moveImgIn = function(obj) {
	mTween(obj, 'top', 40, 800, 'easeBoth');
}
//渲染数据
//方法 文字图片移入的动画
ScrollCarton.prototype.moveWordImgIn = function(obj, direction) {
	mTween(obj, direction, 0, 600, 'easeBoth');
}



/*
 * $方法
 * @param v [string] 根据class写法，获取元素
 * 			[function] 作为window.onload使用
 * @param p [element] 从p中获取
 */
function $( v,p ) {
	
	var t = typeof v,
		s = '',
		doc = document;
		
	if( t === 'string' ) {
		
		s = v.charAt();
		
		p = p && $(p).length ? $(p)[0] : $(p);
		
		if( s === '#' ) {
			return doc.getElementById( v.substring(1) );
		}
		
		if( s === '.' ) {
			return getByClass( v.substring(1), p||doc );
		}
			
		if( s === '<' ) {
			return doc.createElement( v.slice(1,-1) );
		}
			
		return (p||doc).getElementsByTagName( v );
		
	}
	
	if( t === 'function' ) {
		window.onload = v;
	}
		
	return v;
	
}
function getByClass(s,p) {
	
	var aEles,
		arr,
		arr2,
		doc = document;
	
	if(doc.getElementsByClassName) {
		arr = (p||doc).getElementsByClassName(s);
		return arr.length == 1 ? arr[0] : arr;
	}
	
	aEles = (p||doc).getElementsByTagName('*');
	arr2 = [];
	
	for(var i=0; i<aEles.length; i++) {
		var aClass = aEles[i].className.split(' ');
		for(var j=0; j<aClass.length; j++) {
			if(aClass[j]===s)arr2.push(aEles[i]);	
		}	
	}
	
	return arr2;
}

/*
 * DOM操作
 * @param o [element] 作为子元素
 * @param p [element](可选) 作为父元素，若无p，则默认为document下操作
 */
function creat(o) {
	return document.createElement(o);
}

function append(o,p) {
	o = $(o).length ? $(o)[0] : $(o);
	p = $(p).length ? $(p)[0] : $(p);
	(p||document).appendChild(o);
}

function insert(o1,o2,p) {
	o1 = $(o1).length ? $(o1)[0] : $(o1);
	o2 = $(o2).length ? $(o2)[0] : $(o2);
	p = $(p).length ? $(p)[0] : $(p);
	(p||document).insertBefore(o1,o2);
}

function remove(o,p) {
	o = $(o).length ? $(o)[0] : $(o);
	(p||document).removeChild($(o));
}


//获取元素的boundtop
function getEleBoundTop(ele) {
	var t = ele.getBoundingClientRect().top;
	return t;
}





  
 