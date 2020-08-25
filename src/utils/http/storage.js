
/*************************************************************
  存储管理，用于获取聊天室的语音/图片缓存
**************************************************************/
/* jshint esversion: 6 */

import enc from './encrypt.js';
import lf from './localforage.min.js';

let storage = {

    imgGetting: {}, // 正在试图从网络获取的图片，此标记为防止 vue 界面反复调用此函数

    // 保存本地图像
    setImg (api, file, type, data) {
        api.store.state.imgStore[file] = data;
        lf.setItem(file + '@' + type, data, ()=>{});
    },

    // 获取图像
    getImg (callbackRefresh, api, file, type) {
            
        // 从仓库内存读取
        let imgdata = api.store.state.imgStore[file];

        // 仓库内存中没有
        if (null == imgdata) {
            if (null == this.imgGetting[file]) {

                // 标记此图标正在获取，避免重复获取
                this.imgGetting[file] = 1;
                
                // 先从本地获取
                lf.getItem(file + '@' + type, (e, data)=>{
                
                    // 本地没有，从网络获取
                    if (null == data) {
                        let req = { fname: 'GetImg', param: {file: file, type:type} };
                        api.callapi(req, (res)=>{
                            delete this.imgGetting[file]; // 清除获取标记
                            if (res.ok) {
                                if (null == api.store.state.imgStore[file]) {
                                    data = "data:img/png;base64," + enc.uncNormal(res.ex, res.msg);
                                    api.store.state.imgStore[file] = data;
                                    lf.setItem(file + '@' + type, data, ()=>{});
                                    callbackRefresh(); // 刷新显示
                                }
                            }
                        });
                    }
                
                    // 本地有该图片文件
                    else {
                        delete this.imgGetting[file]; // 清除获取标记
                        api.store.state.imgStore[file] = data;
                        callbackRefresh(); // 刷新显示
                    }
                });
            }
            return '';
        }

        // 已存入本地仓库，返回 base64
        else {
            return imgdata;
        }
    },

    // 获取语音
    getAud (callbackRefresh, api, item) {
        if ('aud' != item.chat.type) return false;
        let ind = item.chat.data.indexOf('@');
        if (ind<0) return false;

        // 判断浏览器类型，确定扩展名
        if (api.store.state.isff) item.extype = 'ogg';
        else item.extype = 'mp3';

        // 追加扩展数据
        item.extime = item.chat.data.substring(ind+1); // 保存语音时间
        item.exerr = false;
        item.exdata = null;
        item.playing = false;

        let file = item.chat.data.substring(0,ind);
        lf.getItem(file + '@aud', (e, val)=>{

            // 本地缓存未找到该语音，从网络获取
            if (null != e || null == val) {
                let req = { fname: 'GetAud', param: {file: file + '.' + item.extype} };
                api.callapi(req, (res)=>{
                    if (false == res.ok) {
                        item.exerr = true;
                    }
                    else {
                        item.exerr = false;
                        item.exdata = enc.uncNormal(res.ex, res.msg);
                        lf.setItem(file + '@aud', item.exdata, (e, val) => {});
                    }
                    callbackRefresh();
                });
            }
            
            // 本地缓存找到该语音
            else {
                item.exerr = false;
                item.exdata = val;
            }
            
            callbackRefresh();
        });
        return true;
    },
};

export default storage;
