<template>
  <x-layout modifier="circle">
    <x-header :click-left="mainLeftClick" :leftArrow="false" :isRight="false" slot="header">
      <template #left>
        <x-img v-if="userInfo.ico && userInfo.ico !== 'ico.png'" :src="getAvatar" class="avatar" />
        <van-icon name="contact" v-else :info="countAllNewMsg || ''" color="white" />
      </template>

      <slot>
        <span @click="mainRightClick">
          <van-icon name="plus" color="white" />
        </span>
      </slot>
    </x-header>

    <x-tabs position type="card" border class="customVanTab" fixed :offset-top="44" v-model="circleActive">
      <x-tab title="发现">
        <x-list position v-model="loading" :finished="finished" :error.sync="error" @load="onloadFindMoments" :active="circleActive === 0">
          <x-circle-follow
            v-bind="{
              dataList: momentData,
              type: 'circle'
            }"
            @rewardPopupOpen="rewardPopupOpenFind"
            @loadData="onload"
          />
        </x-list>
      </x-tab>
      <x-tab title="关注">
        <template #tab-icon>
          <span class="new_follow_msg" v-if="new_follow_msg"></span>
        </template>

        <x-list
          position
          v-model="loading1"
          :finished="finished1"
          :error.sync="error1"
          @load="onloadFollowMoments"
          :active="circleActive === 1"
          v-if="!userInfo.guest"
        >
          <x-nodata desc="" :data-s="followMoments">
            <div class="tip">
              添加关注可以看到更多关注人的动态哦
            </div>
            <div class="btnBar">
              <van-button @click="circleActive = 0">去浏览</van-button>
            </div>
          </x-nodata>
          <x-circle-follow
            v-bind="{
              dataList: followMoments,
              type: 'circle'
            }"
            @rewardPopupOpen="rewardPopupOpenFollow"
            @loadData="onload"
          />
        </x-list>
        <x-nodata :data-s="followMoments" v-else-if="userInfo.guest">
          <div class="tip">
            您还未登录，登录后才能查看关注人的动态
          </div>
          <div class="btnBar">
            <van-button @click="$router.push('/sign')">去登录</van-button>
          </div>
        </x-nodata>
      </x-tab>
    </x-tabs>
    <!-- 打赏 -->
    <x-circle-reward :openDialog="openDialog" @rewardPopupConfirm="rewardPopupConfirm" @rewardPopupClose="rewardPopupClose" />
  </x-layout>
  <!-- <div class="page-circle-root"></div> -->
  <!-- <x-page isFooter active="1" closeBack rootClass="circle">
    
  </x-page> -->
</template>

<script>
import { getFindMoments, tippingMoment, getFollowMoments } from '@/api/circle'
import { mapGetters, mapMutations } from 'vuex'

import xHeader from 'cpt/x-header.vue'
import xImg from 'cpt/x-img.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xList from 'cpt/x-list/x-list.vue'
import xCircleFollow from 'cpt/x-circle-follow/x-circle-follow.vue'
import xNodata from 'cpt/x-nodata.vue'
import xCircleReward from 'cpt/x-circle-reward.vue'

export default {
  name: 'circle-page',
  components: {
    xHeader,
    xImg,
    xTabs,
    xTab,
    xList,
    xCircleFollow,
    xNodata,
    xCircleReward
  },
  data() {
    return {
      openDialog: false,

      loading: false,
      finished: false,
      error: false,

      loading1: false,
      finished1: false,
      error1: false,

      startIndex: 0,
      followStartIndex: 0,
      circleActive: 0,
      momentData: [], //发现圈列表
      followMoments: [], //关注圈列表
      new_follow_msg: true, // 关注圈是否有新动态
      titleIconInfo: 0,
      followType: 0, // +关注 已关注 取消关注 相互关注
      tipId: -1, // 打赏id
      tipIdx: 0, // 打赏单号 下标
      list_type: 'find', // 打赏当前哪一个列表的单子
      contentText: [],
      contentHidden: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity', 'getCircelNewMsg', 'getAvatar']),
    countAllNewMsg() {
      if (this.getCircelNewMsg) {
        let { unreadmsg, unreadtipm, unreadlike } = this.getCircelNewMsg
        return Number(unreadmsg || 0) + Number(unreadtipm || 0) + Number(unreadlike || 0)
      }
    }
  },
  watch: {
    circleActive(newValue, oldValue) {
      if (newValue === 0 && !this.momentData.length) {
        this.startIndex = 0
        this.getFindMoments()
      } else if (!this.followMoments.length) {
        this.followStartIndex = 0
        if (this.userIdentity !== 0) {
          this.getFollowMoments()
        }
      }
      if (newValue === 1) {
        this.new_follow_msg = false
      }
    }
  },
  methods: {
    ...mapMutations(['setCircelNewMsg']),
    onload() {
      if (this.circleActive === 0) {
        this.startIndex = 0
        this.getFindMoments()
      } else {
        this.followStartIndex = 0
        this.getFollowMoments()
      }
    },
    ...mapMutations(['setOwnUserInfo']),
    // 获取关注晒单列表
    async getFollowMoments(scroll) {
      const _tmp = {
        startind: this.followMoments.length
      }
      let { ok, msg } = await getFollowMoments(_tmp)
      if (ok) {
        if (msg.length === 0 && scroll) {
          this.finished1 = true
          return
        }
        let last_order_id = ls('last_order_id')
        if (msg[0]) {
          if (msg[0].id == last_order_id) this.new_follow_msg = false
          ls('last_order_id', msg[0].id)
        } else {
          this.new_follow_msg = false
        }
        this.followMoments.push(...msg)

        // this.followStartIndex++;
        this.loading1 = false
        this.$nextTick(() => {})
      }
    },
    // 加载关注
    onloadFollowMoments() {
      this.getFollowMoments(true)
    },
    // 加载发现
    onloadFindMoments() {
      this.getFindMoments(true)
    },
    // 获取发现圈晒单列表
    async getFindMoments(scroll) {
      const _tmp = {
        startind: this.momentData.length
      }
      let { ok, msg } = await getFindMoments(_tmp)
      if (ok) {
        // TODO 等待卡尔代码合并
        // if (msg.moments && msg.moments.length === 0 && scroll) {
        //   this.finished = true;
        // }
        // this.setCircelNewMsg({
        //   unreadmsg: msg.unreadmsg,
        //   unreadtip: msg.unreadtip,
        //   unreadlike: msg.unreadlike
        // });
        // this.momentData.push(...msg.moments);
        if (scroll) {
          if (msg.length === 0) this.finished = true
        }
        this.momentData.push(...msg)
        // this.startIndex++;
        this.loading = false
      }
    },
    // 菜单头部左侧点击跳转
    mainLeftClick() {
      const useinfo = {
        userid: this.userInfo.id,
        nick: this.userInfo.nick,
        icon: this.userInfo.icon
      }
      this.setOwnUserInfo(useinfo)
      this.$router.push(`/userInfo/userInfoCircle/?id=${this.userInfo.id}&nick=${this.userInfo.nick}`)
    },
    // 菜单头部右侧点击调整
    mainRightClick() {
      this.$router.push('/circle/dryingrelease')
    },
    // 菜单头部数字显示
    handleIcanInfo(value) {
      if (value <= 0) {
        return ''
      }
      if (value > 99) {
        return 99
      }
      return value
    },
    rewardPopupOpenFind({ id, idx }) {
      this.list_type = 'find'
      this.tipId = id
      this.tipIdx = idx
      this.openDialog = true
    },
    // 打开打赏窗口
    rewardPopupOpenFollow({ id, idx }) {
      this.list_type = 'follow'
      this.tipId = id
      this.tipIdx = idx
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
        this.startIndex = 0
        this.getFindMoments()
        this.$toast('打赏成功')
        if (this.list_type === 'find') {
          this.$set(this.momentData[this.tipIdx], 'tipcount', this.momentData[this.tipIdx].tipcount + 1)
        } else {
          this.$set(this.followMoments[this.tipIdx], 'tipcount', this.followMoments[this.tipIdx].tipcount + 1)
        }
      } else {
        G.$dialog.alert({
          message: msg
        })
      }
    }
  },
  mounted() {
    if (!ls('last_order_id')) this.new_follow_msg = false
    G.delay(() => {
      this.getFindMoments()
    }, 500)
  },
  activated() {
    if (this.getFindMoments.length === 0) return
    if (this.circleActive === 0) {
      this.momentData.length = 0
      this.getFindMoments()
    } else {
      this.followMoments.length = 0
      this.getFollowMoments()
    }
  }
}
</script>

<style lang="scss">
.page-circle-root {
  padding-bottom: 48px;
  .van-nav-bar__left {
    display: flex;
    align-items: center;
    justify-content: center;
    .avatar {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .van-nav-bar__left {
    // padding: 0 10px;
    padding-right: 10px;
  }
  .characteristic-1 {
    .tab-icon {
      display: inline;
      vertical-align: top;
      .new_follow_msg {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        overflow: hidden;
        vertical-align: text-top;
        background-color: $rootColor;
      }
    }
  }
  .xh-right {
    padding: 5px 10px;
  }
  .xt-middle {
    background-color: $white;
  }
  .customVanTab {
    background-color: #fff;
  }
  .van-tab {
    font-size: 15px !important;
  }
  .van-tabs__nav--card {
    background-color: #fff;
    margin: 0;
  }
  .guest {
    padding-top: 47px;
  }
  .tip {
    text-align: center;
    font-size: 13px;
    color: $txt;
  }
  .btnBar {
    text-align: center;
    padding-top: 46px;
  }
  .x-nodata {
    .tip {
      line-height: 100px;
    }
    .btnBar {
      line-height: 1;
    }
  }
}
</style>
