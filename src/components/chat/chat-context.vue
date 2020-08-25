<template>
  <div class="chat-context" @click="onClick" @touchstart="onTouchStart" :class="`cc-${this.roomKey}`">
    <div class="cc__context">
      <div class="pulldown-wrapper" v-if="isOpenPullDown">
        <div v-show="beforePullDown">
          <span>Pull Down and refresh</span>
        </div>
        <div v-show="!beforePullDown">
          <div v-show="isPullingDown">
            <span>Loading...</span>
          </div>
          <div v-show="!isPullingDown">
            <span>Refresh success</span>
          </div>
        </div>
      </div>
      <slot></slot>
      <div class="bottom-anchor"></div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import { mapMutations, mapGetters } from 'vuex'

BScroll.use(PullDown)

const THRESHOLD = 70
const STOP = 56

export default {
  name: 'chat-context',
  props: {
    roomKey: {
      type: [String, Number],
      default: Math.random()
    }
  },
  data() {
    return {
      beforePullDown: true,
      isPullingDown: false,
      isOpenPullDown: false
    }
  },
  computed: {
    ...mapGetters(['getChatList'])
  },
  mounted() {
    let bs
    this.$nextTick(() => {
      bs = new BScroll('.chat-context', {
        click: true,
        scrollY: true,
        bounceTime: 300,
        swipeBounceTime: 300,
        swipeTime: 1500,
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP
        }
      })

      const moveDown = direction => {
        G.delay(() => {
          bs.refresh()
          if (direction === 'down') {
            bs.scrollTo(0, bs.maxScrollY, 300)
          } else {
            bs.scrollTo(0, 0, 300)
          }
        }, 200)
        G.delay(() => {
          bs.refresh()
          if (direction === 'down') {
            bs.scrollTo(0, bs.maxScrollY, 300)
          } else {
            bs.scrollTo(0, 0, 300)
          }
        }, 250)
      }

      bs.on('beforeScrollStart', () => bs.refresh())
      // 下拉加载
      bs.on('pullingDown', () => {
        this.beforePullDown = false
        this.isPullingDown = true
        this.$emit('load-pulldown')
      })
      // 加拉加载完成的回调
      this.$eventBus.$on('chat:pulldown-finish', () => {
        bs.finishPullDown()
        this.beforePullDown = true
        this.isPullingDown = false
      })
      // 滚动至底部
      this.$eventBus.$on('chat:movedown', () => {
        bs.scrollTo(0, bs.maxScrollY, 100)
      })
      // 滚动至顶部或底部
      this.$eventBus.$on('chat:scroll', direction => {
        this.$nextTick(() => moveDown(direction))
      })
      this.$eventBus.$on('chat:refresh', () => this.$nextTick(() => bs.refresh()))
      this.isOpenPullDown = true
      bs.refresh()
    })
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
    onTouchStart() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.chat-context {
  width: 100vw;
  @include abs;
  overflow: hidden;
  top: 44px;
  bottom: 50px;
  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    transform: translateY(-100%) translateZ(0);
    text-align: center;
    color: #999;
    font-size: 12px;
  }
  .bottom-anchor {
    height: 20px;
  }
}
</style>
