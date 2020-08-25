<template>
  <x-layout modifier="circleOwn" :main-top="getIsUser ? 167 : 191">
    <template #header>
      <x-header :center-text="nick" :isRight="false">
        <span v-if="getIsUser" @click="handleMessage">
          <van-icon name="bell" color="white" v-if="countAllNewMsg" :info="countAllNewMsg || ''" />
        </span>
        <span v-else @click="sheetShow = true">
          <van-icon name="ellipsis" color="white" />
        </span>
      </x-header>
      <div class="vandivTop">
        <x-img :src="icon" class="avatar" dft />
        <span v-if="level == 1" class="xIcon-specialist" />
        <span class="sex" v-if="sex !== -1" :class="sex | Gander('icon')" />
      </div>

      <div class="followBar">
        <x-follow-btn-group class="xc__btn-bar" :isfollow="isfollow" :userid="id" @follow="handleAddFollow" />
      </div>

      <van-grid class="followAndFans" :column-num="2">
        <van-grid-item @click="handleFans"> 粉丝:{{ fans }} </van-grid-item>
        <van-grid-item @click="handleFollow"> 关注:{{ follows }} </van-grid-item>
      </van-grid>
    </template>

    <x-tabs :offset-top="getIsUser ? 167 : 191" :fixed="false" position v-model="tabActive" class="customVanTab" animated>
      <x-tab :title="`${getIsUser ? '我的' : '他的'}圈子`">
        <x-list
          position
          v-model="loadingMoment"
          :error.sync="errorMoment"
          :finished="finishedMoment"
          :active="tabActive === 0"
          @load="getPlayerMomentInfos(true)"
        >
          <x-nodata :data-s="momentData" :tip="`${getIsUser ? '我' : '他'}还未发布任何状态`" />
          <x-circle-follow
            v-bind="{
              dataList: momentData,
              type: 'circleOwn',
              isCloseRt: true
            }"
            @loadData="getPlayerMomentInfos"
            @rewardPopupOpen="rewardPopupOpenFind"
          />
        </x-list>
      </x-tab>
      <x-tab :title="`${getIsUser ? '我的' : '他的'}点赞`">
        <x-list
          position
          v-model="loadingLikes"
          :error.sync="errorLikes"
          :finished="finishedLikes"
          :active="tabActive === 1"
          @load="getLikeMomentList(true)"
        >
          <x-nodata :data-s="likesData" :tip="`${getIsUser ? '我' : '他'}还没有喜欢的内容`" />
          <x-circle-follow
            v-bind="{
              dataList: likesData,
              type: 'circleOwn',
              isCloseRt: true
            }"
            @loadData="getLikeMomentList"
            @rewardPopupOpen="rewardPopupOpenFollow"
          />
        </x-list>
      </x-tab>
    </x-tabs>
    <!-- <x-tabs :offset-top="44">
      <x-tab> </x-tab>
      <x-tab> </x-tab>
    </x-tabs> -->

    <!-- 举报 -->
    <van-action-sheet v-model="sheetShow" :actions="sheetActions" cancel-text="取消" @cancel="sheetShow = false" @select="sheetSelect" />
    <!-- 打赏 -->
    <x-circle-reward :openDialog="openDialog" @rewardPopupConfirm="rewardPopupConfirm" @rewardPopupClose="rewardPopupClose" />
  </x-layout>
</template>

<script>
import Http from '@/utils/http/index.ws.js'
import { getPlayerMomentInfo, tippingMoment, getLikeMomentList, followSomebody } from '@/api/circle'
import { mapGetters, mapMutations } from 'vuex'

import xHeader from 'cpt/x-header.vue'
import xImg from 'cpt/x-img.vue'
import xFollowBtnGroup from 'cpt/x-circle-follow/x-follow-btn-group.vue'
import xList from 'cpt/x-list/x-list.vue'
import xNodata from 'cpt/x-nodata.vue'
import xCircleFollow from 'cpt/x-circle-follow/x-circle-follow.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xCircleReward from 'cpt/x-circle-reward.vue'

export default {
  components: {
    xHeader,
    xImg,
    xFollowBtnGroup,
    xList,
    xNodata,
    xCircleFollow,
    xTabs,
    xTab,
    xCircleReward
  },
  filters: {},
  data() {
    return {
      id: '',

      loading: false,
      finished: false,
      error: false,

      nick: '',
      sex: -1,
      level: 0,
      follows: '',
      fans: '',
      isfollow: 0,
      icon: '',

      // unreadmsg: 0, // 最新留言
      // unreadtip: 0, // 最新打赏
      // unreadlike: 0, // 最新点赞
      // newInfosCount: 0, // 总消息数

      loadingMoment: false,
      errorMoment: false,
      finishedMoment: false,

      loadingLikes: false,
      errorLikes: false,
      finishedLikes: false,

      momentIndex: 0,
      likesIndex: 0,

      tabActive: 0,
      openDialog: false,
      list_type: 'find',
      momentData: [],
      likesData: [],
      sheetShow: false,
      sheetActions: [
        {
          name: '举报'
        }
      ]
    }
  },
  watch: {
    tabActive(newValue, oldValue) {
      if (newValue === 0 && !this.momentData.length) {
        this.getPlayerMomentInfos()
      } else if (!this.likesData.length) {
        this.getLikeMomentList()
      }
    }
  },

  computed: {
    ...mapGetters(['userInfo', 'userIdentity', 'getCircelNewMsg']),
    getIsUser() {
      if (parseInt(this.userInfo.id) === parseInt(this.id)) {
        return true
      } else {
        return false
      }
    },
    countAllNewMsg() {
      if (this.getCircelNewMsg) {
        let { unreadmsg, unreadtipm, unreadlike } = this.getCircelNewMsg
        return Number(unreadmsg || 0) + Number(unreadtipm || 0) + Number(unreadlike || 0)
      }
    }
  },
  methods: {
    ...mapMutations(['setReportParam', 'setCircelNewMsg']),
    // 添加关注
    handleAddFollow() {
      if (this.isfollow === 0 || this.isfollow === 2) {
        this.followSomebody(this.nick, true)
        this.$toast('已关注')
      } else if (this.isfollow === 1 || this.isfollow === 3) {
        G.$dialog
          .confirm({ message: '确认不在关注？' })
          .then(() => {
            this.followSomebody(this.nick, false)
            this.$toast('已取关')
          })
          .catch(() => {})
      }
    },
    // 关注取消关注接口
    async followSomebody(nick, follow) {
      let _data = {
        nick: nick,
        follow: follow
      }
      let { ok, msg } = await followSomebody(_data)
      if (ok) {
        switch (this.isfollow) {
          case 0:
            this.fans++
            this.isfollow = 1
            break
          case 1:
            this.fans--
            this.isfollow = 0
            break
          case 2:
            this.fans++
            this.isfollow = 3
            break
          case 3:
            this.fans--
            this.isfollow = 2
            break
          default:
            break
        }
      }
    },
    // 获取圈子信息
    async getPlayerMomentInfos(scroll) {
      const _tmp = {
        startind: this.momentData.length,
        userid: parseInt(this.id)
      }
      let { ok, msg } = await getPlayerMomentInfo(_tmp)
      if (ok) {
        this.loadingMoment = false
        let getData = G.curry(G.get)(msg)

        this.sex = getData('sex', -1)
        this.follows = getData('follows', '')
        this.fans = getData('fans', '')
        this.nick = getData('nick', '')
        this.level = getData('level', 0)
        this.isfollow = getData('isfollow', 0)
        this.icon = getData('icon', '')
        let unreadmsg = getData('unreadmsg', 0)
        let unreadtip = getData('unreadtip', 0)
        let unreadlike = getData('unreadlike', 0)
        this.setCircelNewMsg({
          unreadmsg,
          unreadtip,
          unreadlike
        })
        // this.newInfosCount = this.unreadmsg + this.unreadtip + this.unreadlike;
        if (scroll) {
          this.momentData.push(...msg.moments)
          if (!msg.moments.length) return (this.finishedMoment = true)
        } else {
          this.momentData = msg.moments || []
        }
        // this.momentIndex++;
      } else {
        this.errorMoment = true
      }
    },
    // 获取点赞信息
    async getLikeMomentList(scroll) {
      const _tmp = {
        startind: this.likesData.length,
        userid: parseInt(this.id)
      }
      let { ok, msg } = await getLikeMomentList(_tmp)
      if (ok) {
        if (scroll) {
          this.likesData.push(...msg)
          if (!msg.length) return (this.finishedLikes = true)
        } else {
          this.likesData = msg
        }
        this.loadingLikes = false
        // this.likesIndex++;
      } else {
        this.errorLikes = true
      }
    },
    rewardPopupOpenFind({ id, idx }) {
      this.list_type = 'find'
      this.tipIdx = idx
      this.tipId = id
      this.openDialog = true
    },
    // 打开打赏窗口
    rewardPopupOpenFollow({ id, idx }) {
      this.list_type = 'follow'
      this.tipIdx = idx
      this.tipId = id
      this.openDialog = true
    },
    // 关闭窗口
    rewardPopupClose() {
      this.openDialog = false
    },
    // 确认打赏
    async rewardPopupConfirm(score) {
      this.openDialog = false
      if (this.tipId === -1) {
        return
      }
      if (Number(this.userInfo.balan_m || 0) < Number(score)) {
        G.$confirm({
          title: '提醒',
          message: '账户积分不足，请充值!'
        })
          .then(() => {
            this.$router.push('/user/integral')
          })
          .catch(G.zero)
      }
      let _tmp = {
        id: this.tipId,
        amount: score
      }
      let { ok, msg } = await tippingMoment(_tmp)
      if (ok) {
        this.$toast('打赏成功')
        if (this.list_type === 'find') {
          this.$set(this.momentData[this.tipIdx], 'tipcount', this.momentData[this.tipIdx].tipcount + 1)
        } else {
          this.$set(this.likesData[this.tipIdx], 'tipcount', this.likesData[this.tipIdx].tipcount + 1)
        }
      } else {
        G.$dialog.alert({
          message: msg
        })
      }
    },
    // 点击消息图标
    handleMessage() {
      this.$router.push('/circle/circleMessage')
    },
    // 关注
    handleFollow() {
      this.$router.push(`/user/follow/${this.getIsUser ? '' : this.nick}`)
    },
    // 粉丝
    handleFans() {
      this.$router.push(`/user/fans/${this.getIsUser ? '' : this.nick}`)
    },
    // 举报
    sheetSelect(item, index) {
      const params = {
        id: 0,
        illegalid: this.id // 被举报人 id
      }
      this.setReportParam(params)
      this.$router.push('/circle/circleReport')
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      vm.id = to.params.id
      vm.getPlayerMomentInfos()
    })
  }
}
</script>

<style lang="scss">
.page-circleOwn-root {
  .xl-header {
    background-color: $white;
  }
  .xt-middle {
    background-color: $white;
  }
  .customVanTab {
    background-color: #fff;
    position: absolute;
    @include abs;
  }
  .van-tab {
    font-size: 15px !important;
  }
  .van-tabs__nav--card {
    background-color: #fff;
    margin: 0;
  }
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
  }
  .vandivTop {
    padding-top: 10px;
    text-align: center !important;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .sex,
    .xIcon-specialist {
      position: absolute;
    }
    .xIcon-specialist {
      margin-left: 48px;
    }
    .sex {
      margin-left: 71px;
    }
  }

  .followAndFans {
    font-size: 13px;
    &::after {
      border-width: 0;
    }
    .van-grid-item__content {
      padding-top: 15px;
      padding-bottom: 15px;
      &::after {
        border-width: 0;
      }
    }
  }
  .followBar {
    text-align: center;
  }
}
</style>
