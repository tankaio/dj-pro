export default {
    state: {
        bkinfo: {}, // 银行卡信息
        fans_hasplan: [], // 我的粉丝中有发布计划的 
        follow_hasplan: [], // 我的关注中有发布计划的
        child_hasplan: [], // 我的助力伙伴中有发布计划的
        newmsg: false, // 新的站内信,
        ag: {}, // 推荐人
        targetUserInfo: {}, // 用户点击个人中心时的目标人信息
    },
    getters: {
        getFansHasplan(state) {
            return state.fans_hasplan
        },
        getFollowHasplan(state) {
            return state.follow_hasplan
        },
        getChildHasplan(state) {
            return state.child_hasplan
        },
        getBkInfo(state) {
            return state.bkinfo
        },
        getNewMsg(state) {
            return state.newmsg
        },
        getAg(state) {
            return state.ag
        },
        getTargetUser(state) {
            return state.targetUserInfo
        }
    },
    mutations: {
        setFansHasplan(state, val) {
            state.fans_hasplan = val || []
        },
        setFollowHasplan(state, val) {
            state.follow_hasplan = val || []
        },
        setChildHasplan(state, val) {
            state.child_hasplan = val || []
        },
        setBkInfo(state, val) {
            state.bkinfo = val || {}
        },
        setNewMsg(state, val) {
            state.newmsg = val
        },
        setAg(state, val) {
            state.ag = val
        },
        setTargetUser(state, val) {
            state.targetUserInfo = val
        }
    }
}