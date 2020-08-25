<template>
  <div class="page-RedDetial-root">
    <x-header :is-right="false" />
    <div class="redPanel">
      <x-img src="" class="avatar" dft />
      <div class="redOrigin">
        来自健健康康平平安安
      </div>
      <div class="amount">
        0.46元
      </div>
    </div>

    <div class="statistics van-hairline--bottom">
      已领取5/6个，总金额20元
    </div>
    <x-settlement-item
      v-for="(item, index) in 10"
      :key="index"
      v-bind="{
        avatar: '',
        username: '健健康康',
        bookmaker: false,
        time: '06:06:06',
        bet: '100',
        winte: true,
        play: 'niuniu',
        amount: '0.66'
      }"
    />
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xImg from 'cpt/x-img.vue'
import xSettlementItem from 'cpt/x-redbag/x-settlement-item.vue'
export default {
  components: {
    xHeader,
    xImg,
    xSettlementItem
  },
  name: 'page-RedDetial-root'
}
</script>

<style lang="scss">
.page-RedDetial-root {
  &::before {
    content: '';
    display: block;
    position: absolute;
    background-color: $rootColor;
    width: 120vw;
    height: 111px;
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    background-color: $rootColor;
    height: 50px;
    left: 0;
    right: 0;
    top: 44px;
    z-index: -1;
  }

  .redPanel {
    text-align: center;
    position: relative;
    z-index: 1;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 40.5px auto 0;
      overflow: hidden;
    }
    .redOrigin {
      font-size: 15px;
      color: $txt;
      margin-top: 24.5px;
    }
    .amount {
      font-size: 30px;
      color: $txt;
      margin-top: 25px;
      font-weight: 600;
    }
  }

  .statistics {
    padding: 6.5px 14.5px;
    font-size: 12px;
    color: $gray-99;
    margin-top: 45px;
  }
}
</style>
