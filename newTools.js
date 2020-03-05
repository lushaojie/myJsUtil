// 使用 'a.b.c' 字符串 访问某个对象 就是用字符串路径来访问对象成员
function getValueByPath( obj, path ){
    let paths = path.split( '.' );
    let res = obj;
    let prop = null;
    while( prop = paths.shift() ){
        res = res[prop];
    }
    return res;
}

// 对象继承 es5 - 圣杯模式
function inherit(Target, Origin){
    function F(){};
    F.prototype = origin.prototype;
    Target.prototype = new F();
    Target.prototype.constuctor = Target; // 更正目标 对象 构造函数
    Target.prototype.uber = origin.prototype; // 标识 目标对象 正在继承的原型
}

// 对象深度克隆
function deepClone(origin, target){
    target = target || {};
    var toStr = Object.prototype.toString,
        arrStr = '[object Array]';

    for (const k in origin) {
        if (origin.hasOwnProperty(k)) { // 排除原型上的属性
            var v = origin[k];
            if(typeof(v) == 'object' && v !== null){
				
                target[k] = toStr.call(v) == arrStr ? [] : {};

                deepClone(v, target[k]);

            }else{
                target[k] = v;
            }
        }
    }

    return target;
}