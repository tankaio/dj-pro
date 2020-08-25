<template>
  <!-- <x-page rootClass="integral" isRight></x-page> -->
  <x-layout modifier="integral">
    <template v-slot:header>
      <x-header>
        <van-icon name="question-o" />
      </x-header>
    </template>
    <van-cell-group>
      <van-cell title="线下存款" label="支持微信转账、支付宝转账、网银转账等" is-link to="/user/offlineChargeSelect" />
      <van-cell title="线上充值" label="支持微信转账、支付宝转账、网银转账等" is-link to="/user/onlineCharge" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="兑换积分" is-link to="/user/redeemPoints"></van-cell>
    </van-cell-group>
    <div class="footer">温馨提示：充值的金额自动兑换为积分，积分只能用于购买 查看专家计划，不能提款。</div>
  </x-layout>
</template>

<script>
import xPage from "cpt/x-page.vue";
export default {
  components: {
    xPage
  }
};
</script>

<style lang="scss">
.page-integral-root {
  padding-bottom: 66px;
  background-color: $white;
  .van-icon-question-o {
    font-size: 20px;
    color: $white;
  }
  .van-cell {
    align-items: center;
  }
  .van-cell-group:nth-child(2) {
    padding-bottom: 8px;
  }
  .footer {
    padding: 14px 19px;
    font-size: 13px;
    color: $txt;
    line-height: 1.5;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 1px 4px 0 rgba($color: #000000, $alpha: 0.2);
  }
}
</style>
