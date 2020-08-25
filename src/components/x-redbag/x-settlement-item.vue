<template>
  <div class="x-settlement-item van-hairline--bottom">
    <div class="xs-left">
      <x-img :src="avatar" class="avatar" dft />
    </div>
    <div class="xs-center">
      <div class="xs__center--top">
        <span class="xs__username">{{ username }}</span>
        <van-tag type="danger" class="xs__tag" v-if="bookmaker">庄家</van-tag>
      </div>
      <div class="xs__center--bottom">
        <div class="xs__time">{{ time }}</div>
        <div class="xs__bet" v-if="bet">投注:{{ bet }}元</div>
      </div>
    </div>
    <div class="xs-right">
      <div class="xs__right--state">
        <!-- 牛牛输赢,庄家不计入输赢 -->
        <template v-if="play === 'niuniu' && !bookmaker && winte !== undefined">
          <span class="xIcon-nn-fail" v-if="!winte"></span>
          <span class="xIcon-nn-win" v-if="winte"></span>
        </template>
        <!-- 接龙 -->
        <template v-if="play === 'dragon' && !bookmaker">
          <span class="xIcon-dragon"></span>
        </template>
      </div>
      <div class="xs__right--detial">
        <div class="xs__amount">{{ amount }}元</div>
        <div class="xs__play" :class="play">
          <!-- 牛牛 -->
          <template v-if="play === 'niuniu'">
            <span class="xs--hit">
              牛九
            </span>
            <span class="xs--multiple">
              3倍
            </span>
          </template>
          <!-- 扫雷 -->
          <template v-if="play === 'boom'">
            <span class="xs--hit xIcon-boom"> </span>
            <span class="xs--multiple">
              中雷
            </span>
          </template>
          <!-- 接龙 -->
          <template v-if="play === 'dragon'">
            <span class="xs--hit"> </span>
            <span class="xs--multiple">
              接龙
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img'
export default {
  components: {
    xImg
  },
  name: 'x-settlement-item',
  props: ['avatar', 'username', 'bookmaker', 'time', 'bet', 'winte', 'play', 'amount']
}
</script>

<style lang="scss">
.x-settlement-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  .xs-left {
    width: 40px;
    height: 40px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  .xs-center {
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    flex: 1;
    line-height: 1.2;
    > * {
      flex: 1;
    }
  }
  .xs__center--top {
    font-size: 15px;
  }
  .xs__username {
    color: $txt;
    margin-right: 5px;
  }
  .xs__tag {
    font-size: 9px;
    line-height: 1.1;
  }
  .xs__center--bottom {
    font-size: 11px;
    display: flex;
    margin-top: 2px;
  }
  .xs__time {
    color: $gray-99;
  }
  .xs__bet {
    margin-left: 5px;
  }
  .xs-right {
    display: flex;
  }
  .xs__right--state {
    display: flex;
    align-items: center;
  }
  .xs__right--detial {
    display: flex;
    flex-direction: column;
    display: flex;
    line-height: 1.2;
    padding-left: 11px;
    > * {
      flex: 1;
    }
  }
  .xs__amount {
    font-size: 15px;
    font-weight: 600;
  }
  .xs__play {
    font-size: 12px;
    color: $txt;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.dragon,
    &.boom {
      .xs--multiple {
        color: $rootColor;
        line-height: 17px;
      }
    }
  }
  .xs--hit {
    font-weight: 600;
  }
}
</style>
