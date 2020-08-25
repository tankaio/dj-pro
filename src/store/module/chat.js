export default {
    state: {
        now_rid: '',
        chat_info: '',
        msg_list: [],
        bookmarker_info: {
            name: "刘德华",
            admin: true, // 当前庄家是否为管理
        }, // 庄家身份信息
        bookmarker: true, // 庄家?
        admin: true, // 管理员
        gameing: false, // 当前是否有进行中的游戏
        nn_config: {
            // lowbet = 20, //最小下注
            // highbet = 10000, //最大下注
            // mincount = 3, //最小红包个数
            // maxcount = 20, //最大红包个数
        }, // 牛牛红包游戏

        chatList: [], // 聊天室消息队列

    },
    getters: {
        getRid(state) {
            return state.now_rid
        },
        getMsgList(state) {
            return state.msg_list
        },
        getBookMarker(state) {
            return state.bookmarker
        },
        getAdmin(state) {
            return state.admin
        },
        getGameing(state) {
            return state.gameing
        },
        getBookMarkerInfo(state) {
            return state.bookmarker_info
        },
        getNnConfig(state) {
            return state.nn_config
        },
        getChatInfo(state) {
            return state.chat_info
        },
        // 获取聊天数据
        getChatList(state) {
            return state.chatList
        }
    },
    mutations: {
        setRid(state, val) {
            state.now_rid = val
        },
        setMsgList(state, val) {
            state.msg_list.push.apply(state.msg_list, val)
        },
        setCoverMsgList(state, val) {
            state.msg_list = val
        },
        setGameing(state, val) {
            return state.gameing = val
        },
        setNnConfig(state, val) {
            return state.nn_config = val
        },
        setChatInfo(state, val) {
            state.chat_info = val
        },
        // 聊天数据
        setChatList(state, val) {
            if (G.isArr(val)) {
                state.chatList.push(...val)
            } else {
                state.chatList.push(val)
            }
        }
    }
}