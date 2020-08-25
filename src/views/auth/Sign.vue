<template>
  <!-- <x-page rootClass="sign"> </x-page> -->
  <x-layout modifier="sign">
    <x-header is-right slot="header" />
    <van-field placeholder="请输入用户名" v-model="user_name" clearable>
      <span slot="left-icon" class="xIcon-user-cm"></span>
    </van-field>
    <van-field placeholder="请输入密码" :type="lock" v-model="pwd" clearable>
      <span slot="left-icon" class="xIcon-pwd-cm"></span>
      <span v-if="lock == 'password'" slot="right-icon" class="xIcon-unlock-cm" @click="lock = 'text'"></span>
      <span v-else slot="right-icon" class="xIcon-lock-cm" @click="lock = 'password'"></span>
    </van-field>
    <van-field v-if="needverify" placeholder="请输入验证码" class="van-hairline--bottom verifyCode" v-model="key" clearable type="tel">
      <span slot="left-icon" class="xIcon-key-cm"></span>
      <van-image :src="verify_code_url" @click="onClickGetVerifyCode" slot="button"></van-image>
    </van-field>
    <div class="buttonGroup">
      <div class="tipBar">
        <div class="tip" @click="onClickForgetPwd">
          忘记密码?
        </div>
      </div>
      <van-button type="danger" @click="onSign">
        登录
      </van-button>
      <van-button type="danger" plain @click="$router.replace('/login')">
        注册
      </van-button>
    </div>
  </x-layout>
</template>

<script>
import { Login } from '@/api'
import { getVerifyCode } from '@/utils/verify.util.js'
import constant from '@/utils/http/constant.js'
import xPage from 'cpt/x-page.vue'
// import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xPage
    // xHeader
  },
  data() {
    return {
      user_name: '',
      pwd: '',
      key: '',
      lock: 'password',
      random: '',
      verify_code_url: '',
      needverify: false
    }
  },
  methods: {
    async onSign() {
      if (this.user_name === '') return this.$notify('请输入用户名')
      if (this.pwd === '') return this.$notify('请输入登录密码')
      if (this.needverify && this.verify_code_url === '') return this.$notify('请输入验证码')
      let params = {
        id: this.user_name,
        psw: this.pwd,
        ver: constant.curver
      }
      if (this.needverify) {
        params.verify = this.key
        params.random = this.random
      }
      let { ok, msg } = await Login(params)
      if (ok) {
        // 登陆错误提醒
        if (msg.remark) {
          this.$notify(msg.remark)
          this.needverify = G.get(msg, 'needverify', false)
          this.onClickGetVerifyCode()
        } else {
          this.$store.commit('setUserInfo', msg)
          ls('acnt', {
            id: this.user_name,
            psw: this.pwd
          })
          this.$router.push('/home')
        }
      } else {
        this.$notify(msg)
        if (!this.this.needverify) {
          // 无需输入验证码时如用户名、密码 验证错误提示后清空密码输入框内容；
          this.user_name = ''
          this.pwd = ''
        } else if (this.this.needverify) {
          // 需要输入验证码时首先验证验证码是否正确，如果验证错误，弹出提示后清空验证码输入框并刷新验证码
          this.onClickGetVerifyCode()
        }
        // 3.需要输入验证码时，验证码校验成功，用户名、密码校验失败时，弹出
      }
    },
    async onClickGetVerifyCode() {
      let { verify_code: verify_code_url, random } = await getVerifyCode()
      this.random = random
      this.verify_code_url = verify_code_url
    },
    onClickForgetPwd() {
      G.$dialog
        .confirm({
          title: '找回密码',
          message: '请联系客服找回密码'
        })
        .then(() => {
          this.$router.replace('/service')
        })
        .catch(() => {})
    }
  },
  created() {
    this.onClickGetVerifyCode()
  }
}
</script>

<style lang="scss">
.page-sign-root {
  .verifyCode {
    .van-field__left-icon {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .van-field__button {
      display: flex;
      align-items: center;
    }
  }
}
</style>
