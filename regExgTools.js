var $r = {
	cn : /[\u4e00-\u9fa5]/,  // 匹配中文
	blank : /^\s*|\s*$/,      // 行首行尾空格
	email : /^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/,  // email邮箱
	net : /^[a-zA-z]+:\/\/[^\s]*/,  // 网址
	qq : /^[1-9][0-9]{4,9}$/,       // qq号
	pCode : /^[1-9]\d{5}$/,         // 邮政编码
	idCard : /^[1-9]\d{14}$|[1-9]\d{17}$|[1-9]\d{16}x$/,  // 身份证
};
/*
正则-敏感词过滤函数（主要针对中文）：
	注意：英雄联盟游戏文件里面有一个文件，用记事本打开可以看到，里面全是敏感词。地址具体在X:\英雄联盟\Game\DATA\LanguageFilters
	参数：
	{
		tagStr : [String] 需要过滤的字符串
		sens : [Array]    敏感词数组
		ident : [String]  正则标识符(默认 g)
		rep : [String]    敏感词的代替字符(默认 *)
	}
 	返回值：[String]
 * */
$r.wordCensor = function (oConfig){
	oConfig.tagStr = oConfig.tagStr === undefined ? '' : oConfig.tagStr;
	oConfig.sens = oConfig.sens === undefined ? [] : oConfig.sens;
	oConfig.ident = oConfig.ident === undefined ? 'g' : oConfig.ident;
	oConfig.rep = oConfig.rep === undefined ? '*' : oConfig.rep;
	
	var reg = new RegExp(oConfig.sens.join('|'),oConfig.ident); // 正则
	
	var result = oConfig.tagStr.replace(reg,function (res){
		return res.replace(/\w|\W/g,oConfig.rep);
	})
	return result;
}
/*
正则-标签格式化：
	注意：
	参数：
		tag : [String] 需要格式化的字符串标签
		rep : [String] 替换标签的字符（默认把< 和 > 转为实体字符）
 	返回值：[String]
 * */
$r.formatLabel = function (tag,rep){
	tag = tag || '';
	if(rep === undefined){
		tag = tag.replace(/<|>/g,function ($0){
			return $0 == '<' ? '&lt' : '&gt';;
		});
	}else{
		tag = tag.replace(/<[^>]+>/g,rep);
	}
	return tag;
}
/*
qq号检测：
	注意：
	参数：
		tag : [String] 需要检测的字符串
 	返回值：[Boolean]
 * */
$r.testQq = function (tag){
	var reg = /^[1-9]\d{4,11}$/g;
	return reg.test(tag);
}