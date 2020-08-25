<template>
  <!-- <div class="page-bill-root"></div> -->
  <x-layout modifier="bill" main-center-color="#fff" :main-top="88">
    <template slot="header">
      <x-header>
        <van-icon name="question-o" />
      </x-header>
      <div class="tabbar">
        <div class="tabbar-container">
          <div ref="tabItem" class="item" :class="{ active: active === 0 }" @click="onTabClick(0)">积分</div>
          <div class="item" :class="{ active: active === 1 }" @click="onTabClick(1)">金币</div>
          <div class="item" :class="{ active: active === 2 }" @click="onTabClick(2)">充值</div>
          <div class="item" :class="{ active: active === 3 }" @click="onTabClick(3)">提款</div>
          <div class="anchor" ref="anchor"></div>
        </div>
        <div class="filter" @click="onFilterClick">
          <span class="xIcon-filter-cm" :class="filterActiveClass"></span>
        </div>
      </div>
    </template>
    <integral-list :idx="active" :filter-active.sync="integral_filter" v-show="active === 0" />
    <gold-list :idx="active" :filter-active.sync="gold_filter" v-show="active === 1" />
    <charge-list :idx="active" :filter-active.sync="charge_filter" v-show="active === 2" />
    <draw-list :idx="active" :filter-active.sync="draw_filter" v-show="active === 3" />
  </x-layout>
</template>

<script>
import integralList from './BillIntegralList'
import goldList from './BillGoldList'
import chargeList from './BillChargeList'
import drawList from './BillDrawList'
import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'

export default {
  components: {
    integralList,
    goldList,
    chargeList,
    drawList,
    xHeader,
    xFixed
  },
  data() {
    return {
      active: 0,
      filte: true,
      show: false,
      integral_filter: false,
      gold_filter: false,
      charge_filter: false,
      draw_filter: false
    }
  },
  computed: {
    filterActiveClass() {
      if (this.active === 0 && this.integral_filter) {
        return 'active'
      }
      if (this.active === 1 && this.gold_filter) {
        return 'active'
      }
      if (this.active === 2 && this.charge_filter) {
        return 'active'
      }
      if (this.active === 3 && this.draw_filter) {
        return 'active'
      }
    }
  },
  methods: {
    onTabClick(idx) {
      this.active = idx
      this.switchTab(idx)
    },
    switchTab(index = 0) {
      let width = this.__tab_item_width
      if (!this.__anchor) return
      this.__anchor.setAttribute('style', `width:${width}px;transition:all 0.5s;transform:translateX(${width * index}px);`)
    },
    onFilterClick() {
      this.show = true
      // 弹出右侧边栏
      this.$eventBus.$emit('pop:active')
    },
    onLoad() {
      this.$nextTick(() => {
        let tab_item = this.$refs.tabItem
        if (tab_item) {
          this.__tab_item_width = tab_item.clientWidth
          this.__anchor = this.$refs.anchor
          this.switchTab()
        }
      })
    }
  },
  mounted() {
    this.onLoad()
  },
  created() {
    /**
     * 1. 获得当前是否激活筛选
     */
    // 激活 filter 按钮样式
    this.$eventBus.$on('filte:active', state => {
      this.active = state
    })
    this.$on('hook:destroyed', () => this.$eventBus.$off('filte:active'))
  }
}
</script>

<style lang="scss">
.page-bill-root {
  //padding-top: 44px;
  .van-field__control:disabled {
    color: $txt;
    -webkit-text-fill-color: $txt;
  }
  .tabbar {
    display: flex;
    min-width: 99.9999vw;
    .tabbar-container {
      flex: 1;
      display: flex;
      position: relative;
      .item {
        flex: 1;
        text-align: center;
        line-height: 44px;
        &.active {
          color: $rootColor;
        }
      }
      .anchor {
        height: 2px;
        background-color: $rootColor;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
  .filter {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 10px;
    padding-left: 10px;
    &::after {
      display: block;
      position: absolute;
      content: '';
      border-left: 1px solid $gray-d7;
      left: 0;
      top: 20%;
      bottom: 20%;
      transform: rotateX(45deg);
    }
  }
  .van-cell__value {
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      text-align: center;
      line-height: 1;
    }
  }
  .fill_center {
    > *[class*='-list'] {
      @include abs;
      .sticky-bar {
        height: 52px;
        .sticky-container {
          position: fixed;
          padding-top: 8px;
          left: 0;
          right: 0;
          top: 88px;
          background-color: $baseBgColor;
          z-index: 1;
          .list-hd {
            background-color: $white;
            padding: 0 10px;
            display: flex;
            .item {
              flex: 1;
              font-size: 14px;
              color: $txt;
              text-align: center;
              line-height: 44px;
            }
          }
        }
      }
      .x-list {
        top: 52px;
      }
    }
  }
}
</style>
