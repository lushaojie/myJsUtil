/**
 * 给定一个包含json对象的数组，如下：
 * [ 'a', {name: 'a', age: 20}, {name: 'b', age: 21}, 'b', 20, {name: 'a', age: 21}, 21, {name: 'b', age: 20} ]
 * 写一个函数 unique(tagArr, key) 去除重复的指定选项
 * 例：
 * unique(arr, 'name') 结果：[ 'a', {name: 'b', age: 21}, 20, 21 ]
 * unique(arr, 'age') 结果：[ 'a', {name: 'a', age: 20}, {name: 'b', age: 21}, 'b' ]
 */

// 答案
function unique(tagArr, key) {
    let temp = {},
        arr = [],
        leng = tagArr.length;
    for (let i = 0; i < leng; i++) {
        let item = tagArr[i];
        if(key && typeof(tagArr[i]) === 'object'){
            item = tagArr[i][key];
        }
        
        if (temp[item] === undefined) {
            temp[item] = i;
            arr.push(tagArr[i])
        } else {
            temp[item] += '-' + i;
        }
    }
    return arr;
}
const arr = [ 'a', {name: 'a', age: 20}, {name: 'b', age: 21}, 'b', 20, {name: 'a', age: 21}, 21, {name: 'b', age: 20} ]
const res = unique(arr, 'name');
console.log( res )