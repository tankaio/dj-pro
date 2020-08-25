<template>
  <div class="x-openlottery" :init="specialRun">
    <div @click.stop="clickSpecial" v-if="getSpecialRun && !pure" class="xIcon-ggl-bg ggl-bg-img" />
    <div v-if="!getSpecialRun || pure" :class="{ ['xo--opcity']: getSpecialRun && !pure }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'x-circle',
  props: ['pure'],
  data() {
    return {
      animate_ctr: false
    }
  },
  computed: {
    ...mapGetters(['getSpecialRun']),
    specialRun() {
      let openSpecialNumberState = ls('openSpecialNumberState')
      if (this.getSpecialRun) {
        // 如果为开奖中状态,则写入false,本期未刮奖
        ls('openSpecialNumberState', {
          issue: this.getNowIssue,
          open: false
        })
      } else {
        // 本地数据为空也视为未刮奖
        if (G.isEmpty(openSpecialNumberState)) {
          // console.log("local");

          this.setSpecialRun(true)
        } else {
          let { issue, open } = openSpecialNumberState
          // 当前期号大于之前的期号
          if (this.getNowIssue > issue) {
            // console.log(">");
            this.setSpecialRun(true)
          } else if (this.getNowIssue <= issue) {
            // 当前期号不大于之前期号根据本地数据判断
            if (open) {
              this.setSpecialRun(false)
            } else {
              // console.log("open false");
              this.setSpecialRun(true)
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setSpecialRun']),
    clickSpecial() {
      if (this.getSpecialRun) {
        this.$eventBus.$emit('open-special')
      }
    }
  },
}
</script>

<style lang="scss">
.x-openlottery {
  position: relative;
  .xo--opcity {
    opacity: 0;
  }
  .ggl-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 34px;
    z-index: 1;
    transform: scale(1.1);
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: 100% 100%;
    &::after {
      content: '开奖';
      font-size: 18px;
      background-color: #f14e5f;
      height: 24px;
      width: 60px;
      line-height: 24px;
      text-align: center;
      color: white;
      transform: scale(0.5);
    }
    &.animate {
      transition: transform 500ms, opacity 2.5s;
      transition-delay: 0s 800ms;
      transform: scale(1.5);
      opacity: 0;
    }
  }
  &.open {
    .txt {
      display: block;
    }
  }
  // .txt {
  //   display: none;
  // }
}
</style>
