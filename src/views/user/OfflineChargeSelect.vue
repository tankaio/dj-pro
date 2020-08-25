<template>
  <!-- <div class="page-OfflineChargeSelect-root"></div> -->
  <x-layout modifier="OfflineChargeSelect">
    <template #header>
      <x-header>
        <van-icon name="question-o" />
      </x-header>
    </template>
    <div class="gray-8" v-if="bk.enable">
      <div class="cell-bar" :class="{ showBanner: bk.tips.bol }">
        <div class="banner-recharge">{{ bk.tips.tip }}</div>
        <van-cell title="银行卡转账" :label="bk.text" to="/user/bankCharge" />
      </div>
    </div>
    <div class="gray-8" v-if="wx.enable">
      <div class="cell-bar" :class="{ showBanner: wx.tips.bol }">
        <div class="banner-recharge">{{ wx.tips.tip }}</div>
        <van-cell title="微信转账" :label="wx.text" to="/user/wechatCharge" />
      </div>
    </div>
    <div class="gray-8" v-if="al.enable">
      <div class="cell-bar" :class="{ showBanner: al.tips.bol }">
        <div class="banner-recharge">{{ al.tips.tip }}</div>
        <van-cell title="支付宝转账" :label="al.text" to="/user/offlineCharge" />
      </div>
    </div>
    <div class="gray-8" v-if="qr.enable">
      <div class="cell-bar" :class="{ showBanner: qr.tips.bol }">
        <div class="banner-recharge">{{ qr.tips.tip }}</div>
        <van-cell title="支付宝/微信转账" :label="qr.text" to="/user/offlineCharge" />
      </div>
    </div>
    <div class="gray-8"></div>
  </x-layout>
</template>

<script>
import { GetLoadingOffline } from "@/api/user";

import xHeader from "cpt/x-header.vue";

export default {
  components: {
    xHeader
  },
  data() {
    return {
      bk: {},
      wx: {},
      al: {},
      qr: {}
    };
  },
  methods: {
    async GetLoadingOffline() {
      // TODO 该接口缺少返回数据
      let { ok, msg } = await GetLoadingOffline();
      if (ok) {
        let getData = G.curry(G.get)(msg);
        this.bk = getData("bk", {});
        this.wx = getData("wx", {});
        this.al = getData("al", {});
        this.qr = getData("qr", {});
      }
    }
  },
  created() {
    this.GetLoadingOffline();
  }
};
</script>

<style lang="scss">
.page-OfflineChargeSelect-root {
  background-color: $white;
  .van-icon-question-o {
    font-size: 20px;
    color: $white;
  }
  .cell-bar {
    position: relative;
    overflow: hidden;
    background-color: $white;
    padding-top: 2px;
    padding-right: 2px;
    .banner-recharge {
      display: none;
    }
    &.showBanner {
      .banner-recharge {
        display: block;
      }
      &::before {
        position: absolute;
        display: block;
        content: "";
        height: 69px;
        width: 30px;
        top: -1px;
        right: 38px;
        background-color: $rootColor;
        transform-origin: top left;
        transform: rotateZ(45deg);
      }
      &::after {
        position: absolute;
        display: block;
        content: "";
        height: 30px;
        width: 30px;
        right: 0;
        bottom: 0;
        background-color: $rootColor;
      }
    }
    .van-cell {
      z-index: 5;
    }
  }
}
</style>
