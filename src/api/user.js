import Http from '@/utils/http/index.ws'
import store from '@/store'

// 上传头像
export let uploadAvatar = (file_data, data = {}, process = () => {}) => {
    return new Promise(resolve => {
        Http.postBigFile('PlayerUploadIco', data, file_data, '.png', process, (ok, msg) => {
            store.commit('setAvatar', msg)
            resolve({
                ok,
                msg
            })
        })
    })
}

// 是否有资格成为专家
export let getCanApplyToBeAnExpert = (data = {}) => Http.callapi('init', 'CanApplyToBeAnExpert', data)

// 申请成为专家
export let ApplyToBeAnExpert = (data = {}) => Http.callapi('init', 'ApplyToBeAnExpert', data)

// 获取个人中心整体信息
export let getMyInfo = (data = {}) => {
    return Http.callapi('init', 'GetMyInfo', data, (msg) => {
        let {
            bkinfo,
            fans_hasplan,
            child_hasplan,
            follow_hasplan
        } = msg
        store.commit("setBkInfo", bkinfo)
        store.commit("setFansHasplan", fans_hasplan)
        store.commit("setFollowHasplan", follow_hasplan)
        store.commit("setChildHasplan", child_hasplan)
    })
}

// 绑定手机号码
export let BindPhone = (data = {}) => {
    return Http.callapi('init', 'BindPhone', data)
}

// 获取手机验证码准备绑定手机
export let SmsGetCode = (data = {}) => Http.callapi('init', 'SmsGetCode', data)

// 提交手机验证码以完成手机绑定
export let SmsSetCode = (data = {}) => Http.callapi('init', 'SmsSetCode', data)


// 绑定银行卡
export let BindBkCard = (data = {}) => {
    return Http.callapi('init', 'BindBkCard', data)
}

// 解绑银行卡
export let UnbindBkCard = (data = {}) => {
    return Http.callapi('init', 'UnbindBkCard', data)
}

// 修改密码
export let SetPassword = (data = {}) => {
    return Http.callapi('init', 'SetPassword', data)
}

// 设置性别
export let SetSex = (data = {}) => {
    return Http.callapi('init', 'SetSex', data)
}

// 获得自己本期发布的计划
export let GetMyPlans = (data = {}) => {
    return Http.callapi('init', 'GetMyPlans', data)
}

// 获得我的历史计划
export let GetMyOldPlans = (data = {}) => {
    return Http.callapi('init', 'GetMyOldPlans', data)
}

// 获得推广邀请码二维码
export let GetTgUrl = (data = {}) => {
    return Http.callapi('init', 'GetTgUrl', data)
}

// 我的助力伙伴
export let GetAllMyChild = (data = {}) => {
    return Http.callapi('init', 'GetAllMyChild', data)
}

// 通过昵称模糊搜索助理伙伴
// export let GetMyChildByNick = (data = {}) => {
//     return Http.callapi('init', 'GetMyChildByNick', data)
// }

// 线下入款 获取可获得的积分
export let GetLoadingPromotion = (data = {}) => {
    return Http.callapi('init', 'GetLoadingPromotion', data)
}

// 线下银行卡入款，获取可用的银行卡信息
export let GetLoadingBkInfo = (data = {}) => {
    return Http.callapi('init', 'GetLoadingBkInfo', data)
}

// 提交银行卡入款
export let LoadingOffline = (data = {}) => {
    return Http.callapi('init', 'LoadingOffline', data)
}

// 获取已提交的申请单 银行卡转账
export let GetLoadingOrder = (data = {}) => {
    return Http.callapi('init', 'GetLoadingOrder', data)
}

// 取消已提交的充值申请单 
export let CancelTransferOrder = (data = {}) => {
    return Http.callapi('init', 'CancelTransferOrder', data)
}

// 线上充值
export let GetLoadingOnlinebkInfo = (data = {}) => {
    return Http.callapi('init', 'GetLoadingOnlinebkInfo', data)
}

// 获取该支付方式的积分返还,线上支付
export let GetOnLinePromotion = (data = {}) => {
    return Http.callapi('init', 'GetOnLinePromotion', data)
}

// 提交线上充值
export let LoadingOnline = (data = {}) => {
    return Http.callapi('init', 'LoadingOnline', data)
}

// 兑换积分
export let BalanC2M = (data = {}) => {
    return Http.callapi('init', 'BalanC2M', data)
}

// 金币提现
export let ApplyWithdrawal = (data = {}) => {
    return Http.callapi('init', 'ApplyWithdrawal', data)
}

// 我的关注
export let GetFollows = (data = {}) => {
    return Http.callapi('init', 'GetFollows', data)
}

// 我的粉丝
export let GetFans = (data = {}) => {
    return Http.callapi('init', 'GetFans', data)
}

// 模糊搜索我的粉丝
export let SearchMyFans = (data = {}) => {
    return Http.callapi('init', 'SearchMyFans', data)
}

// 模糊搜索我关注的人
export let SearchMyFollows = (data = {}) => {
    return Http.callapi('init', 'SearchMyFollows', data)
}

// 关注/取关某人
/* 
    nick  // 对方昵称
    follow // true 关注、 false 取关
*/
export let FollowSomebody = (data = {}) => {
    return Http.callapi('init', 'FollowSomebody', data)
}

// 绑定邀请码获取积分
export let BindAgcodeGetBalanM = (data = {}) => {
    return Http.callapi('init', 'BindAgcodeGetBalanM', data)
}

// 根据邀请码获取推荐人昵称
export let SearchAgInfo = (data = {}) => {
    return Http.callapi('init', 'SearchAgInfo', data)
}

// 账户清单
export let GetOrders = (data = {}) => {
    return Http.callapi('init', 'GetOrders', data)
}

// 获取充值账单
export let GetLoadingOrders = (data = {}) => {
    return Http.callapi('init', 'GetLoadingOrders', data)
}

// 获取提款账单
export let GetDrawingOrders = (data = {}) => {
    return Http.callapi('init', 'GetDrawingOrders', data)
}

// 线下存款页面信息
export let GetLoadingOffline = (data = {}) => {
    return Http.callapi('init', 'GetLoadingOffline', data)
}

// 购买计划
export let BuyPlan = (data = {}) => {
    return Http.callapi('init', 'BuyPlan', data)
}
