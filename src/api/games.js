import Http from '../utils/http/index.ws'

// 获取所有投注区及其赔率
export let enterGame  = (data = {}) => {
    return Http.callapi('init', 'EnterGame', data)
}
// 获取所有投注区及其赔率
export let getLottoOdds = (data = {}) => {
    return Http.callapi('init', 'GetLottoOdds', data)
}
// games投注/确认赔率
export let getOddsTobeConfirmed = (data = {}) => {
    return Http.callapi('init', 'GetOddsTobeConfirmed', data)
}
// games投注
export let lottobet = (data = {}) => {
    return Http.callapi('init', 'LottoBet', data)
}
// games玩法说明
export let getBettingRemark = (data = {}) => {
    return Http.callapi('init', 'GetBettingRemark', data)
}
//退出游戏
export let leaveGame = (data = {}) => {
    return Http.callapi('init', 'LeaveGame', data)
}
//投注记录
export let getOrders = (data = {}) => {
    return Http.callapi('init', 'GetOrders', data)
}
//投注记录详情
export let getOrderDetail = (data = {}) => {
    return Http.callapi('init', 'GetOrderDetail', data)
}
//投注记录详情-撤单
export let lottoCancel = (data = {}) => {
    return Http.callapi('init', 'LottoCancel', data)
}
//获取开奖历史
export let getLottoHistory = (data = {}) => {
    return Http.callapi('init', 'GetLottoHistory', data)
}
