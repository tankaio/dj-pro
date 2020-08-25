<template>
  <div class="x-redbag-open">
    <div class="xr-main redbag-open-bg">
      <div class="xr-redname">
        {{ name }}
      </div>
      <div class="xr-red-tip">
        {{ state | stateFilter }}
      </div>
      <div
        class="xr-detial"
        v-if="read_red_detial_ctr"
        @click="$router.push(`/chat/redDetial/${id}`)"
      >
        <span>查看领取详情</span><van-icon name="arrow" />
      </div>
      <div
        class="xr-open-btn"
        v-if="this.state === 0"
        @click="$router.push(`/chat/redDetial/${id}`)"
      >
        開
      </div>
      <div class="fireworks-bg"></div>
      <div class="niuniu-bg"></div>
    </div>
    <div class="xr-close close-circle" @click="$emit('close')"></div>
  </div>
</template>

<script>
export default {
  name: "x-redbag-open",
  props: ["name", "state", "id"],
  computed: {
    read_red_detial_ctr() {
      if (this.state === 0) {
        return false;
      }
      return true;
    }
  },
  filters: {
    stateFilter(val) {
      switch (val) {
        case 0:
          return "恭喜发财,牛气冲天";
        case 1:
          return "您没有投注，无法抢该红包";
        case 2:
          return "该红包已过期";
        case 3:
          return "手慢了，红包派完了";
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.x-redbag-open {
  height: 499px;
  width: 308px;
  color: #f8e4bd;
  .xr-main {
    width: 308px;
    height: 424px;
    position: relative;
  }
  .xr-close {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin: 40px auto 0;
    border-color: #f8e4bd;
    &::after,
    &::before {
      border-color: #f8e4bd;
    }
  }
  .xr-redname {
    text-align: center;
    padding-top: 56px;
    font-size: 20px;
  }
  .xr-red-tip {
    font-size: 19px;
    text-align: center;
    margin-top: 25px;
    font-weight: 600;
  }
  .xr-detial {
    margin-top: 275px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .fireworks-bg {
    position: absolute;
    width: 153px;
    top: 135px;
    left: 47.5px;
    height: 141px;
  }
  .niuniu-bg {
    position: absolute;
    width: 123px;
    height: 94.5px;
    top: 215px;
    right: 0;
  }
  .xr-open-btn {
    position: absolute;
    top: 289px;
    left: 107.5px;
    background-color: #ebcd99;
    width: 94px;
    height: 94px;
    border-radius: 50%;
    line-height: 94px;
    text-align: center;
    font-size: 38px;
    color: $txt;
  }
}
</style>
