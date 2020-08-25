<template>
  <div class="x-zone">
    <div class="x-zone-content" :style="{ backgroundColor: color }" @click="url ? $router.push(url) : ''">
      <div class="info">
        <div class="tit">
          <span> {{ tit }}</span>
          <i class="combo" v-if="combo">{{ combo > 99 ? 99 : combo }}+</i>
        </div>
        <div class="txt">{{ txt }}</div>
        <div class="desc">{{ desc }}</div>
      </div>
      <div class="icon">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'x-zone',
  props: {
    tit: String,
    txt: String,
    desc: String,
    combo: [String, Number],
    color: String,
    url: String
  }
  // data() {
  //   return {
  //     animated: false
  //   };
  // },
  // created() {
  //   this.animated = true;
  // }
}
</script>

<style lang="scss">
.x-zone {
  // box-shadow: 0 0 6px 0 rgba($color: #000000, $alpha: 0.2);
  width: calc(50% - 4.5px);
  border-radius: 2.5px;
  position: relative;
  &:nth-child(2n) {
    margin-left: 9px;
  }
  &:nth-child(1),
  &:nth-child(2) {
    margin-bottom: 9px;
  }
  .x-zone-content {
    display: flex;
    border-radius: 2.5px;
    overflow: hidden;
    height: 83px;
    box-shadow: inset 0 0 4px 2px rgba($color: #999, $alpha: 0.2);
    &::after,
    &::before,
    .info::after {
      content: '';
      display: block;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 40%;
    }
    &::after {
      width: 58px;
      height: 50px;
      right: 0;
      bottom: 0;
      transform: translateX(50%) translateY(50%);
    }
    &::before {
      width: 41px;
      height: 26px;
      top: 0;
      right: 0;
      transform: translateX(50%) translateY(-50%);
    }
  }

  .info {
    color: $white;
    padding: 10px 0 10px 10px;
    &::after {
      width: 38px;
      height: 50px;
      top: 0;
      left: 0;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .tit {
    font-size: 17px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  .txt {
    font-size: 12px;
    margin: 8px 0 5.5px;
  }
  .desc {
    font-size: 10px;
  }
  .combo {
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    line-height: 18px;
    font-weight: 200;
    font-size: 9px;
    background-color: #f74e60;
    // vertical-align: text-top;
    padding: 0 2px;
    height: 18px;
    min-width: 18px;
    border-radius: 9px;
    margin-left: 5px;
  }
  .icon {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
