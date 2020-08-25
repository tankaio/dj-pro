<template>
  <!-- <div class="page-about-root"></div> -->
  <x-layout modifier="about">
    <x-header :is-right="false" slot="header"></x-header>
    <div class="icon">
      <x-img src />
      <div class="version">当前版本V1.0.0</div>
    </div>
    <van-cell is-link title="本站简介"></van-cell>
    <van-cell is-link title="关于我们"></van-cell>
    <van-cell is-link title="联系我们"></van-cell>
    <van-cell-group>
      <van-cell is-link title="功能介绍"></van-cell>
      <van-cell is-link title="软件分享"></van-cell>
    </van-cell-group>
  </x-layout>
</template>

<script>
import xHeader from "cpt/x-header.vue";
import xImg from "cpt/x-img.vue";

export default {
  components: {
    xHeader,
    xImg
  }
};
</script>

<style lang="scss">
.page-about-root {
  // //padding-top: 44px;
  background-color: $white;
  .van-cell__value {
    color: $txt;
  }
  .icon {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > img {
      height: 60px;
      width: 60px;
      font-size: 0;
    }
    .version {
      font-size: 12px;
      color: $txt;
      margin-top: 10px;
    }
  }
}
</style>
