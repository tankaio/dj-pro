<template>
  <div class="page-UserInfoCircle-root">
    <x-tabs ref="tabs" v-model="tabIndex" position>
      <x-tab :title="getIsUser ? '我的圈子' : '他的圈子'">
        <x-list
          position
          v-model="loadingMoment"
          :error.sync="errorMoment"
          :finished="finishedMoment"
          :active="tabIndex === 0"
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
      <x-tab :title="getIsUser ? '我的点赞' : '他的点赞'">
        <x-list
          position
          v-model="loadingLikes"
          :error.sync="errorLikes"
          :finished="finishedLikes"
          :active="tabIndex === 1"
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
      <x-tab title="我的消息" v-if="!id">
        <div class="gray-8">
          <van-cell title="打赏" is-link @click="linkTo('unreadtipm')">
            <van-tag round type="danger" v-show="rewardNews">
              {{ rewardNews }}
            </van-tag>
            <van-icon name="balance-o" slot="icon" />
          </van-cell>
          <van-cell title="评论" is-link @click="linkTo('unreadmsg')">
            <van-tag round type="danger" v-show="commentNews">
              {{ commentNews }}
            </van-tag>
            <van-icon name="chat-o" slot="icon" />
          </van-cell>
          <van-cell title="点赞" is-link @click="linkTo('unreadlike')">
            <van-tag round type="danger" v-show="thumbsUpNews">
              {{ thumbsUpNews }}
            </van-tag>
            <van-icon name="like-o" slot="icon" />
          </van-cell>
        </div>
      </x-tab>
    </x-tabs>

    <!-- 举报 -->
    <van-action-sheet v-model="sheetShow" :actions="sheetActions" cancel-text="取消" @cancel="sheetShow = false" @select="sheetSelect" />
    <!-- 打赏 -->
    <x-circle-reward :openDialog="openDialog" @rewardPopupConfirm="rewardPopupConfirm" @rewardPopupClose="rewardPopupClose" />
  </div>
</template>

<script>
import { getPlayerMomentInfo, tippingMoment, getLikeMomentList, followSomebody } from '@/api/circle'

import { mapGetters, mapMutations } from 'vuex'

import xNodata from 'cpt/x-nodata.vue'
import xCircleFollow from 'cpt/x-circle-follow/x-circle-follow.vue'
import xFollowBtnGroup from 'cpt/x-circle-follow/x-follow-btn-group.vue'
import xImg from 'cpt/x-img.vue'
import xCircleReward from 'cpt/x-circle-reward.vue'
import xList from 'cpt/x-list/x-list.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
export default {
  components: { xTabs, xTab, xList, xNodata, xCircleFollow, xFollowBtnGroup, xImg, xCircleReward },
  data() {
    return {
      tabIndex: 0,

      loadingMoment: false,
      errorMoment: false,
      finishedMoment: false,

      loadingLikes: false,
      errorLikes: false,
      finishedLikes: false,

      momentData: [],
      likesData: [],

      id: '',
      list_type: 'find',

      openDialog: false,
      sheetShow: false,
      sheetActions: [
        {
          name: '举报'
        }
      ]
    }
  },
  watch: {
    tabIndex(newValue, oldValue) {
      if (newValue === 0 && !this.momentData.length) {
        this.getPlayerMomentInfos()
      } else if (!this.likesData.length) {
        this.getLikeMomentList()
      }
    },
    id(news) {
      console.log(news)
      this.$refs.tabs.refresh()
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity', 'getCircelNewMsg']),
    getIsUser() {
      if (!this.id) return true
      if (parseInt(this.userInfo.id) === parseInt(this.id)) {
        return true
      } else {
        return false
      }
    },
    commentNews() {
      if (this.getCircelNewMsg) return this.getCircelNewMsg.unreadmsg
    },
    thumbsUpNews() {
      if (this.getCircelNewMsg) return this.getCircelNewMsg.unreadlike
    },
    rewardNews() {
      if (this.getCircelNewMsg) return this.getCircelNewMsg.unreadtipm
    }
  },
  methods: {
    ...mapMutations(['setReportParam', 'setCircelNewMsg', 'setCircelNewMsgReaded']),
    linkTo(type) {
      switch (type) {
        case 'unreadmsg':
          this.$router.push('/circle/circleMessageComment')
          break
        case 'unreadtipm':
          this.$router.push('/circle/circleMessageReward')
          break
        case 'unreadlike':
          this.$router.push('/circle/circleMessageThumbsUp')
          break
        default:
          break
      }
      this.setCircelNewMsgReaded(type)
    },
    async getPlayerMomentInfos(scroll) {
      const params = {
        startind: this.momentData.length,
        userid: parseInt(!!this.id ? this.id : this.userInfo.id)
      }
      let { ok, msg } = await getPlayerMomentInfo(params)
      if (ok) {
        this.loadingMoment = false
        let getData = G.curry(G.get)(msg)
        // TODO 这些数据需要修改
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

        if (scroll) {
          this.momentData.push(...msg.moments)
          if (!msg.moments.length) return (this.finishedMoment = true)
        } else {
          this.momentData = msg.moments || []
        }
      } else {
        this.errorMoment = true
      }
    },
    // 获取点赞信息
    async getLikeMomentList(scroll) {
      const _tmp = {
        startind: this.likesData.length,
        userid: parseInt(!!this.id ? this.id : this.userInfo.id)
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
    rewardPopupOpenFind({ id, idx }) {
      this.list_type = 'find'
      this.tipIdx = idx
      this.tipId = id
      this.openDialog = true
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
    next(vm => {
      let { id, nick } = to.query
      vm.id = id
      vm.getPlayerMomentInfos()
    })
  },
  beforeRouteUpdate(to, from, next) {
    let { id, nick } = to.query
    this.id = id
    this.$root.animateDelay(() => this.getPlayerMomentInfos())
    next()
  }
}
</script>

<style lang="scss">
.page-UserInfoCircle-root {
  .van-icon {
    display: flex;
    align-items: center;
  }
  .van-cell__title {
    margin-left: 10.5px;
  }
}
</style>
