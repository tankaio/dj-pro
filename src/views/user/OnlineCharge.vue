<template>
  <!-- <div class="page-onlineCharge-root"></div> -->
  <x-layout modifier="onlineCharge">
    <template #header>
      <x-header @click-right="onClickHeaderRight">
        <van-icon name="question-o" />
      </x-header>
    </template>
    <van-collapse v-model="activeNames" accordion @change="onChange">
      <template v-for="(item, index) in list">
        <van-collapse-item v-if="item.showamounts" :key="index" :name="index">
          <div slot="title">
            <div class="playname">{{ item.channel | titFilter }}</div>
            <div class="playdesc">支付说明文字（例：推荐、充金额限制等）</div>
          </div>
          <div class="container">
            <van-field label="充值账号：" v-model="account" />
            <van-field label="充值金额：" type="number" v-model="amount" :placeholder="placeholder" />
            <van-field label="快捷金额：">
              <template #input>
                <van-button
                  size="small"
                  v-for="(item_a, index_a) in item.amounts.split(',')"
                  :key="index_a"
                  @click="onQuickAmount(item_a)"
                >{{ item_a }}</van-button>
              </template>
            </van-field>
            <van-field label="获得积分：" v-model="integral" disabled />
            <van-button type="danger" class="commit" @click="LoadingOnline(item)">提交</van-button>
          </div>
        </van-collapse-item>
      </template>
    </van-collapse>
  </x-layout>
</template>

<script>
import {
  GetLoadingOnlinebkInfo,
  LoadingOnline,
  GetOnLinePromotion
} from "@/api/user";

import xHeader from "cpt/x-header.vue";

export default {
  components: {
    xHeader
  },
  data() {
    return {
      activeNames: [0],
      list: [],
      account: "",
      amount: "",
      integral: "",
      placeholder: "",
      idx: ""
    };
  },
  filters: {
    titFilter(val) {
      switch (val) {
        case 0:
          return "银联扫码[YL]";
        case 1:
          return "微信支付[WX]";
        case 2:
          return "支付宝支付[ZFB]";
        case 3:
          return "京东扫码[JD]";
        default:
          break;
      }
    }
  },
  methods: {
    onChange(idx) {
      this.account = "";
      this.amount = "";
      this.integral = "";
      if (G.isNum(idx)) {
        this.idx = idx;
        let { low, high } = this.list[idx];
        this.placeholder = `${low}-${high}`;
      }
    },
    onQuickAmount(val) {
      this.amount = val;
    },
    onClickHeaderRight() {},
    async LoadingOnline(item) {
      let { ok, msg } = await LoadingOnline({
        channel: item.channel,
        nick: this.account,
        amount: this.amount
      });
      if (ok) {
        this.$notify({
          type: "success",
          message: `申请成功,单号为${msg.orderid}`
        });
        this.go(-1);
      }
    },
    async GetLoadingOnlinebkInfo() {
      let { ok, msg } = await GetLoadingOnlinebkInfo();
      if (ok) {
        this.list = msg || [];
      }
    },
    async GetOnLinePromotion() {
      let channel = this.list[this.idx].channel;
      let { ok, msg } = await GetOnLinePromotion({
        channel,
        amount: this.amount
      });
      if (ok) {
        return msg;
      }
    }
  },
  created() {
    let GetOnLinePromotion_memoize = G.memoize(this.GetOnLinePromotion);
    this.GetOnLinePromotion_debounce = G.debounce(async () => {
      this.integral = await GetOnLinePromotion_memoize(this.amount, this.idx);
    }, 500);
    this.GetLoadingOnlinebkInfo();
  },
  watch: {
    amount(news) {
      if (news) {
        this.GetOnLinePromotion_debounce();
      }
    }
  }
};
</script>

<style lang="scss">
.page-onlineCharge-root {
  background-color: $white;
  .van-icon-question-o {
    font-size: 20px;
  }
  .van-collapse-item {
    .van-cell {
      align-items: center;
      font-size: 15px;
      .playname {
        font-weight: 700;
      }
      .playdesc {
        color: $gray-99;
        font-size: 14px;
      }
    }
  }
  .van-collapse-item__content {
    padding-top: 0;
    padding-bottom: 0;
  }
  .container {
    .van-cell {
      padding-left: 0;
      padding-right: 0;
    }
    .commit {
      display: block;
      margin: 10px auto;
      width: 290px;
      height: 43px;
      line-height: 43px;
    }
  }
  .van-field__control {
    display: flex;
    justify-content: space-between;
    .van-button {
      min-width: unset;
    }
  }
  .van-field__control:disabled {
    color: $txt;
    -webkit-text-fill-color: $txt;
  }
}
</style>
