export default {
    init(state) {
        // 检测浏览器
        var ua = navigator.userAgent.toLowerCase();
        state.isff = /firefox|opera/.test(ua);
        state.isios = /ipad|iphone|ipod/.test(ua);
        state.isweixin = /micromessenger/.test(ua);
        state.isandroid = /android/.test(ua);
        state.isphoneos = (/symbianos|windows phone/.test(ua)) || state.isandroid || state.isweixin || state.isios;

        // 获取客户资料
        let str = sessionStorage.getItem('userinfo');
        if (null != str) {
            try {
                state.userinfo = JSON.parse(str);
            } catch (e) {
                state.userinfo = null;
            }
        }

        // 初始化客服推送
        // let lastid = localStorage.getItem('lobbymsg');
        // if (null != lastid && '' != lastid) state.lobbyord = lastid;
        // state.lobbygid = 0;

        // 提取最后登录的页面
        // state.lastpage = localStorage.getItem('lastpage');
        // if ('' == state.lastpage || null == state.lastpage) state.lastpage = '/lobby';

        // _clearLocalForage();

        // str = sessionStorage.getItem("videoinfo");
        // try {
        //     state.videoinfo = JSON.parse(str);
        // } catch (e) {
        //     state.videoinfo = {
        //         id: '',
        //         date: '',
        //         cover: '',
        //         url: '',
        //         desc: '',
        //         keywords: '',
        //     };
        // }
    },
    // setShowTags(state, bshow) {
    //     state.showtags = bshow;
    // },
    // toggleShowTags(state) {
    //     state.showtags = !state.showtags;
    // },
    // 清空本地图片语音缓存
    // clearLocalForage() {
    //     _clearLocalForage();
    // },
    // 设置用户信息
    setUserInfo(state, info) {
        if (null != info) {
            state.userinfo = info;
        }
        sessionStorage.setItem('userinfo', JSON.stringify(state.userinfo));
    },
    // 清空用户信息
    clearUserInfo(state) {
        state.autologin = false;
        state.userbalan = 0;
        state.userinfo = null;
        sessionStorage.removeItem('userinfo');
    },
    // setUserBalan(state, info) {
    //     state.userbalan = info;
    // },
    // setLastPage(state, info) {
    //     state.lastpage = info;
    //     // localStorage.setItem('lastpage', state.lastpage);
    // },
    // setLobbyMsg(state, info) {
    //     state.lobbymsg = info;
    // },
    // // 
    // setAutoLogin(state, b) {
    //     state.autologin = b;
    // },
    // // 写入路由钩子
    // setRouteHook(state, fun) {
    //     state.routeHook.push(fun)
    // },
    // // 清除路由钩子
    // clearRouteHook(state) {
    //     state.routeHook = []
    // },



    // 设置用户头像
    setAvatar(state, val) {
        state.avatar = val
    },
    setCuryear(state, val) {
        state.curyear = val
        ls('curyear', val)
    },
    setRounds(state, val) {
        state.rounds = val
    },
    setGander(state, val) {
        state.userinfo = Object.assign(state.userinfo, {
            sex: val
        })
    },
    // 添加开奖号码
    updatedOpenLottery(state, val) {
        state.openLottery.push(val)
    },
    // 清空开奖号码
    clearOpenLottery(state) {
        state.openLottery = []
    },
    setSpecialRun(state, val) {
        ls('SpecialState', val)
        state.special_run = val
    },
    setNowIssue(state, val) {
        state.now_issue = val
    },
    //
    setBaseUrl(state, val) {
        state.base_url = val
    },
    setOpenIssue(state, val) {
        state.open_issue = val
    }
}

// 清理过早的localforage
// function _clearLocalForage() {
//     let max_aud = 50;
//     let max_pic = 50;
//     let max_ico = 100;

//     lf.keys((e, val) => {
//         if (null != val) {
//             let len = val.length;
//             let audlist = [];
//             let piclist = [];
//             let icolist = [];
//             for (let i = 0; i < len; i++) {

//                 // 取出所有声音缓存
//                 if (/@aud/.test(val[i])) {
//                     audlist.push(val[i]);
//                 }

//                 // 取出所有图片缓存
//                 else if (/@pic/.test(val[i])) {
//                     piclist.push(val[i]);
//                 }

//                 // 取出所有头像缓存
//                 else if (/@ico/.test(val[i])) {
//                     icolist.push(val[i]);
//                 }
//             }

//             // 语音保留最近的 xx 条
//             len = audlist.length;
//             if (len > max_aud) {
//                 len = len - max_aud;
//                 audlist.sort();
//                 for (let i = 0; i < len; i++) {
//                     lf.removeItem(audlist[i], () => {});
//                 }
//             }

//             // 图片保留最近的 xx 张
//             len = piclist.length;
//             if (len > max_pic) {
//                 len = len - max_pic;
//                 piclist.sort();
//                 for (let i = 0; i < len; i++) {
//                     lf.removeItem(piclist[i], () => {});
//                 }
//             }

//             // 头像保留最近的 xx 个
//             len = icolist.length;
//             if (len > max_ico) {
//                 len = len - max_ico;
//                 icolist.sort();
//                 for (let i = 0; i < len; i++) {
//                     lf.removeItem(icolist[i], () => {});
//                 }
//             }
//         }
//     });
// }