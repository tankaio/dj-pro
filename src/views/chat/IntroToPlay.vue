<template>
  <div class="page-introtoplay-root">
    <x-header :isRight="false"></x-header>
    <x-intro-play introTitle="红包牛牛">
      <template #h6>在您开始游戏前，请花上几分钟阅读我们的玩法介绍</template>
      <template #textWrap>
        红包牛牛是一个非常流行和有趣的博弈玩法，在红包游戏里，我们取后三位数以计算点数。所有闲
        家的点数与庄家进行对比。奖级相同则比较金额，金额大的优先。金额一样则庄赢。在牛牛游戏里，
        所抢到的红包只作计算牛牛点数用，不可实际使用和计入账户。
      </template>
    </x-intro-play>
    <div class="award">
      <h4>现有奖级如下，奖级优先级按从小到大依次排列</h4>
      <div class="award-details">
        <div class="details-title">
          <span>奖级</span>
          <span>赔率</span>
        </div>
        <div class="details-warp" v-for="(item, index) in awards" :key="index">
          <span v-text="item.title"></span>
          <span v-text="item.odds"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xIntroPlay from 'cpt/x-intro-play.vue'
export default {
  components: {
    xHeader,
    xIntroPlay
  },
  data() {
    return {
      awards: [
        { title: '无牛', odds: 'N' },
        { title: '牛一', odds: 'N' },
        { title: '牛二', odds: 'N' },
        { title: '牛三', odds: 'N' },
        { title: '牛四', odds: 'N' },
        { title: '牛五', odds: 'N' },
        { title: '牛六', odds: 'N' },
        { title: '牛七', odds: 'N' },
        { title: '牛八', odds: 'N' },
        { title: '牛九', odds: 'N' },
        { title: '牛牛', odds: 'N' },
        { title: '对子(0.11-0.99)', odds: 'N' },
        { title: '金牛(0.10-0.90)', odds: 'N' },
        { title: '满牛(1.00-9.00)', odds: 'N' },
        { title: '正顺(1.23-7.89)', odds: 'N' },
        { title: '到顺(9.87-3.21)', odds: 'N' },
        { title: '豹子(1.11-9.99，11.11)', odds: 'N' }
      ]
    }
  }
}
</script>

<style lang="scss">
.page-introtoplay-root {
  font-size: 12px;
  color: $txt;
  padding: 15px;
  .award {
    margin-top: 5px;
    color: $white;
    h4 {
      display: inline-block;
      height: 23px;
      line-height: 23px;
      background-color: #f10215;
      text-align: center;
      padding: 2px 10px;
    }
    .award-details {
      margin-top: 10px;
      border: 1px solid $gray-d7;
      border-radius: 5px;
      overflow: hidden;
      .details-title {
        height: 31.5px;
        line-height: 31.5px;
        background-color: #d8352e;
        display: flex;
        span {
          flex: 1;
          text-align: center;
          &:nth-child(1) {
            border-right: 1px solid $gray-d7;
          }
        }
      }
      .details-warp {
        color: $txt;
        display: flex;
        height: 26px;
        line-height: 26px;
        &:nth-child(2n + 1) {
          background-color: #f0f0f0;
        }
        span {
          flex: 1;
          text-align: center;
          &:nth-child(1) {
            border-right: 1px solid $gray-d7;
          }
        }
      }
    }
  }
}
</style>
