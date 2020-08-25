<template>
  <!-- <div class="page-more-root"></div> -->
  <x-layout modifier="more">
    <x-header :is-right="false" slot="header"></x-header>
    <van-cell title="关于本站" value="版本1.0.0" is-link to="/about"></van-cell>
    <van-cell title="帮助中心" is-link to="/help"></van-cell>
    <van-cell-group>
      <van-cell title="意见反馈" is-link to="/feedBack"></van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="联系我们" is-link to="/service"></van-cell>
      <van-cell title="软件分享" is-link to="/share"></van-cell>
    </van-cell-group>
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
.page-more-root {
  // //padding-top: 44px;
  background-color: $white;
  .van-cell__value {
    color: $txt;
  }
}
</style>
