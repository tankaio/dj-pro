import Http from '../utils/http/index.ws'
import store from '@/store'
import router from '@/router'
import {
    NOT_STATE,
    routerExclude
} from '../utils/Auth'

export function getSession() {
    return new Promise(resolve => {
        Http.getSession(res => resolve(res))
    })
}

export function Login(data = {}) {
    return Http.callapi('init', 'Login', data, msg => {
        let curyear = ls('curyear')
        let lastorder = msg.lastorder
        if (lastorder) ls('orderId', msg.lastorder) // 线下存款上次的单号
        store.commit('setAvatar', msg.ico) // 用户头像
        store.commit('setUserInfo', msg) //  用户信息
        store.commit('setCuryear', msg.curyear || curyear) // 当年 生肖
        store.commit('setAg', msg.ag || {}) // 推荐人
        store.commit('setRounds', msg.rounds || []) // 历史冠军所有历史期号
        closeAnimate()
        
        if (msg.guest === true && routerExclude(location.hash.replace('#', ''), NOT_STATE)) {
            G.$dialog.confirm({
                title: '请登录',
                message: '需要登录后才可以查看'
            }).then(() => {
                router.push('/sign')
            }).catch(G.zero)
        }
    })
}

export let Logout = (data = {}) => Http.callapi('init', 'Logout', data, msg => {
    let curyear = ls('curyear')
    let lastorder = msg.lastorder
    if (lastorder) ls('orderId', msg.lastorder) // 线下存款上次的单号
    store.commit('setAvatar', msg.ico) // 用户头像
    store.commit('setUserInfo', msg) //  用户信息
    store.commit('setCuryear', msg.curyear || curyear) // 当年 生肖
    store.commit('setAg', msg.ag || {}) // 推荐人
    ls.remove("acnt"); // 清除本地账号
    // Http.islogin = false // 
})

export function Regist(data = {}) {
    return Http.callapi('init', 'Regist', data)
}