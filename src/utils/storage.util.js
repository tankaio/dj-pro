import lf from './http/localforage.min.js'
import store from '@/store'
import Http from '@/utils/http/index.ws.js'
import {
    formatDuration,
    getWithTime,
    getDaysDiffBetweenDates,
    isYesterday,
    ymd,
    hms
} from "@/utils/formant.util.js";

// 历史搜索记录
export let historySearchRecord = (val, type) => new Promise((reslove) => {
    if (val) {
        let history_list = ls(`${type}_search_history`)
        if (history_list) {
            if (history_list.length > 10) {
                history_list.pop();
            }
            history_list.unshift(val);
        } else {
            history_list = [val];
        }
        ls(`${type}_search_history`, history_list);
        reslove(history_list)
    }
})

const NUMBER_DATE_REG = /^([0-9]+){([0-9-]+)}/
const AUD_TIME = /@[0-9.]+$/

export default {
    number_map: {},
    msg_list_timestamp_count: 0,
    targetVal: null,
    listenFun(e) {
        console.log('没有注册的监听', e);
    },
    init() {
        lf.keys((k, v) => {
            v.forEach(item => {
                let number_date_match = item.match(NUMBER_DATE_REG)
                if (number_date_match) {
                    let [_, number, date] = number_date_match
                    if (number && date) {
                        if (getDaysDiffBetweenDates(new Date(date), new Date()) > 10) {
                            lf.removeItem(item)
                        } else if (number) {
                            this.number_map[number] = item
                        }
                    }
                }
            })
            // console.log(this.number_map);
        })

    },
    update(key, type) {
        let [ymd] = getWithTime(new Date())
        this.number_map[key] = `${key}{${ymd}}@${type}`
        // console.log('[update number map]:', key, `${key}{${ymd}}@${type}`);

    },
    // 单条数据写入
    setCache(type, ordid, data) {
        let [ymd] = getWithTime(new Date())
        lf.setItem(`${ordid}{${ymd}}@${type}`, data)
        this.update(ordid, type)
    },
    // 用于单个数据的获取
    getCache(type, ordid, filename, cb = () => {}) {
        // ordid 文件id
        let is_ordid = this.number_map[ordid]
        if (!is_ordid) {
            return `${Http.url_base}/download/media/${filename}`
        } else {
            lf.getItem(is_ordid).then(res => {
                cb(res)
            })
        }
    },
    // 聊天室历史数据缓存
    setListCache(rid, list, type) {
        let [ymd] = getWithTime(new Date())
        // 保留最新的 100 条
        if (list.length > 100) {
            list.slice(list.length - 100)
        }
        lf.setItem(`${rid}{${ymd}}/${type}@chat`, list)
    },
    // 直接获取本地聊天列表缓存,将列表中包含的图片语音使用本地存储获取
    getListCache(rid, type) {
        let key = this.number_map[rid]
        let local_cache = lf.getItem(key)

        if (!local_cache) {
            return Promise.resolve(false)
        }
        let now = new Date()
        return new Promise(resolve => {
            local_cache.then(res => {
                res = res || []
                res.forEach(async item => {
                    let type = item.type
                    if (type === 'img' || type === 'voice' || type === 'txt') {
                        item.timestamp = this.timestampDispose(item.time, now)
                    }
                })
                let len = res.length
                if (len > 100) {
                    res = res.slice(len - 100)
                }
                resolve(res)
            })
        })
    },
    // 用户发送消息成功后会接收 ws 返回的当前消息,将当前消息转换格式,丢入 vuex
    msgDispose(body, formant) {
        let res = []
        let now = new Date()
        let rid = body.rid
        let chats = body.chats || []
        this.targetVal = null;

        chats.forEach(item => {
            let isSelf = store.getters.userInfo.id == item.spkid
            let data = {
                avatar: isSelf ? store.getters.getAvatar : item.ico,
                username: item.nick,
                self: isSelf,
                ordid: item.ordid,
                timestamp: this.timestampDispose(item.time, now),
                time: item.time,
                rid: rid
            }

            let [ymd, hms] = getWithTime(new Date(item.time))
            let [year, mounth, day] = ymd.split('-')
            let [hour, minute, second] = hms.split(':')

            switch (item.type) {
                case 'txt':
                    // data.message = {
                    //     type: 'txt',
                    //     text: item.data
                    // }
                    data.type = 'txt'
                    data.text = item.data
                    data.component = 'x-room-msg'
                    res.push(data);
                    break;
                case 'img':
                    // data.message = {
                    //     type: 'img',
                    //     src: ''
                    // }
                    data.type = 'img'
                    data.src = ''
                    data.filename = item.data
                    data.component = 'x-room-msg'
                    res.push(data);
                    break;
                case 'aud':
                    // data.message = {
                    //     type: 'voice',
                    //     src: ''
                    // }
                    let voice_time
                    let filename = item.data.replace(AUD_TIME, match => {
                        voice_time = match.replace('@', '')
                        return ''
                    })
                    data.type = 'voice'
                    data.src = ''
                    data.component = 'x-room-msg'
                    data.filename = filename
                    data.voice_time = voice_time
                    res.push(data)
                    break;
                case 'redbag':
                    Object.assign(data, {
                        type: 'redbag', // 
                        open: false, // 自己是否领取
                        end: false, // 红包是否结束
                        redbagPlay: 1, // 游戏红包的玩法类型
                        redbagType: 2, // 普通红包还是游戏红包 
                    })
                    data.component = 'x-room-msg'
                    res.push(data)
                    break;
                case 'launch':
                    // data.message = {
                    //     type: 'launch',
                    //     launchuser: '彭于晏',
                    //     lower_bet: 50,
                    //     red_num: 5,
                    //     upper_bet: 1000
                    // }
                    Object.assign(data, {
                        type: 'launch',
                        launchuser: '彭于晏',
                        lower_bet: 50,
                        red_num: 5,
                        upper_bet: 1000
                    })
                    data.timestamp = `${year}年${mounth}月${day}日 ${hour}:${minute}:${second}`
                    data.component = 'x-redgame-nn'
                    res.push(data)
                    break;
                case 'bet':
                    Object.assign(data, {
                        type: 'bet',
                        member: 5,
                        list: [{
                            name: 'a123123',
                            bet: 50
                        }, {
                            name: 'Emma',
                            bet: 50
                        }, {
                            name: 'Leo',
                            bet: 50
                        }, {
                            name: '彭于晏',
                            bet: 50
                        }, {
                            name: '彭于晏',
                            bet: 50
                        }]
                    })
                    data.timestamp = `${year}年${mounth}月${day}日 ${hour}:${minute}:${second}`
                    data.component = 'x-redgame-nn'
                    res.push(data)
                    break;
                case 'end':
                    Object.assign(data, {
                        type: 'end',
                        list: [{
                            name: '彭于晏',
                            bet: 50,
                            grab: 1.64,
                            identity: '庄家',
                            nn: '牛牛'
                        }, {
                            name: '彭于晏',
                            bet: 50,
                            grab: 1.64,
                            nn: '牛1',
                            fail: 200,
                        }, {
                            name: '彭于晏',
                            bet: 50,
                            grab: 1.64,
                            nn: '牛1',
                            win: 100,
                        }, {
                            name: '彭于晏',
                            bet: 50,
                            grab: 1.64,
                            nn: '牛1',
                            win: 100,
                        }, {
                            name: '彭于晏',
                            bet: 50,
                            grab: 1.64,
                            nn: '牛1',
                            win: 100,
                        }]
                    })
                    data.timestamp = `${year}年${mounth}月${day}日 ${hour}:${minute}:${second}`
                    data.component = 'x-redgame-nn'
                    res.push(data)
                    break;
                case 'failend':
                    data.type = 'failend'
                    data.timestamp = undefined
                    data.component = 'x-redgame-nn'
                    break;
                default:
                    break;
            }

        })
        if (formant) {
            return res
        }
        this.listenFun(res)
    },
    listen(fun) {
        this.listenFun = fun
    },
    timestampDispose(timestamp, now = new Date()) {
        let date = new Date(timestamp);

        let [year, month, day] = ymd(date).split("-");
        let [hour, minute] = hms(date).split(":");

        function getTimeStamp() {
            if (now.getDate() == day) return `今天${hour}:${minute}`
            else if (isYesterday(date)) return `昨天${hour}:${minute}`
            else if (now.getFullYear() == year) return `${month}月${day}日 ${hour}:${minute}`
            else if (Number(year) < now.getFullYear()) return `${year}年${month}月${day}日 ${hour}:${minute}`
        }
        if (!this.targetVal) {
            this.targetVal = date;
            return getTimeStamp();
        } else {
            let tarVal = (date - this.targetVal) / 1000;
            this.targetVal = date;
            if (tarVal >= 300) return getTimeStamp();
        }
    }
}