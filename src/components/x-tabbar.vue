<template>
  <van-tabbar active-color="#EC293C" inactive-color="#333333" v-model="active" class="x-tabbar ios-bt">
    <van-tabbar-item v-for="(item, index) in icon" :key="index" @click="go(item.link)" :class="item.ident">
      <span>{{ item.tit }}</span>
      <span slot="icon" :class="[activeFilter(index), `xIcon-${item.ident}-tabbar`]" />
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'x-tabbar',
  components: { Tabbar, TabbarItem },
  props: ['active_prop'],
  model: {
    prop: 'active_prop',
    event: 'sync'
  },
  data() {
    return {
      value: 0,
      old: 0,
      icon: [
        {
          tit: '首页',
          ident: 'home',
          link: '/home'
        },
        {
          tit: '晒单圈',
          ident: 'circle',
          link: '/circle'
        },
        {
          tit: '聊天室',
          ident: 'chat',
          link: '/chat'
        },
        {
          tit: '个人中心',
          ident: 'user',
          link: '/user'
        },
        {
          tit: '活动',
          ident: 'activity',
          link: '/activity'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    active: {
      get() {
        return this.value
      },
      set(val) {
        if (!(this.userInfo.guest && this.routerExclude(this.icon[val].link))) {
          this.value = val
        }
      }
    }
  },
  methods: {
    routerExclude(path) {
      const NOT_LOG_IN = ['/user', '/chat/room', '/user/userDetail', '/circle/circleOwn']
      return NOT_LOG_IN.some(ele => path.match(ele))
    },
    activeFilter(index) {
      return this.active == index ? 'active' : ''
    },
    go(link) {
      if (this.$route.path !== link) {
        // if (this.userInfo.guest && this.routerExclude(link)) {

        // } else {

        // }
        this.$router
          .replace(link)
          .then(() => {
            this.$emit('sync', this.active)
          })
          .catch(() => {
            this.active = this.old
          })
      }
    }
  },
  created() {
    this.active = this.active_prop
  },
  watch: {
    active(news, old) {
      // if(!(this.userInfo.guest && this.routerExclude(link))){

      // }
      this.old = old
    },
    $route(news) {
      let path = news.path
      this.icon.forEach((ele, idx) => {
        if (ele.link === path) {
          this.old = this.active
          this.active = idx
        }
      })
    }
  }
}
</script>

<style lang="scss">
div.x-tabbar {
  height: 48px;
  background-color: $baseBgColor;
  .van-tabbar-item {
    padding-top: 5px;
    .van-tabbar-item__icon {
      height: 22.08px;
      width: 22.08px;
      position: relative;
      .xIcon-chat-tabbar {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-60%);
        background-color: $baseBgColor;
        border-radius: 50%;
        z-index: 10;
        box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
    }
    .van-tabbar-item__text {
      > span {
        position: relative;
        z-index: 10;
      }
    }
  }
}
</style>
