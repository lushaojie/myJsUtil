/*
随机生成简单的列表数据
	options:
		leng [Number]*  列表长度
		items [{  -- *  列表中每一个对象的配置
            key [String], -- 列表中每一个对象中所需要的key
            lengs [Array], -- 长度区间值 默认[5,10]
            type [Number] -- 参考随机的字符串的typeNum 默认4(中文)
        }]
	返回值：[Array] 示例：[{id: xxx, name: xxx}]
 * */
export const mockListFn = function (options) {
    var arr = [];
    var itemsLeng = options.items.length;

    for (var i = 0; i < options.leng; i++) {
        var item = { id: createRandomStr(10, 1) + '' + i }; // 生成唯一id

        for (var j = 0; j < itemsLeng; j++) {
            var itemConfig = options.items[j];
            var itemLeng = 0;
            if(itemConfig.lengs){
                itemLeng = randomBasedSection(itemConfig.lengs[0], itemConfig.lengs[1])
            }else{
                itemLeng = randomBasedSection(5, 10)
            }
            item[itemConfig.key] = createRandomStr(itemLeng, itemConfig.type || 4, itemConfig.isSymbol); // 生成每一项的模拟数据
        }

        arr.push(item)
    }

    return arr;
}
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
export const createRandomStr = function (leng, typeNum, isSymbol) {
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

        // 带符号的情况
        if(isSymbol && Math.random() > 0.7){
            var arr2 = [
                [32, 47], // 标点自1区(32是空格)
                [58, 64], // 标点2区
                [91, 96], // 标点3区
                [123,126] // 标点4区
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
export const randomBasedSection = function (small, big) {
    return Math.round(Math.random() * (big - small) + small);
};