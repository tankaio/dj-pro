<template>
  <div class="x-changlong-item gray-after-8">
    <div class="xc-container">
      <div class="xc-left">
        <x-img :src="src" class="xc-avatar" dft />
      </div>
      <div class="xc-center">
        <div class="xc-top">
          <div class="xc-lottery-info">
            <div class="xc-name">{{ lotteryName }}</div>
            <div class="xc-issue">{{ issue }}期</div>
          </div>
          <div class="xc-end-time">
            <div class="xc-desc">距离封盘</div>
            <div class="xc-time">{{ time }}</div>
          </div>
        </div>
        <div class="xc-bottom">
          <div class="xc-label">特码：</div>
          <van-tag type="danger">小</van-tag>
          <van-tag type="danger">10期</van-tag>
        </div>
      </div>
      <div class="xc-right">
        <div class="xc-item">
          <div class="xc-type">大</div>
          <div class="xc-num">1.98</div>
        </div>
        <div class="xc-item">
          <div class="xc-type">小</div>
          <div class="xc-num">1.98</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  name: 'x-changlong-item',
  props: {
    src: String,
    lotteryName: String,
    issue: String,
    time: [String, Date]
  },
  components: {
    xImg
  }
}
</script>

<style lang="scss">
.x-changlong-item {
  .xc-container {
    display: flex;
    padding: 20px 16px;
  }
  .xc-left {
    margin-right: 10px;
  }
  .x-img {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    overflow: hidden;
  }
  .xc-center {
    flex: 1;
  }
  .xc-top {
    display: flex;
    justify-content: space-between;
    line-height: 1.2;
  }
  .xc-lottery-info {
    color: $txt;
  }
  .xc-name {
    font-size: 15px;

    font-weight: 600;
  }
  .xc-issue {
    font-size: 12px;
  }
  .xc-end-time {
    color: $rootColor;
    font-size: 14px;
  }
  .xc-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }
  .xc-label {
    font-weight: 600;
    font-size: 14px;
  }

  .xc-right {
    display: flex;
    align-items: center;
  }
  .xc-item {
    width: 50px;
    height: 50px;
    border-radius: 2.5px;
    border: 0.5px solid $gray-d7;
    margin-left: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .xc-type {
    font-size: 15px;
    font-weight: 600;
    color: $rootColor;
  }
  .xc-num {
    font-size: 14px;
    color: $txt;
    margin-top: 10px;
  }
}
</style>
