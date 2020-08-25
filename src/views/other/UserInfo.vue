<template>
  <x-layout modifier="userInfo" :main-top="168">
    <template #header>
      <x-header :center-text="self ? '我的' : '用户信息'" />
      <div class="userHeader">
        <x-img :src="ico" dft class="avatar" />
        <div class="userInfo">
          <div class="top">
            <span class="username">{{ username }}</span>
            <span :class="gender | Gander('icon')" v-if="gender !== -1"></span>
            <span class="xIcon-specialist" v-if="specialist"></span>
          </div>
          <div class="bottom">
            <span class="fans">粉丝:{{ fans }}</span>
            <span class="follow">关注:{{ follow }}</span>
          </div>
          <div class="money" v-if="userSelfInfo">
            <span class="userMoneyItem">
              <span class="xIcon-integral-money"></span>
              <span>积分:{{ integral }}</span>
            </span>
            <span class="userMoneyItem">
              <span class="xIcon-gold-money"></span>
              <span>金币:{{ glod }}</span>
            </span>
          </div>
        </div>
        <div class="cancelFollow">
          <van-button
            type="danger"
            size="small"
            @click="$router.push('/circle/dryingrelease')"
            v-if="$route.path.indexOf('/userInfo/userInfoCircle') !== -1"
          >
            发布晒单
          </van-button>
          <template v-else>
            <van-button type="danger" size="small" v-if="userSelfInfo" @click="$router.push('/publish')">
              发布计划
            </van-button>
            <van-button v-else type="danger" size="small" @click="followUser">
              {{ attention ? '取消关注' : '+关注' }}
            </van-button>
          </template>
        </div>
      </div>
      <div class="routerNavbar">
        <router-link :class="{ ['router-link-active']: $route.path.includes('userInfoPlan') }" :to="`/userInfo/userInfoPlan${computedQuery}`" replace>
          计划发布
        </router-link>
        <router-link
          :class="{ ['router-link-active']: $route.path.includes('userInfoCircle') }"
          :to="`/userInfo/userInfoCircle${computedQuery}`"
          replace
        >
          晒单圈
        </router-link>
        <router-link
          :class="{ ['router-link-active']: $route.path.includes('UserInfoLiuHe') }"
          :to="`/userInfo/UserInfoLiuHe${computedQuery}`"
          replace
        >
          六合头条
        </router-link>
        <router-link
          :class="{ ['router-link-active']: $route.path.includes('UserInfoPicture') }"
          :to="`/userInfo/UserInfoPicture${computedQuery}`"
          replace
        >
          六合图库
        </router-link>
      </div>
    </template>
    <transition mode="" :appear="false" enter-active-class="fadeIn animated faster" leave-active-class="fadeOut animated faster">
      <router-view />
    </transition>
  </x-layout>
  <!-- <div class="page-userInfo-root"></div> -->
</template>

<script>
import { followUser, getGetUserDetail } from '@/api/home'
import { mapGetters, mapMutations } from 'vuex'
import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'
import xImg from 'cpt/x-img.vue'

export default {
  components: {
    xHeader,
    xFixed,
    xImg
  },
  data() {
    return {
      username: '',
      fans: 0,
      follow: 0,
      integral: 0,
      glod: 0,
      attention: true,
      specialist: false,
      gender: '',
      ico: '',
      self: '',

      id: '',
      params_nick: ''
    }
  },
  methods: {
    async followUser() {
      let params = {
        nick: this.username,
        follow: !this.attention
      }
      let { ok, msg } = await followUser(params)
      if (ok) {
        this.attention = G.get(msg, 'followed', this.attention)
      }
    },
    async getGetUserDetail() {
      let { ok, msg } = await getGetUserDetail({
        nick: this.username
      })
      if (ok) {
        let getUserInfo = G.curry(G.get)(msg)
        this.follow = getUserInfo('follow', 0)
        this.fans = getUserInfo('fans', 0)
        this.ico = getUserInfo('ico', '')
        this.specialist = getUserInfo('level', 0) === 1
        this.gender = getUserInfo('sex', 'male')
        this.attention = getUserInfo('followed ', false)
      }
    },
    preInspectSelf(nick) {
      if (nick) {
        this.username = nick
        this.self = false
      }
    },
    init(nick) {
      if (nick) {
        this.self = false
        this.getGetUserDetail()
      } else {
        this.self = true
      }
    },
    judgeModule() {
      if (this.$route.path.indexOf('/userInfo/userInfoCircle') !== -1) {
        // 晒单
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getAvatar']),
    userSelfInfo() {
      if (this.self === true) {
        this.integral = this.userInfo.balan_m
        this.glod = this.userInfo.balan_c
        this.fans = this.userInfo.fans
        this.follow = this.userInfo.follow
        this.username = this.userInfo.nick
        this.gender = this.userInfo.sex === 1 ? 'male' : 'female'
        this.specialist = this.userInfo.level === 1
        this.ico = this.getAvatar
        return true
      }
      return false
    },
    computedQuery() {
      let query = '/?'
      if (!G.isEmpty(this.id)) {
        query += `id=${this.id}&`
      }
      if (!G.isEmpty(this.params_nick)) {
        query += `nick=${this.params_nick}`
      }
      if (query == '/?') return ''
      return query
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      let { id, nick } = to.query
      vm.id = id
      vm.params_nick = nick
      vm.preInspectSelf(nick)
      vm.$root.animateDelay(() => vm.init(nick))
    })
  },
  beforeRouteUpdate(to, from, next) {
    let { id, nick } = to.query
    this.id = id
    this.params_nick = nick
    this.preInspectSelf(nick)
    this.$root.animateDelay(() => this.init(nick))
    next()
  }
}
</script>

<style lang="scss">
.page-userInfo-root {
  .fill_center {
    display: flex;
    > * {
      flex: 1;
      height: 100%;
      width: 375px;
      min-width: 375px;
      max-width: 375px;
      overflow: hidden;
      position: relative;
    }
  }
  .userHeader {
    display: flex;
    padding: 5px 10px;
    align-items: center;
    background-color: $white;
    height: 70px;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
    }
    .userInfo {
      flex: 1;
      padding: 0 10px;
      .top {
        font-size: 13px;
        color: $txt;
        display: flex;
        align-items: center;
        > * {
          margin-right: 5px;
        }
      }
      .username {
        font-weight: 600;
        font-size: 15px;
      }
      // .username{
      //   margin-right: 5px;
      // }
      // .xIcon-male-gender {
      //   margin: 0 5px;
      // }
      // .specialist {
      //   box-sizing: border-box;
      //   background-color: $rootColor;
      //   border-radius: 2px;
      //   width: 16px;
      //   height: 16px;
      //   color: $white;
      //   text-align: center;
      //   font-size: 10px;
      //   line-height: 16px;
      // }
      .bottom {
        margin: 5px 0;
        > * {
          font-size: 13px;
          color: $txt;
        }
        .fans {
          margin-right: 20px;
        }
      }
      .money {
        color: $gray-66;
        display: flex;
        .userMoneyItem {
          line-height: 1;
          flex: 1;
          display: flex;
          align-items: center;
          > * {
            white-space: nowrap;
            font-size: 11px;
          }
          > span:nth-child(1) {
            margin-right: 5px;
          }
        }
      }
    }
    .cancelFollow {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .xf-container {
    padding-bottom: 8px;
    background-color: $gray-f5;
    box-sizing: border-box;
  }
  .routerNavbar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
    background-color: $white;
    > * {
      height: 34px;
      line-height: 34px;
      text-align: center;
      color: $rootColor;
      width: 85px;
      box-sizing: border-box;
      border: 1px solid $rootColor;
      border-left: none;
      font-size: 15px;
      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      &:nth-child(1) {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-left: 1px solid $rootColor;
      }
    }
    .router-link-active {
      color: white;
      background-color: $rootColor;
    }
  }
  .main {
    position: relative;
  }
}
</style>
