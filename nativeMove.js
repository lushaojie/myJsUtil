/*
 运动原理解析：
	弹性运动 ： 
		1, 速度 += (目标点 - 当前值) / 系数 6 7 8
		2, 速度 *= 摩擦系数; // 0.7 0.75
		
	缓冲运动:
		1, 速度 = (目标点 - 当前值) / 系数;
		2, 速度取整
 * */

/*
 缓冲运动函数
 params : 
 	obj : [Object] 目标dom节点对象
 	json : {       配置项
 		属性 : 属性值 (如：width:100)
 	}
 	fn : [Function] 运动结束后的回调函数
 * */
function startMove(obj,json,fn){
    clearInterval(obj.timer);
    let iCur = 0; // 当前值
    let iSpeed = 0;
    obj.timer = setInterval(() => {
        let iBool = true;
        for (const attr in json) {
            let iTarget = json[attr]; // 目标点的值

            if(attr === 'opacity'){
                iCur = Math.round(getCss(obj,'opacity') * 100);
            }else{
                iCur = parseInt(getCss(obj,attr));
            }

            iSpeed = (iTarget - iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if(iCur != iTarget){
                iBool = false;
                if(attr === 'opacity'){
                    obj.style.opacity = (iCur + iSpeed)  / 100;
                    obj.style.filter = 'alpha(opacity='+ (iCur + iSpeed) +')';
                }else{
                    obj.style[attr] = iCur + iSpeed + 'px';
                }
            }

        }

        if(iBool){
            clearInterval(obj.timer);
            fn && fn.call(obj);
        }

    }, 30);
}
// 获取样式
function getCss(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj,null)[attr];
    }
}
/*
 弹性运动
 params : 
 	obj : [Object] 目标dom节点对象
 	json : {       配置项
 		属性 : 属性值 (如：width:100)
 	}
 	fn : [Function] 运动结束后的回调函数
 	
 bug : 
 	- 设置多个属性时，不能停下来，尚未找到原因
 * */
function elasticMove(el,json,fn){
	var iSpeed = 0;
	var iCur = 0;
	clearInterval(el.timer);
	el.timer = setInterval(() => {
		let iBool = true;
		for (const attr in json) {
      let iTaget = json[attr]; // 目标点的值
      var iCur = parseInt(getCss(el,attr));

      iSpeed += (iTaget - iCur) / 6;
			iSpeed *= 0.75;

      if(Math.abs(iSpeed) < 1 && Math.abs(iTaget - iCur) < 1){
				el.style[attr] = iTaget + 'px';
				iSpeed = 0;
			}else{
				iBool = false;
				var value_ = iCur + iSpeed;
				if((attr === 'height' || attr === 'width') && value_ < 0){
          value_ = 0;  // 解决ie低版本浏览器下 弹性越界的问题（低版本浏览器 不支持宽 高 为负数的情况）
      	}
				console.log(value_)
				el.style[attr] = value_ + 'px';
			}
    }
		if(iBool){
        clearInterval(el.timer);
        fn && fn.call(el);
    }
	},30);
}