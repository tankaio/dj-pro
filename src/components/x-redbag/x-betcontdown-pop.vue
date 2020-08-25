<template>
  <div class="x-betcontdown-pop">
    <van-overlay :show="betPopCtr" z-index="10">
      <div class="xb-bar bounceInDown animated faster">
        <div class="admin-countdown-bg" v-if="identity === 'being'"></div>
        <div class="xian-countdown-tit-bg" v-if="identity === 'before'"></div>
        <div class="grab-red-tit-bg" v-if="identity === 'grab'"></div>

        <div class="xb__main bet-pop-bg">
          <span
            class="xb__count-down admin"
            v-if="identity === 'being' || identity === 'grab'"
          >
            {{ time }}
          </span>
          <div class="xb__button" v-if="identity === 'before'" @click="$emit('bet')">
            <span>立即投注</span>
            <span class="xb__count-down">{{ time }}</span>
          </div>
        </div>
        <span
          class="xIcon-redbag-pop-close xb__close"
          @click="onClose"
          :class="{ animate: close_animate_ctr }"
        ></span>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "x-betcontdown-pop",
  props: ["betPopCtr", "time", "identity"],
  data() {
    return {
      close_animate_ctr: false // 关闭按钮的动画控制
    };
  },
  methods: {
    onClose() {
      this.$emit("update:betPopCtr", false);
    }
  },
  created() {},
  mounted() {
    G.delay(() => {
      this.close_animate_ctr = true;
    }, 1000);
  }
};
</script>

<style lang="scss">
.x-betcontdown-pop {
  position: relative;
  .van-overlay {
    background-color: rgba($color: #000000, $alpha: 0.6);
  }
  .xb-bar {
    position: relative;
  }
  .xb__main {
    width: 231.5px;
    height: 255px;
    overflow: hidden;
    position: relative;
    z-index: 10;
  }
  .xb__button {
    width: 178px;
    height: 30.5px;
    border-radius: 5px;
    background-image: linear-gradient(#feee76, #feed74);
    margin: 209px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    color: $rootColor;
    position: relative;
  }
  .xb__count-down {
    position: absolute;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: $rootColor;
    top: 3px;
    right: 3px;
    font-size: 12px;
    color: $white;
    text-align: center;
    line-height: 25px;
    &.admin {
      width: 38.5px;
      height: 38.5px;
      line-height: 38.5px;
      font-size: 18.5px;
      position: absolute;
      top: 205px;
      left: 99.5px;
    }
  }
  .xb__close {
    width: 29.5px;
    height: 60.5px;
    position: absolute;
    bottom: 0;
    right: 6px;
    transform: translateY(0);
    transition-duration: 200ms;
    &.animate {
      transform: translateY(98%);
    }
  }
  .xian-countdown-tit-bg {
    width: 196.5px;
    height: 66px;
    position: absolute;
    left: 22.5px;
    z-index: 20;
    transform: translateY(-17px);
  }
  .admin-countdown-bg {
    width: 205px;
    height: 58.5px;
    position: absolute;
    left: 16.5px;
    z-index: 20;
    transform: translateY(-17px);
  }
  .grab-red-tit-bg {
    width: 193px;
    height: 65px;
    position: absolute;
    z-index: 20;
    transform: translateY(-17px);
    left: 24.5px;
  }
}
</style>
