var $c = {};
/*
计算指定月份的天数函数 
	注意：
		参数：
			oMonth : [Number] 月份（getMonth()已经处理过的月份）
			oYear : [Number] 年份
	 	返回值：[Number]
 * */
$c.computeDaysFn = function (oMonth,oYear){
	var days = 31;
	switch (oMonth){
		case 2:
			days = isLeapYear(oYear) ? 29 : 28;
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			days = 30; 
			break;
		default:
			days = 31;
			break;
	}
	// 判断是否时瑞年函数
	function isLeapYear(oYear){
		if(oYear % 4 == 0 && oYear % 100 != 0){
			return true;
		}else{
			if(oYear % 400 == 0){
				return true;
			}else{
				return false;
			}
		}
	}
	return days;
}
/*
获取当前日期信息
	注意：
	参数：
		oDate : [Object] 日期对象 （默认时当前日期）
		isDs : [Boolean] 是否计算出当月的days天数(默认不计算)
 	返回值：[Object] 带有y年 m月（0 表示 一月）w 周（0 表示 周日） d日 h时 mt分 s秒 t毫秒
 * */
$c.getDate = function (oDate,isDs){
	var d = oDate || new Date(),
			res = {
				y : d.getFullYear(), // 年
				m : d.getMonth(), // 月（0 表示 一月）
				w : d.getDay(), // 周 （0 表示 周日）
				d : d.getDate(), // 日
				h : d.getHours(), // 时
				mt : d.getMinutes(), // 分
				s : d.getSeconds(), // 秒
				t : d.getTime() // 毫秒
			};
			
	if(isDs){
		res.days = $c.computeDaysFn(res.m + 1,res.y); // 计算当月天数
	}
			
	return res;
};
/*
获取前一天信息
	注意：
	参数：
		y : [Number] 年份
		m : [Number] 月份（原始，getMonth()不曾处理过的月份）
		d : [Number] 天
 	返回值：[Object] 
 * */
$c.getBeforDay = function (y,m,d){
	var res = {
		y : y,
		m : m,
		d : d - 1
	}
	
	if(d == 1){
		// 当d 是此月的第一天时...
		var bm = $c.getBeforMonth(y,m); // 获取上一月信息
		
		var bmds = $c.computeDaysFn(bm.m + 1,bm.y); // 获取上一月的天数
		
		res.y = bm.y;
		res.m = bm.m;
		res.d = bmds;
		
	}
	
	return res;
}
/*
获取后一天信息
	注意：
	参数：
		y : [Number]* 年份
		m : [Number]* 月份（原始，getMonth()不曾处理过的月份）
		d : [Number]* 天
		ds : [Number] 此月的天数（默认使用$c.computeDaysFn函数计算）
 	返回值：[Object] 
 * */
$c.getAfterDay = function (y,m,d,ds){
	var res = {
		y : y,
		m : m,
		d : d + 1
	}
	ds = ds || $c.computeDaysFn(m + 1,y);
	if(d == ds){
		// 当d 是此月的最后一天时...
		var am = $c.getAfterMonth(y,m);  // 下一月信息
		
		res.y = am.y;
		res.m = am.m;
		res.d = 1;
	}
	
	return res;
}
/*
计算上一月信息
	注意：
	参数：
		oYear : [Number] 年份
		oMoth : [Number] 月份（原始，getMonth()不曾处理过的月份）
 	返回值：[Object] 
 * */
$c.getBeforMonth = function (oYear,oMoth){
	var res = {
		y : oYear,
		m : oMoth - 1
	};
	if(oMoth == 0){
		res.y = oYear - 1;
		res.m = 11;
	}
	return res;
}
/*
计算下一月信息
	注意：
	参数：
		oYear : [Number] 年份
		oMoth : [Number] 月份（原始，getMonth()不曾处理过的月份）
 	返回值：[Object] 
 * */
$c.getAfterMonth = function (oYear,oMoth){
	var res = {
		y : oYear,
		m : oMoth + 1
	};
	if(oMoth == 11){
		res.y = oYear + 1;
		res.m = 0;
	}
	return res;
}
/*
计算上一年和下一年
	注意：
	参数：
		oYear : [Number] 年份
 	返回值：[Object]
 * */
$c.getBAyear = function (oYear){
	return {
		prev : oYear - 1,
		next : oYear + 1
	}
}
/*
获取日期，并计算相关信息 -> 综合性函数
	注意：
	参数：
		{
			oDate : [Object] 日期对象 （默认时当前日期）
			isDs : [Boolean] 是否计算出当月的days天数(默认false不计算)
			nCase : [Number] （默认当前日期信息）可以传两个case的结合例如：12-当前日期 加 前后天
				1-当前日期，
				2-带前一天和后一天信息，
				3-带上一月和下一月信息
				4-带上一年和下一年信息
				5-全部都带
		}
		
 	返回值：[Object] 带有y年 m月（0 表示 一月）w 周（0 表示 周日） d日 h时 mt分 s秒 t毫秒
 * */
$c.getDateHandler = function (oConfig){
	var result = {};
	defaultConfigFn();  // 初始化默认参数
	// 当前日期
	var current = $c.getDate(oConfig.oDate,oConfig.isDs);
	// 下一天
	function getBday(obj){
		var prev = $c.getBeforDay(obj.y,obj.m,obj.d);
		// 拨动时间
		oConfig.oDate.setFullYear(prev.y); // 拨动年份
		oConfig.oDate.setMonth(prev.m); // 拨动月份
		oConfig.oDate.setDate(prev.d); // 拨动月份
		
		result.bDay = $c.getDate(oConfig.oDate,oConfig.isDs);
	}
	// 下一天
	function getAday(obj){
		var next = $c.getAfterDay(obj.y,obj.m,obj.d,obj.ds);
		// 拨动时间
		oConfig.oDate.setFullYear(next.y); // 拨动年份
		oConfig.oDate.setMonth(next.m); // 拨动月份
		oConfig.oDate.setDate(next.d); // 拨动月份
		
		result.aDay = $c.getDate(oConfig.oDate,oConfig.isDs);
	}
	// 上一月
	function getBmonth(obj){
		var res = {};
		var prev = $c.getBeforMonth(obj.y,obj.m);
		// 拨动时间
		oConfig.oDate.setFullYear(prev.y); // 拨动年份
		oConfig.oDate.setMonth(prev.m); // 拨动月份
		
		result.bMonth = $c.getDate(oConfig.oDate,oConfig.isDs);
	}
	// 下一月
	function getAmonth(obj){
		var res = {};
		var next = $c.getAfterMonth(obj.y,obj.m);
		// 拨动时间
		oConfig.oDate.setFullYear(next.y);
		oConfig.oDate.setMonth(next.m);
		
		result.aMonth = $c.getDate(oConfig.oDate,oConfig.isDs);
	}
	// 上一年
	function getByear(obj){
		oConfig.oDate.setFullYear(obj.y - 1);
		result.bYear = $c.getDate(oConfig.oDate,oConfig.isDs);
	}
	// 下一年
	function getAyear(obj){
		oConfig.oDate.setFullYear(obj.y + 1);
		result.aYear = $c.getDate(oConfig.oDate,oConfig.isDs);
	}
	
	switch (oConfig.nCase){
		case 1:
			result.current = current;
			break;
		case 12:
			result.current = current;
			getBday(current);
			getAday(current);
			break;
		case 13:
			result.current = current;
			getBmonth(current);
			getAmonth(current);
			break;
		case 13:
			result.current = current;
			getByear(current);
			getAyear(current);
			break;
		case 2:
			getBday(current);
			getAday(current);
			break;
		case 23:
			getBmonth(current);
			getAmonth(current);
			
			getBday(current);
			getAday(current);
			break;
		case 24:
			getByear(current);
			getAyear(current);
			
			getBmonth(current);
			getAmonth(current);
			
			getBday(current);
			getAday(current);
			break;
		case 3:
			getBmonth(current);
			getAmonth(current);
			break;
		case 34:
			getByear(current);
			getAyear(current);
			
			getBmonth(current);
			getAmonth(current);
			break;
		case 4:
			getByear(current);
			getAyear(current);
			break;
		case 5:
			result.current = current;
			
			getByear(current);
			getAyear(current);
			
			getBmonth(current);
			getAmonth(current);
			
			getBday(current);
			getAday(current);
			
			break;
		default:
			console.log('无效的 cCase！！！')
			break;
	}
	
	// 初始化默认参数
	function defaultConfigFn(){
		oConfig = oConfig || {};
		
		oConfig.oDate = oConfig.oDate === undefined ? new Date() : oConfig.oDate;
		
		oConfig.isDs = oConfig.isDs === undefined ? false : oConfig.isDs;
		
		oConfig.nCase = oConfig.nCase === undefined ? 1 : oConfig.nCase;
	}
	
	return result;
}