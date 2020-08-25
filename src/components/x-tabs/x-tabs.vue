<template>
  <div class="x-tabs" :class="{ [type]: true, fixed: position }">
    <div class="xt-tabbar" ref="tabs" @touchmove.prevent>
      <div class="xt-middle" ref="xtMiddle">
        <div class="xt-tab van-hairline--bottom" ref="xtTab" :style="{ height: isOpenTabBottom ? '' : '0px' }">
          <template v-for="(item, _index) in titles">
            <div
              ref="tabItem"
              class="xt-item"
              :key="_index"
              @click="onItemClick(_index)"
              :class="{
                active: index === _index,
                [`characteristic-${_index}`]: true
              }"
            >
              {{ item.title }}
              <x-slot name="tab-icon" target="title" :idx="item.title" cls="tab-icon" />
            </div>
          </template>

          <div class="xt-anchor" ref="anchor" v-if="anchor && type === 'line'" />
          <slot v-if="type === 'line'" name="nav-right"></slot>
        </div>
        <slot name="tab-bottom"></slot>
      </div>
    </div>
    <div class="xt-containers" :style="{ top: `${tabbarHeight}px` }">
      <div class="xt-context" :style="{ width: (titles.length * 375) / 100 + 'rem' }" ref="context">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
// ******************************
//      x-tab 的 title 不能设置为可变值
// ******************************
import xSlot from 'cpt/x-slot.vue'

//  $emit

//  sticky
//  unsticky

export default {
  components: {
    xSlot
  },
  name: 'x-tabs',
  props: {
    anchor: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 0
    },
    offsetTop: Number,
    animate: {
      type: Number,
      default: 200
    },
    fixed: Boolean,
    type: {
      type: String,
      default: 'line'
    },
    position: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'index',
    event: 'syncmodel'
  },
  data() {
    return {
      children: [],
      titles: [],
      container: null,
      activated: false,
      tabbarHeight: 40,
      isOpenTabBottom: false
    }
  },
  methods: {
    syncTittles() {
      // 初始化获取dom属性
      this.$nextTick(() => {
        this.$xtTab = this.$refs.xtTab

        this.$xtMiddle = this.$refs.xtMiddle

        this.$tabs = this.$refs.tabs
        // 下方标识线
        this.$anchor_dom = this.$refs.anchor

        this.$context_dom = this.$refs.context

        this.xtTab_offsetTop = this.$xtMiddle.offsetTop

        this.xtTab_clientHeight = this.$xtMiddle.clientHeight
        // 锚点线初始化
        this.anchorToggle()
        // 是否为 fixed 状态,fixed 状态意为渲染后就保持 tab 顶部标签 fixed 布局
        this.updateTabbarHeight()
      })
    },
    anchorToggle() {
      // 是否渲染 anchor 线
      if (!this.anchor) return
      // 获取顶部 tab 顶部标签的宽度
      let tabItems = this.$refs.tabItem
      if (this.$anchor_dom && tabItems) {
        let width = $(tabItems[0]).width()
        $(this.$anchor_dom)
          .css('width', `${width / 2}px`)
          .css('transitionDuration', `${this.animate}ms`)
          .css('transform', `translateX(${this.index * width + width / 4}px`)
      }

      $(this.$context_dom)
        .css('transitionDuration', `${this.animate}ms`)
        .css('transform', `translateX(-${this.index * this.$root.$vw}px`)

      // 未激活的内容区需要隐藏高度,避免当前内容少于其他区的内容而造成的撑高问题
      this.$context_dom.children.forEach((item, index) => {
        if (index == this.index) {
          this.$context_dom.children[this.index].setAttribute('style', '')
        } else {
          this.$context_dom.children[index].setAttribute('style', 'height:0;overflow:visible;')
        }
      })
    },
    onItemClick(v) {
      window.scrollTo(0, 0)
      this.$emit('syncmodel', v)
      // $parent 目的是为了上层组件 x-filter-page 的功能
      this.$parent.$parent.$emit('tabclick', v)
      // this.$parent.$emit('change')

      // old = this.index
      // 更新 anchor 的位置, sticky 重新计算
      this.$nextTick(() => {
        this.sticky(document.documentElement.scrollTop)
        this.anchorToggle()
      })
    },
    sticky(scrollTop) {
      this.xtTab_offsetTop = this.$xtMiddle.offsetTop
      if (this.xtTab_offsetTop) {
        // 当scroll 为最顶部时清除 fixed 状态
        if (scrollTop === 0) {
          this.$xtMiddle.setAttribute('style', '')
          return
        }
        // 达到吸附状态
        // console.log(this.offsetTop + scrollTop - this.xtTab_offsetTop);
        if (this.offsetTop + scrollTop - this.xtTab_offsetTop > -5) {
          if (!this.oldXtTabOffsetTop) {
            this.oldXtTabOffsetTop = this.xtTab_offsetTop
          }
          $(this.$tabs).css('height', `${this.xtTab_clientHeight}px`)
          $(this.$xtMiddle)
            .css('position', 'fixed')
            .css('top', `${this.offsetTop / 100}rem`)
          // 吸附事件
          this.$emit('sticky')
        }
        // 未达到吸附状态
        if (this.oldXtTabOffsetTop && this.oldXtTabOffsetTop > scrollTop + this.offsetTop + 5) {
          this.$xtMiddle.setAttribute('style', '')
          // 解除吸附事件
          this.$emit('unsticky')
        }
      }
    },
    // 更新
    updateTabbarHeight() {
      if (this.fixed) {
        this.tabbarHeight = this.$xtMiddle.clientHeight
        if (!this.tabbarHeight) {
          if (this.$slots['tab-bottom'] && this.$slots['tab-bottom'].length) {
            this.tabbarHeight = this.type === 'line' ? 80 : 96
          } else {
            this.tabbarHeight = this.type === 'line' ? 40 : 56
          }
        }
        $(this.$tabs).css('height', `${this.tabbarHeight}px`)

        $(this.$xtMiddle)
          .css('position', 'fixed')
          .css('top', `${this.offsetTop / 100}rem`)
      }
    },
    refresh() {
      console.log(this.$slots)
    }
  },
  created() {
    this.activated = true
    this.onScroll = G.throttle(e => {
      if (this.activated) {
        this.sticky(document.documentElement.scrollTop)
      }
    }, 50)
    if (this.offsetTop && !this.fixed) {
      window.addEventListener('scroll', this.onScroll)
    }
  },
  mounted() {
    this.syncTittles()
    this.$children.forEach(item => {
      if (item.title) {
        this.isOpenTabBottom = true
        this.titles.push(item)
      }
    })
    G.delay(() => {
      this.updateTabbarHeight()
    }, 200)
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  },
  watch: {
    index() {
      this.anchorToggle()
      this.$nextTick(() => {
        this.updateTabbarHeight()
      })
    }
  },
  deactivated() {
    this.activated = false
  },
  activated() {
    this.activated = true
  }
}
</script>

<style lang="scss">
.x-tabs {
  &.fixed {
    @include abs;
    widows: 100%;
    overflow: hidden;
    overflow-y: auto;
    .xt-tabbar {
      @include abs;
      bottom: unset;
      width: 100%;
    }
    .xt-middle,
    .xt-tab {
      z-index: 20;
    }
    .xt-containers {
      @include abs;
      top: 40px;
    }
    .x-tab {
      position: relative;
      @include scroll('y');
    }
    .xt-context {
      height: 100%;
    }
  }
  .xt-middle {
    left: 0;
    right: 0;
    z-index: 1;
    background-color: $white;
  }
  .xt-tab {
    z-index: 20;
    display: flex;
    position: relative;
    /* prettier-ignore */
    height: 40PX;
    width: 99.999vw;
    min-width: 99.999vw;
    max-width: 99.999vw;
    overflow: hidden;
    background-color: $white;
    // box-shadow: 0 2px 2px 0 rgba($color: #000000, $alpha: 0.2);
  }
  .xt-item {
    flex: 1;
    text-align: center;
    /* prettier-ignore */
    height: 40PX;
    /* prettier-ignore */
    line-height: 40PX;
    font-size: 15px;
    color: $txt;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      color: $rootColor;
    }
  }
  .xt-anchor {
    position: absolute;
    height: 3px;
    background-color: $rootColor;
    border-radius: 3px;
    left: 0;
    bottom: 0;
  }
  .xt-containers {
    width: 375px;
    overflow: hidden;
  }
  .xt-context {
    display: flex;
    > * {
      flex: none;
      width: 375px;
    }
  }
  &.card {
    .xt-tab {
      height: 56px;
      justify-content: center;
      align-items: center;
    }
    .xt-item {
      color: $rootColor;
      height: 34px;
      max-width: 120px;
      line-height: 34px;
      border-top: 1px solid $rootColor;
      border-bottom: 1px solid $rootColor;
      border-right: 1px solid $rootColor;

      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      &:nth-child(1) {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-left: 1px solid $rootColor;
      }
      &.active {
        color: $white;
        background-color: $rootColor;
      }
    }
  }
}
</style>
