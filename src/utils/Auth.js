import store from '@/store'
import {
    Notify
} from 'vant';
import {
    BuyPlan
} from '@/api/user'

const ROUTE_REG = /^((?:\/[A-z]+)+)(\/\?|\/\*)*$/

// 登陆的权限路由
export const NOT_LOG_IN = [
    '/user/?',
    '/chat/*',
    '/circle/*',
    '/games/?',
    '/publish/?'
]
// 关闭的模块
export const CLOSE_MODEL = [
    '/chat/room/red/?', // 聊天室红包房
    '/chat/changLongAssistant', // 聊天室长龙
    '/toutiao/?', // 六合头条
    '/userInfo/UserInfoPicture/?', // 个人中心六合头条
    '/userInfo/UserInfoLiuHe/?', // 个人中心六合图库
    // '/userInfo/userInfoCircle/?'
]
// 刷新无状态的路由,即当前路由页面刷新会导致某些数据无法获取时需要回退至首页
export const NOT_STATE = [
    '/publish/?',
    '/chat/?',
    '/circle/*',
    '/planDetail/?',
    '/user/*',
    "/games/*"
]

export const routerExclude = (path, exclude) => {
    return exclude.some(ele => {

        let [match, p1, p2] = ele.match(ROUTE_REG) || []

        if (path === match) {
            return true
        } else {
            if (p2) {
                if (p2 === '/?') {
                    // 如果p2等于 /? 则需要满足匹配 /p1/? 或 /p1 的路径
                    if (path === p1) {
                        return true
                    } else {
                        return path.match(`${p1}/`)
                    }
                } else if (p2 === '/*') {
                    // 如果p2等于 /* 则 /p1/ 以下的任何路由都会被匹配
                    return path.match(`${p1}/`)
                }
            } else {
                return false
            }
        }
    })
}

// 所有聊天室的进入都需要调用这个方法
export const inRoom = ({
    type: roomType,
    rid: roomId,
}) => new Promise(reslove => {

    if (!roomId || !roomType) {
        new Error('参数错误')
        return;
    }
    if (roomType === 'red') {
        G.$dialog.alert({
            title: "提醒",
            message: "当前房间未开放!"
        })
        return;
    };

    if (store.getters.getRid == '') {
        reslove('inroom')
    } else if (store.getters.getRid != roomId) {
        G.$dialog
            .confirm({
                title: '提醒',
                message: '是否要切换房间?'
            })
            .then(() => reslove('checkout'))
            .catch(G.__)
    } else {
        reslove()
    }
})

// 购买计划
export const judgeBuyPlan = (id, balance, price, options = {
    access() {
        /* 已经购买允许查看准入 */
    },
    faild() {
        /* 购买失败 */
    },
    cancel() {
        /* 取消 */
    },
    charge() {
        /* 充值 */
    }
}) => {
    if (price == 0) {
        options.access()
    } else {
        G.$dialog.confirm({
            title: `消费${price}积分？`,
            message: '温馨提示：此资料纯属专家个人观点，仅供参考。请自愿选择购买。祝您中奖!'
        }).then(async () => {

            if (G.toNumber(balance) > G.toNumber(price)) {
                let {
                    ok,
                    msg
                } = await BuyPlan({
                    planid: id
                })

                if (ok) {
                    Notify({
                        type: 'success',
                        message: '购买成功',
                        duration: 2000,
                        onClose: () => {
                            options.access()
                        }
                    })
                } else {
                    Notify({
                        type: 'danger',
                        message: '购买失败',
                        duration: 2000,
                        onClose: () => {
                            options.faild()
                        }
                    })
                }

            } else {
                G.$dialog
                    .confirm({
                        title: '提醒',
                        message: '账户积分不足，请充值！'
                    })
                    .then(() => {
                        options.charge();
                        // this.$router.push('/user/integral')
                    })
                    .catch(() => {
                        options.cancel()
                    })
            }

        }).catch(res => {
            options.cancel()
        })
    }
}