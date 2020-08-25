<template>
  <van-cell-group class="x-panel">
    <div v-if="title" class="xp-title">
      {{ title }}
    </div>
    <div class="xp-bar">
      <div class="xp-item" v-for="(item, index) in list" :key="index">
        <span class="xp-label"
          >{{ item.rgn }}<i class="xp-special">{{ item.bet }}</i></span
        >
        <i class="xp-act" v-if="item.win">中</i>
      </div>
    </div>
  </van-cell-group>
</template>

<script>
export default {
  name: "x-panel",
  props: {
    list: Array,
    title: String
  }
};
</script>

<style lang="scss">
.x-panel {
  &.van-hairline--top-bottom::after {
    display: none;
  }
  .xp-title {
    font-size: 15px;
    color: $txt;
    padding: 15px 15px 0 15px;
    background-color: $white;
  }
  .xp-bar {
    display: flex;
    padding: 10px;
    background-color: $white;
    flex-wrap: wrap;
  }
  .xp-item {
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    width: 50%;
    height: 40px;
    padding-left: 10px;
    line-height: 40px;
    color: $txt;
    font-size: 14px;
    &:nth-child(1),
    &:nth-child(3) {
      &::after {
        content: "";
        display: block;
        position: absolute;
        border-right: 1px solid $gray-d7;
        transform: rotateY(60deg);
        top: 0;
        right: 0;
        bottom: 0;
      }
    }
    &:nth-child(1)::before,
    &:nth-child(2)::before {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      transform: rotateX(60deg);
      border-bottom: 1px solid $gray-d7;
    }
  }
  .xp-special {
    margin-left: 10px;
    color: $rootColor;
  }
  .xp-act {
    display: inline-block;
    height: 15px;
    width: 15px;
    line-height: 15px;
    background-color: #ffd9dd;
    text-align: center;
    margin-right: 15px;
    font-size: 13px;
    color: $rootColor;
  }
  .xp-label {
    flex: 1;
    font-size: 14px;
  }
}
</style>
