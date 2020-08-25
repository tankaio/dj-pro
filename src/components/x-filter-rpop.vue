<template>
  <div class="x-filter-rpop">
    <van-popup
      get-container="#box"
      class="xf-right-pop"
      v-model="show"
      position="right"
      @open="$emit('update_model', true)"
      @close="$emit('update_model', false)"
    >
      <slot></slot>
      <div class="xf-btn-bar">
        <span class="xf-reset-btn" @click="$emit('reset')">重置</span>
        <span class="xf-confirm-btn" @click="onConfirm">确认</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'x-filter-rpop',
  props: ['prop_show'],
  data() {
    return {
      show: false
    }
  },
  model: {
    prop: 'prop_show',
    event: 'update_model'
  },
  created() {
    this.show = this.prop_show
  },
  methods: {
    onConfirm() {
      this.$emit('confirm')
      this.$emit('update_model', false)
    }
  },
  watch: {
    prop_show(news) {
      this.show = this.prop_show
    }
  }
}
</script>

<style lang="scss">
.xf-right-pop {
  box-sizing: border-box;
  width: 310px;
  height: 100%;
  padding-bottom: 44px;
  .xf-btn-bar {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    bottom: 0;
    display: flex;
    font-size: 15px;
    .xf-reset-btn {
      background-color: $baseBgColor;
      color: $txt;
    }
    .xf-confirm-btn {
      background-color: $rootColor;
      color: $white;
    }
    > * {
      flex: 1;
      text-align: center;
      line-height: 44px;
    }
  }
}
</style>
