import {
    Notify
} from 'vant'

let m1_m6 = [
    "码一 m1",
    "码二 m2",
    "码三 m3",
    "码四 m4",
    "码五 m5",
    "码六 m6",
]

let h1_h6 = [
    "一合 h1",
    "二合 h2",
    "三合 h3",
    "四合 h4",
    "五合 h5",
    "六合 h6",
]

// 玩法大类
export let big_plays = {
    "单双": 'oneDouble',
    "色波": 'colorBo',
    "大小": 'size',
    "生肖": 'zodiac',
    "合肖": "hezodiac",
    "正特码": "positiveSpecialCode",
    "自选不中": "selfSelection",
    "连码": "jointMark",
    "尾数": "mantissa"
}

export let plays = {
    '单双': [
        '和值 hz',
        '特码 tm',
        '特合 th',
        ...m1_m6,
        ...h1_h6
    ],
    "大小": [
        '和值 hz',
        '特码 tm',
        '特合 th',
        ...m1_m6,
        ...h1_h6
    ],
    "色波": [
        '特码 tm',
        "特码半波 tmbb",
        ...m1_m6,
    ],
    "生肖": [
        "正肖 zx",
        "特肖 tx",
        "正特肖 ztx",
        "二连肖 lx2",
        "三连肖 lx3",
        "四连肖 lx4",
        "五连肖 lx5",
    ],
    "合肖": [
        "二不中 bz2",
        "三不中 bz3",
        "四不中 bz4",
        "五不中 bz5",
        "六不中 bz6",
        "七不中 bz7",
        "八不中 bz8",
        "九不中 bz9",
        "十不中 bz10",
        "十一不中 bz11",
        "二中 z2",
        "三中 z3",
        "四中 z4",
        "五中 z5",
        "六中 z6",
        "七中 z7",
        "八中 z8",
        "九中 z9",
        "十中 z10",
        "十一中 z11",
    ],
    "正特码": [
        "正码任选 zmrx",
        "特码直选 tmzx",
        ...m1_m6
    ],
    "自选不中": [
        "五不中 bz5",
        "六不中 bz6",
        "七不中 bz7",
        "八不中 bz8",
        "九不中 bz9",
        "十不中 bz10",
        "十一不中 bz11",
        "十二不中 bz12",
    ],
    "连码": [
        "三全中 qz3",
        "三中二 z32",
        "二全中 qz2",
        "二中特 zt2",
        "特串 tc"
    ],
    "尾数": [
        "二尾 w2",
        "三尾 w3",
        "四尾 w4",
        "特尾 tw",
        "正特尾 ztw",
    ]
}

// 获取玩法小类时会排除当前玩法
export let getPlay = (key, exclude) => {
    let play = plays[key]
    let res = []
    let [_, exc_suffix] = exclude.split(' ')
    if (play) {
        play.forEach(item => {
            let [txt, path] = item.split(' ')
            if (exc_suffix !== txt) {
                res.push({
                    txt,
                    path
                })
            }
        })
    }
    return res
}

// 用英文key 获取玩法说明
export let getPlayDesc = (min_cls, max_cls) => {
    switch (max_cls) {
        case 'oneDouble':
            switch (min_cls) {
                case 'hz':
                    return '所有正特码7个开奖号码数字之和是单数为和值 单；是双数为和值 双（单147个；双148个）。'
                case 'm1':
                case 'm2':
                case 'm3':
                case 'm4':
                case 'm5':
                case 'm6':
                    return '开奖所开出的对应号码数字为单数则为 码n（ 例： 码一、 码二等） 单； 为双数则为 码n（ 例： 码一、 码二等） 双。'
                case 'tm':
                    return '开奖所开出的特码数字为单数则为 特码 单；为双数则为 特码 双 。'
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    return '合数是指开奖号个位数的值与十位数的值相加的结果。例如：开奖号为01，则合数为：0+1=1 合数： 2、 4、 6、 8、 10、 12 为 双；合数： 1、 3、 5、 7、 9、 11、 13 为 单。 '
                case 'th':
                    return '合数是指开奖号个位数的值与十位数的值相加的结果。例如：开奖号为01，则合数为：0+1=1 合数：2、4、6、8、10、12 为 双； 合数：1、3、5、7、9、11、13为 单。'
                default:
                    break;
            }
            break;
        case 'colorBo':
            switch (min_cls) {
                case 'm1':
                case 'm2':
                case 'm3':
                case 'm4':
                case 'm5':
                case 'm6':
                    return '正码色波开奖球颜色与下注的球颜色相同时，视为中奖码一~码六 '
                case 'tm':
                    return '特码开出的颜色和投注的颜色相同视为中奖。'
                case 'tmbb':
                    return '特码色波+特码单或双+大或小为一个投注组合，当期特码开出符合投注组合，即视为中奖；其余情形视为不中奖。'
                default:
                    break;
            }
            break;
        case 'size':
            switch (min_cls) {
                case 'hz':
                    return '所有正特码7个开奖号码数字之和大于等于176为和值 大；小于等于175为和值 小。'
                case 'm1':
                case 'm2':
                case 'm3':
                case 'm4':
                case 'm5':
                case 'm6':
                    return '开奖对应号码数字大于等于25为  码n（例：码一、码二等） 大；小于等于24为 码n（例：码一、码二等） 小'
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    return '合数是指开奖号个位数的值与十位数的值相加的结果。例如：开奖号为01，则合数为：0+1=1合数：1、2、3、4、5、6 为 小；合数：7、8、9、10、11、12、13为 大'
                case 'tm':
                    return '开奖结果特码数字大于等于25为特码 大；小于等于24为特码 小'
                case 'th':
                    return '合数是指奖号的个位数的值与十位数的值相加的结果。例如：奖号为01，则合数为：0+1=1 合数为1、2、3、4、5、6 为 小；合数为7、8、9、10、11、12、13为 大'
                default:
                    break;
            }
            break;
        case 'zodiac':
            switch (min_cls) {
                case 'zx':
                    return '开奖正码6个号码中一个或多个号含有所下注生肖则视为中奖'
                case 'tx':
                    return '开奖结果中特码生肖在投注生肖范围内，视为中奖'
                case 'ztx':
                    return '开奖7个号码中一个或多个号码含有所下注生肖则视为中奖'
                case 'lx2':
                case 'lx3':
                case 'lx4':
                case 'lx5':
                    return '选择二、三、四、或五个生肖为一投注组合进行下注。该注的生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。'
                default:
                    break;
            }
            break;
        case 'hezodiac':
            switch (min_cls) {
                case 'bz2':
                case 'bz3':
                case 'bz4':
                case 'bz5':
                case 'bz6':
                case 'bz7':
                case 'bz8':
                case 'bz9':
                case 'bz10':
                case 'bz11':
                    return '选号：从12个生肖中挑选2-11个不同生肖为一个组合投注；中奖：开奖号码中特码生肖若不在此组合内『49除外』，即视为中奖，若当期特码开出49，则所有组合皆视为和局；范例：投注方案：鼠、牛；开奖号码：特码生肖为虎，即中奖；特码为49,，即和局。'
                default:
                    return '选号：从12个生肖中挑选2-11个不同生肖为一个组合投注；中奖：开奖号码中特码生肖若在此组合内『 49 除外』， 即视为中奖， 若当期特码开出49， 则所有组合皆视为和局；范例： 投注方案： 鼠、 牛； 开奖号码： 特码生肖为鼠， 即中奖； 特码为49, ，即和局。 '
            }
            break;
        case 'positiveSpecialCode':
            switch (min_cls) {
                case 'zmrx':
                    return '从1-49中任选1个或多个号码，所选号码在开奖号码前六位中存在，即为中奖'
                case 'tmzx':
                    return ' 从1-49中任选1个或多个号码，所选号码与特码的开奖号码一致，即中奖'
                case 'm1':
                case 'm2':
                case 'm3':
                case 'm4':
                case 'm5':
                case 'm6':
                    return '从1-49中任选1个或多个号码，所选码n号码与码n的开奖号码一致，即中奖'
                default:
                    break;
            }
            break;
        case 'selfSelection':
            switch (min_cls) {
                case 'bz5':
                case 'bz6':
                case 'bz7':
                case 'bz8':
                case 'bz9':
                case 'bz10':
                case 'bz11':
                case 'bz12':
                    return '挑选5~12个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖。'
                default:
                    break;
            }
            break;
        case 'jointMark':
            switch (min_cls) {
                case 'qz3':
                    return '所投注的每三个号码为一个组合，若三个号码都是开奖号码的正码，则视为中奖，其余情形视为 不中奖。'
                case 'z32':
                    return '所投注的每三个号码为一个组合，若其中二个是开奖号码的正码，即为三中二，视为中奖；若三个都是开奖号码的正码，即为三中二 之中三，视为中奖。其余情形视为不中奖'
                case 'qz2':
                    return '所投注的每二个号码为一个组合，若二个号码都是开奖号码的正码，则视为中奖，其余情形视为不中奖。'
                case 'zt2':
                    return '所投注的每二个号码为一个组合，若二个号码都是开奖号码的正码，即为二中特 之中二，视为中奖；若其中一 个是正码，一个是特码，即为二中特 之中特，视为中奖；其余情形视为不中奖。'
                case 'tc':
                    return '所投注的每二个号码为一个组合，若其中一个是开奖号码的正码，一个是开奖号码的特码，则视为中奖，其余情形视为不中奖'
                default:
                    break;
            }
            break;
        case 'mantissa':
            switch (min_cls) {
                case 'w2':
                    return '选择二个尾数为一个组合进行投注。开奖号码（含特码）中含有投注对应全部尾数，即为中奖。'
                case 'w3':
                    return '选择三个尾数为一个组合进行投注。开奖号码（含特码）中含有投注对应全部尾数，即为中奖。'
                case 'w4':
                    return '选择四个尾数为一个组合进行投注。开奖号码（含特码）中含有投注对应全部尾数，即为中奖。'
                case 'tw':
                    return '一个尾数作为1注，只要当期特码尾数与下注特码尾数一致，即中奖。'
                case 'ztw':
                    return '开奖正码及特码７个号码中含有所下注尾数的一个或多个号码则视为中奖。'
                default:
                    break;
            }
            break
        default:
            break;
    }
}

// 用中文key 获取玩法说明
export let getPlayDescZh = (min_cls, max_cls) => {
    let min_cls_map = {}
    plays[max_cls].forEach(ele => {
        let [key, val] = ele.split(' ')
        min_cls_map[key] = val
    })
    return getPlayDesc(min_cls_map[min_cls], big_plays[max_cls])
}

function notify(msg) {
    Notify(msg)
    return false
}

function least(len, target = 1, min) {
    if (min) {
        if (min <= len <= target) {
            return true
        } else {
            return notify('请至少选择一注')
        }
    } else {
        if (len != target) {
            return notify('请至少选择一注')
        } else {
            return true
        }
    }
}

export let verifyPlayNum = (list, min_cls, max_cls) => {
    let len = list.length
    if (len === 0) {
        return notify('请选择投注号码。')
    }
    // console.log(list, len, min_cls, max_cls);
    switch (max_cls) {
        case 'oneDouble':
            switch (min_cls) {
                case 'hz':
                case 'm1':
                case 'm2':
                case 'm3':
                case 'm4':
                case 'm5':
                case 'm6':
                case 'tm':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                case 'th':
                    return least(len);
                default:
                    break;
            }
            break;
        case 'colorBo':
            switch (min_cls) {
                case 'm1':
                case 'm2':
                case 'm3':
                case 'm4':
                case 'm5':
                case 'm6':
                case 'tm':
                    return least(len)
                case 'tmbb':
                    return least(len, 2)
                default:
                    break;
            }
            break;
        case 'size':
            switch (min_cls) {
                case 'hz':
                case 'm1':
                case 'm2':
                case 'm3':
                case 'm4':
                case 'm5':
                case 'm6':
                case 'tm':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                case 'th':
                    return least(len)
                default:
                    return least(len)
            }
            break;
        case 'zodiac':
            switch (min_cls) {
                case 'tx':
                    return least(len, 4)
                case 'zx':
                case 'ztx':
                    return least(len);
                case 'lx2':
                    return least(len, 2)
                case 'lx3':
                    return least(len, 3)
                case 'lx4':
                    return least(len, 4)
                case 'lx5':
                    return least(len, 5)
                default:
                    break;
            }
            break;
        case 'hezodiac':
            switch (min_cls) {
                case 'bz2':
                    return least(len, 2)
                case 'bz3':
                    return least(len, 3)
                case 'bz4':
                    return least(len, 4)
                case 'bz5':
                    return least(len, 5)
                case 'bz6':
                    return least(len, 6)
                case 'bz7':
                    return least(len, 7)
                case 'bz8':
                    return least(len, 8)
                case 'bz9':
                    return least(len, 9)
                case 'bz10':
                    return least(len, 10)
                case 'bz11':
                    return least(len, 11)
                case 'z2':
                    return least(len, 2)
                case 'z3':
                    return least(len, 3)
                case 'z4':
                    return least(len, 4)
                case 'z5':
                    return least(len, 5)
                case 'z6':
                    return least(len, 6)
                case 'z7':
                    return least(len, 7)
                case 'z8':
                    return least(len, 8)
                case 'z9':
                    return least(len, 9)
                case 'z10':
                    return least(len, 10)
                case 'z11':
                    return least(len, 11)
                default:
                    return least(len, 11, 2)
            }
            case 'positiveSpecialCode':
                switch (min_cls) {
                    case 'zmrx':
                        return least(len, 2, 1)
                    case 'tmzx':
                        return least(len, 12, 1)
                    case 'm1':
                    case 'm2':
                    case 'm3':
                    case 'm4':
                    case 'm5':
                    case 'm6':
                        return least(len, 12, 1)
                    default:
                        break;
                }
                break;
            case 'selfSelection':
                switch (min_cls) {
                    case 'bz5':
                        return least(len, 5)
                    case 'bz6':
                        return least(len, 6)
                    case 'bz7':
                        return least(len, 7)
                    case 'bz8':
                        return least(len, 8)
                    case 'bz9':
                        return least(len, 9)
                    case 'bz10':
                        return least(len, 10)
                    case 'bz11':
                        return least(len, 11)
                    case 'bz12':
                        return least(len, 12)
                    default:
                        break;
                }
                break;
            case 'jointMark':
                switch (min_cls) {
                    case 'qz3':
                        return least(len, 3)
                    case 'z32':
                        return least(len, 3)
                    case 'qz2':
                        return least(len, 2)
                    case 'zt2':
                        return least(len, 2)
                    case 'tc':
                        return least(len, 2)
                    default:
                        break;
                }
                break;
            case 'mantissa':
                switch (min_cls) {
                    case 'w2':
                        return least(len, 2)
                    case 'w3':
                        return least(len, 3)
                    case 'w4':
                        return least(len, 4)
                    case 'tw':
                        return least(len)
                    case 'ztw':
                        return least(len, 7)
                    default:
                        break;
                }
                break
            default:
                break;
    }
}