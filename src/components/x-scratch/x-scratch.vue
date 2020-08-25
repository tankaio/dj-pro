<template>
  <div class="x-scratch">
    <van-popup get-container="#box" class="x-scratch" v-model="showXC" :close-on-click-overlay="false">
      <div class="scratch-bg">
        <div class="xs_container" v-if="hidden_container">
          <div class="cicrle" :class="num | circleClassFilter">
            {{ num }}
          </div>
          <div class="text">{{ text }}</div>
        </div>
        <canvas id="scratch" width="450" height="250"></canvas>
      </div>
      <div class="close close-circle" @click="showXC = false"></div>
    </van-popup>
  </div>
</template>

<script>
import Http from '@/utils/http/index.ws.js'
import { scratch } from './core'
import { mapGetters, mapMutations } from 'vuex'
import { BuildBallsXiao } from '@/utils/rule/zodiac.rule.js'
export default {
  props: {
    num: Number,
    show: Boolean
  },
  model: {
    prop: 'show',
    event: 'sync'
  },
  computed: {
    ...mapGetters(['getCuryear']),
    text() {
      if (this.getCuryear && this.num) {
        let xiao = BuildBallsXiao(this.getCuryear)
        return xiao[this.num]
      }
    }
  },
  data() {
    return {
      showXC: false,
      hidden_container: false
    }
  },
  methods: {
    ...mapMutations(['setSpecialRun']),
    draw() {
      G.delay(() => {
        scratch(
          '#scratch',
          () => {
            this.setSpecialRun(false)
            this.$emit('open')
          },
          () => {
            this.hidden_container = true
          }
        )
      }, 200)
    }
  },
  watch: {
    show(news) {
      if (news) {
        this.draw()
      }
      this.showXC = news
    },
    showXC(news) {
      if (!news) {
        this.hidden_container = false
      }
      this.$emit('sync', news)
    }
  }
}
</script>

<style lang="scss">
.x-scratch {
  .scratch-bg {
    width: 250px;
    height: 156px;
    position: relative;
  }
  #scratch {
    position: absolute;
    top: 15.5px;
    left: 12.5px;
    right: 12.5px;
    bottom: 15.5px;
    width: 225px;
    height: 125px;
  }
  .xs_container {
    width: 250px;
    height: 156px;
    display: flex;
    justify-content: center;
    align-items: center;
    .cicrle {
      width: 83.5px;
      height: 83.5px;
      text-align: center;
      line-height: 83.5px;
      font-size: 35px;
    }
    .text {
      font-size: 54px;
      color: $txt;
      margin-left: 15px;
    }
  }
  .close-circle {
    border-color: $white;
    z-index: 10;
    position: absolute;
    top: 236px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    &::after,
    &::before {
      border-color: $white;
      width: 24px;
    }
  }
  .van-popup {
    background-color: unset;
    height: 276px;
    overflow: hidden;
  }
}
</style>
