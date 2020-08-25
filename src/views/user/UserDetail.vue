<template>
  <!-- <x-page rootClass="userDetail"> </x-page> -->
  <x-layout modifier="userDetail">
    <x-header slot="header"/>

    <van-cell>
      <div class="avatarBar">
        <x-img :src="getAvatar" class="avatar" dft />
      </div>
      <div class="welc">欢迎您,{{ userInfo.nick }}</div>
    </van-cell>
    <van-cell-group>
      <van-cell title="真实姓名" class="noLink" :value="getBkInfo.owner | Name"></van-cell>
      <van-cell
        title="手机号码"
        :is-link="!userInfo.phone"
        :class="{ noLink: !!userInfo.phone }"
        :value="userInfo.phone | Phone"
        @click="userInfo.phone ? onBindPhoneClick() : $router.push('/user/bindPhone')"
      />
      <van-cell title="性别" is-link :value="userInfo.sex | Gander" to="/user/bindGender" />
      <van-cell title="银行卡号" is-link :value="getBkInfo.bknum | BankID" to="/user/bindCard" />
      <van-cell title="修改密码" is-link to="/user/changePwd" />
    </van-cell-group>
    <div class="vanBtnBar" v-if="userIdentity !== 0">
      <van-button type="danger" @click="onClickLogOut">退出当前账号</van-button>
    </div>
    
  </x-layout>
</template>

<script>
import { Logout } from '@/api'
import { mapGetters } from 'vuex'
// import { Login } from "@/api";

import xPage from 'cpt/x-page.vue'
import xImg from 'cpt/x-img.vue'

export default {
  components: {
    xPage,
    xImg
  },
  computed: {
    ...mapGetters(['userInfo', 'getAvatar', 'getBkInfo', 'userIdentity'])
  },
  methods: {
    async onClickLogOut() {
      let { ok, msg } = await Logout()
      if (ok) {
        this.$router.push('/home')
      }
    },
    onBindPhoneClick() {
      G.$dialog
        .confirm({
          title: '温馨提示',
          message: '若需要修改绑定手机号，请联系在线客服.',
          confirmButtonText: '联系客服'
        })
        .then(() => {
          this.$router.push('/service')
        })
        .catch(() => {})
    }
  },
  created() {
    // console.log(this.getBkInfo)
  }
}
</script>

<style lang="scss">
.page-userDetail-root {
  background-color: $white;
  .avatarBar {
    text-align: center;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      background-color: $avatarFill;
    }
  }
  .welc {
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: $txt;
  }
  .van-cell__value {
    color: $txt;
  }
  .noLink {
    .van-cell__value {
      margin-right: 21px;
    }
  }
  .vanBtnBar {
    text-align: center;
    margin-top: 40px;
    .van-button {
      width: 290px;
      border-radius: 5px;
    }
  }
}
</style>
