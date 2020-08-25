<template>
  <div id="app" :style="{ minHeight: `${$root.viewHeight}px` }">
    <transition
      :appear="false"
      :mode="animate ? '' : 'out-in'"
      :name="transitionName"
      :leave-active-class="leaveActiveClass()"
      :enter-active-class="enterActiveClass()"
    >
      <keep-alive :max="10" :include="['user', 'circle-page', 'chat-page', 'home']" :exclude="['x-tabs', 'x-list', 'x-layout']">
        <router-view class="rootView"></router-view>
      </keep-alive>
    </transition>
    <x-tabbar @touchmove.prevent.stop v-model="active" v-if="$route.meta.tabbar" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import xTabbar from 'cpt/x-tabbar.vue'

import BScroll from '@better-scroll/core'
import { getDaysDiffBetweenDates } from '@/utils/formant.util.js'
export default {
  components: {
    xTabbar
  },
  data() {
    return {
      active: 0,
      transitionName: 'fadeLeft',
      animate: false,
      isTabbar: false,
      toNextPage: true
    }
  },
  computed: {},
  mounted() {},
  methods: {
    enterActiveClass() {
      // console.log('app', G.getter('toNextPage'))
      G.delay(() => {
        G.setter('toNextPage', true)
      })
      if (this.animate) {
        if (G.getter('toNextPage')) {
          return 'fadeInRight fadeIn animated faster'
        } else {
          return 'fadeInLeft fadeIn animated faster'
        }
      }
      return ''
    },
    leaveActiveClass() {
      // console.log('app', G.getter('toNextPage'))
      G.delay(() => {
        G.setter('toNextPage', true)
      })
      if (this.animate) {
        if (G.getter('toNextPage')) {
          return 'fadeOutLeft fadeOut animated faster'
        } else {
          return 'fadeOutRight fadeOut animated faster'
        }
      }
      return ''
    }
  },
  watch: {
    $route(to, from) {
      let active = Number(to.meta.tabbar)
      if (active !== undefined) {
        this.active = active
      }
      let animate = to.meta.animate
      let from_animate = from.meta.animate

      if (animate === false) {
        this.animate = false
        this.transitionName = 'dft'
      } else if (animate === undefined || animate) {
        this.transitionName = 'fadeLeft'
        this.animate = true
      }
    }
  },
  created() {
    let tabbar_active = this.$route.meta.tabbar
    if (tabbar_active) {
      this.active = Number(tabbar_active)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // position: relative;
  // min-height: 100vh;
  // display: flex;
  // flex-direction: column;
  font-size: initial; // 修复button的问题
  // overflow-x: hidden;
  // box-shadow: 0 0 15px 0 rgba($color: #000000, $alpha: 0.2);
  > .x-layout {
    min-width: 100vw;
    max-width: 100vw;
  }
  .fadeLeft-enter-to {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    min-height: 100vh;
  }
  .fadeLeft-leave-to {
    width: 100vw;
    height: 100%;
    .x-header {
      // 解决 ios 的动画返回 fixed 定位的顶部栏位置错位问题
      position: absolute;
    }
  }
  .dft-enter-to {
    .x-header {
      // 解决 ios 的动画返回 fixed 定位的顶部栏位置错位问题
      position: absolute;
    }
  }
  .van-tabbar-item__icon {
    margin-bottom: 2px;
  }
}
.page-login-root,
.page-sign-root {
  .van-hairline--bottom::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    top: unset;
    right: 0;
    bottom: 0;
    right: 16px;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .van-field__left-icon {
    margin-right: 15px;
  }
  .buttonGroup {
    display: flex;
    flex-direction: column;
    align-items: center;
    .tipBar {
      width: 345px;
      text-align: right;
      margin-top: 20px;
      height: 30px;
      .isWelcCode,
      .tip {
        display: inline-block;
        color: $gray-66;
        font-size: 14px;
        right: 0;
        height: 30px;
        line-height: 30px;
      }
    }
    .van-button {
      width: 345px;
      &:nth-child(3) {
        margin-top: 30px;
      }
      .special {
        color: #2993ec;
      }
    }
  }
}
</style>
