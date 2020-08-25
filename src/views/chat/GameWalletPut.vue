<template>
  <div class="page-GameWalletPut-root">
    <x-header :is-right="false" />
    <van-cell title="到账户:" value="账户总余额"></van-cell>
    <van-field type="tel" label="转出金额:">
      <template #right-icon>
        元
      </template>
    </van-field>
    <van-cell class="allBalance van-hairline--bottom">
      <template #title>
        <span>游戏钱包总余额:</span>
        <span>￥99999</span>
      </template>
      <van-button type="danger" size="small">全部转出</van-button>
    </van-cell>

    <van-button type="danger" class="wd200">转出</van-button>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  },
  name: 'page-GameWalletPut-root'
}
</script>

<style lang="scss">
.page-GameWalletPut-root {
  .allBalance .van-cell__title {
    line-height: 30px;
  }
  .van-cell__value,
  .van-field__right-icon {
    color: $txt;
  }
  .van-hairline--bottom::after {
    top: unset;
  }
  .wd200 {
    display: block;
    margin: 159px auto 0;
  }
}
</style>
