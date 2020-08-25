<template>
  <div :class="[`page-${rootClass}-root`, 'x-bind-page']">
    <x-header :leftText="leftText" :clickLeft="clickLeft" :leftArrow="leftArrow" :center-text="centerText"></x-header>
    <div class="tip" v-if="tip">
      <van-icon name="warning-o" v-if="tipIcon" />
      {{ tip }}
    </div>
    <slot></slot>
    <div class="btnBar" v-if="$slots.btns">
      <slot name="btns"></slot>
    </div>
    <slot name="btm"></slot>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
export default {
  name: 'x-bind-page',
  components: {
    xHeader
  },
  props: {
    tip: String,
    rootClass: String,
    tipIcon: Boolean,
    leftText: {
      type: String,
      default: '取消'
    },
    leftArrow: {
      type: Boolean,
      default: false
    },
    centerText: String
  },
  provide() {
    return
  },
  methods: {
    clickLeft() {
      this.$emit('cancel')
      this.go(-1)
    }
  }
}
</script>

<style lang="scss">
.x-bind-page {
  // //padding-top: 44px;
  box-sizing: border-box;
  .tip {
    text-align: center;
    font-size: 12px;
    color: $txt;
    background-color: $baseBgColor;
    padding: 10px 20px;
    display: flex;
    align-items: center;
  }
  .van-icon-warning-o {
    font-size: 20px;
    margin-right: 10px;
  }
  .btnBar {
    display: flex;
    flex-direction: column;
    align-items: center;
    .van-button {
      width: 290px;
      margin-top: 40px;
      border-radius: 5px;
    }
  }
}
</style>
