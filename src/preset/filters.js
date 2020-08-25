import Vue from 'vue'

let playColor = {
    '单双': 'ds',
    '大小': 'dx',
    '色波': 'sb',
    '生肖': 'sx',
    '合肖': 'hx',
    '正特码': 'ztm',
    '自选不中': 'zxbz',
    '连码': 'lm',
    '尾数': 'ws'
}

let red_circle = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
let blue_circle = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
let green_circle = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

// 9种玩法大类基本色
Vue.filter('playColor', function (val, type) {
    return playColor[val] || 'error'
})

// 胜率
Vue.filter('percentage', function (val = 0, sum = 0) {
    if (sum === 0) {
        return '0%'
    }
    let perct = Number.parseFloat(val / sum * 100).toFixed(2)
    return perct + '%'
})

Vue.filter("Gander", function (val = 0, qualifier) {
    if (qualifier === 'mark') {
        switch (val) {
            case 1:
                return 'male'
            case 0:
                return 'female'
            default:
                return ''
        }
    } else if (qualifier === 'icon') {
        switch (val) {
            case 1:
                return 'xIcon-male-gender'
            case 0:
                return 'xIcon-female-gender'
            default:
                return ''
        }
    }
    switch (val) {
        case 1:
            return '男'
        case 0:
            return '女'
        default:
            return '未设置'
    }
})

Vue.filter("Phone", function (val) {
    if (val) {
        return String(val).replace(/([0-9]{3})([0-9]{4})/, (match, p1, p2) => {
            return p1 + '****'
        })
    } else {
        return "未绑定"
    }
})

Vue.filter("Name", function (val) {
    if (val) {
        return val.replace(/^[\w\W]/, '*')
    } else {
        return '未填写'
    }
})

Vue.filter('BankID', function (val) {
    if (val) {
        return val.replace(/^([0-9]{4})([0-9]+)([0-9]{4})$/, (match, p1, p2, p3) => {
            return p1 + G.repeat('*', p2.length) + p3
        })
    } else {
        return '未绑定'
    }
})

Vue.filter('circleClassFilter', function (val) {
    if (red_circle.some(ele => ele === val)) {
        return 'xIcon-red-circler'
    } else if (blue_circle.some(ele => ele === val)) {
        return 'xIcon-blue-circler'
    } else if (green_circle.some(ele => ele === val)) {
        return 'xIcon-green-circler'
    }
})