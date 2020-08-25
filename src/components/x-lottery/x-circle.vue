<template>
  <div class="circle" :class="{ animate }">
    <div class="circle-bar">
      <div class="content" :class="num | circleClassFilter">
        {{ num }}
      </div>
      <div class="animate-bar" v-if="animate">
        <div
          class="content"
          v-for="(item, index) in fill_list"
          :key="index"
          :class="item | circleClassFilter"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="txt">{{ txt }}</div>
  </div>
</template>

<script>
let ctx;
export default {
  name: "x-circle",
  props: {
    num: [String, Number],
    txt: [String],
    idx: Number,
    animate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fill_list: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    };
  }
};
</script>

<style lang="scss">
.circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: $txt;

  $var: 3px;

  &.animate {
    .circle-bar {
      > .content {
        opacity: 0;
      }
      > .animate-bar {
        transform: translateY(-36px);
        animation: lotteryAnimate 0.8s infinite linear;
      }
    }
    .txt {
      display: none;
    }
  }

  .circle-bar {
    height: 36px;
    overflow: hidden;
  }
  .content {
    position: relative;
    height: 34px;
    width: 34px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    font-size: 15px;
    text-align: center;
    // &::after,
    // &::before,
    // .core::after,
    // .core::before {
    //   content: "";
    //   display: block;
    //   border-radius: 50%;
    //   height: 20px;
    //   width: 20px;
    //   background-color: $white;
    //   position: absolute;
    // }
    // &::after {
    //   bottom: 27px + $var;
    // }
    // &::before {
    //   top: 27px + $var;
    // }
  }
  // .core::after {
  //   left: -20px - $var;
  //   top: 50%;
  //   transform: translateY(-50%);
  // }
  // .core::before {
  //   left: 20 + $var;
  // }
  .core {
    position: relative;
    height: 20px;
    width: 20px;
    line-height: 20px;
    border-radius: 50%;
    background-color: $white;
  }
  .txt {
    color: $txt;
    margin-top: 5px;
    font-size: 13px;
  }
}
</style>
