import {
    Dialog
} from "vant"

const EVENT_PREFIX = /^on/
const GET_TYPE = /^(?:\[object )([A-z]+)(?:\])$/
const KEBABCASE_WORD = /([A-Z][a-z0-9]+)|([a-z]+[a-z0-9]+)|([A-Z]+[0-9]*[A-Z]*)/g

let ROUTE_HOOK = []

let route_hook_deep = -1

let heap = Object.create(null)

/**
  {
    log-params 控制台打印请求参数
    log-msg 控制台打印返回参数
    log-ws 控制台打印推送消息
  }
 */
let state = Object.create(null)

let g = function (...args) {
    if (!(this instanceof g)) {
        return new g(...args)
    }
    this.__val = args[0]
}

if (process.env.NODE_ENV === 'development') {
    g.beta = {
        ROUTE_HOOK,
        route_hook_deep,
        heap,
        state,
    }
}

let fn = Object.create(null)

g.fn = fn

fn.v = '1.0'

function _type(val) {
    let match = Object.prototype.toString.call(val).match(GET_TYPE)
    if (match && match.length === 2) {
        return match[1]
    } else {
        console.error(`[参数]:${val},匹配结果:${match}`);
    }
}

fn.__ = () => {}
fn.type = val => _type(val)
fn.isEle = v => _type(v).indexOf('Element') != -1
fn.isArr = v => 'Array' === _type(v)
fn.isNu = v => 'Null' === _type(v)
fn.isUn = v => 'Undefined' === _type(v)
fn.isBl = v => 'Boolean' === _type(v)
fn.isStr = v => 'String' === _type(v)
fn.isNum = v => 'Number' === _type(v)
fn.isObj = v => 'Object' === _type(v)
fn.isFun = v => 'Function' === _type(v)
fn.isEmpty = v => {
    if (fn.isUn(v) || fn.isNu(v)) return true
    if (fn.isArr(v) && v.length === 0) return true
    if (fn.isObj(v) && Object.keys(v).length === 0) return true
    if (fn.isStr(v) && v === '') return true
    return false
}

fn.toNumber = (val) => isNaN(Number(val)) ? 0 : Number(val)

// 剔除数组中的某个元素
fn.someRemove = (arr, v) => {
    if (fn.isArr(arr)) {
        let idx = arr.indexOf(v)
        if (idx > -1) {
            arr.splice(idx, 1)
        }
    }
}

/**
 * 单次调用函数
 */

fn.once = (fn) => {
    let lock = false
    return function (...args) {
        if (lock) return
        lock = true
        return fn.apply(this, args)
    }
}
/**
 * 延时调用函数
 */
fn.delay = (callback, delayTime = 0) => {
    let timer = setTimeout(() => {
        callback()
        clearTimeout(timer)
    }, delayTime)
}

/**
 * 装饰函数,前置调用
 */
fn.after_decorate = (after, fn) => {
    return function (...args) {
        let res = fn.apply(this, args)
        let after_res = after.apply(this, args)
        return [after_res, res]
    }
}

/**
 * 装饰函数,后置调用
 */

fn.before_decorate = (before, fn) => {
    return function (...args) {
        let before_res = before.apply(this, args)
        let res = fn.apply(this, args)
        return [before_res, res]
    }
}

/**
 * 返回当前函数参数
 */

fn.zero = (...args) => args

/**
 * 剪切数组
 */

fn.slice = (str, start, newStr) => str.slice(0, start) + newStr + str.slice(start)

/**
 * 状态锁函数
 */

fn.stateLock = (cb) => {
    let lock = false
    return function (...args) {
        if (!lock) {
            lock = true
            let res = cb.apply(this, args)
            lock = false
            return res
        }
    }
}

/**
 * 对象克隆,非深度克隆
 */

fn.objClone = (map, target) => {
    let res = {}
    Object.keys(map).forEach(ele => {
        if (target) {
            target[ele] = map[ele]
        }
        res[ele] = map[ele]
    })
    return target || res
}

/**
 * 节流函数
 */

fn.throttle = (callback, interval) => {
    let lastTime = new Date().getTime()
    let nowTime
    return function (...args) {
        nowTime = new Date().getTime()
        if (nowTime - lastTime >= interval) {
            lastTime = nowTime
            return callback.apply(this, args)
        }
    }
}

/**
 * 防抖函数
 */

fn.debounce = (callback, interval) => {
    let timer
    return function (...args) {
        if (timer !== undefined) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            callback.apply(this, args)
            clearTimeout(timer)
        }, interval)
    }
}

/**
 * 缓存函数
 */

fn.memoize = callback => {
    let cache = {};
    return function () {
        let hash = JSON.stringify(arguments);
        return cache[hash] = (cache[hash] || callback.apply(this, arguments));
    };
}

fn.get = (target, path, defaultVal) => {
    if (!fn.isStr(path)) return console.error('参数错误');
    let pathList = path.split('.')
    let res = ''
    let pathListLen = pathList.length
    try {
        for (let i = 0; i < pathListLen; i++) {
            if (i === 0) {
                res = target[pathList[i]]
            } else {
                res = res[pathList[i]]
            }
        }
    } catch (e) {
        return defaultVal
    }
    return fn.isUn(res) || fn.isNu(res) ? defaultVal : res
}

/**
 * 柯里化函数
 */

fn.curry = cb => {
    let len = cb.length,
        cache_args = [],
        once

    let callback = function () {

        if (once === undefined) {
            once = [...arguments]
            return callback
        } else {
            cache_args = [...cache_args, ...arguments]
        }
        if (arguments.length === 0) {
            // 空参数意味着程序执行
            let temp = [...cache_args]
            cache_args = []
            return cb.call(this, ...once, ...temp)
        } else if (once && (once.length + cache_args.length) === len) {
            // 参数等于函数初始参数也是执行
            let temp = [...cache_args]
            cache_args = []
            return cb.call(this, ...once, ...temp)
        } else {
            return callback
        }

    }

    if (len >= 2) {
        return callback;
    } else {
        throw new Error('柯里化函数参数需要至少两位')
    }
};

/**
 * 数组差异对比
 */
fn.differenceBy = (array = [], exclude = [], identity) => {
    let res = []
    let newArray = []
    let newExclude = []
    if (identity) {
        // if (!fn.isArr(array) || fn.isArr(exclude)) {
        //     console.error(array, exclude);
        //     throw new Error("参数错误")
        // }
        if (fn.isFun(identity)) {
            array.forEach(val => newArray.push(val))
            exclude.forEach(val => newExclude.push(val))
        } else if (fn.isStr(identity)) {
            array.forEach(val => newArray.push(val))
            exclude.forEach(val => newExclude.push(val))
        }

    }
    newExclude.forEach((item, idx) => {
        if (newArray.indexOf(item) === -1) {
            if (exclude[idx]) {
                res.push(exclude[idx])
            }
        }
    })
    return res
}

/**
 * 复制函数 repeat(*,3) => ***
 */

fn.repeat = (str, len) => {
    if (fn.isEmpty(str) || fn.isEmpty(len)) {
        // TODO 错误函数
    }
    let res = ''
    for (let i = 0; i < len; i++) {
        res += str
    }
    return res
}

/**
 * 驼峰命名转中划线命名
 */

fn.kebabCase = (str = '') => {
    let res = ''
    let match = str.match(KEBABCASE_WORD)
    let len = match ? match.length : 0;
    for (let i = 0; i < len; i++) {
        if (i === 0) {
            res = match[0]
        } else {
            res += '-' + match[i]
        }
    }
    return res.toLowerCase()
}

function eventListenerAdaptor(event, target, fn) {
    // 事件名是否以 on 开头
    if (!EVENT_PREFIX.test(event)) {
        event = `on${event}`
    }
    let backup = target[event]
    if (backup && fn.isFun(backup)) {
        target[event] = e => {
            fn(e)
            backup(e)
        }
    } else {
        target[event] = e => fn(e)
    }
}
fn.eventListenerAdaptor = eventListenerAdaptor


/***********************/
// 事件总线
/***********************/

fn.$on = (event, fun) => {
    let identity = Math.random()
    if (!fn.isObj(heap[event])) {
        heap[event] = Object.create(null)
        heap[event].keys = [identity]
    } else {
        heap[event].keys.push(identity)
    }
    heap[event][identity] = fun
}

fn.$emit = (event, ...args) => {

    let child_heap = heap[event]
    // 子事件堆存在吗
    if (fn.isObj(child_heap)) {

        child_heap.keys.forEach(identity => {

            if (fn.isFun(child_heap[identity])) {
                child_heap[identity](...args || [])
            }

        })

    }
}

fn.$remove = (event, identity) => {

    let child_heap = heap[event]
    // 子事件堆存在吗
    if (fn.isObj(child_heap)) {
        if (!fn.isEmpty(child_heap[identity])) {
            delete child_heap[identity]
            fn.someRemove(child_heap.keys, identity)
        }
    }

}

/**
 * @description 改写 Dialog 主要是为了物理返回键时需要阻断路由
 * @param  {...any} args 
 */
function $dialog(...args) {
    return Dialog(...args)
}
$dialog.confirm = (...args) => {
    // 推入函数
    $routeHook(Dialog.close)
    return new Promise((reslove, reject) => Dialog.confirm(...args).then(res => {
        reslove(res)
        window.history.go(-1)
        $routeHook.clear()
    }).catch(res => {
        reject(route_hook_deep)
        window.history.go(-1)
        $routeHook.clear()
    }))
}
$dialog.alert = (...args) => {
    $routeHook(Dialog.close)
    return new Promise((reslove, reject) => Dialog.alert(...args).then(res => {
        reslove(res)
        window.history.go(-1)
        $routeHook.clear()
    }).catch(res => {
        reject(route_hook_deep)
        window.history.go(-1)
        $routeHook.clear()
    }))
}
$dialog.close = () => {
    $routeHook.clear()
    Dialog.close()
}

/**
 * @description 路由钩子函数用户执行,推入,清空路由钩子
 * @param {*} fns 
 * @param  {...any} args 
 */
function $routeHook(fns, ...args) {
    history.pushState(null, null, document.URL);
    route_hook_deep -= 1
    if (G.isArr(fns)) {
        ROUTE_HOOK.push(...fns)
    } else {
        ROUTE_HOOK.push(fns, ...args)
    }
}
$routeHook.state = () => !!ROUTE_HOOK.length
$routeHook.go = () => {
    ROUTE_HOOK.forEach(fn => fn(route_hook_deep))
    $routeHook.clear()
}
$routeHook.clear = () => {
    route_hook_deep = 0
    ROUTE_HOOK = []
}

/**
 * @description 监听页面的显示与隐藏状态
 */
function $backstage() {
    let hidden, visibilityChange;

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    eventListenerAdaptor(visibilityChange, document, e => {
        if (document[hidden]) {
            // 隐藏
            $backstage.onhidden(e)
            $backstage.state = 'hidden'
            fn.$emit('page-hidden')
        } else {
            // 显示
            $backstage.onvisible(e)
            $backstage.state = 'visible'
            fn.$emit('page-visible')
        }
    })
    // 判断浏览器进入后台,这是一个心跳机制的后台后激活判断,只能检测进入后台后何时打开
    let last_time = new Date().getTime()
    setInterval(() => {
        let now = new Date().getTime()
        if (now - last_time > 5000) {
            fn.$emit('page-visible')
        }
        last_time = now
    }, 500);
    // 
    // eventListenerAdaptor('blur', window, e => {
    //     $backstage.onhidden(e)
    //     $backstage.state = 'hidden'
    //     fn.$emit('page-hidden')
    // })
    // eventListenerAdaptor('focus', window, e => {
    //     $backstage.onvisible(e)
    //     $backstage.state = 'visible'
    //     fn.$emit('page-visible')
    // })
}

$backstage.destroy = () => {
    $backstage.onvisible = fn.__
    $backstage.onhidden = fn.__
}

$backstage.destroy()

$backstage()

// 全局状态,不可追踪的非响应式的状态
fn.setter = (k, v) => {
    state[k] = v
}
fn.getter = k => Object.freeze(state[k])

// 路由历史记录
// fn.rtLst = path => {
//     if (path === undefined) {
//         return localStorage.getItem('lastRouterHistory')
//     } else {
//         // lastRouterHistory
//         localStorage.setItem('lastRouterHistory', path)
//     }
// }

function $swiper(e) {
    $swiper.page = $swiper.getPosit(e)
    $swiper.state = false
    $swiper.once_page = fn.once((now_x, now_y) => {
        let {
            x,
            y
        } = $swiper.page

        if (Math.abs(now_x - x) > Math.abs(now_y - y)) {
            // 左右滑动
            $swiper.state = false
        } else {
            // 上下滑动
            $swiper.state = true
        }

    })

    return $swiper
}

$swiper.getPosit = function (e) {

    let touchs = e.targetTouches[0]

    if (!fn.isEmpty(touchs)) {
        return {
            x: touchs.pageX,
            y: touchs.pageY
        }
    }
    return {
        x: 0,
        y: 0
    }
}
// 这里只针对 touch 事件
$swiper.direction = function (e, ud = fn.__, lr = fn.__) {
    let {
        x,
        y
    } = this.page

    let {
        x: nowX,
        y: nowY
    } = this.getPosit(e)
    this.once_page(nowX, nowY)
    if (this.state) {
        // 上下滚动
        ud(nowX, nowY, e)
        if (nowY > y && window.scrollY === 0 && e.cancelable) {
            try {
                e.preventDefault();
            } catch (error) {

            }
        }
    } else {
        // 左右滚动
        lr(nowX, nowY, e)
        try {
            e.preventDefault();
        } catch (e) {

        }
        e.stopPropagation()
    }

    return this
}

/**
 * @description console.trace(); 堆栈追踪
 */

// fn.logsty = {
//     default: `background-color:#73d13d;
//     font-size:12px;
//     font-weight:600;
//     color:#fff;
//     text-align:center;
//     line-height:20px;
//     padding:0 5px;
//     margin:0 3px;`,
//     message: `color:#789;
//     font-weight:500;
//     font-size:12px;
//     border-bottom:1px solid #d3adf7;
//     margin:0 10px;`,
//     error: `background-color:#f5222d;
//     font-size:12px;
//     font-weight:600;
//     color:#fff;
//     text-align:center;
//     line-height:20px;
//     padding:0 5px;
//     margin:0 3px;`,
//     params: `background-color:#22075e;
//     font-size:12px;
//     font-weight:600;
//     color:#fff;
//     text-align:center;
//     line-height:20px;
//     padding:0 5px;
//     margin:0 3px;`,
//     response: `background-color:#f4ffb8;
//     font-size:12px;
//     font-weight:600;
//     color:#123;
//     text-align:center;
//     line-height:20px;
//     padding:0 5px;
//     margin:0 3px;`,
//     router: `background-color:#d9d9d9;
//     font-size:12px;
//     font-weight:600;
//     color:#123;
//     text-align:center;
//     line-height:20px;
//     padding:0 5px;
//     margin:0 3px;`,
//     tag: `background-color:#d9d9d9;
//     font-size:12px;
//     font-weight:600;
//     color:#fff;
//     text-align:center;
//     line-height:20px;
//     padding:0 5px;
//     border-radius:2px;`,
//     type: `font-size:8px;
//     color:#456;
//     text-align:center;
//     line-height:20px;
//     padding:0 5px;
//     margin-left:50px;
//     font-weight:unset;`,
//     key: `font-size:12px;
//     color:#ffa39e;
//     `,
//     value: `font-size:8px;
//     color:#adc6ff;
//     padding:0 10px;`,
//     fname: `color:red;
//     padding:0 10px;`,
//     mark: `color:#bae7ff;`
// }

// function $log(message) {
//     $log.group({
//         message
//     })
// }

// function Traversal(judge, data, {
//     key,
//     type,
//     collapse
// } = {}) {

//     let group = collapse ? console.groupCollapsed : console.group

//     if (fn.isObj(data)) {
//         if (key !== undefined) {
//             group(...$log.style([
//                 [`{ ${key} }`, 'tag'],
//                 ['Object', 'type']
//             ]))
//             Object.keys(data).forEach(item => Traversal(judge, data[item], {
//                 key: item,
//                 collapse
//             }))
//             console.groupEnd()
//         } else {
//             Object.keys(data).forEach(item => Traversal(judge, data[item], {
//                 key: item,
//                 collapse
//             }))
//         }

//     } else if (fn.isArr(data)) {
//         if (key !== undefined) {
//             group(...$log.style([
//                 [`[ ${key} ]`, 'tag'],
//                 ['Array', 'type']
//             ]))
//             data.forEach((item, index) => Traversal(judge, item, {
//                 key: index,
//                 collapse
//             }))
//             console.groupEnd()
//         } else {
//             data.forEach((item, index) => Traversal(judge, item, {
//                 key: index,
//                 collapse
//             }))
//         }

//     } else {
//         judge(key, data, _type(data))
//     }

// }

// fn.$log = function (arr) {
//     let res = []
//     let styls = []
//     let print = ``
//     arr.forEach(item => {
//         let [str, style] = item
//         print += `%c${str}`
//         styls.push(logStyleMap[style] || logStyleMap.default)
//     })
//     res = [print, ...styls]
//     console.log(res);
//     return res
// }

// $log.group = function ({
//     fname,
//     message,
//     data,
//     _class,
//     collapse,
// }) {
//     if (fn.isEmpty(data)) {
//         // 输出错误
//         if (message) {
//             console.log(...$log.style([
//                 [message, 'message']
//             ]))
//         }
//     } else {
//         let header = []
//         header.push([_class || 'point', _class])
//         if (fname) header.push([fname, 'fname'])
//         if (message) header.push([message, 'message'])
//         header.push([_type(data), 'type'])
//         console.groupCollapsed(...$log.style(header))
//         Traversal((key, val, type) => {
//             let putItem = [
//                 [`${key}:`, 'key'],
//                 [val, 'value'],
//                 [type, 'type'],
//             ]
//             if (fname) putItem.push([fname, 'mark'])
//             console.log(...$log.style(putItem))
//         }, data, {
//             collapse
//         })
//         console.groupEnd()
//     }
// }

// $log.error = function (message, data = {}) {
//     if (fn.isEmpty(data)) {
//         console.log(...$log.style([
//             ['error', 'error'],
//             [message, 'message']
//         ]))
//     } else {
//         $log.group({
//             message: message,
//             _class: 'error',
//             data
//         })
//     }

// }

let RegCache = {}

const _TYPE = /^@([A-z-0-9]+)/
const _VARIABLE = /\[(.*)\]/
const _FILTER = /([a-z]+|)\|(!*[a-z]+)/

const lowerType = val => _type(val).toLowerCase()

const oneVerify = (val, rule, stack) => {
    let ruleAry = rule.trim().split(' ')
    let len = ruleAry.length
    let item = null;
    let result = true
    for (let index = 0; index < len; index++) {
        item = ruleAry[index];
        if (item) {
            if (_TYPE.test(item)) {
                result = analysisRule('type')(val, fixMatch(item.match(_TYPE)))
            }
            if (_FILTER.test(item)) {
                result = analysisRule('filter')(val, fixMatch(item.match(_FILTER), -1), (() => {
                    let variableName = fixMatch(item.match(_VARIABLE))
                    if (variableName && variableName.startsWith('!')) {
                        return variableName.slice(1)
                    } else if (item.indexOf('|reg') !== -1) {
                        return variableName
                    } else if (variableName) {
                        return stack[variableName]
                    }
                    return false
                })())
            }
        } else {

        }
        if (result === false) return false
    }
    return result
}

const analysisRule = rule => {
    switch (rule) {
        case 'type':
            return (val, type) => type ? lowerType(val) === type : false;
        case 'filter':
            return (val, match, depatch) => {
                let non = false;
                let [_, limit, type] = match
                let result = false

                if (limit) {
                    if (limit === 'len') {
                        val = (val + '').length || 0
                    }
                }

                const depatchIsNum = n => Number(n) === NaN
                const var2Number = () => {
                    let to = Number(val)
                    if (to === NaN) {
                        return false
                    } else {
                        return true
                    }
                }

                if (type.startsWith('!')) {
                    non = true
                    type = type.slice(1)
                }

                switch (type) {
                    case 'abs':
                        // 正数
                        result = var2Number() ? val > 0 : false
                        break;
                    case 'minus':
                        // 负数
                        result = var2Number() ? val < 0 : false
                        break;
                    case 'decimal':
                        // 小数
                        let mo = val % 1
                        result = var2Number() ? (mo < 1 && mo !== 0) : false
                        break;
                    case 'eq':
                        // 等于
                        result = depatchIsNum(depatch) ? false : val === Number(depatch)
                        break;
                    case 'gt':
                        // 大于
                        result = depatchIsNum(depatch) ? false : val > Number(depatch)
                        break;
                    case 'lt':
                        // 小于
                        result = depatchIsNum(depatch) ? false : val < Number(depatch)
                        break;
                    case 'reg':
                        // 正则匹配
                        let reg
                        if (RegCache[depatch] === undefined) {
                            RegCache[depatch] = reg = new RegExp(depatch)
                        } else {
                            reg = RegCache[depatch]
                        }
                        result = reg.test(val)
                        break
                    default:
                        throw new Error('类型错误')
                }
                result = non ? !result : result
                return result;
            }
        default:
            break;
    }
}

const fixMatch = (match, idx = 1) => {
    if (idx >= 0) {
        if (!match || !match[idx]) return false
        else return match[idx]
    } else {
        return idx === -1 ? match : match[idx]
    }
}

function $verify(map, rules) {
    let rule = ''
    let val = ''
    let ruleJudge = {}
    let ruleKeys = Object.keys(rules)
    let ruleKeysLen = ruleKeys.length
    for (let index = 0; index < ruleKeysLen; index++) {
        let key = ruleKeys[index]
        val = map[key]
        rule = rules[key] || ''
        //  使用规则作为hash 保存函数集
        let result = oneVerify(val, rule, map)
        ruleJudge[key] = result
        if (!result) {
            return false
        }
    }
    return true
}



/**
 *  @ 符号开头被视为 类型限定
 * ' ' 空格视为分隔符
 * |A 视为过滤符 abs 正数 ,minus 负数,  decimal 小数 ,eq 等于, gt 大于 ,lt 小于
 * |!A 视为对以上值取非
 * B| B 为数值操作限定 len 长度
 * [] 视为引用其它 变量 
 * [!1] 内容为值
 * reg[] 视为正则限定
 */
// var deal = {
//     // date1: "@date |eq[date2]",
//     // test3: "@number |decimal |lt[test4] len|eq[!4] |reg[^1] |reg[1$]"
//     // date2: "",
//     data1: "@number |!decimal |lt[upperLimit] len|lt[lenLimit] |gt[lowerLimit]",
//     data2: "@number |!decimal len|lt[lenLimit] |gt[lowerLimit]",
//     mixin: "@string |reg[[a-z]+] |reg[[0-9]+] |reg[^[a-z]]"
// }

// data2 = 99999
// var map = {
//     mixin: 'fae89fe89fe',
//     data1: 1,
//     data2,
//     upperLimit: data2 + 1,
//     lowerLimit: -1,
//     lenLimit: 6
// }
// verify(map, deal)

// 不涉及到 this 操作的所有函数,都可以直接调用
fn.$dialog = $dialog
fn.$routeHook = $routeHook
fn.$backstage = $backstage
fn.$swiper = $swiper
fn.$v = $verify
// fn.$log = $log

Object.keys(fn).forEach(item => {
    g[item] = fn[item]
})

g.prototype = fn

if (window.G) {
    throw new Error('请使用其他命名方式,避免产生覆盖')
}

window.G = g