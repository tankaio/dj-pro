import Http from '../utils/http/index.ws'
import lf from '../utils/http/localforage.min'
import strg from '../utils/storage.util'
import {
        getWithTime
} from "@/utils/formant.util.js";

// 获取聊天室总大厅信息
export const GetChatLobbyInfo = (data = {}) => {
        return Http.callapi('init', 'GetChatLobbyInfo', data)
}

// 搜索所有聊天室房间
export const GetChatRooms = (data = {}) => {
        return Http.callapi('init', 'GetChatRooms', data)
}

// 进入某个聊天室
export const EnterRoom = (data = {}) => {
        return Http.callapi('init', 'EnterRoom', data)
}

// 离开房间
export const LeaveRoom = (data = {}) => {
        return Http.callapi('init', 'LeaveRoom', data)
}

// 获取历史聊天
export const GetOldChats = (data = {}) => {
        return Http.callapi('init', 'GetOldChats', data)
}

// 会员在聊天室发言
export const SetChats = (data = {}) => {
        return Http.callapi('init', 'SetChats', data)
}

// 会员在聊天室发送图片
export const PlayerSendChatPic = (file_data, data = {}, process = () => {}) => {
        return new Promise(resolve => {
                Http.selPic(file_data, (zip_file, ext) => {
                        Http.postBigFile('PlayerSendChatPic', data, zip_file, ext, process, (ok, msg) => {
                                let [ymd] = getWithTime(new Date())
                                let {
                                        ordid,
                                        file // 文件名
                                } = msg
                                // 缓存聊天图片,这里的图片上传回调会比ws消息返回的慢一些
                                strg.setCache('img', ordid, zip_file)
                                resolve(ok, file)
                        })
                })

        })
}

// 会员在聊天室发送语音
export const PlayerSendChatAud = (file_data, data = {}, ext = '.mp3', process = () => {}) => {
        return new Promise(resolve => {
                Http.postBigFile('PlayerSendChatAud', data, file_data, ext, process, (ok, msg) => {
                        let [ymd] = getWithTime(new Date())
                        let {
                                ordid,
                                file // 文件名
                        } = msg
                        // 缓存聊天图片,这里的图片上传回调会比ws消息返回的慢一些
                        strg.setCache('voice', ordid, file_data)
                        console.log('录音文件上传完毕',ordid, file_data,file)
                        resolve(ok, file)
                })
        })
}

// 指定庄家
export const SetNiuNiuBanker = (data = {}) => {
        return Http.callapi('init', 'SetNiuNiuBanker', data)
}

// 收回庄家
export const GetBackNiuNiuBanker = (data = {}) => {
        return Http.callapi('init', 'GetBackNiuNiuBanker', data)
}

// 返还庄家给管理员
export const ReturnBackNiuNiuBanker = (data = {}) => {
        return Http.callapi('init', 'ReturnBackNiuNiuBanker', data)
}

// 发起红包牛牛游戏
export const StartNiuNiuFuli = (data = {}) => {
        return Http.callapi('init', 'StartNiuNiuFuli', data)
}

// 获取红包牛牛游戏参数
export const GetNiuNiuConf = (data = {}) => {
        return Http.callapi('init', 'GetNiuNiuConf', data)
}

// 红包牛牛下注
export const NiuNiuBet = (data = {}) => {
        return Http.callapi('init', 'NiuNiuBet', data)
}