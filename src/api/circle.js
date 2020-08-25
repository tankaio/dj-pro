import Http from '../utils/http/index.ws'
import {
    getWithTime
} from "@/utils/formant.util.js";

// 获取发现圈晒单列表 
export function getFindMoments(data = {}) {
    return Http.callapi('init', 'GetFindMoments', data)
}
// 获取关注晒单列表
export function getFollowMoments(data = {}) {
    return Http.callapi('init', 'GetFollowMoments', data)
}
// 获取指定userid关注晒单列表
export function getPlayerMomentInfo(data = {}) {
    return Http.callapi('init', 'GetPlayerMomentInfo', data)
}

// 获取指定userid关注晒单列表
export function followSomebody(data = {}) {
    return Http.callapi('init', 'FollowSomebody', data)
}

// 根据指定晒单id获取指定晒单列表
export function getMomentInfo(data = {}) {
    return Http.callapi('init', 'GetMomentInfo', data)
}
// 删除晒单
export function removeMoment(data = {}) {
    return Http.callapi('init', 'RemoveMoment', data)
}
// 获取打赏列表
export function getMomentTips(data = {}) {
    return Http.callapi('init', 'GetMomentTips', data)
}
// 获取消息列表
export function getMomentMsgs(data = {}) {
    return Http.callapi('init', 'GetMomentMsgs', data)
}
// 获取点赞列表(晒单)
export function getMomentLikes(data = {}) {
    return Http.callapi('init', 'GetMomentLikes', data)
}
// 获取点赞列表(用户)
export function getLikeMomentList(data = {}) {
    return Http.callapi('init', 'GetLikeMomentList', data)
}
// 点赞晒单
export function likeMoment(data = {}) {
    return Http.callapi('init', 'LikeMoment', data)
}
// 取消点赞晒单
export function cancelLikeMoment(data = {}) {
    return Http.callapi('init', 'CancelLikeMoment', data)
}
// 打赏晒单
export function tippingMoment(data = {}) {
    return Http.callapi('init', 'TipMoment', data)
}
// 回复晒单
export function replyMoment(data = {}) {
    return Http.callapi('init', 'ReplyMoment', data)
}
// 举报违规
export function momentReport(data = {}) {
    return Http.callapi('init', 'MomentReport', data)
}

// 发布晒单
export function PublishMoment(data = {}) {
    return Http.callapi('init', 'PublishMoment', data)
}
// 发布图片上传
export const UploadPicByPlayer = (file_data, data = {}, process = () => {}) => {
    return new Promise(resolve => {
        Http.selPic(file_data, (zip_file, ext) => {
            Http.postBigFile('UploadPicByPlayer', data, zip_file, ext, process, (ok, msg) => {
                if (msg) {
                    resolve(msg)
                } else {
                    resolve(msg)
                }
            })
        })

    })
}


// 查询打赏我得晒单记录r
export function requestTipMeList(data = {}) {
    return Http.callapi('init', 'RequestTipMeList', data)
}

// 查询点赞我得晒单记录
export function requestLikeMeList(data = {}) {
    return Http.callapi('init', 'RequestLikeMeList', data)
}

// 查询回复我得晒单记录
export function requestMsgMeList(data = {}) {
    return Http.callapi('init', 'RequestMsgMeList', data)
}