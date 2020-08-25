import './preset/bootstrap';

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import eventBus from './utils/eventBus.js'
import {
  mapGetters
} from 'vuex'

// api
import {
  getSession,
  Login,
} from './api'

import {
  Lazyload,
  Dialog,
  Toast,
  Button,
  Swipe,
  SwipeItem,
  Icon,
  Tag,
  CellGroup,
  Cell,
  Row,
  Col,
  Field,
  Search,
  Popup,
  Loading,
  DropdownMenu,
  DropdownItem,
  Overlay,
  Divider,
  Tabbar,
  TabbarItem,
  Uploader,
  ActionSheet,
  Image,
  Picker,
  Tabs,
  Tab,
  Switch,
  DatetimePicker,
  NavBar,
  Panel,
  Grid,
  GridItem,
  Collapse,
  CollapseItem,
  NoticeBar,
  List,
  Notify,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Area,
  PullRefresh,
} from 'vant'

Vue
  // .use(vant)
  .use(Dialog)
  .use(Toast)
  .use(Button)
  .use(Swipe)
  .use(SwipeItem)
  .use(Icon)
  .use(Tag)
  .use(CellGroup)
  .use(Cell)
  .use(Row)
  .use(Col)
  .use(Field)
  .use(Search)
  .use(Popup)
  .use(Loading)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Overlay)
  .use(Divider)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Uploader)
  .use(ActionSheet)
  .use(Image)
  .use(Picker)
  .use(Tabs)
  .use(Tab)
  .use(Switch)
  .use(DatetimePicker)
  .use(NavBar)
  .use(Panel)
  .use(Panel)
  .use(Grid)
  .use(GridItem)
  .use(Collapse)
  .use(CollapseItem)
  .use(NoticeBar)
  .use(List)
  .use(Notify)
  .use(RadioGroup)
  .use(Radio)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(Area)
  .use(PullRefresh)
  .use(Lazyload, {
    loading: './images/img-loading.gif',
    error: './images/img-loading-error.png',
    lazyComponent: true
  })

Toast.setDefaultOptions(
  'loading', {
    forbidClick: true
  }
)
Notify.setDefaultOptions({
  color: '#333'
})
Dialog.setDefaultOptions({
  closeOnPopstate: true
})

// 导入预定义样式
import './assets/css/index.scss'
// 注册自有组件
// import './preset/globalComponentRegister'
// 导入filters
import './preset/filters'
// 导入指令
import './preset/directive'
// 导入 http 
import Http from './utils/http/index.ws'
// 带入 http 配置文件
import constant from "@/utils/http/constant.js";
// 导入 消息分发文件
import wsDispose from './api/ws_dispose.js'
// 导入本地缓存初始化
import strg from '@/utils/storage.util.js'

strg.init()

store.commit('init')

G.setter('ws_connect', true)

function initDialogue() {
  // 初始会话
  getSession().then((res) => {
    // session 会话中的用户信息
    if (res && res.update) {
      alert('更新', JSON.stringify(res))
      location.reload()
    }
    // 本地用户账号密码
    let user_account = ls('acnt')

    let params = {
      id: '',
      psw: '',
      ver: constant.curver
    }

    if (user_account) {
      params.id = user_account.id
      params.psw = user_account.psw
    }

    Login(params).then(() => {
      G.setter('ws_connect', true)
      Toast.clear()
    })

  })
}

const reConnect = () => {
  Toast.loading({
    duration: 0,
    message: '断线重连中...',
    forbidClick: true
  })
  // 设置ws为断线状态
  G.setter('ws_connect', false)
  // ws登陆重试
  initDialogue()
}

// 初始化连接
Http.init((type, data) => {
  // 收到消息推送
  Toast.clear()
  // 处理ws消息
  wsDispose.follow(type, data)
  // 设置ws状态为连接
  G.setter('ws_connect', true)

}, (msg) => {
  // 断线关闭登陆状态
  Http.islogin = false
  reConnect()
})

// 页面转为前台时检测是否掉线
G.$on('page-visible', () => {
  // 不在线重连
  if (!G.getter('ws_connect')) {
    reConnect()
  }
})

/**
 * log-params 控制台打印请求参数
 * log-msg 控制台打印返回参数
 * log-ws 控制台打印推送消息
 */
if (process.env.NODE_ENV === 'development') {
  G.setter('log-params', true)
  G.setter('log-msg', true)
  G.setter('log-ws', true)
  // 是否进入下级页面,这里控制路由切换时的页面动画
  G.setter('toNextPage', false)
}

/* 浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。 */
Vue.config.performance = true
/* 启动时生成生产提示 */
Vue.config.productionTip = true

Vue.prototype.$eventBus = eventBus;
Vue.prototype.$vw = document.body.clientWidth
Vue.prototype.$http = Http

// 初始化登陆,游客身份登录
initDialogue()

import xLayout from 'cpt/x-layout/index.vue'
import xHeader from 'cpt/x-header.vue'
import xLazyCpt from 'cpt/x-lazy-cpt/x-lazy-cpt.vue'
import xCptLoading from 'cpt/x-cpt-loading.vue'

Vue.component(xLayout.name, xLayout)
Vue.component(xHeader.name, xHeader)
Vue.component(xLazyCpt.name, xLazyCpt)
Vue.component(xCptLoading.name, xCptLoading)

new Vue({
  router,
  store,
  render: h => h(App),
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      viewHeight: window.innerHeight,
    }
  },
  methods: {
    v2px(px) {
      return this.$vw / 375 * px
    },
    px2rem(px) {
      return 375 / this.$vw * px / 100
    },
    loginVerify() {
      if (this.userInfo.guest) {
        G.$dialog
          .confirm({
            title: "请登录",
            message: "需要登录后才可以查看"
          })
          .then(() => {
            router.push("/sign");
          })
          .catch(G.zero);
        return false;
      } else {
        return true;
      }
    },
    getViewPortHeight() {
      // let body = document.getElementsByTagName("body")[0];
      let _that = this

      function getPortHeight() {
        _that.viewHeight = window.innerHeight
      }

      let throttle_getPortHeight = G.throttle(getPortHeight, 50)

      window.addEventListener('touchmove', throttle_getPortHeight)

    },
    // 当前历史栈中有其他页面时,无法使用vue路由钩子完成路由阻断,需要阻断物理返回键
    stopPhysical() {
      window.addEventListener("popstate", e => {
        if (G.$routeHook.state()) {
          e.preventDefault()
          G.$routeHook.go()
        }
      }, false);
    },
    // 动画延时
    animateDelay(cb, delay = 350) {
      // WS 数据返回比api快列表类型的数据是直接随在动画开始时就渲染的,大量渲染会导致动画卡顿
      G.delay(cb, delay)
    },
  },
  created() {
    this.getViewPortHeight()
  },
  mounted() {
    this.stopPhysical()
  },
}).$mount('#app')