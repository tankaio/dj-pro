<template>
  <div class="x-cpt-loading" :style="{ height, width }">
    <slot v-if="isShow"></slot>
    <van-loading v-else color="#EC293C" />
  </div>
</template>

<script>
import { Loading } from 'vant'
export default {
  name: 'x-cpt-loading',
  components: { Loading },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    w: {
      type: [Boolean, String],
      default: 0
    },
    h: {
      type: [Boolean, String],
      default: 0
    }
  },
  computed: {
    width() {
      let w = Number(this.w)
      if (isNaN(w)) return '0rem'
      return Number(this.w) / 100 + 'rem'
    },
    height() {
      let h = Number(this.h)
      if (isNaN(h)) return '0rem'
      return Number(this.h) / 100 + 'rem'
    }
  },
  created() {
  }
}
</script>

<style lang="scss">
.x-cpt-loading {
  position: relative;
  .van-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    text-align: center;
  }
}
</style>
