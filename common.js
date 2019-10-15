import matchExcerciseApi from 'api/homework/MatchExcercise'

import RouterList from "../../router/router"

const jsonStr = () => {
    return JSON.stringify
}
const jsonObj = () => {
    return JSON.stringify
}
/**
 *
 */
const wordCount = (content) => {
    return $("<div>" + content + "</div>").text().length
}

const fetchEditions = async (subjectId,navigationCode) => {
    let params={
        termId:util.getTermId() || 2,
        subjectId
    }
    let editions = await matchExcerciseApi.fetchEditions(params)
    let editionItem = editions.filter((item)=>{
        return item.tfcode== navigationCode.slice(0,8)
    })
    return editionItem[0].id
}

const fetchBooks = async (editionId,navigationCode) => {
    let books = await matchExcerciseApi.fetchBooks({
        editionId
    })
    let bookItem = books.filter((item)=>{
        return  item.tfcode === navigationCode.slice(0,10);
    })
    return bookItem
}

const fetchChapters = async (bookItem,navigationCode) => {
    let chapters = await matchExcerciseApi.fetchChapters({
        bookId:bookItem[0].id
    })
    let chaptersItem = chapters[0].children.filter((item)=>{
        return item.tfcode === navigationCode.slice(0,12);
    })
    let selectChapter =chaptersItem[0].children && chaptersItem[0].children.filter((item)=>{
        return item.tfcode ===navigationCode.slice(0,14)
    })
    console.log("sleel",selectChapter)
    let lastChapter =selectChapter!=undefined && !!selectChapter.length && selectChapter[0].children && selectChapter[0].children.filter((item)=>{
        return item.tfcode ===navigationCode.slice(0,16)
    })
    console.log("chapter",chapters,chaptersItem,selectChapter,lastChapter)
    return {
        selectBookName:bookItem[0].name,
        selectChapterName:(lastChapter && !!lastChapter.length && lastChapter[0].name) ||
        (selectChapter && !!selectChapter.length && selectChapter[0].name) ||
        (chaptersItem && !!chaptersItem.length && chaptersItem[0].name),
        selectBookId : bookItem[0].id,
    }
}


/**
 * 提示信息封装
 * @type warning success error
 * @text 提示信息
 */
const notifyMessage = (type, text) => {
    return {
        title: '提示',
        message: text,
        duration: 1000,
        type: type
    }
}
/**
 * 解析window.location.serch
 * @name 地址栏参数
 */
const getSearchByName = function (name) {
    var reg = new RegExp("[?|&]" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.href.match(reg);
    if (r != null) return (r[1].split('#')[0]);
    return null;
}

/**
 * 移动到 div[contenteditable] 最后
 */
const moveCursorToEnd = function (obj) {
    if (window.getSelection) { //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
    } else if (document.selection) { //ie10 9 8 7 6 5
        var range = document.selection.createRange(); //创建选择对象
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
    }
}

/**
 * 是否送过鲜花
 * return true| false
 */
const hasSendFlower = function (data, userId) {
    if (!data) return false
    let index = false
    data.forEach((item) => {
        if (item.userId == userId) index = true
    })
    return !!index ? true : false
}



/*
 * json转成url格式
 * 中文encode
 */
const jsonUrlFormat = function (data) {
    let param = function (obj) {
        let query = ''
        let name, value, fullSubName, subName, subValue, innerObj, i
        for (name in obj) {
            value = obj[name]
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i]
                    fullSubName = name + '[]'
                    innerObj = {}
                    innerObj[fullSubName] = subValue
                    query += param(innerObj) + '&'
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName]
                    fullSubName = name + '[' + subName + ']'
                    innerObj = {}
                    innerObj[fullSubName] = subValue
                    query += param(innerObj) + '&'
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&'
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query
    }
    // 加上token 和 sign签名
    let dataCustom = param(data) + '&noCache=' + new Date().getTime()
    return data.toString() === '[object Object]' ? dataCustom : data
}



/*
 * 处理post请求,application/json格式传参
 * 封装 data
 */
const encapData = function (params) {

    return {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: doJson(params)
    }
}
/**
 *
 * 处理post请求，application/x-www-form-urlencoded方式传参
 */
const encapDataForm = function (params) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: jsonUrlFormat(params)
    }
}

/**
 * 处理post请求，简单encode封装
 */

const doJson = function(params) {
	return params
}

const getDeviceType = function(){
    let userAgent = window.navigator.userAgent;
    let isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
    let isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    let isBrowser = (!isAndroid && !isIOS)?true:false;
	let isMiniProgram = getSearchByName('isMiniProgram')?true:userAgent.indexOf('miniProgram') > -1;
	// console.log("userAgent:", isAndroid, isIOS, isBrowser, isMiniProgram, userAgent)
    return {
        isAndroid,
        isIOS,
        isBrowser,
		isMiniProgram
    }
};

const getMD5 = function(str) {
	return hex_md5(str);
};

const getMd5Key = function(o, token) {
	o.token = token;
	var tfeduKey = '[tfedu]';
	var key, a = [];
	var values = '';

	for(key in o) {
		if(o.hasOwnProperty(key)) {
			a.push(key);
		}
	}
	a.sort();
	// 取出 排序好的 其中的值 拼成 待加密字符串
	for(key = 0; key < a.length; key++) {
		// 处理value未定义等
		if(o[a[key]] == undefined) {
			o[a[key]] = '';
		}
		values += o[a[key]] + tfeduKey
	}
	// 最后加上 appKey
	values += window.appKey;
		// 	console.log(o, values)
	return getMD5(values)
};

// 获取用户id
const getUserId = function(){
    // Cookies.get('userId') ||
    let id = 0;
    if(Cookies.get('user')){
        let userInfo = {
            user: Cookies.get('user')
        };
        store.set('userInfo', userInfo);
        id = Cookies.get('user').userId;
    }else if(store.get('userInfo')){
        id = store.get('userInfo').user.userId;
    }else if(dsBridge.call("getUserInfo","")){
        id =  JSON.parse(dsBridge.call("getUserInfo","")).userId;
    }else{
        id =  util.getSearchByName('userId');
    }
    // match(/\d+/g).join('')
    id = id.match(/\d+/g).join('');
    return id;
};

const getFullName = function(){
    return Cookies.get('user') && Cookies.get('user').fullName || dsBridge.call("getUserInfo").user.fullName || store.get('userInfo') && store.get('userInfo').user.fullName
}

// 获取用户信息
// 默认从cookie里读取，存入store中使用
const getUserInfo= function(){
	let userInfo ={};
	if(Cookies.get('user')) {
		userInfo = {
			user: Cookies.get('user')
		};
		store.set('userInfo', userInfo)
	} else {
		userInfo =  store.get('userInfo')
	}
    userInfo && (userInfo.user.userId = userInfo.user.userId.match(/\d+/g).join(''));
	return userInfo
};

const getTermId = function () {
    return store.get('userInfo') && store.get('userInfo').user && store.get('userInfo').user.termId;
};

// 根据ID查找班级
const getClassName = function(id,data){

    if(data.__proto__.construtor == Array) {
        let theClass = data.find((item)=>{
            if(item.id == id){
                return true
            }
        })
        return theClass && theClass.name
    }
    
}

/**获取用户角色 */
const getRoles = function(){
    let id = store.get('userInfo') && store.get('userInfo').user && store.get('userInfo').user.roleList[0].id
    return {
        isStudent: id == 1,
        isTeacher: id == 2,
        isParent: id == 3
    }
}

const getRoleId = function(){
    let id = store.get('userInfo') && store.get('userInfo').user && store.get('userInfo').user.roleList[0].id
    return id
}

// 校验规则
const Rules = {
    classId: {
        required: true,
        name: '班级'
    },
    name: {
        required: true,
        name: '标题'
    },
    intro: {
        required: true,
        name: '内容'
    }
}

/**
 * 校验提示
 * @param data {a:1,b:2}
 * @param rules:{title:{name:'abc',required:true}}
 */
const checkRules = function (data,rules=Rules) {
    // console.log(data, rules)
    for (let rule in rules) {
        if (rules[rule].required) {
            if (!data[rule] || (data[rule] instanceof Array && !data[rule].length)) {
                dsBridge.call("showToast", { data: `${rules[rule].name}不能为空` })
                return false
            }
        }
    }
    return true
}

// 获取学科列表
const getSubjectList = function(){
    return store.get('subjectList') || []
}

// 获取班级列表
const getClassList = function() {
    return store.get('classList') || []
}

// 获取班级Id列表
const getClassIdList = function() {
    let classList = getClassList()
    return classList.reduce(function(arr,item){
        return arr.concat(item.id)
    },[])
}

// 是否是学科Id
const isSubjectId = function(id){
   let subjectList = getSubjectList()
   let theSubject = subjectList.find((item)=>item.subjectId == id)
   return !!theSubject
}


//根据学科id获取学科名称
const getSubjectName = function(id){
   let subjectList = getSubjectList()
   let theSubject = subjectList.find((item)=>item.id == id)
   return theSubject
}

//  根据班级Id获取班级名称
const getClassNameById = function(id){
   let classList = getClassList()
   let theClass = classList.find((item)=>item.id == id)
   return theClass.className
}

// 同上
const isClassId = function(id){
   let classList = getClassList()
   let theClass = classList.find((item)=>item.id == id)
   return !!theClass
}

/**
 * 页面跳转方法，兼容pC、客户端、小程序
 * @param {*} url 相对路径
 * @param {*} context this
 */
const goForward = function(url,context,fn) {
    let originUrl = location.origin + location.pathname + '#'
	if(getDeviceType().isMiniProgram){
		// 小程序跳转处理 格式： /pages/webview/common?page=+  page + 页面标题 + 其他参数
		// 提取page
		let page = url.split("?")[0]
		let name = ''
		RouterList.forEach((item) => {
			if(url.indexOf(item.path) > -1 && item.toolbar) name = item.toolbar.title.content
		})
		url = '/pages/webview/common?page=' + url.replace('?', '&') + "&name=" + name
		wx.miniProgram.navigateTo({
			url
		});
		// console.log(url,getDeviceType().isMiniProgram)
	} else if(getDeviceType().isBrowser){
        context.props.history.push(url)
    }else{
        dsBridge.call("openNewPage", {
            "data": originUrl + url
        });
    }
};
/*
* h5 跳原生页面
* pConfig {
*   miniProgram : [String] 小程序url(参数接在 url 后面)
*   app :         [String] app方法名
*   appData :     [Object] 原生app参数
*   web :         [String] pc端 url (参数接在 url 后面)
* }
* fn : [Function] 回调函数 (用于给原生app传参)
* */
const goNativePage = function(pConfig,callBack) {
    if(getDeviceType().isMiniProgram){
        // 小程序跳转处理
        let url = pConfig.miniProgram;
        wx.miniProgram.navigateTo({
            url
        })
    } else if(getDeviceType().isBrowser){
        context.props.history.push(url)
    }else{
        dsBridge.call(pConfig.app, pConfig.appData,function (responseData) {
            callBack && callBack(responseData);
        });
    }
};


/**
 * 页面回退，兼容pC、客户端、小程序
 * config {
 *  num ; [Number]  回退页数
 *  isBackToHome : [Number]  0 回到首页 1 以 num 值为准回退
 * }
 */
const goBack = function(config,context) {
	let originUrl = location.origin + location.pathname + '#'
	if(getDeviceType().isMiniProgram){
		wx.miniProgram.navigateBack({
			delta: config.num
		})
	} else if(getDeviceType().isBrowser){
		context.props.history.go(-config.num)
	}else{
		dsBridge.call("closeNumPage", config);
	}
};


/**
 * 页面返回方法
 * @param {*} url 跳转相对路径
 * @param {*} eventName 注册的用于原生调用的方法
 * @param {*} param 给原生传递的参数
 * @param {*} callback 页面返回触发的回调函数
 * @param {*} context this
 */
const goBackward = function(url,eventName,param,callback,context) {
    if(getDeviceType().isBrowser){
        context.props.history.push({
            pathname: url,
            search: `?${jsonUrlFormat(param)}`
        })
        callback.apply(context,param)
    }else{
        dsBridge.register(eventName,
            function(param) {
                dsBridge.call("closeCurrPage");
                callback.apply(context,param)
            }
        )
        dsBridge.call("sendEvent", {
            "tag": "file:///android_asset/jsbridge.html", 
            "event": eventName, 
            "args": param
        })
    }
}

const getYear = (date = new Date().getTime()) => {
    return new Date(date).getFullYear()
}
const getMonth = (date = new Date().getTime()) => {
    return new Date(date).getMonth()
}
const getDate = (date = new Date().getTime()) => {
    return new Date(date).getDate()
}

// 根据日期判断是否同一天
const isInTheSameDay = (date1,date2) => {
    let year1 = getYear(date1)
    let month1 = getMonth(date1)
    let day1 = getDate(date1)
    let year2 = getYear(date2)
    let month2 = getMonth(date2)
    let day2 = getDate(date2)
    if(year1 == year2 && month1 == month2 && day1 == day2){
        return true
    }else{
        return false
    }
}

//判断是否是数组
const isNullArray = function(data){
    if(data instanceof Array && !data.length){
        return true
    }
    return false
}

// 判断是否是空对象
const isNullObject = function (data) {
    if (Object.prototype.toString.call(data) == '[object Object]' && !Object.keys(data).length){
        return true
    }
    return false
}

const loop = function(data,index){
    if(index>=1){
        if (data[index] === data[index - 1]) {
            data.splice(index, 1);
        }
        loop(index - 1)
    }
}

// 数组去重和排序
const uniqueAndSort = function(arr=[],sortField,isUp){
    let len = arr.length
        arr.sort((a,b)=>a[sortField]-b[sortField])
    loop(arr,len-1)
    return arr
}

// json数组根据发布时间排序
const sortByReleaseTime = function (arr, time ='releaseTime'){
    arr.sort((a, b) => new Date(b[time]).getTime() - new Date(a[time]).getTime())
    return arr
}

//将时间戳或格林时间转成 年-月-日 时:分:秒 时间格式默认:'yyyy-MM-dd HH:mm:ss'
const formatTime = function(time, format='yyyy-MM-dd HH:mm:ss') {
    let datetime
    if(!!time){
        datetime = new Date(Date.parse(time));
    }

    if(datetime == 'Invalid Date' || !datetime) return false

    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let date = datetime.getDate();
    let hour = datetime.getHours();
    let minute = datetime.getMinutes();
    let second = datetime.getSeconds();
    if(/yyyy/.test(format)) {
        format = format.replace(/yyyy/, year);
    }
    if(/MM/.test(format)) {
        if((month + 1) < 10) {
            format = format.replace(/MM/, '0' + (month + 1));
        } else {
            format = format.replace(/MM/, (month + 1));
        }
    }
    if(/dd/.test(format)) {
        if(date < 10) {
            format = format.replace(/dd/, '0' + date);
        } else {
            format = format.replace(/dd/, date);
        }
    }
    if(/HH/.test(format)) {
        if(hour < 10) {
            format = format.replace(/HH/, '0' + hour);
        } else {
            format = format.replace(/HH/, hour);
        }
    }
    if(/mm/.test(format)) {
        if(minute < 10) {
            format = format.replace(/mm/, '0' + minute);
        } else {
            format = format.replace(/mm/, minute);
        }
    }
    if(/ss/.test(format)) {
        if(second < 10) {
            format = format.replace(/ss/, '0' + second);
        } else {
            format = format.replace(/ss/, second);
        }
    }
    return format + ' ';
}

// 显示星期几
const showWeek = function(date){
    let weekNumber = new Date(date).getDay()
    let enumber = {
        '0': '星期日',
        '1': '星期一',
        '2': '星期二',
        '3': '星期三',
        '4': '星期四',
        '5': '星期五',
        '6': '星期六'
    }
    return enumber[weekNumber]
}

// 将时间显示成今天/昨天/前天 或者月-日，或者年-月-日或者周几
const showTodayYesterdy = function(date,format){
    let createDate = new Date(date)
    createDate=isWhichDay(createDate)
    if(!!format && format != 'week'){

        createDate+=formatTime(date,"HH:mm")
    }
    if (!!format && format == 'week'){
        createDate+= ' ' + showWeek(date)
    }
    return createDate
}

const isWhichDay=function(date){
    let createDate = new Date(date)
    if (createDate == 'Invalid Date') return
    let currentDate = new Date()
    let createDateTimestamp = createDate.getTime()
    let nextDayDate = new Date(date) //更新时间第二天的日期
    nextDayDate.setDate(nextDayDate.getDate() + 1)
    // 获取创建时间下一天0点的时间差
    let difftime1 = parseInt((new Date(Date.parse(formatTime(nextDayDate, "yyyy/MM/dd 00:00:00"))) - createDate) / 1000) //更新时间跟第二天零点的时间差，单位：秒
    // 获取创建时间跟当前时间的时间差
    let difftime2 = parseInt((currentDate.getTime() - createDateTimestamp) / 1000) //获得两个时间的时间差（秒），当前时间-最新更新时间
    if (difftime2 < difftime1) {
        createDate = "今天 "
    } else if (difftime2 < (difftime1 + 3600 * 24)) {
        createDate = "昨天 "
    } else if (difftime2 < (difftime1 + 3600 * 24 * 2)) {
        createDate = "前天 "
    }else if(createDate.getFullYear()==currentDate.getFullYear()){
        createDate=formatTime(date, "MM-dd")
    }else{
        createDate=formatTime(date, "yyyy-MM-dd")
    }
    return createDate
}

//处理今天昨天前天 format="yyyy-MM-dd HH:mm:ss"
//2018-09-07 14:19:16  --- 今天/昨天/前天 14:19
const showDayAndHHmm=function(value,format){
    if(!value) return
    let valueFormat;
    if(/-/.test(value)){
        valueFormat = value.replace(/-/gi, "/")
    }else{
        valueFormat = value
    }
    return showTodayYesterdy(valueFormat,format)
}

//2018-09-07 14:19:16  --- 09月07日
const showMonthDay=function(value,format="HH:mm"){
    if(!value) return
    let valueFormat;
    if(/-/.test(value)){
        valueFormat = value.replace(/-/gi, "/")
    }else{
        valueFormat = value
    }
    return formatTime(valueFormat,format)
};
// 本月时间第一天
const getCurrentMonthFirst = function(date,delayTime){
    if(delayTime){
        let m = date.getMonth() - delayTime;
        date.setMonth(m);
    }
    date.setDate(1);
    let month = parseInt(date.getMonth()+1);
    let day = date.getDate();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day + ' 00:00:00';
};
// 本月时间最后一天
const getCurrentMonthLast = function(date,delayTime){
    if(delayTime){
        let m = date.getMonth() - delayTime;
        date.setMonth(m);
    }
    let currentMonth=date.getMonth();
    let nextMonth=++currentMonth;
    let nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
    let oneDay=1000*60*60*24;
    let lastTime = new Date(nextMonthFirstDay-oneDay);
    let month = parseInt(lastTime.getMonth()+1);
    let day = lastTime.getDate();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day + ' 23:59:00';
};

const addProperty = function(target, json){
    return Object.assign(target,json)
};

const decode = function(str){
    return decodeURIComponent(str)
};

/**
 * 修改state对象
 * @param {*} context this
 * @param {*} json 修改后的key-value对
 */
const setState = function(context,json){
    context.setState((prevState) => {
        for( let i in json ){
            Object.assign(prevState,{[i]:json[i]})
        }
        return prevState
    })
}

/**
 * 根据url参数数组，获取对应对象
 * eg.  getParams(['a','b']) => {a,b}
 */
const getParams = (function(){
    let tempObj = {}
    return function (params){
        for(let i of params){
            let key = i, value = util.getSearchByName(i)
            if(/\,/.test(value)){
                value = value.split(',')
            }
            Object.assign(tempObj,{[key]:value})
        } 
        return tempObj  
    }
})()

// 格林时间转成年-月-日 时:分:秒
const GMTToStr = function(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate() + ' ' + 
    date.getHours() + ':' + 
    date.getMinutes() + ':' + 
    date.getSeconds()
    return Str
}

//  处理时间分组
const firstDataHandle = function(list){
    if (!list) return
    list.forEach((item) => {
        item.isFirst = true
    })
    let followArray = list.slice(1)
    followArray.forEach((item, i) => {
        let firstTime = list[i].releaseTime || list[i].createTime
        let followTime = item.releaseTime || item.createTime
        if(firstTime.split(" ")[0]==followTime.split(" ")[0]){
            item.isFirst=false
        }
        // if (firstTime && followTime) {
        //     if (formatTime(firstTime, "yyyy-MM-dd") == formatTime(followTime, "yyyy-MM-dd")) {
        //         //console.log(firstTime,followTime)
        //         item.isFirst = false
        //     }
        // }

    })
    return list
};
const maxAndMinComputedHandler = function(arr,max,min,k){
    let maxObj = null,
        minObj = null;
    arr.forEach((item,index) => {
        if(max === parseInt(item[k])){
            maxObj = item;
        }
        if(min === parseInt(item[k])){
            minObj = item;
        }
    });
    return {
        maxObj,
        minObj
    }
}

/** 上下 学期处理
 * year string 班级级数，eg. 2014
* return [] 处理后的学期数组
*/
const doSemester = function (year){
    var date = new Date();
    //学期列表
    var semesterlist = [];
    for(var i = 0; i < 6; i++) {
        var semester = {};
        if(parseInt(date.getMonth())+1 >= 8) {
            semester.sem = date.getFullYear() + "-" + (date.getFullYear() + 1 )+ "上学期";
            semester.sem_begin = date.getFullYear() + "-08-01";
            semester.sem_end = date.getFullYear() + 1 + "-01-31";
            semester.id = i;
        } else if(parseInt(date.getMonth())+1 >= 2 && parseInt(date.getMonth())+1 < 8) {
            if(year != '' && year == date.getFullYear())
                break;
            semester.sem = date.getFullYear() - 1 + "-" + date.getFullYear() + "下学期";
            semester.sem_begin = date.getFullYear() + "-02-01";
            semester.sem_end = date.getFullYear() + "-07-31";
            semester.id = i;
        } else {
            semester.sem = date.getFullYear() - 1 + "-" + date.getFullYear() + "上学期";
            semester.sem_begin = date.getFullYear() - 1 + "-08-01";
            semester.sem_end = date.getFullYear() + "-01-31";
            semester.id = i;
        }
        semesterlist.push(semester);
        date.setMonth(parseInt(date.getMonth()) - 6);
    }
    //		console.log(semesterlist);
    // 全局用
    window.sessionStorage.setItem('ngStorage-SemesterList', JSON.stringify(semesterlist));
    return semesterlist;
}

const util = {
    getCurrentMonthFirst,
    getCurrentMonthLast,
    maxAndMinComputedHandler,
    jsonStr,
    jsonObj,
    wordCount,
    notifyMessage,
    getSearchByName,
    moveCursorToEnd,
    hasSendFlower,
    jsonUrlFormat,
    encapData,
    encapDataForm,
    doJson,
    getDeviceType,
    getMd5Key,
    getUserId,
	getUserInfo,
    getClassName,
    getTermId,
    getRoles,
    getRoleId,
    checkRules,
    getSubjectList,
    getClassList,
    isSubjectId,
    isClassId,
    getClassNameById,
    getSubjectName,
    goForward,
    goNativePage,
	goBack,
	goBackward,
    isInTheSameDay,
    isNullArray,
    isNullObject,
    uniqueAndSort,
    showMonthDay,
    sortByReleaseTime,
    addProperty,
    decode,
    getClassIdList,
    setState,
    getParams,
    formatTime,
    GMTToStr,
    firstDataHandle,
    doSemester,
    showDayAndHHmm,
    loop,
    fetchEditions,
    fetchBooks,
    fetchChapters,
    getFullName
}

window.getMd5Key = getMd5Key
window.getSearchByName = getSearchByName
window.getSeachByName = getSearchByName
window.util = util

