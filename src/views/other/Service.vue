<template>
  <!-- <div class="page-service-root"></div> -->
  <x-layout modifier="service" :main-top="0">
    <x-header :is-right="false" slot="header"></x-header>
    <div class="main">
      <div class="bg service-bg"></div>
      <div class="tit service-tit-bg"></div>
      <div class="btnBar">
        <van-button type="danger" plain>
          <span class="xIcon-wechat-service"></span>
          在线客服1
        </van-button>
        <van-button type="danger" plain>
          <span class="xIcon-QQ-service"></span>
          在线客服2
        </van-button>
        <van-button type="danger" plain>
          <span class="xIcon-service_blue-service"></span>
          在线客服3
        </van-button>
        <van-button type="danger" plain>
          <span class="xIcon-service_blue-service"></span>
          在线客服4
        </van-button>
      </div>
    </div>
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
.page-service-root {
  //padding-top: 44px;
  background-color: $white;
  .main {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    overflow: hidden;
    bottom: 0;
  }
  .bg {
    position: absolute;
    height: 603px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  .tit {
    margin: 53px auto;
    display: block;
    width: 216px;
    height: 95px;
  }
  .btnBar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .van-button {
    margin-bottom: 20px;
    border-radius: 22px;
    width: 265px;
    background-color: unset;
    .van-button__text {
      > span {
        margin-right: 10px;
      }
    }
  }
}
</style>
