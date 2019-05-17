/*
 * 封装兼容所有浏览器的，获取页面滚动距离的方法
 * -返回一个对象
 */
function getScrollOffset(){
	if(window.pageXOffset){
		return {
			x : window.pageXOffset,
			y : window.pageYOffset
		}
	}else{
		return {
			x : document.body.scrollLeft + document.documentElement.scrollLeft,
			y : document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}
/*
 * 封装兼容所有浏览器的，返回浏览器视口尺寸的方法
 */
function getViewportOffset(){
	if(0 && window.innerWidth){
		return {
			w : window.innerWidth,
			h : window.innerHeight
		}
	}else{
		if(document.compatMode === 'BackCompat'){
			return {
				w : document.body.clientWidth,
				h : document.body.clientHeight
			}
		}else{
			return {
				w : document.documentElement.clientWidth,
				h : document.documentElement.clientHeight
			}
		}
	}
}
/*
 获取兼容性方法获取dom元素的样式（待改进）
 * */
function getStyle(ele,prop){
	if(window.getComputedStyle){
		return window.getComputedStyle(ele,null)[prop];
	}else{
		return ele.currentStyle[prop];
	}
}
/*
 封装兼容性的事件绑定函数：无返回值
 参数：
 	elem [Object] -- 目标dom元素对象
 	type [String] -- 事件类型
 	handle [fn/String]   -- 执行方法体/方法名
 	bool   [Boolean] -- 冒泡还是捕获（默认false冒泡,有待改进）
 * */
function addEvent(elem,type,handle,bool){
	if(elem.addEventListener){
		elem.addEventListener(type,handle,bool);
	}else if(elem.attachEvent){
		elem.attachEvent('on' + type,function(){
			handle.call(elem);
		})
	}else{
		elem['on' + type] = handle;
	}
}
/*
 封装兼容性的事件绑定函数：无返回值
 参数：
 	elem [Object] -- 目标dom元素对象
 	type [String] -- 事件类型
 	handleName [String]   -- 要移除的方法名
 * */
function removeEvent(elem,type,handleName){
	if(elem.addEventListener){
		elem.removeEventListener(type,handleName);
	}else if(elem.attachEvent){
		elem.detachEvent(type,handleName)
	}else{
		elem['on' + type] = null;
	}
}
/*
 封装兼容性阻止默认事件的函数
 * */
function cancelHandler(e){
	if(e.preventDefault){
		e.preventDefault();
	}else{
		e.returnValue = false;
	}
}
/*
 封装兼容性阻止冒泡的函数
 * */
function stopBubble(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
}
/*
 拖动函数封装（有兼容处理）：无返回值  (有待改进)
 依赖函数：getStyle、addEvent、stopBubble、cancelHandler、removeEvent
 前提：
 	elem 需要设置定位和默认top、left值
 参数：
 	elem [Object] -- dom元素对象
 * */
function drag(elem){
	var disX = 0,
		disY = 0;
	addEvent(elem,'mousedown',function (e){
		var event = e || window.event;
		disX = event.clientX - parseInt(getStyle(elem,'left'));
		disY = event.clientY - parseInt(getStyle(elem,'top'));
		if((disX + '') == 'NaN'){
			console.log('目标元素对象需要设置定位和默认top、left值')
			return;
		}
		addEvent(document,'mousemove',mouseMove);
		addEvent(document,'mouseup',mouseUp);
		stopBubble(event);
		cancelHandler(event);
	})
	function mouseMove(e){
		var event = e || window.event;
		elem.style.left = event.clientX - disX + 'px';
		elem.style.top = event.clientY - disY + 'px';
	}
	function mouseUp(e){
		var event = e || window.event;
		removeEvent(document,'mousemove',mouseMove);
		removeEvent(document,'mouseup',mouseUp);
	}
}
/*
 函数封装：兼容ie 动态创建js加载外部js文件，并且加载完后回调处理函数（有待改进（加载失败的情况））
 参数：
 	ur [String] -- src路径
 	callback [fn] 回调函数
 * */
function loadScript(ur,callback){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	if(script.readyState){
		// 兼容ie
		script.onreadystatechange = function (){
			if(script.readyState == 'complete' || script.readyState == 'loaded'){
				callback();
			}
		}
	}else{
		script.onload = function (){
			callback();
		}
	}
	script.src = ur;  // 这行代码放在这，是为了避免js文件加载太快，无法监听到onreadystatechange或onload事件
	document.head.appendChild(script);
}














































