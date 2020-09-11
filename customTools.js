// 工具类函数--------------------------------------------------------------
var $t = {};
/*
获取指定的元素节点（兼容ie浏览器）
 	1, 支持id、class、tageName
 	params:
 		v       [String]* id名或类名或标签名（同 css 选择器）
 		oParent [Object] 父级节点dom对象 （默认document,当v 为id名时，此参数无效）
 		
 	返回值：[Object, 类数组, Array]  ie低版本返回的是 数组 而不是类数组
 * */
$t.getEle = function (v, oParent) {
	if (typeof (v) !== 'string') {
		return;
	}
	oParent = oParent || document;
	var type = v.substr(0, 1),
		name = v.substr(1),
		res = null;
	switch (type) {
		case '#':
			res = document.getElementById(name);
			break;
		case '.':
			if (document.getElementsByClassName) {
				res = oParent.getElementsByClassName(name);
			} else {
				// 兼容 ie 低版本
				var aEle = oParent.getElementsByTagName('*'); // 先获取父级元素中所有的dom元素
				res = [];
				for (var i = 0; i < aEle.length; i++) {
					// 判断元素中是否含有 对应的class类名
					if ($t.hasClass(aEle[i], name)) {
						res.push(aEle[i]);
					}
				}
			}
			break;
		default:
			res = oParent.getElementsByTagName(v);
			break;
	}
	return res;
};
/*
获取元素的父元素节点（兼容ie浏览器）
	params:
 		ele [Object]*  dom元素
 		p [Number | String]* 
 				如果传数字则返回目标元素的第n层的父级元素，
 				如果传字符串（要查找的父级类名），则返回最接近目标元素的 含有对应类名的父级元素
 		
 	返回值：[Object]
 * */
$t.getParentEle = function (ele, p) {
	while (ele && p) {
		ele = ele.parentNode;

		if (ele && ele.nodeType == 1) {
			if (typeof (p) == 'string') {
				if ($t.hasClass(ele, p)) {
					return ele;
				}
			} else {
				p--;
			}
		} else if (!ele) {
			return ele;
		}
	}
	return ele;
};
/*
获取一个元素的所有一级子节点（兼容ie浏览器）
	params:
 		tag [Object]*  目标dom元素
 		
 	返回值：[Array]
 * */
$t.getChildren = function (tag) {
	if (!tag) {
		return;
	} // 容错
	var childs = tag.childNodes,
		leng = childs.length,
		arr = [];
	for (var i = 0; i < leng; i++) {
		if (childs[i].nodeType == 1) {
			arr.push(childs[i])
		}
	}
	return arr;
};
/*
封装返回元素的第n个兄弟元素节点：（兼容ie浏览器）
	注意：1，n 为正数时返回后面的兄弟元素节点，n为负数时，返回前面的，n为0时，返回自己，找不到则返回null；
	参数：
		e [Object]* -- 目标dom对象
		n [Number]* -- 想要获取第几个兄弟元素节点
		
	返回值：[Object]
 * */
$t.getSiblings = function (e, n) {
	while (e && n) {
		if (n > 0) {
			if (e.nextElementSibling) {
				e = e.nextElementSibling;
			} else {
				// 兼容ie9及以下浏览器
				for (e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling);
			}
			n--;
		} else {
			if (e.previousElementSibling) {
				e = e.previousElementSibling;
			} else {
				// 兼容ie9及以下浏览器
				for (e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling);
			}
			n++;
		}
	}
	return e;
};
/*
判断一个元素是否含有某个class类名(考虑最周全，兼容所有浏览器的方法)
	params:
 		tag   [Object]*  dom元素
 		classStr  [String]*  class类名
 		
 	返回值：[Boolean]
 	
 	待改善：
 		可以用一行正则做到 参见 miaov-延迟菜单 案例
 * */
$t.hasClass = function (tag, classStr) {
	if (!tag) {
		return;
	} // 容错
	var reg = new RegExp('\\b' + classStr + '\\b');
	return reg.test(tag.className);
	//	 var arr = tag.className.split(/\s+/),  //这个正则表达式是因为class可以有多个,判断是否包含
	//	 		leng = arr.length;
	//	 	// 用数组的方式做判断是为了防止有类似 a aa aaa 的类名的情况
	//  for (var i = 0;i < leng;i++){
	//      if (arr[i] == classStr){
	//          return true ;
	//      }
	//  }
	//  return false;
};
/*
元素的class类名替换（考虑最周全，兼容所有浏览器的方法）(也可用于删除某项class类名)
	params:
 		tag   [Object]*  dom元素
 		oldStr  [String]*  被替换的class类名
 		newStr  [String]*  替换后的class类名
 		
 	返回值：无
 * */
$t.replaceClass = function (tag, oldStr, newStr) {
	if (!tag) {
		return;
	} // 容错
	var arr = tag.className.split(/\s+/), //这个正则表达式是因为class可以有多个,判断是否包含
		leng = arr.length;
	// 用数组的方式做判断是为了防止有类似 a aa aaa 的类名的情况
	for (var i = 0; i < leng; i++) {
		if (arr[i] == oldStr) {
			arr[i] = newStr;
			break;
		}
	}
	tag.className = arr.join(' ');
};
/*
 获取浏览器计算后的dom元素样式：
 	注意：
 		1，不能获取复合样式（background），只能获取单一样式(backgroundColor)
 		2，不能获取没设置的样式（会有兼容问题）
		 3，不要有空格
		 4, 颜色值 有可能返回rgba 尚需改进
 	params:
 		ele   [Object]*  dom元素
 		prop  [String]*  样式属性
 		pseudo [String] 伪元素  （传此参数可获取伪元素的样式 ，ie9以下不支持,默认 null）
 	返回值：[String]
 * */
$t.getStyle = function (ele, prop, pseudo) {
	if (!ele) {
		return;
	}
	pseudo = pseudo || null;
	return window.getComputedStyle ? getComputedStyle(ele, pseudo)[prop] : ele.currentStyle[prop];
};
/*
生成一个由随机的字符串
	注意：
		1，依赖 $t.randomBasedSection 函数
	params:
		leng [Number]  长度(默认长度是 10)
		typeNum [Number] 类型(默认 混杂模式)
			0 -> 数字 、小写字母、大写字母
			1 -> 只有数字
			2 -> 只有小写字母
			3 -> 只有大写字母
            4 -> 只有中文（目前还不能把繁体字和简体字区分出来）
        isSymbol [Boolean] 是否包含符号 默认false
	返回值：[String]
 * */
$t.createRandomStr = function (leng, typeNum, isSymbol) {
	var num = 97,
		str = '',
		startNum = 0,
		endNum = 40869;
	leng = leng === undefined ? 10 : leng; // 默认长度是 10
	// 判断需要的类型
	if (typeNum) {
		var arr = ['', [48, 57],
			[97, 122],
			[65, 90],
			[19968, 40869]
		];
		startNum = arr[typeNum][0];
		endNum = arr[typeNum][1];
	}

	for (var i = 0; i < leng; i++) {
		// 0 的情况 数字 、小写字母、大写字母
		if (typeNum == 0) {
			var arr1 = [
				[48, 57],
				[97, 122],
				[65, 90]
			];
			var indexNum = randomBasedSection(0, 2);
			startNum = arr1[indexNum][0];
			endNum = arr1[indexNum][1];
		}

		num = randomBasedSection(startNum, endNum); // 生成一个指定区域的随机数
		str += String.fromCharCode(num); // 根据传入的 ASCII编码生成对应的字符，可传多个值

		// 带符号的情况 Math.random() > 0.7 是为了减少符号出现的频率
		if (isSymbol && Math.random() > 0.7) {
			var arr2 = [
				[32, 47], // 标点自1区(32是空格)
				[58, 64], // 标点2区
				[91, 96], // 标点3区
				[123, 126] // 标点4区
			];
			var indexNum2 = randomBasedSection(0, 3);
			str += String.fromCharCode(randomBasedSection(arr2[indexNum2][0], arr2[indexNum2][1]));
		}
	}
	return str;
};
/*
生成一个指定区域的随机数
	params:
		small [Number]*  最小值
		big [Number]* 最大值
	返回值：[Number]
 * */
$t.randomBasedSection = function (small, big) {
	return Math.round(Math.random() * (big - small) + small);
};
/*
获取一个字符 在另一个字符串中所出现的位置集合
	params:
		sonStr [String]*  目标字符
		parentStr [String]* 基于的字符
	返回值：[Array]
 * */
$t.getIndexofArr = function (sonStr, parentStr) {
	var i = 0,
		arr = [];
	while (parentStr.indexOf(sonStr, i) != -1) {
		arr.push(parentStr.indexOf(sonStr, i));
		i = parentStr.indexOf(sonStr, i) + sonStr.length;
	}
	return arr;
};
/*
生成随机颜色：
	注意：
		1，依赖 randomBasedSection 函数
	params:
		clarityP [String, Number]  透明度 （默认1）
		avoid [String] 想要回避的颜色 rgb形式(如: '255,255,255') 默认会把接近此颜色的110个色值都回避掉，
										如果想要更改，请搜索 '颜色取值范围' 关键字 去改源码
	返回值：[String]
 * */
$t.randomColor = function (clarityP, avoidP) {
	if (!clarityP && clarityP != 0) {
		clarityP = 1;
	}
	let r = $t.randomBasedSection(0, 255);
	let g = $t.randomBasedSection(0, 255);
	let b = $t.randomBasedSection(0, 255);
	let res = r + ',' + g + ',' + b;
	// 是否要回避某个色值
	if (avoidP) {
		let arr = avoidP.split(',');

		let minN = (arr[2] - 55) <= 0 ? 0 : (arr[2] - 55); // 最小接近值
		let maxN = (arr[2] + 55) >= 255 ? 255 : (arr[2] + 55); // 最大接近值
		// 判断是否是需要回避的颜色 或者是否是接近 需要回避的颜色 颜色取值范围（上下55）
		while (r == arr[0] && g == arr[1] && (b >= minN && b <= maxN)) {
			g = $t.randomBasedSection(0, 255);
			b = $t.randomBasedSection(0, 255);
			res = r + ',' + g + ',' + b;
		}
	}

	return 'rgba(' + res + ',' + clarityP + ')';
};
/*
 * 封装兼容所有浏览器的，获取页面滚动距离的方法
 * 返回值：[Object]
 */
$t.getScrollOffset = function () {
	if (window.pageXOffset) {
		return {
			x: window.pageXOffset,
			y: window.pageYOffset
		}
	} else {
		return {
			x: document.body.scrollLeft + document.documentElement.scrollLeft,
			y: document.body.scrollTop + document.documentElement.scrollTop
		}
	}
};
/*
 * 封装兼容所有浏览器的，返回浏览器视口尺寸的方法
 * 返回值：[Object]
 */
$t.getViewportOffset = function () {
	if (window.innerWidth) {
		return {
			w: window.innerWidth,
			h: window.innerHeight
		}
	} else {
		if (document.compatMode === 'BackCompat') {
			return {
				w: document.body.clientWidth,
				h: document.body.clientHeight
			}
		} else {
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			}
		}
	}
};
/*
 封装兼容性的事件绑定函数
	注意：
		1,在ie低版本下,当给同一个元素绑定多个事件时，先绑定的事件 后执行
		2,在ie低版本下，依赖$t.getType函数
	 参数：
	 	elem [Object]* -- 目标dom元素对象
	 	type [String]* -- 事件类型
	 	handle [fn | String]*   -- 执行方法体/方法名 (方法体，不支持解除绑定)
	 	bool   [Boolean] -- 冒泡还是捕获（false -> 冒泡, true -> 捕获, 默认 false,目前低版本浏览器不支持此参数）
 	
 	返回值：无
 * */
$t.addEvent = function (elem, type, handle, bool) {
	bool = bool || false;
	if (elem.addEventListener) {
		elem.addEventListener(type, handle, bool);
	} else if (elem.attachEvent) {
		if ($t.getType(handle) == 'string') {
			// 为了在ie低版本下，即能把this指向目标元素，又能支持解除绑定的事件函数
			elem['ie' + handle] = function (ev) {
				handle.call(elem, ev);
			}
			elem.attachEvent('on' + type, elem['ie' + handle]);
		} else {
			elem.attachEvent('on' + type, handle);
		}
	} else {
		elem['on' + type] = handle;
	}
};
/*
 封装兼容性的事件 解除 绑定函数
 	注意：
	 参数：
	 	elem [Object]* -- 目标dom元素对象
	 	type [String]* -- 事件类型
	 	handleName [String]*   -- 要移除的方法名
	 	bool   [Boolean] -- 冒泡还是捕获（false -> 冒泡, true -> 捕获, 默认 false,目前低版本浏览器不支持此参数）
 		
 	返回值：无
 * */
$t.removeEvent = function (elem, type, handleName, bool) {
	if (elem.removeEventListener) {
		elem.removeEventListener(type, handleName, bool);
	} else if (elem.detachEvent) {
		elem.detachEvent('on' + type, 'ie' + handleName)
	} else {
		elem['on' + type] = null;
	}
};
/*
 封装兼容性阻止默认事件的函数
	参数：
	 	e [Object]* -- 事件对象
 	
 	返回值：[Object] 兼容ie 触发事件的目标对象
 * */
$t.cancelHandler = function (e) {
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
	return e.target || e.srcElement;
};
/*
 封装兼容性阻止冒泡的函数
	参数：
	 	event [Object]* -- 事件对象
 	
 	返回值：[Object] 兼容ie 触发事件的目标对象
 * */
$t.stopBubble = function (event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
	return event.target || event.srcElement;
};
/*
 函数封装：兼容ie 动态创建js加载外部js文件，并且加载完后回调处理函数
 参数：
 	ur [String]* -- src路径(必传)
 	callback [fn] 加载成功的回调函数
 	errorBack [fn] 加载失败的回调函数（目前 此回调不兼容 IE6~8与opera11 ）
 	
 	返回值：[String] 创建的script标签的id(为了防止耦合冲突 id中带有时间戳)
 * */
$t.loadScript = function (ur, callback, errorBack) {
	if (!ur) {
		return;
	} // 容错
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.id = 'loadScript' + new Date().getTime();
	if (script.readyState) {
		// 兼容ie
		script.onreadystatechange = function () {
			if (script.readyState == 'complete' || script.readyState == 'loaded') {
				callback && callback(); // 成功回调
			}
		}
	} else {
		script.onload = function () {
			callback && callback(); // 成功回调
		}
	}
	script.onerror = function () {
		errorBack && errorBack(); // 出错回调
	}
	script.src = ur; // 这行代码放在这，是为了避免js文件加载太快，无法监听到onreadystatechange或onload事件
	document.head.appendChild(script);
	return script.id; // 返回 script标签的id
};
/*
 函数封装：哈希数组去重
 	参数：
		tagArr : [Array]* 数组
		
 	返回值：[Object] 对象中有两个属性 
 									newArrr [Array] 去重后的新数组 
 									temp [Object] 记录了每一个重复的值在原数组中依次出现的索引 
 * */
$t.unique = function (tagArr) {
	let temp = {},
		arr = [],
		leng = tagArr.length;
	for (let i = 0; i < leng; i++) {
		if (temp[tagArr[i]] === undefined) {
			temp[tagArr[i]] = i;
			arr.push(tagArr[i])
		} else {
			temp[tagArr[i]] += '-' + i;
		}
	}
	return {
		newArrr: arr,
		temp: temp
	};
};
/*
类型检测函数封装
	参数：
		target : [...]* 要检测的值
		
 	返回值：[String]
 */
$t.getType = function (target) {
	let ret = typeof (target);
	let template = {
		'[object Array]': 'array',
		'[object Object]': 'object',
		'[object Number]': 'number - object', // 包装类对象
		'[object Boolean]': 'boolean - object', // 包装类对象
		'[object String]': 'string - object' // 包装类对象
	}
	if (target === null) {
		return 'null';
	} else if (ret == 'object') {
		let str = Object.prototype.toString.call(target); // 主要是为了检测是否是包装类对象
		return template[str];
	} else {
		return ret;
	}
};
/*
封装insertAfter函数
	注意：
		1，依赖$t.getSiblings函数
	参数：
		targetNode : [Object] * 要插入的元素对象
		afterNode : [Object] * 要插到那个元素的后面
		parentNode : [Object] * 要插到那个元素的后面的父容器
		
 	返回值：无
 */
$t.insertAfter = function (targetNode, afterNode, parentNode) {
	var beforeNode = $t.getSiblings(afterNode, 1); // 兼容ie获取afterNode的下一个元素节点
	if (beforeNode === null) {
		parentNode.appendChild(targetNode);
	} else {
		parentNode.insertBefore(targetNode, beforeNode);
	}
};
/*
获取元素静态的大小及相对于视口的位置和坐标 兼容ie9以下
	注意：
	参数：
		ele : [Object] * 目标元素对象
		
 	返回值：[Object] 返回静态的元素几何尺寸,
 * */
$t.getRect = function (ele) {
	var obj = {},
		oRect = ele.getBoundingClientRect(),
		top = document.documentElement.clientTop, // 非IE为0，IE为2
		left = document.documentElement.clientLeft; // 非IE为0，IE为2
	obj.top = oRect.top - top;
	obj.bottom = oRect.bottom - top;
	obj.left = oRect.left - left;
	obj.right = oRect.right - left;
	obj.width = oRect.width || oRect.right - oRect.left; // IE67不存在width 使用right - left获得
	obj.height = oRect.height || oRect.bottom - oRect.top;
	obj.width = Math.round(obj.width);
	obj.height = Math.round(obj.height);
	return obj;
}
/*
获取当前日期
	注意：
	参数：
		date : [Object] 日期对象 （默认时当前日期）
 	返回值：[Object] 带有年 月 周（0 表示 周日） 日 时 分 秒 毫秒
 * */
$t.getDate = function (oDate) {
	var d = oDate || new Date(),
		obj = {
			year: d.getFullYear(), // 年
			month: d.getMonth() + 1, // 月
			week: d.getDay(), // 周 （0 表示 周日）
			day: d.getDate(), // 日
			hour: d.getHours(), // 时
			minute: d.getMinutes(), // 分
			seconds: d.getSeconds(), // 秒
			timestamp: d.getTime() // 毫秒
		}
	return obj;
};
/*
字符串中,空格处理函数 兼容性封装
注意：不改变原字符串

参数： str      [String]* 目标字符串
* deleteWay [Number] （默认 1）
* 										1 -- 去掉两端空格(包括连续的多个空格),
* 										2 -- 去掉字符串中所有空格(包括连续的多个空格),
* 										3 -- 空格替换后两端清空(即，先去除两端的空格，再把其他的空格替换为想要的字符),
*                     4 -- 替换时连续的多个空格将视为一个空格来处理,并且两端清空
* sub      [String] 替换后的字符(即,将去掉的空白字符替换为什么字符),默认是空字符
* 
返回值：[String]
* */
$t.dealBlank = function (str, deleteWay, sub) {
	deleteWay = deleteWay || 1;
	sub = sub || "";
	var result = str;
	switch (deleteWay) {
		case 1:
			result = str.replace(/(^\s+)|(\s+$)/g, sub);
			break;
		case 2:
			result = result.replace(/[\s\n\t\r\v]/g, sub);
			break;
		case 3:
			result = str.replace(/(^\s+)|(\s+$)/g, '');
			result = result.replace(/[\s\n\t\r\v]/g, sub);
			break;
		case 4:
			result = result.replace(/[\s\n\t\r\v]/g, ' ');
			var arr = result.split(' ');
			var arr2 = arr.filter(function (item, index) {
				if (item) {
					return item
				}
			})
			result = arr2.join(sub);
			break;
		default:
			console.log('deleteWay值无效，必须是大于0的数字')
	}
	return result;
};
/*
获取地址栏参数的函数
	注意：不传参数时返回一个包含所有参数的对象
	参数：
		n [String]* 指定要查找的关键字，
 	返回值：[Object | String] 
 * */
$t.getAddressParam = function (n) {
	var str = window.location.search.substr(1),
		obj = {},
		arr = str.split('&'),
		leng = arr.length,
		arr2 = [];
	for (var i = 0; i < leng; i++) {
		arr2 = arr[i].split('=');
		obj[arr2[0]] = arr2[1];
	}
	return n !== undefined ? obj[n] : obj;
};
/*
设置 或 重置 或清除 cookie函数
	注意：当 prop 为 空 并且 t 为 -1 时，即 清除相应 的cookie
	参数：
		att [String]* 属性，
		prop [String]* 值，
		t [Number] 要保留的时间(暂时仅支持以天为单位,默认临时存储)，
 	返回值：无 
 * */
$t.setCooki = function (att, prop, t) {
	var oDate = new Date();
	oDate.setDate(oDate.getDate() + t); // 计算有效时间
	prop = encodeURI(prop); // 编码处理 防止由特殊字符的情况
	document.cookie = att + '=' + prop + ';expires=' + oDate.toGMTString();
}
/*
获取cookie函数
	注意：不传参数时返回一个包含所有参数的对象
	参数：
		att [String]* 指定要查找的关键字，
 	返回值：[Object | String] 
 * */
$t.getCooki = function (att) {
	var arr1 = document.cookie.split('; '),
		leng = arr1.length,
		arr2 = [],
		obj = {};
	for (var i = 0; i < leng; i++) {
		arr2 = arr1[i].split('=');
		obj[arr2[0]] = decodeURI(arr2[1]); // 解码存储
	}
	return att === undefined ? obj : obj[att];
};
/*
函数节流封装：
	注意：
		使用函数节流是为了减少不必要的高频率事件触发，以提高性能
	参数：
		fn : [Function]* 要处理的函数
		delay : [Number] 延迟时间（毫秒）
		mastExec : [Number] 最大间隔时间（毫秒）
 	返回值：[Function] (默认使用...语法糖接受参数，低版本浏览器可使用arguments或根据不同情况设置参数)
 * */
$t.reduceDealWith = function (fn, delay, mastExec) {
	var timer = null,
		lastTime = new Date();
	return function (...arg) {
		var now = new Date();
		clearTimeout(timer);
		if (now - lastTime < mastExec) {
			timer = setTimeout(function () {
				fn(...arg);
			}, delay)
		} else {
			fn(...arg);
			lastTime = now;
		}
	}
};
// 简洁写法
// const throttle = function(event) {
// 	let timerid = null
// 	return function() {
// 	  if (!timerid) {
// 		timerid = setTimeout(() => {
// 		  event()
// 		  timerid = null
// 		}, 100)
// 	  }
// 	}
//   }
/*
碰撞检测函数封装：
	注意：
		1,依赖$t.getRect函数
	参数：
		moveEle : [Object]* 要碰撞的dom元素
		tagEle : [Object]* 被碰撞的don元素
		
 	返回值：[Boolean]
 * */
$t.isCollision = function (moveEle, tagEle) {
	var mRect = $t.getRect(moveEle),
		tRect = $t.getRect(tagEle);
	if (
		mRect.top > tRect.bottom ||
		tRect.top > mRect.bottom ||
		tRect.left > mRect.right ||
		mRect.left > tRect.right) {
		return false;
	}
	return true;
};
/*
媒体时间格式化封装：
	注意：
		1, 依赖$t.toZero函数,
		2, 目前仅支持到小时
	参数：
		t : [Number]* 秒
		cn : [String] 连接符 (默认 :)
 	返回值：[String]
 * */
$t.timeFormat = function (t, cn) {
	if (!t) {
		return;
	}
	t = Math.floor(t);
	cn = cn ? cn + '' : ':';
	var h = $t.toZero(Math.floor(t / 3600)), // 时
		m = $t.toZero(Math.floor(t % 3600 / 60)), // 分
		s = $t.toZero(t % 60); // 秒
	return h + cn + m + cn + s;
}
/*
数字补零函数：
	注意：
	参数：
		num : [Number]* 数字
 	返回值：[String]
 * */
$t.toZero = function (num) {
	num = (num <= 9 ? '0' + num : num);
	return num;
}
/*
获取圈选页面文字内容的函数：
	注意：
	参数：
 	返回值：[String]
 * */
$t.getSelectPageTxt = function () {
	if (document.selection) {
		return document.selection.createRange().text; // ie
	} else {
		return window.getSelection().toString(); // 标准
	}
}
/*
保留小数位的处理函数(比 toFixed 更好用)
	注意：
	参数：
		num : [Number] 目标数字,
		dig : [Number] 保留几位小数 (默认2)
		mo : [Number]  模式：1-四舍五入，2-向下取整，3-向上取整（默认1）
 	返回值：[Number]
 * */
$t.dealDecimal = function (num, dig, mo) {
	if (!num) {
		console.error('num 无效!');
		return;
	}
	if (typeof (num) != 'number' && isNaN(Number(num))) {
		console.error('num 不是一个数字!');
		return;
	}
	dig = dig || 2;
	mo = mo || 1;
	var i = Math.pow(10, dig);
	switch (mo) {
		case 1:
			num = Math.round(num * i) / i;
			break;
		case 2:
			num = Math.floor(num * i) / i;
			break;
		case 3:
			num = Math.ceil(num * i) / i;
			break;
		default:
			console.error('mo 无效!');
			break;
	}

	return num;
};
/*
hsl色值转rgb色值函数：
	注意：
	参数：
		h : [Number] 色相,
		s : [Number] 饱和度
		l : [Number] 亮度
	返回值：[Array] 
			 r [Number] 红,
			 g [Number] 绿,
			 b [Number] 蓝,
 * */
$t.hslToRgb = function (h, s, l) {
	var r, g, b;
	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
/*
rgb色值转hsl色值函数：
	注意：
	参数：
		 	r [Number] 红,
			g [Number] 绿,
			b [Number] 蓝,
	返回值：[Array] ：
	 		h : [Number] 色相,
			s : [Number] 饱和度
			l : [Number] 亮度
			
 * */
$t.rgbToHsl = function (r, g, b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [h, s, l];
}
/*
获取指定字符串中出现次数最多的字符：
	注意：
	参数：
		 	str : [String] 指定字符串,
	返回值：[Object]
			
 * */
$t.getMaxFromStr = function (str) {
	var leng = str.length,
		obj = {},
		max = 0,
		moreKey = str.charAt(0);
	for (var i = 0; i < leng; i++) {
		if (obj[str.charAt(i)]) {
			obj[str.charAt(i)]++;
		} else {
			obj[str.charAt(i)] = 1;
		}
		if (max < obj[str.charAt(i)]) {
			max = obj[str.charAt(i)];
			moreKey = str.charAt(i);
		}
	}

	return {
		maxNum: max,
		moreKey: moreKey,
		obj: obj
	};
}































// 事件类-----------------------------------------------------------------------
var $e = {};
/*
input框内容改变事件兼容性封装：
	注意：
	参数：
		otag [Object] 目标dom节点对象,
		callBack [Function] 回调函数
 	返回值：无
 * */
$e.inputChangeEv = function (otag, callBack) {
	if (!-[1, ]) {
		// ie
		otag.onpropertychange = function () {
			callBack & callBack();
		}
	} else {
		// 标准
		otag.oninput = function () {
			callBack & callBack();
		}
	}
}

// 应用类函数------------------------------------------------------------------------------
var $u = {};

/*
定时器 控制元素移动 函数:
	注意：
		1，依赖 $t.getStyle 函数
	配置项：
		oConfig = {
			ele : , [Object]*  dom元素
			att : , [String]  要改变的元素属性(可控制的数值属性，默认left)
			dir : , [Number]  步长（默认10，正值向前，负值向后）
			tagPoint : ,  [Number]   目标点（默认0）
			callIn : ,    [Function] 进行中的回调函数
			callBack : ,  [Function] 结束的回调函数
		}
 * */
$u.doMove = function (oConfig) {
	if (!oConfig || !oConfig.ele) {
		return;
	}
	clearInterval(oConfig.ele.doMovetTimer); // 1,防止重复开启定时器(越点越快) clear清除null或未定义 不会报错

	// 设置默认值
	oConfig.att = oConfig.att || 'left';
	oConfig.dir = oConfig.dir === undefined ? 10 : oConfig.dir;
	oConfig.tagPoint = oConfig.tagPoint === undefined ? 0 : oConfig.tagPoint;

	// 判断并决定方向
	if (parseInt($t.getStyle(oConfig.ele, oConfig.att)) > oConfig.tagPoint) {
		oConfig.dir = -oConfig.dir
	}

	// 2,把定时器存到目标元素身上，可减少变量申明，节省空间，提高性能
	oConfig.ele.doMovetTimer = setInterval(function () {
		var speed = parseInt($t.getStyle(oConfig.ele, oConfig.att)) + oConfig.dir;

		// 3,最精准地保证移动元素能走到指定的位置，并且不出现被拉回的bug
		if (speed > oConfig.tagPoint && oConfig.dir > 0 || speed < oConfig.tagPoint && oConfig.dir < 0) {
			speed = oConfig.tagPoint;
		}

		oConfig.ele.style[oConfig.att] = speed + 'px'; // 赋值

		oConfig.callIn && oConfig.callIn(); // 执行 进行中的回调函数

		// 3,最精准地保证移动元素能走到800的位置，并且不出现被拉回的bug
		if (speed == oConfig.tagPoint) {
			clearInterval(oConfig.ele.doMovetTimer);
			oConfig.callBack && oConfig.callBack(); // 执行 结束回调函数
		}

	}, 30)
};

/*
 	抖动函数封装:
 	注意：
 		1,必须在样式中实现设置好相应的定位样式(left top)
 		2, 依赖$t.getStyle
	配置项：
		oConfig {
			ele : ,  [Object]*  dom元素
			startValue : , [Number]（若不传此参数，则需依赖$t.getStyle函数  默认会使用$t.getStyle函数动态获取）
			att : ,   [String]  抖动的方向（默认 left 当前仅支持 left top）
			scope : , [Number]  抖动的最大范围 （默认 20px）
			frequency : , [Number] 抖动的频率 (默认2, 数值越小抖动越快,可以，但不建议传浮点数)
			callIn : ,    [Function] 进行中的回调函数
			callBack : ,  [Function] 结束的回调函数
		}
 * */
$u.shake = function (oConfig) {
	// 在上次抖动还没结束时，不进行任何操作，防止获取初始位置不准确的bug
	if (!oConfig || !oConfig.ele || oConfig.ele.shakeTimer) {
		return;
	}
	// 设置默认值
	oConfig.att = oConfig.att || 'left'; // 方向左右
	oConfig.startValue = oConfig.startValue || $t.getStyle(oConfig.ele, oConfig.att); // 初始的位置
	oConfig.startValue = parseInt(oConfig.startValue);
	oConfig.scope = oConfig.scope || 20; // 范围
	oConfig.frequency = oConfig.frequency || 2; // 频率

	clearInterval(oConfig.ele.shakeTimer); // 先清除上一次定时器

	var arr = [];
	var num = 0;
	// 生成抖动所依赖的由一正一负的数字组成的 数组
	for (var i = oConfig.scope; i > 0; i -= oConfig.frequency) {
		arr.push(i, -i);
	}
	arr.push(0); // 在数组最后填入0，否则回不到原位置
	var leng = arr.length;
	// 开启间隔定时器
	oConfig.ele.shakeTimer = setInterval(function () {
		oConfig.ele.style[oConfig.att] = oConfig.startValue + arr[num] + 'px';
		num++;
		oConfig.callIn && oConfig.callIn(); // 进行中的回调函数
		if (num == leng) {
			clearInterval(oConfig.ele.shakeTimer);
			oConfig.ele.shakeTimer = null; // 设为null，用于判断当前抖动是否结束（以防止获取初始位置不准确的bug）
			num = 0;
			oConfig.callBack && oConfig.callBack(); // 结束的回调函数
		}
	}, 50)
};
/*
按下、移动、抬起公共函数封装
注意：
	1，依赖$t.cancelHandler、$t.stopBubble、$t.getStyle、$t.getRect、$t.getViewportOffset
			$t.addEvent、$t.removeEvent
参数：
oConfig {
 	ele : ,  [Object]* 拖动的目标元素节点(必须设置top，left值)
 	positionParent : ,  [Object] 用于限制目标元素拖动范围的父级元素
 											(如果不传此参数，默认使用$t.getViewportOffset()获取浏览器视口的 宽高)
 	listenerParent : ,  [Object] 用于监听移动和结束事件 的父级元素 
 											（默认 document,不建议修改除非你真的知道拖动效果的底层原理）
 	topOverstep : ,   [Number] 顶部超出父级范围的偏移量(默认 0)
	leftOverstep : ,  [Number] 左侧超出父级范围的偏移量(默认 0)
	bottomOverstep : ,  [Number] 底部超出父级范围的偏移量(默认 0)
	rightOverstep : ,  [Number] 右侧超出父级范围的偏移量(默认 0)
	startFn : ,  [Function] 初始化的回调函数 带有两个参数：this指向目标元素
								param3 : 鼠标x轴坐标值
 								param4 : 鼠标y轴坐标值
 	callIn : ,  [Function] 拖动进行中的回调函数,带有四个参数：this指向目标元素
 								param1 : 计算后的top值
 								param2 : 计算后的left值
 								param3 : 鼠标x轴坐标值
 								param4 : 鼠标y轴坐标值
 	callBack : ,  [Function] 拖动结束后的回调函数 带有两个参数：this指向目标元素
 								param3 : 鼠标x轴坐标值
 								param4 : 鼠标y轴坐标值
 }
 * */
$u.downMoveUp = function (oConfig) {
	if (!oConfig || !oConfig.ele) {
		return;
	} // 限制必有条件

	oConfig.topOverstep = oConfig.topOverstep === undefined ? 0 : oConfig.topOverstep;
	oConfig.leftOverstep = oConfig.leftOverstep === undefined ? 0 : oConfig.leftOverstep;
	oConfig.bottomOverstep = oConfig.bottomOverstep === undefined ? 0 : oConfig.bottomOverstep;
	oConfig.rightOverstep = oConfig.rightOverstep === undefined ? 0 : oConfig.rightOverstep;
	oConfig.listenerParent = oConfig.listenerParent === undefined ? document : oConfig.listenerParent;

	var starrT = 0, // 目标元素y轴初始位置
		startL = 0, // 目标元素x轴初始位置
		startX = 0, // 鼠标x轴初始位置
		startY = 0, // 鼠标y轴初始位置
		minT = 0, // 限制上部最大偏移量
		minL = 0, // 限制左侧最大偏移量
		maxT = 0, // 限制下部最大偏移量
		maxL = 0; // 限制右侧最大偏移量

	$t.addEvent(oConfig.ele, 'mousedown', start);
	// 函数封装
	function start(ev) {
		var ev = ev || window.event;
		$t.cancelHandler(ev); // 阻止默认事件
		$t.stopBubble(ev); // 阻止冒泡

		if (oConfig.ele.setCapture) {
			oConfig.ele.setCapture(); // 设置全局捕获，阻止ie低版本下，文字或图片的默认拖拽行为，
		}

		// 获取相关尺寸
		if (oConfig.positionParent) {
			var parentW = parseInt($t.getStyle(oConfig.positionParent, 'width')),
				parentH = parseInt($t.getStyle(oConfig.positionParent, 'height'));
		} else {
			var parentRect = $t.getViewportOffset(), // 默认获取浏览器视口的 宽高
				parentW = parentRect.w,
				parentH = parentRect.h;
		}

		starrT = parseInt($t.getStyle(oConfig.ele, 'top')); // 目标元素y轴初始位置
		startL = parseInt($t.getStyle(oConfig.ele, 'left')); // 目标元素x轴初始位置
		startX = ev.clientX; // 鼠标x轴初始位置
		startY = ev.clientY; // 鼠标y轴初始位置
		// 在此处计算最大和最小值，是为了防止目标元素初始化时，是隐藏状态的情况(即获取不到宽高)
		maxT = parentH - parseInt($t.getRect(oConfig.ele).height) + oConfig.bottomOverstep; // 限制上部最大偏移量
		minT = 0 + oConfig.topOverstep; // 限制左侧最大偏移量
		maxL = parentW - parseInt($t.getRect(oConfig.ele).width) + oConfig.rightOverstep; // 限制下部最大偏移量
		minL = 0 + oConfig.leftOverstep; // 限制右侧最大偏移量

		oConfig.startFn && oConfig.startFn.call(oConfig.ele, startX, startY); // 初始的回调函数

		$t.addEvent(oConfig.listenerParent, 'mousemove', move);
		$t.addEvent(oConfig.listenerParent, 'mouseup', end);
	}

	function move(ev) {
		var ev = ev || window.event;
		var moveX = ev.clientX,
			moveY = ev.clientY,
			disX = moveX - startX, // x轴差值
			disY = moveY - startY, // y轴差值
			resT = starrT + disY, // x轴最终位置值
			resL = startL + disX; // y轴最终位置值

		if (resT < minT) {
			resT = minT;
		} // 限制上部最大偏移量
		if (resL < minL) {
			resL = minL;
		} // 限制左侧最大偏移量
		if (resT > maxT) {
			resT = maxT;
		} // 限制下部最大偏移量
		if (resL > maxL) {
			resL = maxL;
		} // 限制右侧最大偏移量

		oConfig.callIn && oConfig.callIn.call(oConfig.ele, resT, resL, moveX, moveY); // 移动中的回调函数
	}

	function end(ev) {
		var ev = ev || window.event;
		maxT = 0; // 防止数据叠加
		maxL = 0; // 防止数据叠加

		if (oConfig.ele.releaseCapture) {
			oConfig.ele.releaseCapture(); // 释放全局捕获
		}

		oConfig.callBack && oConfig.callBack.call(oConfig.ele, ev.clientX, ev.clientY); // 结束时的回调函数

		$t.removeEvent(oConfig.listenerParent, 'mousemove', move);
		$t.removeEvent(oConfig.listenerParent, 'mouseup', end);
	}
};
/*
 封装兼容性的鼠标滚轮事件的 构造函数
 	注意：
 		1，依赖$t.addEvent，$t.removeEvent函数
	 参数：
 		oConfig : {
 			ele [Object]* -- 目标dom元素对象
		 	bool   [Boolean] -- 冒泡还是捕获（false -> 冒泡, true -> 捕获, 默认 false,目前低版本浏览器不支持此参数）
 		}
 	返回值：[Object]
 	可用on监听的事件 ：
 		rollerUp : 向上滚动
 		rollerDown : 向下滚动
 	可直接调用的事件：
 		destroyFn : 销毁滚轮事件
 * */
$u.MouseRoller = function (oConfig) {
	if (!oConfig || !oConfig.ele) {
		return;
	}
	oConfig.bool = oConfig.bool || false;
	var _this = this;
	// 向上滚动
	_this.rollerUp = {
		callBack: null,
		doing: function () {
			this.callBack && this.callBack();
		}
	};
	// 向下滚动
	_this.rollerDown = {
		callBack: null,
		doing: function () {
			this.callBack && this.callBack();
		}
	};
	// 滚轮处理函数
	_this.handleFn = function (e) {

		if ((e.wheelDelta && e.wheelDelta > 0) || (e.detail && e.detail < 0)) {
			_this.rollerUp.doing();
		} else {
			_this.rollerDown.doing();
		}
		$t.cancelHandler(e);
		$t.stopBubble(e);
	}
	// 兼容性绑定事件
	if (oConfig.ele.onmousewheel !== undefined) {
		$t.addEvent(oConfig.ele, 'mousewheel', _this.handleFn, oConfig.bool);
	} else {
		oConfig.ele.addEventListener('DOMMouseScroll', _this.handleFn, oConfig.bool)
	}
	// 模拟监听事件，处理相应的函数
	_this.on = function (evType, handle) {
		_this[evType].callBack = handle;
	}
	// 销毁滚轮事件
	_this.destroyFn = function () {
		if (oConfig.ele.onmousewheel !== undefined) {
			$t.removeEvent(oConfig.ele, 'mousewheel', _this.handleFn, oConfig.bool);
		} else {
			oConfig.ele.removeEventListener('DOMMouseScroll', _this.handleFn, oConfig.bool)
		}
	}
}