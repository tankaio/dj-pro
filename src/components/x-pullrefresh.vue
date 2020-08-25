<template>
  <div class="x-pullrefresh">
    <div
      class="xp-bar"
      :style="xpBarSty"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="xp-header">
        <template v-if="state === 'touchend'">
          <!-- 加载中 -->
          <van-loading /> 加载中。。。
        </template>
        <template v-if="state === 'pull' && !target">
          释放即可刷新
        </template>
        <template v-if="target">
          下拉即可刷新...
        </template>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
let start_y = 0;
let now_y = 0;
let old_y = 0;
let peak = false;
export default {
  name: "x-pullrefresh",
  props: {
    loadstate: Boolean //
  },
  model: {
    prop: "loadstate",
    event: "sync"
  },
  data() {
    return {
      state: "loaded",
      val: 0,
      target: true
    };
  },
  computed: {
    xpBarSty() {
      switch (this.state) {
        case "pull": // 下拉中
          return `transition-duration:0ms;transform:translate3d(0,${this.val /
            100}rem,0)`;
        case "touchend": // 手指松开
          return `transition-duration:300ms;transform:translate3d(0,.5rem,0);padding-bottom:.5rem;`;
        case "loaded": // 加载结束
          return `transition-duration:300ms;transform:translate3d(0,0,0)`;
        default:
          break;
      }
    }
  },
  methods: {
    direction(e) {
      return e.touches[0].clientY;
    },
    onTouchStart(e) {
      start_y = G.$swiper(e).getPosit(e).y;
      if ($(window).scrollTop() == 0 && this.state !== "touchend") {
        peak = true;
      }
    },
    onTouchMove(e) {
      G.$swiper.direction(e);
      if ($(window).scrollTop() == 0 && this.state !== "touchend") {
        peak = true;
      }
      now_y = this.direction(e);
      if (peak) {
        if (this.state === "touchend") {
          // 当前状态为正在加载
        } else if (this.state === "loaded") {
          // 加载结束
          this.state = "pull";
          this.val = (now_y - start_y) / 3;
        } else if (this.state == "pull") {
          // pull状态有两种判定
          if (now_y < old_y) {
            // 上滑时不允许页面滚动
            if (now_y > start_y) {
              // e.preventDefault();
              e.stopPropagation();
            } else {
              // 上滑达到起点允许页面滚动
              return;
            }
            if (this.val < 50) this.target = true;
          }
          if (now_y <= start_y) {
            // 当前点低于起点是为结束
            this.state = "loaded";
            this.val = 0;
          } else {
            // 当前视为下拉
            // e.preventDefault();
            e.stopPropagation();
            this.state = "pull";
            this.val = (now_y - start_y) / 3;
            if (this.val >= 50) this.target = false;
          }
        }
      }
      old_y = now_y;
    },
    onTouchEnd(e) {
      if (this.state == "pull" && this.val > 50) {
        // 超过50px 视为下拉加载
        this.$emit("sync", true);
        this.$emit("loading");
        peak = false;
        this.state = "touchend";
        this.val = 0;
      } else if (this.state !== "touchend") {
        peak = false;
        this.state = "loaded";
        this.val = 0;
      }
      this.target = false;
    },
    loadEnd() {
      peak = false;
      this.val = 0;
      // 如果值为false代表加载结束
      this.state = "loaded";
    }
  },
  watch: {
    loadstate(newv, oldv) {
      if (!newv) {
        peak = false;
        this.val = 0;
        // 如果值为false代表加载结束
        this.state = "loaded";
      }
    }
  }
};
</script>

<style lang="scss">
.x-pullrefresh {
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;
  .xp-bar {
    position: relative;
    height: 100%;
    flex: 1;
  }
  .xp-header {
    height: 50px;
    text-align: center;
    line-height: 50px;
    width: 100vw;
    position: absolute;
    transform: translateY(-100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #969799;
    .van-loading {
      margin-right: 10px;
      .van-loading__spinner {
        width: 15px;
        height: 15px;
      }
    }
  }
}
</style>
