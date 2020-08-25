<template>
  <div class="x-layout" :class="modifier ? `page-${modifier}-root` : ''">
    <div class="xl-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="xl-main-wapper lazyTarget" :class="{ isHeader, isBottom }" :style="{ backgroundColor: mainCenterColor }" @scroll="onMainWapperScroll">
      <!-- wapper 内容主体 -->
      <div class="main-content" @touchstart="onContentTouchStart">
        <!-- 顶部锚点 -->
        <div id="scrollTopFlag"></div>

        <div class="fill_top" v-if="isHeader" :style="{ height: `${mainTop / 100}rem`, backgroundColor: mainTopColor }"></div>

        <div class="fill_center">
          <slot></slot>
        </div>

        <div class="fill_bottom" v-if="isBottom" :style="{ height: `${fillBottomHeight / 100}rem`, backgroundColor: mainBottomColor }">
          <!-- 触底加载 -->
          <van-loading v-if="downLoading && bottomOutLock" size="24px" vertical>{{ loadingText }}</van-loading>
          <div class="finish" v-if="mvvm === 'finish'">所有数据加载完毕</div>
        </div>
        <!-- 底部锚点 -->
        <div id="scrollBottomFlag"></div>
      </div>
    </div>
    <div class="xl-bottom" @touchmove.prevent.stop v-if="$slots.bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'x-layout',
  props: {
    modifier: String,
    mainTop: { type: Number, default: 44 },
    mainBottom: { type: Number, default: 50 },

    mainBottomColor: String,
    mainCenterColor: { type: String, default: '#fff' },
    mainTopColor: String,

    downLoading: { type: Boolean, default: false }, // 是否开启触底加载
    loadingText: { type: String, default: '加载中...' },
    isHeader: {
      type: Boolean,
      default: true
    },
    isBottom: {
      type: Boolean,
      default: false
    },
    mvvm: {
      type: String
    }
  },
  model: {
    prop: 'mvvm',
    event: 'sync'
  },
  provide() {
    return {}
  },
  data() {
    return {
      $mainWapper: undefined,
      viewPortHeight: 0,
      contentHeight: 0,
      bottomOutLock: false // 避免连续触底
    }
  },
  computed: {
    fillBottomHeight() {
      if (this.downLoading) {
        return this.mainBottom + 40
      }
      return this.mainBottom
    }
  },
  methods: {
    onMainWapperScroll() {
      if (this.mvvm === 'finish' || this.mvvm === undefined) return
      if (this.$mainWapper && this.downLoading) {
        if (this.contentHeight - (this.$mainWapper.scrollTop() + this.viewPortHeight) > 200 && this.bottomOutLock === false) {
          //
          this.bottomOutLock = true
          // 触底加载
          this.$emit('load')
          this.$emit('sync', 'loading')
        } else {
          //
          this.bottomOutLock = false
          this.$emit('sync', '')
        }
      }
    },
    onContentTouchStart() {
      this.refresh()
    },
    refresh() {
      if (this.mvvm === 'finish') return
      if (this.downLoading) {
        this.$mainWapper = $('.xl-main-wapper')
        this.viewPortHeight = this.$mainWapper.height()
        this.contentHeight = $('.main-content').height()
      }
    }
  },
  created() {},
  mounted() {
    this.refresh()
  },
  updated() {
    this.refresh()
  },
  destroyed() {
    $('body').attr('style', '')
  },
  watch: {
    mvvm(news) {
      this.mvvm = news
    }
  }
}
</script>

<style lang="scss" scope>
div.x-layout {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .xl-header,
  .xl-bottom {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    > * {
      position: relative;
    }
  }
  .xl-bottom {
    top: unset;
    bottom: 0;
  }
  .xl-main-wapper {
    flex: 1;
    height: 100%;
    width: 100%;
    @include scroll('y');
    .main-content {
      .fill_bottom {
        height: 40px;
        font-size: 12px;
        color: $gray-d6;
        text-align: center;
        line-height: 40px;
      }
    }
  }
}
</style>
