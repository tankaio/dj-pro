<template>
  <!-- barHeight 是设计稿的明确尺寸，尽量不要使用计算尺寸 -->
  <div
    class="x-fixed"
    :style="{
      height: barHeight ? `${barHeight / 100}rem` : remHeight
    }"
  >
    <div
      class="xf-container"
      ref="xfc"
      :style="{
        top: `${offsetTop / 100}rem`,
        zIndex,
        height: barHeight ? `${barHeight / 100}rem` : ''
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'x-fixed',
  props: {
    offsetTop: {
      type: [Number, String],
      default: 0
    },
    zIndex: {
      type: [Number, String],
      default: 10
    },
    barHeight: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      height: ''
    }
  },
  computed: {
    remHeight() {
      return this.$root.px2rem(this.height) + 'rem'
    }
  },
  methods: {
    refresh() {
      this.height = this.$refs.xfc.clientHeight
    }
  },
  mounted() {
    let xfc = this.$refs.xfc
    this.height = xfc.clientHeight
    this.$emit('load')
  }
}
</script>

<style lang="scss">
.x-fixed {
}
.xf-container {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: $white;
  // box-shadow: 0 1px 4px 0 rgba($color: #000000, $alpha: 0.2);
}
</style>
