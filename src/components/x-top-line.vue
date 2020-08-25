<template>
  <div class="x-top-line">
    <div class="logo-bar">
      <x-img class="logo" src="./images/sexhe-logo.png" />
    </div>
    <div class="wapper">
      <div class="wapper-bar" ref="wapperBar">
        <div class="wapper-item van-hairline--bottom" v-for="(item, index) in list" :key="index">
          {{ item }}
        </div>
        <div class="wapper-item van-hairline--bottom">
          {{ list[0] }}
        </div>
        <div ref="item" class="wapper-item van-hairline--bottom">
          {{ list[1] }}
        </div>
      </div>
    </div>
    <van-icon name="arrow" />
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
// FIXME 需要优化，重写·动画
import { type } from 'os'
export default {
  components: {
    xImg
  },
  name: 'x-top-line',
  props: {
    list: {
      type: Array,
      default() {
        return [1, 2, 3]
      }
    },
    duration: {
      type: Number,
      default: 2000
    },
    animateSpeed: {
      type: Number,
      default: 1
    },
    logo: String
  },
  data() {
    return {
      index: 1
    }
  },
  created() {},
  mounted() {
    let that = this
    let wb = this.$refs.wapperBar
    let item = this.$refs.item
    let item_height = item.clientHeight
    let item_num = wb.children.length
    if (wb) {
      setInterval(() => {
        scrollAnimate()
        if (that.index >= item_num) {
          that.index = 1
          wb.setAttribute('style', '')
          setTimeout(scrollAnimate, 10)
        }
      }, this.duration)
    }

    function scrollAnimate() {
      wb.setAttribute('style', `transition:all ${that.animateSpeed}s;transform: translateY(-${item_height * that.index}px);`)
      that.index++
    }
  }
}
</script>

<style lang="scss">
.x-top-line {
  background-color: $white;
  display: flex;
  padding: 12.5px;
  .logo-bar {
    padding-right: 9px;
    height: 38px;
    border-right: 1px solid $gray-d7;
  }
  .logo {
    width: 38px;
    height: 38px;
  }
  .wapper {
    height: 38px;
    overflow: hidden;
    flex: 1;
    padding-left: 9px;
  }
  .wapper-item {
    height: 19px;
    line-height: 19px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    color: $txt;
  }
  .van-icon-arrow {
    line-height: 38px;
    color: $gray-99;
  }
}
</style>
