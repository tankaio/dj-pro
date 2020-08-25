let xiao = {}
let old_curyear = ""
export function BuildBallsXiao(curyear) {
    if (!G.isEmpty(xiao) && curyear === old_curyear) return xiao
    let arr = ["猪", "狗", "鸡", "猴", "羊", "马", "蛇", "龙", "兔", "虎", "牛", "鼠"];
    if (arr.indexOf(curyear) < 0) return null;

    // 找到今年的一岁生肖
    while (arr[0] != curyear) {
        arr.splice(0, 0, arr[11]);
        arr.splice(12, 1);
    }

    // 构建号码生肖对照表
    xiao = {};
    for (let i = 1, ind = 0; i <= 49; i++, ind++) {
        if (ind > 11) ind = 0;
        xiao[i] = arr[ind];
    }
    return xiao;
}
/**
 * @param {BuildBallsXiao} xiao
 */
export function xiaoList(xiao, curyear) {
    let res = {}
    Object.keys(xiao).forEach(ele => {
        let val = xiao[ele]

        if (res[val]) {
            res[val].push(ele)
        } else {
            if (val !== curyear) {
                res[val] = [0, ele]
            } else {
                res[val] = [ele]
            }

        }
    })
    return res
}