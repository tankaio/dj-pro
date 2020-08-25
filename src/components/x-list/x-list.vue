<template>
  <div class="x-list" ref="xList" :class="{ fixed: position }">
    <div class="xl-content">
      <slot>
        <x-nodata :data-s="[]" bg />
      </slot>
      <div class="xl-tip-cell" @click="onClickError">
        <template v-if="loading && !error && !finished">
          <van-loading size="24px" vertical>{{ loadText }}</van-loading>
        </template>

        <template v-else-if="error && !finished">
          {{ errorText }}
        </template>

        <template v-else-if="finished">
          {{ finishText }}
        </template>

        <template v-else-if="bottomOut">
          到底了!
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import xNodata from 'cpt/x-nodata.vue'
import { init } from './core'
export default {
  name: 'x-list',
  components: { xNodata },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    offset: {
      type: Number,
      default: 250
    },
    loadText: {
      type: String,
      default: '加载中...'
    },
    finishText: {
      type: String,
      default: '所有数据加载完毕'
    },
    errorText: {
      type: String,
      default: '加载失败,点击重新加载'
    },
    active: Boolean,
    position: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'loading',
    event: 'sync'
  },
  data() {
    return {
      destory: false,
      lock: false,
      bottomOut: false
    }
  },
  methods: {
    // onTouchStart(e) {
    //   if (!this.position) return
    //   let { x, y } = G.$swiper.getPosit(e)
    //   this.oldY = y
    // },
    // onTouchMove(e) {
    //   if (!this.position) return
    //   G.$swiper(e).direction(e, (x, y, e) => {
    //     if (y > this.oldY) {
    //       if (this.$xList.scrollTop == 0) {
    //         e.stopPropagation()
    //         e.preventDefault()
    //       }
    //     }
    //   })
    // },
    onClickError() {
      if (this.active && this.error && !this.finished) {
        this.$emit('update:error', false)
        this.$emit('sync', true)
        this.$emit('load')
      }
    },
    initFun() {
      this.$xList = this.$refs.xList
      this.init = init('.x-list', this.offset, this.position ? this.$refs.xList : undefined)
      let debounce_load = G.debounce(() => {
        this.bottomOut = true
        // console.log(
        //   "x-list-scroll",
        //   this.finished,
        //   this.error,
        //   this.lock,
        //   this.loading
        // );
        // 当前不属于加载完成 不属于加载错误 不属于锁住状态 不属于加载中状态
        if (!this.finished && !this.error && !this.lock && !this.loading) {
          // 当前属于激活状态
          if (this.active) {
            this.lock = true
            this.$emit('sync', true)
            this.$emit('load')
          }
        }
      }, 50)
      this.init.listen(debounce_load)
      if (this.active) {
        this.init.inactive()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initFun()
    })
  },
  beforeDestroy() {
    this.init.destroyed()
  },
  destroyed() {
    this.init.destroyed()
  },
  watch: {
    active(news) {
      if (news === false) {
        this.init.unactive()
      } else {
        this.init.inactive()
      }
    },
    loading(news) {
      if (news === false) {
        this.lock = false
      }
    }
  },
  activated() {
    this.initFun()
  },
  deactivated() {
    this.init.destroyed()
  },
  created() {
    this.init = {
      inactive() {},
      unactive() {},
      destroyed() {}
    }
  }
}
</script>

<style lang="scss">
.x-list {
  &.fixed {
    @include abs;
    @include scroll('y');
  }
}
div.xl-tip-cell {
  min-height: 44px;
  background-color: transparent;
  color: $gray-99;
  text-align: center;
  padding: 5px;
  font-size: 12px;
  line-height: 44px;
  .van-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    .van-loading__text {
      margin: 0;
      margin-left: 10px;
    }
  }
}
</style>
