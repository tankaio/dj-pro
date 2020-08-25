<template>
  <!-- <x-bind-page
    left-arrow
    left-text
    rootClass="WechatCharge"
    tip="温馨提示：入款前请查看最新银行账号，若转入停用账户造成损失我司概不负责，如有疑问请查看帮助或咨询客服."
  ></x-bind-page>-->
  <x-layout modifier="WechatCharge" :main-top="96">
    <template v-slot:header>
      <x-header></x-header>
      <div class="tip">温馨提示：入款前请查看最新银行账号，若转入停用账户造成损失我司概不负责，如有疑问请查看帮助或咨询客服.</div>
    </template>
    <van-field clearable label="充值账号：" :value="userInfo.nick" disabled />
    <van-field
      clearable
      label="充值金额："
      type="number"
      :disabled="look_order"
      :placeholder="`最低${low}元，最高${hight}元`"
      v-model="money"
    />
    <van-field clearable label="获得积分：" disabled>
      <template #input>{{ integral }}</template>
    </van-field>
    <van-field
      label="转入微信："
      arrow-direction="down"
      is-link
      disabled
      placeholder="请选择微信号"
      @click="onSelectWechatClick"
      v-model="wechat_number"
    />
    <van-field clearable label="微信昵称：" disabled v-model="wechat_nick">
      <van-button
        class="wechat_nick_copy"
        slot="button"
        size="small"
        type="danger"
        @click="onCopyInnameClick"
      >复制</van-button>
    </van-field>
    <van-field clearable label="微信账号：" disabled v-model="wechat_account">
      <van-button
        class="wechat_account_copy"
        slot="button"
        size="small"
        type="danger"
        @click="onCopyInaccountClick"
      >复制</van-button>
    </van-field>
    <div class="qrBar" :class="{ animate: qr }">
      <x-img :src="qr" class="qr" v-if="qr" />
    </div>
    <van-field
      clearable
      label="汇款人姓名："
      :disabled="look_order"
      placeholder="请填写汇款人姓名"
      v-model="name"
    ></van-field>
    <van-field
      clearable
      label="联系方式："
      type="tel"
      v-model="phone"
      :disabled="look_order"
      placeholder="请输入联系方式"
    />

    <van-field label="提交时间：" v-if="look_order" disabled v-model="committime" />
    <van-field class="process" label="订单状态：" disabled v-model="orderstate" v-if="look_order" />
    <van-popup get-container="#box"  v-model="account_show" position="bottom">
      <van-picker
        :columns="wechat_numbers"
        title="转入微信"
        show-toolbar
        value-key="bknick"
        @cancel="bankPickerCancel"
        @confirm="bankPickerConfirm"
      />
    </van-popup>
    <div class="btns">
      <div class="chargeBtns">
        <van-button type="danger" @click="LoadingOffline">提交</van-button>
      </div>
    </div>
  </x-layout>
</template>

<script>
import { mapGetters } from "vuex";
import {
  GetLoadingBkInfo,
  GetLoadingPromotion,
  LoadingOffline,
  GetLoadingOrder
} from "@/api/user";
import { getTime } from "@/utils/formant.util.js";

import xBindPage from "cpt/x-bind-page.vue";
import xImg from "cpt/x-img.vue";

export default {
  components: {
    xBindPage,
    xImg
  },
  data() {
    return {
      columns: [],
      account_show: false,

      wechat_numbers: [],

      wechat_number: "", // 微信号,当前选中
      money: "", // 金额
      integral: "", // 积分
      wechat_nick: "", // 微信昵称
      wechat_account: "", // 微信账号
      name: "", // 汇款人姓名
      phone: "", // 联系方式
      hight: 0,
      low: 0,
      showamounts: false,
      qr: "",

      committime: "2019-01-01 00:00:00",
      orderstate: "审核中",

      look_order: false,

      order: false
    };
  },
  methods: {
    onCopyInnameClick() {
      $clip(".wechat_nick_copy", this.wechat_nick).then(() =>
        this.$notify({ type: "success", message: "成功复制" })
      );
    },
    onCopyInaccountClick() {
      $clip(".wechat_account_copy", this.wechat_account).then(() =>
        this.$notify({ type: "success", message: "成功复制" })
      );
    },
    onSelectWechatClick() {
      if (this.look_order) return;
      this.account_show = true;
    },
    bankPickerCancel() {
      this.account_show = false;
    },
    bankPickerConfirm(value, index) {

      this.wechat_number = value.bknick;
      this.account_show = false;
      this.fill(value);
    },
    async GetLoadingBkInfo() {
      let { ok, msg } = await GetLoadingBkInfo({ channel: 1 });
      if (ok) {
        this.wechat_numbers = msg || [];
        this.fill(this.wechat_numbers[0]);
      }
    },
    GetLoadingPromotion() {
      return new Promise(reslove => {
        if (!this.money) return reslove("");
        GetLoadingPromotion({
          bknick: this.wechat_number,
          amount: this.money
        }).then(({ ok, msg }) => {
          reslove(msg);
        });
      });
    },
    async LoadingOffline() {
      //   G.$dialog
      // .confirm({
      //   title: "温馨提示",
      //   message: `
      //     充值账号：${this.userInfo.nick},
      //     充值金额：${this.money}
      //     转入银行：${this.wechat_number}
      //     转入户名：${this.inname}
      //     转入账号：${this.inaccount}
      //     汇款人姓名：${this.name}
      //     联系方式：${this.userInfo.phone}
      // `,
      //   className: "table"
      // })
      // .then(() => {
      //   LoadingOffline({
      //     nick: this.userInfo.nick,
      //     amount: this.money,
      //     payee: this.name,
      //     paynum: "",
      //     phone: this.phone
      //   }).then(({ ok, msg }) => {
      //     if (ok) {
      //       this.$notify({
      //         type: "success",
      //         message: "您的充值申请已经提交，请尽快完成充值"
      //       });
      //       this.look_order = true;
      //       let [ymd, hms] = getTime();
      //       this.committime = `${ymd} ${hms}`;
      //       this.orderstate = "审核中";
      //     }
      //   });
      // });
    },
    fill(value = {}) {
      let { amounts, bknick, bknum, high, low, name, showamounts, qr } = value;
      if (!bknick) return;
      // this.quick_list = amounts.split(",");
      this.hight = high;
      this.low = low;

      this.wechat_number = bknick;
      this.wechat_nick = bknick;//name; 
      this.wechat_account = bknum;
      this.showamounts = showamounts;
      G.delay(() => (this.qr = qr), 1000);
    }
  },
  created() {
    this.GetLoadingBkInfo();
    this.phone = this.userInfo.phone;
    this.name = this.getBkInfo.owner;
    let GetLoadingPromotion_memoize = G.memoize(() =>
      this.GetLoadingPromotion()
    );
    this.GetLoadingPromotion_debounce = G.debounce(async () => {
      this.integral = await GetLoadingPromotion_memoize(this.money);
    }, 500);
  },
  computed: {
    ...mapGetters(["userInfo", "getBkInfo"])
  },
  watch: {
    money(news) {
      this.GetLoadingPromotion_debounce();
    }
  }
};
</script>

<style lang="scss">
.page-WechatCharge-root {
  background-color: $white;
  .tip {
    background-color: $baseBgColor;
    font-size: 12px;
    color: $txt;
    padding: 12px;
    line-height: 14px;
  }
  .btns {
    text-align: center;
    .van-button {
      width: 290px;
      margin-top: 40px;
      border-radius: 5px;
    }
  }
  .qrBar {
    font-size: 0;
    height: 0;
    overflow-y: hidden;
    transition-duration: 500ms;
    &.animate {
      height: 120px;
    }
    .qr {
      display: block;
      height: 80px;
      width: 80px;
      margin: 20px auto;
    }
  }
  .van-field__control:disabled {
    color: $txt;
    -webkit-text-fill-color: $txt;
  }
  .van-cell {
    .van-button {
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>
