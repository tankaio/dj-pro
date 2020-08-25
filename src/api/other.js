import Http from "../utils/http/index.ws"

// 获取当前开放的玩法
export let GetAvailableBettype = (data = {}) => {
    return Http.callapi('init', 'GetAvailableBettype', data)
}

// 可开放购买的玩法
export let GetCanBuyPlans = (data = {}) => {
    return Http.callapi('init', 'GetCanBuyPlans', data)
}

// 当前计划玩法的胜率信息和是否可售卖
export let GetPlansInfoByType = (data = {}) => {
    return Http.callapi('init', 'GetPlansInfoByType', data)
}

// 发布计划
export let SetMyPlan = (data = {}) => {
    return Http.callapi('init', 'SetMyPlan', data)
}

// 获取所有站内信
export let GetSysMsg = (data = {}) => {
    return Http.callapi('init', 'GetSysMsg', data)
}

//一键已读所有
export let OnceReadSysMsgs = (data = {}) => {
    return Http.callapi('init', 'OnceReadSysMsgs', data)
}

// 获取所有站内信
export let GetSysMsgById = (data = {}) => {
    return Http.callapi('init', 'GetSysMsgById', data)
}

// 获取当前我的所有反馈
export let GetMySuggestions = (data = {}) => {
    return Http.callapi('init', 'GetMySuggestions', data)
}

// 提交新反馈
export let MakeSuggestion = (data = {}) => {
    return Http.callapi('init', 'MakeSuggestion', data)
}

// 获取某条反馈的具体回复细节
export let GetSuggestionChat = (data = {}) => {
    return Http.callapi('init', 'GetSuggestionChat', data)
}

// 反馈发送消息
export let SendMySuggestion = (data = {}) => {
    return Http.callapi('init', 'SendMySuggestion', data)
}

// 标记某反馈已解决
export let CloseSuggestion = (data = {}) => {
    return Http.callapi('init', 'CloseSuggestion', data)
}

// 查看计划详情
export let GetPlanDetail = (data = {}) => {
    return Http.callapi('init', 'GetPlanDetail', data)
}

// 是否计划可发布
export let CanPublishPlan = (data = {}) => {
    return Http.callapi('init', 'CanPublishPlan', data)
}