import Http from '../utils/http/index.ws'

// 首页
export function getMainInfo(data = {}) {
    return Http.callapi('init', 'GetMainInfo', data)
}

// 年份开奖信息
export function getHkcDrawsByYear(data = {}) {
    return Http.callapi('init', 'GetHkcDrawsByYear', data)
}

// 获取某期六合彩开奖详细信息
export function getHkcDrawDetails(data = {}) {
    return Http.callapi('init', 'GetHkcDrawDetails', data)
}

// 获取六合彩日历 开奖
export function getHkcOpenDay(data = {}) {
    return Http.callapi('init', 'GetHkcOpenDay', data)
}

// 获取大神榜
export function getRankingSearch_dashen(data = {}) {
    return Http.callapi('init', 'RankingSearch_dashen', data)
}

// 获取大神推荐搜索
export function getRankingRecommend_dashen(data = {}) {
    return Http.callapi('init', 'RankingRecommend_dashen', data)
}

// 获取连胜榜
export function getRankingSearch_liansheng(data = {}) {
    return Http.callapi('init', 'RankingSearch_liansheng', data)
}

// 获取连胜搜索推荐
export function getRankingRecommend_liansheng(data = {}) {
    return Http.callapi('init', 'RankingRecommend_liansheng', data)
}

// 获取胜率榜推荐搜索的用户名
export function getRankingRecommend_shenglv(data = {}) {
    return Http.callapi('init', 'RankingRecommend_shenglv', data)
}

// 获取胜率榜
export function getRankingSearch_shenglv(data = {}) {
    return Http.callapi('init', 'RankingSearch_shenglv', data)
}


// 获取冠军榜推荐搜索的用户名
export function getRankingRecommend_champion(data = {}) {
    return Http.callapi('init', 'RankingRecommend_champion', data)
}

// 获取冠军榜
export function getRankingSearch_champion(data = {}) {
    return Http.callapi('init', 'RankingSearch_champion', data)
}

// 获取某个用户的信息
export function getGetUserDetail(data = {}) {
    return Http.callapi('init', 'GetUserDetail', data)
}

// 关注用户
export function followUser(data = {}) {
    return Http.callapi('init', 'FollowUser', data)
}

// 某用户本期推荐
export function getUserRecommend_cur(data = {}) {
    return Http.callapi('init', 'GetUserRecommend_cur', data)
}

// 某用户历史推荐
export function getUserRecommend_old(data = {}) {
    return Http.callapi('init', 'GetUserRecommend_old', data)
}