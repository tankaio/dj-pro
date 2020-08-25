<template>
  <!-- <x-bind-page rootClass="changepwd" tip="温馨提示：定期修改，有助于保护您的账户安全!"></x-bind-page> -->
  <x-layout modifier="changepwd" :main-top="78">
    <template #header>
      <x-header :left-arrow="false">
        <template v-slot:left>取消</template>
      </x-header>
      <div class="tip">温馨提示：定期修改，有助于保护您的账户安全!</div>
    </template>
    <van-field clearable type="password" v-model="old_pwd" placeholder="请输入原始登录密码">
      <span slot="left-icon" class="xIcon-pwd-cm"></span>
    </van-field>
    <van-cell-group>
      <van-field clearable type="password" v-model="new_pwd" placeholder="请输入新登录密码">
        <span slot="left-icon" class="xIcon-pwd-cm"></span>
      </van-field>
      <van-field clearable type="password" v-model="confirm_pwd" placeholder="请确认登录密码">
        <span slot="left-icon" class="xIcon-pwd-cm"></span>
      </van-field>
    </van-cell-group>
    <div class="btns">
      <van-button type="danger" @click="onChangePwsClick">确认修改</van-button>
    </div>
  </x-layout>
</template>

<script>
import { mapMutations } from "vuex";
import { verifyPwd } from "@/utils/verify.util.js";
import { SetPassword } from "@/api/user";
import { Logout } from "@/api";

import xBindPage from "cpt/x-bind-page.vue";

export default {
  components: {
    xBindPage
  },
  data() {
    return {
      phone: "",
      audio: 0,
      old_pwd: "",
      new_pwd: "",
      confirm_pwd: ""
    };
  },
  methods: {
    ...mapMutations(["clearUserInfo"]),
    async onChangePwsClick() {
      if (!this.old_pwd) {
        return this.$notify("请输入原登录密码");
      }
      let { psw } = ls("acnt");
      if (this.old_pwd !== psw) {
        return this.$notify("原登录密码有误");
      }
      let str_new_pwd_len = String(this.new_pwd).length;
      if (str_new_pwd_len < 6) {
        return this.$notify("密码不能低于6位");
      }
      if (str_new_pwd_len > 15) {
        return this.$notify("密码不能低于6位");
      }
      if (this.new_pwd !== this.confirm_pwd) {
        return this.$notify("两次密码输入不相符");
      }
      if (verifyPwd(this.new_pwd)) {
        let { ok, msg } = await SetPassword({
          psw_old: psw,
          psw_new: this.new_pwd
        });
        if (ok) {
          this.$notify({ type: "success", message: "密码修改成功" });
          this.clearUserInfo();
          Logout();
          this.$router.push("/login");
        }
      }
    }
  }
};
</script>

<style lang="scss">
.page-changepwd-root {
  background-color: $white;
  .van-cell__value {
    margin-left: 20px;
  }
  .tip {
    background-color: $baseBgColor;
    font-size: 12px;
    color: $txt;
    height: 34px;
    line-height: 34px;
    text-align: center;
  }
  .btns {
    text-align: center;
    .van-button {
      width: 290px;
      margin-top: 40px;
      border-radius: 5px;
    }
  }
}
</style>
