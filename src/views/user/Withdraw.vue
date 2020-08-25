<template>
  <!-- <x-page rootClass="ApplyWithdrawal" is-right></x-page> -->
  <x-layout modifier="ApplyWithdrawal">
    <template #header>
      <x-header>
        <van-icon name="question-o" />
      </x-header>
    </template>
    <van-cell title="账户金币余额" :value="userInfo.balan_c"></van-cell>
    <van-cell title="提款银行" :value="getBkInfo.bkname"></van-cell>
    <van-cell title="账户姓名" :value="getBkInfo.owner | Name"></van-cell>
    <van-cell title="银行账号" :value="getBkInfo.bknum | BankID"></van-cell>
    <!-- 仅允许输入数字小数点，且不超过两位。

    注意不允许零开头-->
    <van-field label="提款金额" placeholder="请输入提款金额(元)" v-model="money" type="number" clearable />
    <van-field type="number" label="消耗金币" v-model="money" disabled />
    <div class="tip">温馨提示：当金币数量达到100个时，方可提现。 1个金币=1元。</div>
    <div class="btnBar">
      <van-button type="danger" @click="onWithDraw" :disabled="Number(userInfo.balan_c) < 100">确认</van-button>
    </div>
  </x-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { ApplyWithdrawal } from "@/api/user";
import { exchangeIntegral } from "@/utils/verify.util.js";

import xPage from "cpt/x-page.vue";

export default {
  components: {
    xPage
  },
  data() {
    return {
      money: ""
    };
  },
  methods: {
    async onWithDraw() {
      if (Number(this.money) > Number(this.userInfo.balan_c)) {
        return this.$notify("账户金币不足");
      }
      if (!exchangeIntegral(this.money)) return;
      let { ok, msg } = await ApplyWithdrawal({
        amount: this.money
      });
      if (ok) {
        // 如后台有未处理的提款订单时前台不允许重复提交；重复提交toast提示（3秒）：您有一笔提款订单正在处理，请误重复提交！
        G.$dialog
          .alert({
            title: "温馨提示",
            message:
              "您的提款订单已经提交后台审核，到账可能会稍有延迟，请耐心等待！"
          })
          .then(() => {
            this.go(-1);
          });
      }
    }
  },
  computed: {
    ...mapGetters(["getBkInfo", "userInfo"])
  }
};
</script>

<style lang="scss">
.page-ApplyWithdrawal-root {
  background-color: $white;
  .van-icon-question-o {
    font-size: 20px;
    color: $white;
  }
  .van-cell__value {
    color: $txt;
  }
  .van-cell::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .tip {
    font-size: 13px;
    color: $gray-66;
    padding: 9px 50px;
    line-height: 1.5;
  }
  .btnBar {
    padding: 10px 42px;
    .van-button {
      width: 290px;
      border-radius: 2.5px;
    }
  }
  .van-field__control:disabled {
    color: $txt;
    -webkit-text-fill-color: $txt;
  }
}
</style>
