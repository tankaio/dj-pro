import Http from '@/utils/http/index.ws.js'
export default {
    // 用户信息
    userInfo(state) {
        return state.userinfo || {}
    },
    // 用户身份
    userIdentity(state) {
        if (!state.userinfo) return 0
        // true 为游客,false为会员
        let guest = state.userinfo.guest
        // 0 为普通 1 为专家
        let level = state.userinfo.level

        let res = 0
        if (!guest) {
            res = 1
            if (level == 1) {
                res = 2
            }
        }
        // 返回值 0 为游客 1 会员 2 专家
        return res
    },
    // 头像
    getAvatar(state) {
        let avatar = state.avatar
        if (avatar === 'ico.png') avatar = '0-0-0-ico.png'
        if (!avatar) avatar = '0-0-0-ico.png'
        return `${Http.url_base}/download/media/${avatar}`
    },
    // 生肖
    getCuryear(state) {
        return state.curyear
    },
    // 所有历史榜单
    getRounds(state) {
        return state.rounds.map((item, index) => ({
            text: `第${item}期冠军榜`,
            value: item
        }))
    },
    getOpenLottery(state) {
        return state.openLottery
    },
    getSpecialRun(state) {
        return state.special_run
    },
    getNowIssue(state) {
        return state.now_issue
    },
    getBaseUrl(state) {
        return state.base_url
    },
    getIsFF(state) {
        return state.isff
    },
    getIsIos(state) {
        return state.isios;
    },
    getOpenIssue(state) {
        return state.open_issue
    }
}