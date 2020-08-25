import store from '@/store'
import storage from '@/utils/storage.util.js'

let event_sink = {}

let messageDispose = {
    userinfo(body) {
        let userinfo = store.state.userinfo
        store.commit('setUserInfo', Object.assign(userinfo, body))
    },
    chat(body) {
        storage.msgDispose(body)
    },
    draw(body) {},
    gamestate(body) {},
    hkcdraws(body) {
        let {
            nums
        } = body

        let len = store.getters.getOpenLottery.length
        store.commit('setSpecialRun', true)
        if (len === 7) {
            store.commit('clearOpenLottery')
            len = 0
        }
        nums.slice(len).forEach((ele, idx) => {
            G.delay(() => {
                store.commit('updatedOpenLottery', ele)
            }, 1000 * idx)
        })

    }
}

function follow(type, body) {
    let disposeFun = messageDispose[type]
    if (disposeFun) {
        if (G.getter('log-ws')) console.log(type, body);
        disposeFun(body)
        let collect = event_sink[type]
        if (collect) {
            collect.forEach(fn => fn(body))
        }
    } else {
        console.error(`未知消息体:[${type}]`);
    }
}

function listen_msg(type, fn) {
    if (event_sink[type]) {
        event_sink[type].push(fn)
    } else {
        event_sink[type] = [fn]
    }
}

export default {
    follow,
    listen_msg
}