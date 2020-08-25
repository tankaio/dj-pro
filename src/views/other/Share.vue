<template>
  <!-- <div class="page-share-root"></div> -->
  <x-layout modifier="share">
    <x-header :is-right="false" slot="header"></x-header>
    <div class="qtBar">
      <div id="shareQr"></div>
    </div>
    <div class="tip">您可以扫描二维码或输入下方网址</div>
    <div class="url">www.xxxxxx.com</div>
    <div class="footer">
      <div class="tit">分享到</div>
      <div class="container">
        <div class="item">
          <span class="icon xIcon-friend-share"></span>
          <span class="txt">朋友圈</span>
        </div>
        <div class="item">
          <span class="icon xIcon-wechat-share"></span>
          <span class="txt">微信</span>
        </div>
        <div class="item">
          <span class="icon xIcon-qq-share"></span>
          <span class="txt">QQ</span>
        </div>
        <div class="item">
          <span class="icon xIcon-message-share"></span>
          <span class="txt">短信</span>
        </div>
      </div>
    </div>
  </x-layout>
</template>

<script>
import QRCode from "qrcode";
import xHeader from "cpt/x-header.vue";
export default {
  components: {
    xHeader
  },
  methods: {},
  created() {},
  mounted() {
    QRCode.toCanvas(`www.baidu.com`, {}, (err, canvas) => {
      if (err) {
        return;
      }
      var container = $("#shareQr")[0];
      container.appendChild(canvas);
    });
  }
};
</script>

<style lang="scss">
.page-share-root {
  flex: 1;
  background-color: $white;
  .qtBar {
    padding-top: 75px;
    text-align: center;
    .van-icon-qr {
      font-size: 88px;
    }
  }
  .tip,
  .url {
    font-size: 15px;
    color: $txt;
    text-align: center;
  }
  .tip {
    margin-top: 33px;
  }
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    .tit {
      font-size: 16px;
      text-align: center;
      color: $txt;
      padding: 15px 0;
      &::after {
        content: "";
        display: block;
        height: 1px;
        background-color: $gray-d7;
        margin-top: 15px;
      }
    }
    .container {
      display: flex;
      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 90px;
        .icon {
          width: 34px;
          height: 34px;
        }
        .txt {
          margin-top: 9px;
        }
      }
    }
  }
}
</style>
