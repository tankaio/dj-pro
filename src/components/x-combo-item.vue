<template>
  <div class="x-combo-item" @click="$router.push(url)">
    <van-cell>
      <div slot="title" class="center">
        <div class="avatar-bar">
          <x-img :src="ico" class="avatar" dft />
          {{ username }}
        </div>
        <div class="infos">
          <div class="top">
            <span class="plan-name">{{ planname }}</span>
            <span class="look-num">查看人数:{{ looknum }}</span>
          </div>
          <div class="bottom">
            <span class="itegral" @click.stop="$emit('look')" v-if="publish"> 查看 ({{ itegral }}积分) </span>
            <span class="publish" v-else>本期未发布</span>
            <span class="combo">最近连胜:{{ combo }}次</span>
          </div>
        </div>
        <div class="tag-bar">
          <div class="tag" :class="modeType | playColor">
            <span class="container">{{ modeType }}</span>
          </div>
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  name: 'x-combo-item',
  props: ['avatar', 'username', 'planname', 'looknum', 'combo', 'itegral', 'publish', 'modeType', 'ico', 'url']
}
</script>

<style lang="scss">
.x-combo-item {
  background-color: $baseBgColor;
  padding-top: 5px;
  .van-cell {
    background-color: $white;
    align-items: center;
  }
  .van-cell__title {
    overflow: hidden;
  }
  .avatar-bar {
    font-size: 11px;
    color: $txt;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  .center {
    display: flex;
    align-items: center;
    padding-left: 10px;
  }
  .infos {
    flex: 1;
    padding-left: 10px;
    font-size: 12px;
    align-self: center;
  }
  .top,
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bottom {
    margin-top: 6px;
    // margin-bottom: 11px;
  }
  .plan-name {
    font-size: 14px;
    color: $txt;
    font-weight: 600;
    margin-right: 8px;
  }
  .look-num {
    font-size: 13px;
    color: $txt;
  }
  .itegral {
    width: 75px;
    height: 22px;
    border-radius: 2.5px;
    background-color: $rootColor;
    text-align: center;
    line-height: 22px;
    color: $white;
    font-size: 11px;
    box-shadow: 0 2px 1px 0 #d7051a;
  }
  .publish {
    width: 75px;
    height: 22px;
    border-radius: 2.5px;
    background-color: #f5f5f5;
    text-align: center;
    line-height: 22px;
    color: $txt;
    font-size: 11px;
    box-shadow: 0 2px 1px 0 #cccccc;
  }
  // .publish {
  //   background-color: $baseBgColor;
  // }
  .combo {
    color: $rootColor;
    font-size: 13px;
  }
  .tag-bar {
    padding-left: 20px;
    .tag {
      color: $white;
      width: 24px;
      height: 70px;
      border-radius: 3px;
      position: relative;
      text-align: center;
      display: flex;
      align-items: center;
      &.od {
        background-color: $tagsOD;
      }
      &.no {
        background-color: $rootColor;
      }
      &.cb {
        background-color: $tagsCB;
      }
      &::after {
        display: block;
        content: '';
        position: absolute;
        background-color: $white;
        height: 24px;
        width: 24px;
        bottom: 0;
        left: 0;
        right: 0;
        transform: translateY(80%) rotateZ(45deg);
      }
      .container {
        writing-mode: vertical-rl;
        transform: scale(0.8);
        margin-bottom: 10px;
      }
    }
  }
}
</style>
