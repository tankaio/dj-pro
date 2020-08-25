<template>
  <div class="x-code" :class="{ state }">
    <div class="xc-bar">
      <div class="xc-hd van-hairline--bottom">
        <span class="xc-left">
          <span class="special" :class="bettype | playColor">
            {{ bettype }}
          </span>
          {{ betrgn }}
        </span>
        <span class="xIcon-fun-cm" @click="playFunDesc"></span>
      </div>
      <div class="xc-body">
        <div
          class="xc-num__item--bar"
          v-for="(item, index) in numList"
          :key="index"
        >
          <div class="xc-num-item" :class="{ active: item.win }">
            {{ item.num }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlayDescZh } from "@/utils/plan.util.js";
export default {
  name: "x-code",
  props: ["state", "numList", "bettype", "betrgn"],
  methods: {
    playFunDesc() {
      G.$dialog.alert({
        title: "玩法说明",
        message: getPlayDescZh(this.betrgn, this.bettype)
      });
    }
  }
};
</script>

<style lang="scss">
.x-code {
  padding-top: 8px;
  background-color: $baseBgColor;
  &:last-child {
    padding-bottom: 8px;
  }
  .xc-bar {
    background-color: $white;
  }
  .xc-hd,
  .xc-body {
    padding: 10px 15px;
  }
  .xc-hd {
    display: flex;
    align-items: center;
  }
  .xc-left {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
  }
  .special {
    color: $male;
    @each $k, $v in $playColors {
      &.#{$k} {
        color: $v;
      }
    }
  }
  .xc-num__item--bar {
    min-width: 16.6%;
    text-align: center;
    margin-top: 8px;
  }
  .xc-ds-item,
  .xc-num-item {
    display: inline-block;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    color: $txt;
    border: 1px solid $txt;
    border-radius: 50%;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
  }
  .xc-num-item.active {
    background-color: $rootColor;
    color: $white;
    border-color: $rootColor;
  }
  .xc-body {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
