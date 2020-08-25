export default {
    state: {
        details_params: {}, // 详情信息
        own_UserInfo: '', // 自己跟他人页
        report_Param: {}, // id illegalid
        new_msg: null, // 与我相关的最新消息数 
    },
    getters: {
        getDetailsParams(state) {
            return state.details_params
        },
        getOwnUserInfo(state) {
            return state.own_UserInfo
        },
        getReportParam(state) {
            return state.report_Param
        },
        getCircelNewMsg(state) {
            return state.new_msg
        }
    },
    mutations: {
        setDetailsParams(state, val) {
            state.details_params = val || {}
        },
        setOwnUserInfo(state, val) {
            state.own_UserInfo = val || {}
        },
        setReportParam(state, val) {
            state.report_Param = val || {}
        },
        setCircelNewMsg(state, val) {
            state.new_msg = val
        },
        setCircelNewMsgReaded(state, val) {
            let new_msg = state.new_msg
            switch (val) {
                case 'unreadmsg':
                    new_msg.unreadmsg = 0
                    break;
                case 'unreadtipm':
                    new_msg.unreadtipm = 0
                    break;
                case 'unreadlike':
                    new_msg.unreadlike = 0
                    break;
                default:
                    break;
            }
            state.new_msg = new_msg
        }
    }
}