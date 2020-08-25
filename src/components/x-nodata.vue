<template>
  <div class="x-nodata" v-if="is" :class="{ absolute }" :style="{ backgroundColor: bgColor }">
    <!-- 位图 -->
    <div class="xn__bg nodata-bg" v-if="bg" />
    <!-- 描述 -->
    <div class="xn__desc" v-if="desc">{{ desc }}</div>
    <!-- 默认提示语 -->
    <div class="xn__tip" v-if="!$slots.default && tip">{{ tip }}</div>
    <!-- 插槽 -->
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'x-nodata',
  props: {
    absolute: {
      type: Boolean,
      default: false
    },
    tip: String,
    desc: {
      type: String,
      default: '暂无数据...'
    },
    bg: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: '#fff'
    },
    dataS: [Array, Number, String]
  },
  computed: {
    is() {
      if (!this.dataS) {
        return false
      }
      if (this.dataS.length === 0) {
        return true
      } else if (this.dataS === undefined) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.x-nodata {
  flex: 1;
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: $txt;
  min-height: 200px;
  line-height: 20px;
  padding-top: 25px;
  box-sizing: border-box;
  &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
}
.xn__bg {
  margin: 0 auto 0;
}
.xn__desc {
  font-size: 15px;
  color: $gray-99;
  margin-top: 30px;
}
.xn__tip {
  font-size: 13px;
  color: $gray-d6;
  margin-top: 15px;
}
</style>
