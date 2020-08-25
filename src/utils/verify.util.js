import Http from '@/utils/http/index.ws.js'
import {
    Notify
} from 'vant'


// 用户名：中文或字母开头6-12位，不允许特殊符号、空格
const USERNAME_REG6_12 = /^[A-z\u4e00-\u9fa5][A-z0-9\u4e00-\u9fa5]{5,11}$/

// 密码：字母与数字组合6-15位（仅允许输入数字、字母、符号；不允许空格）
const PWD_REG6_12 = /^[^ ]{6,12}$/

// 设置计划名称规则：仅允许输入中文、数字以及符号（不允许空格），长度4~12位
const PLAN_NAME_REG4_14 = /^[^ ]{4,14}$/

// 短信验证码：6位数字（仅允许输入数字、并只能输入6个数字
const MESSAGE_REG_6 = /^[A-z0-9]+$/

// 混合数字字母,非纯数字或字母
const LATTER_MIXIN_NUMBER = /^([0-9]|[A-z])+[A-z]+[0-9]+(|[A-z]+)$/

const PHONE_REG = /^1[0-9]{10}$/

const ACCOUNT_NAME_REG = /[\u4e00-\u9fa5-]{2,18}/

const BANK_ID = /[0-9]{14,20}/

const OPEN_ACT_ADDRESS = /[\w\W]{0,18}/

const PURE_NUMBER_12 = /[0-9]{0,12}/

const QQ_NUMBER = /[0-9]{4,20}/

const EMAIL_REG = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// 兑换积分量 仅允许输入数字与小数点，输入数字必须大于零且不超过两位小数。
const INTEGRAL = /^[1-9][0-9]+(.[0-9]{1,2}|)$/

function notify(msg) {
    Notify({
        message: msg,
        duration: 1000
    })
    return false
}


// 获取验证码
export let getVerifyCode = () => {
    let random = Math.random()
    return new Promise(resolve => {
        function isRandom() {
            if (G.isEmpty(Http.url_base)) {
                G.delay(isRandom, 500)
            } else {
                resolve({
                    // verify_code: 'http://dtapi-aj.xy50test.com' + '/VerifyCode?random=' + random,
                    verify_code: Http.url_base + '/VerifyCode?random=' + random,
                    random
                })
            }
        }
        isRandom()
    })
}

// 用户名验证
export let verifyUserName = user_name => {
    if (!USERNAME_REG6_12.test(user_name)) {
        Notify('请输入6-12位中文或字母开头的用户名，不允许特殊符号、空格')
        return false
    }
    return true
}

// 密码验证
export let verifyUserPwd = pwd => {
    if (!PWD_REG6_12.test(pwd)) {
        return notify('请输入6-12位的非空格密码')
    }
    return true
}

export let verifyMessage = msg => {
    if (!MESSAGE_REG_6.test(msg)) {
        return notify('请输入6位数验证码')
    }
    return true
}

// 积分区间输入框验证
export let integralInterval = (start, end) => {
    end = G.toNumber(end)
    start = G.toNumber(start)
    if (end < start) {
        return notify('请输入正确的区间');
    }
    return true
}
// 积分区间单值验证
export let integralVal = (integral) => {
    if (integral.length > 5) {
        return notify('请输入0~5位正整数')
    }
    integral = G.toNumber(integral)
    if (integral < 0) {
        return notify('请输入0~5位正整数')
    }
    return true
}

// 手机号码
export let verifyPhone = phone => {
    if (phone === "") {
        return notify('请输入手机号')
    }
    if (!PHONE_REG.test(phone)) {
        return notify('请输入正确的手机号')
    }
    return true
}

// 账户名
export let accountName = name => {
    if (ACCOUNT_NAME_REG.test(name)) {
        return true
    }
    return notify('请输入2~18位中文账户名')
}

// 银行卡
export let verifyBankID = id => {
    if (BANK_ID.test(id)) {
        return true
    }
    return notify('请输入14~20位银行卡密码')
}

//开户网点
export let verifyOpenActAddress = ads => {
    if (OPEN_ACT_ADDRESS.test(ads)) {
        return true
    }
    return notify('最多输入18位字符')
}

// 密码
export let verifyPwd = pwd => {
    if (!LATTER_MIXIN_NUMBER.test(pwd)) {
        return notify('密码必须使用字母数字混合')
    }
    return true
}

// 邀请码
export let verifyWlCode = code => {
    if (!PURE_NUMBER_12.test(code)) {
        return notify('请输入不超过12位数字的邀请码')
    }
    return true
}

export let verifyQQ = code => {
    if (!QQ_NUMBER.test(code)) {
        return notify('请填写正确的QQ号')
    }
    return true
}

export let verifyEmail = emai => {
    if (!EMAIL_REG.test(emai)) {
        return notify('请填写正确的邮箱地址')
    }
    return true
}

export let verifySugges = msg => {
    if (msg.length < 10) {
        return notify('意见反馈内容不能少于10个字')
    } else if (!msg) {
        return notify('请填写意见反馈内容')
    }
    return true
}

export let verifyPlanName = name => {
    if (!PLAN_NAME_REG4_14.test(name)) {
        return notify('仅允许4-14位非空格字符')
    }
    return true
}

export let exchangeIntegral = num => {
    if (!INTEGRAL.test(num)) {
        return notify('小数点不超过2位')
    }
    return true
}