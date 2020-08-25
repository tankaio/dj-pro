import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '../store'
import {
  NOT_LOG_IN,
  CLOSE_MODEL,
  NOT_STATE,
  routerExclude
} from '../utils/Auth'

const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};



Vue.prototype.go = function (n) {
  G.setter('toNextPage', false)
  this.$router.go(n)
}

Vue.prototype.back = function () {
  G.setter('toNextPage', false)
  this.$router.back()
}

Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

router.onError(err => {
  console.error(err);
})

// 路由钩子
router.beforeEach((to, from, next) => {

  // websocket 未连接
  if (!G.getter('ws_connect')) return next()
  let guest = G.get(store.state, 'userinfo.guest', true) // true 未登陆
  // 无钩子
  // 如果用户在其他具有登陆限制的页面刷新将会导致 状态丢失
  if (from.path === '/' && to.path !== '/' && to.path !== '/home') {
    if (routerExclude(to.path, NOT_STATE) || routerExclude(to.path, CLOSE_MODEL)) {
      router.replace('/home')
      return;
    }
    return next()
  } else if (guest && routerExclude(to.path, NOT_LOG_IN)) {
    // 非登陆不准入
    G.$dialog.confirm({
      title: '请登录',
      message: '需要登录后才可以查看'
    }).then(() => {
      router.push('/sign')
    }).catch(G.zero)

  } else if (routerExclude(to.path, CLOSE_MODEL)) {
    // 关闭模块
    G.$dialog.alert({
      title: '提示',
      message: '暂未开放'
    })

  } else if (G.$routeHook.state()) {
    // 路由钩子
    G.$routeHook.go()
    return next(-1);

  } else {

    next()

  }

});

router.beforeResolve((to, from, next) => {
  // console.log('reslove');
  next()
})

router.afterEach((to, from) => {
  // 记录历史有效路由
})



export default router