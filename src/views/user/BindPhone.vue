<template>
  <!-- <x-bind-page tip="温馨提示：请填写本人手机号，绑定后如需修改需要联系客服修改" @cancel="onCancel"></x-bind-page> -->
  <x-layout :main-top="80" mainCenterColor="#fff">
    <template #header>
      <x-header :left-arrow="false">
        <template v-slot:left>取消</template>
      </x-header>
      <div class="tip">温馨提示：请填写本人手机号，绑定后如需修改需要联系客服修改</div>
    </template>
    <van-field clearable v-model="phone" label="手机号码" type="tel" placeholder="请输入11位的手机号码"></van-field>
    <div class="btns">
      <van-button type="danger" @click="onConfirmClick">确认绑定</van-button>
    </div>
  </x-layout>
</template>

<script>
import { BindPhone } from "@/api/user";
import { verifyPhone } from "@/utils/verify.util.js";

import xBindPage from "cpt/x-bind-page.vue";

export default {
  components: {
    xBindPage
  },
  data() {
    return {
      phone: ""
    };
  },
  methods: {
    onCancel() {},
    async onConfirmClick() {
      if (verifyPhone(this.phone)) {
        G.$dialog
          .confirm({
            title: "提醒",
            message: `是否绑定手机号${this.phone}？绑定后需联系客服才能修改。`
          })
          .then(() => {
            BindPhone({ phone: this.phone }).then((ok, msg) => {
              if (ok) {
                this.$notify({
                  type: "success",
                  message: msg
                });
              }
            });
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
.van-cell:not(:last-child)::after {
  right: 0 !important;
}
</style>
