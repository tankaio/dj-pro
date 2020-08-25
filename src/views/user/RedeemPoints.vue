<template>
  <!-- <x-page rootClass="redeemPoints" is-right></x-page> -->
  <x-layout modifier="redeemPoints">
    <template #header>
      <x-header>
        <van-icon name="question-o" />
      </x-header>
    </template>
    <van-cell title="账户当前金币" :value="userInfo.balan_c"></van-cell>
    <van-cell title="账户当前积分" :value="userInfo.balan_m"></van-cell>
    <van-cell-group>
      <div class="tit">金币兑换积分</div>
      <van-field label="兑换金额：" placeholder="请输入兑换积分数" v-model="amount" type="number"></van-field>
      <div class="consuption">
        消耗金币：
        <i class="special">{{ amount }}</i>
      </div>
    </van-cell-group>
    <van-cell-group class="nobottom">
      <div class="tip">温馨提示：当金币数量达到100个时，方可兑换积分。 1个金币=1积分。</div>
    </van-cell-group>
    <div class="btnBar">
      <van-button type="danger" @click="BalanC2M">提交</van-button>
    </div>
  </x-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { BalanC2M } from "@/api/user";
import { exchangeIntegral } from "@/utils/verify.util.js";

import xPage from "cpt/x-page.vue";

export default {
  components: {
    xPage
  },
  data() {
    return {
      amount: ""
    };
  },
  methods: {
    async BalanC2M() {
      // “兑换积分”输入框仅允许输入数字与小数点，输入数字必须大于零且不超过两位小数
      // 输入数字时，下面“消耗金币”同步显示所需消耗的进金币数量
      if (this.userInfo.balan_c < 100) {
        return this.$notify("您的账户金币未达到100，无法兑换积分");
      }
      if (!exchangeIntegral(this.amount)) return;
      let { ok, msg } = await BalanC2M({
        amount: this.amount
      });
      if (ok) {
        this.$notify({
          type: "success",
          message: `已成功兑换${this.amount}积分`
        });
        this.go(-1);
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created() {}
};
</script>

<style lang="scss">
.page-redeemPoints-root {
  background-color: $white;
  .van-icon-question-o {
    font-size: 20px;
    color: $white;
  }
  .tit {
    font-size: 15px;
    font-weight: 600;
    color: $txt;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    background-color: $white;
  }
  .consuption {
    padding: 0 10px;
    height: 44px;
    line-height: 44px;
    background-color: $white;
    font-size: 14px;
    color: $txt;
    .special {
      color: $rootColor;
    }
  }
  .van-cell__value {
    color: $txt;
  }
  .van-field {
    padding: 0 10px 18px;
    .van-cell__title {
      line-height: 36px;
    }
    .van-cell__value {
      flex: none;
      display: flex;
      align-items: center;
      height: 34px;
      width: 180px;
      border-radius: 2.5px;
      border: 1px solid $gray-99;
      padding-left: 10px;
    }
  }
  .tip {
    background-color: $white;
    padding: 10px 32px;
    font-size: 14px;
    color: $txt;
  }
  .nobottom::after {
    display: none;
  }
  .btnBar {
    display: flex;
    justify-content: center;
    .van-button {
      width: 290px;
      border-radius: 2.5px;
      margin-top: 50px;
      border-radius: 5px;
    }
  }
}
</style>
