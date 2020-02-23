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