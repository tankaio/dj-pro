<template>
  <div class="page-GameWallet-root">
    <x-header @click-right="$router.push('/chat/walletInstructions')">
      <van-icon name="question-o" />
    </x-header>
    <div class="panel">
      <div class="balance">
        <div class="top">总余额</div>
        <div class="bottom">￥999.99</div>
      </div>
      <div class="tab van-hairline--top">
        <div class="item van-hairline--right">可用金额 :</div>
        <div class="item">未结算金额 :</div>
      </div>
    </div>
    <van-field type="tel" label="转入金额 :" input-align="right" placeholder="请输入转入钱包金额" v-cursor>
      <template #right-icon>
        元
      </template>
    </van-field>
    <van-field class="van-hairline--bottom" label="可转入钱包金额:" value="￥99999" disabled />

    <div class="btnBar">
      <van-button type="danger" class="wd200">确认转入</van-button>
      <van-button class="wd200" @click="$router.push('/chat/gameWalletPut')">转出</van-button>
    </div>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  },
  name: 'page-GameWallet-root'
}
</script>

<style lang="scss">
.page-GameWallet-root {
  .van-icon-question-o {
    font-size: 20px;
  }
  .van-field__right-icon {
    color: $txt;
  }
  .van-field__label {
    flex: unset;
    white-space: nowrap;
    width: unset;
  }
  .van-field__control:disabled {
    color: $txt;
    -webkit-text-fill-color: $txt;
  }
  .van-cell__value {
    flex: 1;
  }
  .van-hairline--bottom::after {
    top: unset;
  }
  .panel {
    background-color: $rootColor;
    .balance {
      height: 92px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 16px;
      color: $white;
      text-align: center;
      .bottom {
        margin-top: 5px;
      }
    }
    .tab {
      display: flex;
      .item {
        height: 41px;
        line-height: 41px;
        padding-left: 14.5px;
        color: $white;
        font-size: 12px;
        font-weight: 600;
        flex: 1;
      }
    }
  }
  .btnBar {
    text-align: center;
    padding-top: 70px;
    .van-button {
      margin-bottom: 15px;
    }
  }
}
</style>
