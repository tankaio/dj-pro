<template>
  <!-- <div class="page-help-root"></div> -->
  <x-layout modifier="help">
    <x-header :is-right="false" slot="header"></x-header>
    <van-cell title="如何成为本站会员？" is-link></van-cell>
    <van-cell title="什么是积分？" is-link></van-cell>
    <van-cell title="如何充值积分？" is-link></van-cell>
    <van-cell title="如何兑换积分？" is-link></van-cell>
    <van-cell title="什么是金币？" is-link></van-cell>
    <van-cell title="如何提款？" is-link></van-cell>
    <van-cell title="什么是专家？" is-link></van-cell>
    <van-cell title="绑定/修改/解绑银行账号？" is-link></van-cell>
    <van-cell title="如何修改手机号码？" is-link></van-cell>
    <van-cell title="什么是邀请码？" is-link></van-cell>
  </x-layout>
</template>

<script>
import xHeader from "cpt/x-header.vue";
export default {
  components: {
    xHeader
  }
};
</script>

<style lang="scss">
.page-help-root {
  // //padding-top: 44px;
  background-color: $white;
  .van-cell__value {
    color: $txt;
  }
}
</style>
