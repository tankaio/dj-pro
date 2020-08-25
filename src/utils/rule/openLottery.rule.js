/**
 * @description 所有正特码7个开奖号码数字之和大于等于176为和值 大；小于等于175为和值 小。
 * 单计划限制：每期最多推荐1个选项作为计划发布。
 * @param {Number} sum 
 */
export let getSize = (sum) => {
    if (sum >= 176) {
        return "大"
    } else {
        return "小"
    }
}
/**
 * @description 所有正特码7个开奖号码数字之和是单数为和值 单；是双数为和值 双（单147个；双148个）。
 * @param {Number} sum 
 */
export let odd_even = (sum) => {
    if (sum % 2 == 1) {
        return '单'
    } else {
        return '双'
    }
}

/**
 * @description 所有正特码7个开奖号码数字之和
 * @param {Number} arr 
 */
export let getSum = arr => {
    let begin = 0
    arr.forEach(item => {
        begin += item
    })
    return begin
}

/**
 * @description 开奖对应号码数字大于等于25为  码n（例：码一、码二等） 大；小于等于24为 码n（例：码一、码二等） 小
 * @param {Array}} arr  [1,2,3,4,5,6,,7] empty 为加号
 */
export let getSingleSize = arr => {
    let res = []
    arr.forEach((item, index) => {
        if (index == 6) {
            res.push('')
        }
        if (item >= 25) {
            res.push('大')
        } else {
            res.push('小')
        }
    })
    return res
}

/**
 * @description 开奖所开出的对应号码数字为单数则为 码n（例：码一、码二等） 单；为双数则为 码n（例：码一、码二等） 双。
 * @param {Array} arr 
 */
export let getSingleOddEven = arr => {
    let res = []
    arr.forEach((item, index) => {
        if (index == 6) {
            res.push('')
        }
        if (item % 2 == 1) {
            res.push('单')
        } else {
            res.push('双')
        }
    })
    return res
}

/**
 * @description 合数是指奖号的个位数的值与十位数的值相加的结果。例如：奖号为01，则合数为：0+1=1
 */
export let getSpecialSum = (num) => {
    return Math.floor(num / 10) + num % 10
}

/**
 * @description 特合数是指奖号的个位数的值与十位数的值相加的结果。例如：奖号为01，则合数为：0+1=1合数为1、2、3、4、5、6 为 小；合数为7、8、9、10、11、12、13为 大
 * @param {*} num 
 */
export let getSpecailSize = (num) => num <= 6 ? '小' : '大'