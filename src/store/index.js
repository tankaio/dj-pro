import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// import actions from './actions'
import mutations from './mutations'

import module_user from './module/user'
import module_other from './module/other'
import module_chat from './module/chat'
import module_circle from './module/circle'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isff: false, // 是否在火狐/opera中
    isios: false, // 是否在ios中
    isweixin: false, // 是否在微信中
    isandroid: false, // 是否在安卓设备中
    isphoneos: false, // 是否在其他手机系统中

    // routeHook: [], // 路由钩子函数，用于拦截路由后退

    avatar: '', // 用户头像
    userinfo: {}, // 用户数据
    curyear: "", // 今年的生肖
    rounds: [], // 往期冠军榜的列表
    openLottery: [], // 开奖奖池，因为是单个数开奖所以需要 push 
    special_run: false, // 特码挂奖状态
    open_issue: '', // 已开奖期数
    now_issue: {
      // date
      // round
    }, // 当前期
    base_url: "", // url

    // userbalan: 0, // 用户余额

    // oddsdict: {}, // 赔率缓存

    // lobbygid: 0, // 客服推送消息线程id
    // lobbyord: '0', // 客服推送消息最后单号
    // lobbymsg: '', // 客服推送消息
    // lobbyxhr: null,
    // // lobbyreqid: 1000,           // 客服推送长轮询网络编号

    // autologin: true, // 首页是否自动登录
    // // urltime: (new Date()).valueOf(),    // 重新构建最快url的时间

    // atmyinfo: false, // 是否处在“我的”页面
    // curtag: '', // 当前搜索的标签

    // videoinfo: {
    //   id: '',
    //   date: '',
    //   cover: '',
    //   url: '',
    //   desc: '',
    //   keywords: '',
    // },

  },
  getters,
  // actions,
  mutations,
  modules: {
    user: module_user,
    other: module_other,
    chat: module_chat,
    circle: module_circle
  }
})