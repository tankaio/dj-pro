<template>
  <x-layout modifier="login">
    <x-header is-right slot="header" />
    <van-field placeholder="请输入用户名(6-12位数字字母组合" clearable v-model="user_name" @blur="unameBlur">
      <span slot="left-icon" class="xIcon-user-cm"></span>
    </van-field>
    <van-field placeholder="请设置密码(6-15位数字字母混合" type="password" v-model="pwd" clearable @blur="pwdBlur">
      <span slot="left-icon" class="xIcon-pwd-cm"></span>
    </van-field>
    <van-field placeholder="请再一次输入您的密码" type="password" v-model="pwd2" clearable @blur="pwdConfirmBlur">
      <span slot="left-icon" class="xIcon-pwd-cm"></span>
    </van-field>
    <van-field placeholder="请输入11位手机号码" type="tel" v-model="phone" clearable>
      <span slot="left-icon" class="xIcon-phone-cm"></span>
    </van-field>
    <van-field type="tel" class="verifyCode" placeholder="请输入正确的验证码" v-model="verify_code" clearable>
      <span slot="left-icon" class="xIcon-key-cm"></span>
      <van-image :src="verify_code_url" @click="onClickGetVerifyCode" slot="button"></van-image>
    </van-field>
    <van-field placeholder="请输入您收到的短信验证码" type="number" v-model="auth_code" clearable v-if="false">
      <span slot="left-icon" class="xIcon-auth-cm"></span>
      <van-button slot="button" size="small" type="danger" @click="verifycodeClick">获取验证码</van-button>
    </van-field>
    <van-field v-if="is_welc_code" placeholder="请输入邀请码" type="number" v-model="welc_code" class="van-hairline--bottom">
      <span slot="left-icon" class="xIcon-welc-cm"></span
    ></van-field>
    <div class="buttonGroup">
      <div class="tipBar">
        <div v-if="!is_welc_code" class="isWelcCode" @click="is_welc_code = true">
          我有注册邀请码
        </div>
      </div>
      <van-button type="danger" @click="onClickLoginAndSign">
        注册并登录
      </van-button>
      <van-button type="danger" plain @click="$router.replace('/sign')"> 已有账号?<i class="special">登陆</i> </van-button>
    </div>
  </x-layout>
  <!-- <x-page rootClass="login"> </x-page> -->
</template>

<script>
import { Regist } from '@/api'
import { getVerifyCode, verifyUserName, verifyUserPwd, verifyMessage, verifyPhone } from '@/utils/verify.util.js'
import constant from '@/utils/http/constant.js'
import xPage from 'cpt/x-page.vue'
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xPage,
    xHeader
  },
  data() {
    return {
      user_name: '',
      pwd: '',
      pwd2: '',
      phone: '',
      auth_code: '',
      welc_code: '',
      is_welc_code: false,
      verify_code: '',
      verify_code_url: '',
      random: ''
    }
  },
  methods: {
    unameBlur() {
      if (!verifyUserName(this.user_name)) return
    },
    pwdBlur() {
      if (!verifyUserPwd(this.pwd)) return
    },
    pwdConfirmBlur() {
      if (this.pwd !== this.pwd2) return this.$notify('两次密码输入不相符')
    },
    verifycodeClick() {
      if (!verifyPhone(this.phone)) return
    },
    onClickLoginAndSign() {
      if (!verifyUserName(this.user_name)) return
      if (!verifyUserPwd(this.pwd)) return
      if (this.pwd !== this.pwd2) return this.$notify('两次密码输入不相符')
      if (!verifyMessage(this.verify_code)) return

      let params = {
        id: this.user_name,
        psw: this.pwd,
        phone: this.phone,
        ver: constant.curver,
        verify: this.verify_code,
        random: this.random
      }

      let sign = async () => {
        let { ok, msg } = await Regist(params)
        if (ok) {
          this.$store.commit('setUserInfo', msg)
          this.$router.push('/home')
        } else {
          this.$notify(msg)
          this.onClickGetVerifyCode()
        }
      }
      // 邀请码
      if (this.is_welc_code) {
        params.ag = this.welc_code
        G.$dialog
          .confirm({
            title: '提醒',
            message: `您的推荐人为${'xxx'},如确认无误点击"确认"完成注册,可在个人中心查看您的推荐人信息`
          })
          .then(() => {
            sign()
          })
          .catch(() => {})
      } else {
        sign()
      }
    },
    onClickGetVerifyCode() {
      getVerifyCode().then(({ verify_code: verify_code_url, random }) => {
        this.random = random
        this.verify_code_url = verify_code_url
      })
    }
  },
  created() {
    this.onClickGetVerifyCode()
  }
}
</script>

<style lang="scss">
.page-login-root {
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
