<template>
  <x-layout modifier="dryingListDetails">
    <template #header>
      <x-header>
        <span v-if="isFlag" @click="reportPopShow = true">
          <van-icon name="ellipsis" color="white" />
        </span>
      </x-header>
    </template>
    <!-- 晒单详情 -->
    <van-cell class="cellInfo">
      <div class="center">
        <div class="avatar-bar" @click="handlerImgClick(detailMoment)">
          <x-img :src="detailMoment.icon" class="avatar" dft />
        </div>
        <div class="xc__infos">
          <div class="xc__infos-top">
            <span class="xc__nick" @click="handlerImgClick(detailMoment)">
              {{ detailMoment.nick }}
            </span>
            <span v-if="detailMoment.level == 1" class="xIcon-specialist" />
          </div>
          <div class="xc__infos-bottom">
            <span class="xc__time">
              {{ detailMoment.time | timestampdispose }}
            </span>
          </div>
        </div>

        <div v-if="isFlag" class="rights">
          <x-follow-btn-group
            class="xc__btn-bar"
            :isfollow="detailMoment.isfollow"
            :userid="getDetailsParams.userid"
            @follow="handleAddFollow(detailMoment)"
          />
        </div>
        <div v-else class="delete" @click="removeMomentInter(detailMoment)">
          <van-icon name="delete" />
        </div>
      </div>

      <x-circle-main :no-fold="true" @click-plan="onClickPlan" :plan="detailMoment.plan" :text="detailMoment.text" />

      <div class="xc__album" v-if="detailMoment.picture">
        <div class="xc__album--bar" v-for="(pic, pic_idx) in detailMoment.picture.split(',')" :key="pic_idx">
          <x-img class="xc__album--item" :src="pic" @click="onClickImg(detailMoment, pic_idx)" />
        </div>
      </div>
    </van-cell>

    <van-tabs v-model="active" animated>
      <van-tab :title="`打赏 ${detailMoment.tipcount}`">
        <x-nodata :data-s="tiplist" tip="赠人玫瑰手有余香" desc="" />
        <div class="container">
          <x-user-item :info="tip" v-for="(tip, tipIndex) in tiplist" :key="tipIndex" @click="handlerImgClick(tip)">
            打赏了{{ tip.tipamount }}积分
          </x-user-item>
        </div>
      </van-tab>
      <van-tab :title="`评论 ${detailMoment.msgcount}`">
        <x-nodata :data-s="msglist" tip="赠人玫瑰手有余香" desc="" />
        <div class="container">
          <x-comment
            v-for="(item, index) in msglist"
            v-bind="{
              rootmsg: item.rootmsg,
              dependmsg: item.dependmsg
            }"
            :key="index"
            @repy="clickComments"
          />
        </div>
      </van-tab>
      <van-tab :title="`点赞 ${detailMoment.likecount}`">
        <x-nodata :data-s="likelist" tip="常点赞可以带来好运哦" desc="" />
        <div class="container">
          <x-user-item v-for="(like, likeIndex) in likelist" :key="likeIndex" :info="like" @click="handlerImgClick(like)">
            觉得很赞
          </x-user-item>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 回复评论隐藏显示 -->

    <div class="footer ios-bt" slot="bottom">
      <div v-if="focus">
        <div class="mask" @click="onCancelReplyMoment"></div>
        <van-field @focus="focus = true" @blur="onBlur" v-model="replyContent" :placeholder="replyPlaceHolder">
          <!-- <van-button @click="onCancelReplyMoment" slot="button" size="small">
            取消
          </van-button> -->
          <van-button @click="replyMoment" slot="button" size="small" type="danger">
            发送
          </van-button>
        </van-field>
      </div>
      <!-- 底部(打赏 评论 点赞) -->
      <div v-else class="btnGroup van-hairline--top ios-bt">
        <div v-if="isFlag" class="btnItem van-hairline--right" @click="openDialog = true">
          <van-icon name="balance-o" />
          <span class="iconText">打赏 {{ detailMoment.tipcount }}</span>
        </div>
        <div class="btnItem van-hairline--right" @click="onClickCommentBtn">
          <van-icon name="chat-o" />
          <span class="iconText">评论 {{ detailMoment.msgcount }}</span>
        </div>
        <div class="btnItem" @click="handleThumbsUp">
          <van-icon :name="`${likesContain ? 'like' : 'like-o'}`" />
          <span class="iconText">点赞 {{ detailMoment.likecount }}</span>
        </div>
      </div>
    </div>

    <!-- 复制举报 -->
    <van-action-sheet v-model="reportPopShow" :actions="actions" cancel-text="取消" @cancel="reportPopShow = false" @select="sheetSelect" />
    <!-- 打赏 -->
    <x-circle-reward :openDialog="openDialog" @rewardPopupConfirm="rewardPopupConfirm" @rewardPopupClose="rewardPopupClose" />

    <x-img-view ref="xiv" :info="album_info" :picture="album_picture" :idx="album_index" @like="handleThumbsUp" @repy="onClickCommentBtn" />
  </x-layout>
  <!-- <x-page rootClass="dryingListDetails" :isRight="false">
   
  </x-page> -->
</template>

<script>
import {
  tippingMoment,
  likeMoment,
  cancelLikeMoment,
  getMomentInfo,
  replyMoment,
  getMomentTips,
  getMomentMsgs,
  getMomentLikes,
  removeMoment,
  followSomebody
} from '@/api/circle'

import Http from '@/utils/http/index.ws.js'
import { timestampdispose } from '@/utils/formant.util.js'
import { mapGetters, mapMutations } from 'vuex'
import { judgeBuyPlan } from '@/utils/Auth'
import xPage from 'cpt/x-page.vue'
import xImg from 'cpt/x-img.vue'
import xFollowBtnGroup from 'cpt/x-circle-follow/x-follow-btn-group.vue'
import xCircleMain from 'cpt/x-circle-follow/x-circle-main.vue'
import xNodata from 'cpt/x-nodata.vue'
import xComment from 'cpt/x-circle-list/x-comment.vue'
import xUserItem from 'cpt/x-circle-list/x-user-item.vue'
import xCircleReward from 'cpt/x-circle-reward.vue'
import xImgView from 'cpt/x-img-view.vue'
import xHeader from 'cpt/x-header.vue'

export default {
  components: {
    xPage,
    xImg,
    xFollowBtnGroup,
    xCircleMain,
    xNodata,
    xComment,
    xUserItem,
    xCircleReward,
    xImgView,
    xHeader
  },
  name: 'dryingListDetails',
  filters: {
    timestampdispose(value) {
      return timestampdispose(value)
    }
  },
  data() {
    return {
      id: '', // 当前单号
      focus: false,

      replayId: 0, // 消息 id
      rootMsgId: 0, // 楼主id

      replyContent: '', // 输入框消息主体
      replyPlaceHolder: '', // 输入框提示文字
      reportPopShow: false,
      active: 1,
      detailMoment: {}, // 当前晒单信息
      actions: [
        {
          name: '复制'
        },
        {
          name: '举报'
        }
      ],
      openDialog: false,
      likesContain: false,
      tiplist: [],
      msglist: [],
      likelist: [],

      album_info: {},
      album_picture: [],
      album_index: 1
    }
  },
  watch: {
    active(news) {
      if (news === 0 && !this.tiplist.length) {
        this.getMomentTipsInter()
      } else if (news === 1 && !this.msglist.length) {
        this.getMomentMsgsInter()
      } else if (news === 2 && !this.likelist.length) {
        this.getMomentLikes()
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getDetailsParams']),
    // 判断是否是自己发布得圈
    isFlag() {
      if (parseInt(this.userInfo.id) === parseInt(this.detailMoment.userid)) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapMutations(['setOwnUserInfo', 'setReportParam']),
    onClickImg(item, idx) {
      this.album_info = item
      this.album_index = idx
      this.album_picture = item.picture.split(',')
      this.$refs.xiv.onClickImg(idx)
    },
    onBlur() {
      G.delay(() => {
        this.onCancelReplyMoment()
        if (this.replyContent === '') this.focus = false
      }, 100)
    },
    onCancelReplyMoment() {
      this.focus = false
      this.replyContent = ''
      this.replayId = 0
      this.rootMsgId = 0
      this.replyPlaceHolder = ''
    },
    // 点击评论按钮
    onClickCommentBtn() {
      this.focus = true
      this.replayId = 0
      this.rootMsgId = 0
      this.replyContent = ''
      this.replyPlaceHolder = `@${this.detailMoment.nick}`
    },
    // 点击某点消息获取消息id
    clickComments(item, rootmsgid) {
      this.replayId = 0
      this.rootMsgId = 0
      this.rootMsgId = rootmsgid
      this.focus = true
      if (this.replyContent === '') {
        this.replayId = item.msgid
        this.replyPlaceHolder = `@${item.nick}`
      }
    },
    // 点击跳转至计划详情
    onClickPlan(plan) {
      let that = this
      judgeBuyPlan(plan.id, this.userInfo.balan_m, plan.cost, {
        access() {
          /* 已经购买允许查看准入 */
          that.detailMoment.plan.cost = 0
          that.$router.push(`/planDetail/${plan.id}`)
        },
        faild() {
          /* 购买失败 */
          that.$router.back()
        },
        cancel() {
          /* 取消 */
          // that.$router.back()
        },
        charge() {
          /* 充值 */
          that.$router.push('/user/integral')
        }
      })
    },
    // 回复消息api
    async replyMoment() {
      if (!this.replyContent) return
      let params = {
        id: this.id,
        text: this.replyContent
      }

      if (this.replayId) {
        Object.assign(params, {
          replymsgid: this.replayId,
          rootmsgid: this.rootMsgId // 楼主消息 id
        })
      } else {
        // 直接点击评论按钮回复晒单主体
        Object.assign(params, {
          replymsgid: 0,
          rootmsgid: 0
        })
      }

      let { ok, msg } = await replyMoment(params)
      if (ok) {
        this.$toast('评论成功')
        this.getMomentMsgs()
        this.focus = false
        this.replyContent = ''
        this.detailMoment.msgcount++
      }
    },
    // 晒单详情信息
    async getMomentInfo() {
      const _tmp = {
        id: parseInt(this.id)
      }
      let { ok, msg } = await getMomentInfo(_tmp)
      if (ok) {
        this.likesContain = msg.islike
        this.detailMoment = msg
      }
    },
    // 获取晒单留言
    async getMomentMsgs() {
      let { ok, msg } = await getMomentMsgs({ id: this.id })
      if (ok) {
        this.msglist = msg.msgs
      }
    },
    // 获取晒单详情信息
    async initgetMomentInfo() {
      const _tmp = {
        id: parseInt(this.id)
      }
      let { ok, msg } = await getMomentInfo(_tmp)
      if (ok) {
        this.detailMoment = msg
        this.likesContain = msg.islike
      }
    },
    // 删除晒单接口
    removeMomentInter(item) {
      G.$dialog
        .confirm({ message: '确定删除这条晒单吗' })
        .then(async () => {
          let { ok, msg } = removeMoment({ id: this.detailMoment.id })
          if (ok) {
            this.go(-1)
          }
        })
        .catch(() => {})
    },
    // 打赏列表接口
    async getMomentTipsInter() {
      let { ok, msg } = await getMomentTips({ id: this.id })
      if (ok) {
        this.tiplist = msg.tips
      }
    },
    // 评论列表接口
    async getMomentMsgsInter() {
      let { ok, msg } = await getMomentMsgs({ id: this.id })
      if (ok) {
        this.msglist = msg.msgs
      }
    },
    // 点赞列表
    async getMomentLikes() {
      let { ok, msg } = await getMomentLikes({ id: this.id })
      if (ok) {
        this.likelist = msg.likes
      }
    },
    // 点击关注
    handleAddFollow(item) {
      if (item.isfollow === 0 || item.isfollow === 2) {
        this.followSomebody(item.nick, true)
        this.$toast('已关注')
      } else if (item.isfollow === 1 || item.isfollow === 3) {
        G.$dialog
          .confirm({ message: '确认不在关注？' })
          .then(() => {
            this.followSomebody(item.nick, false)
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
        this.getMomentInfo()
      }
    },
    async likeMomentInter() {
      let { ok, msg } = await likeMoment({ id: this.id })
      if (ok) {
        this.likesContain = true
        this.detailMoment.likecount++
        this.getMomentLikes()
      }
    },
    // 取消点赞接口
    async cancelLikeMomentInter() {
      let { ok, msg } = await cancelLikeMoment({ id: this.id })
      if (ok) {
        // 避免再次请求
        this.likesContain = false
        this.detailMoment.likecount--
        this.getMomentLikes()
      }
    },
    // 点赞
    handleThumbsUp() {
      if (this.likesContain) {
        this.cancelLikeMomentInter()
      } else {
        this.likeMomentInter()
      }
    },
    // 关闭窗口
    rewardPopupClose() {
      this.openDialog = false
    },
    // 确认打赏
    async rewardPopupConfirm(score) {
      this.openDialog = false
      let _tmp = {
        id: this.id,
        amount: score
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
      let { ok, msg } = await tippingMoment(_tmp)
      if (ok) {
        this.$toast('打赏成功')
        this.getMomentTipsInter()
        this.$set(this.detailMoment, 'tipcount', this.detailMoment.tipcount + 1)
      } else {
        G.$dialog.alert({
          message: msg
        })
      }
    },
    // 复制举报 TODOVITOR
    sheetSelect(item, index) {
      this.reportPopShow = false
      const params = {
        id: this.getDetailsParams.id,
        illegalid: this.getDetailsParams.userid
      }
      this.setReportParam(params)
      this.$router.push('/circle/circleReport')
    },
    // 点击头像，用户名
    handlerImgClick(item) {
      const useinfo = {
        userid: item.userid,
        nick: item.nick,
        icon: item.icon
      }
      this.setOwnUserInfo(useinfo)
      this.$router.push(`/userInfo/userInfoCircle/?id=${item.userid}&nick=${item.nick}`)
    }
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      vm.id = to.params.id
      vm.initgetMomentInfo()
      vm.getMomentMsgsInter()
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.id = to.params.id
    this.initgetMomentInfo()
    this.getMomentMsgsInter()
    next()
  }
}
</script>

<style lang="scss">
.page-dryingListDetails-root {
  padding-bottom: 45px;
  .van-field__control {
    border: 1px solid #333333;
    border-radius: 5px;
    padding-left: 5px;
    &::placeholder {
      color: #999999;
    }
  }
  .van-field__button {
    .van-button--default {
      margin-right: 10px;
    }
  }
  .van-tab__pane-wrapper .container {
    position: relative;
    padding: 0 16px;
    background-color: $white;
    box-sizing: border-box;
    max-width: 99.9999vw;
    overflow: hidden;
  }
  .center {
    display: flex;
    align-items: center;
    .avatar-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      .avatar {
        height: 35px;
        width: 35px;
        border-radius: 50%;
        overflow: hidden;
      }
    }

    .delete {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 10px;
    }
    .xc__infos {
      padding-left: 10px;
      flex: 1;
    }
    .xc__nick {
      font-size: 15px;
      color: $txt;
    }

    .xc__time {
      font-size: 11px;
      color: $gray-99;
    }
    .xc__btn-bar {
      background-color: transparent;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $white;
    .mask {
      position: absolute;
      top: 0;
      height: 100vh;
      width: 100vw;
      transform: translateY(-100%);
    }
    .inputReply {
      .van-cell {
        padding-top: 7.5px;
        padding-bottom: 7.5px;
      }
    }
    .btnGroup {
      height: 45px;
      display: flex;
      .btnItem {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        .iconText {
          font-size: 13px;
          margin-left: 10px;
        }
        .van-icon-like {
          color: $rootColor;
        }
      }
    }
  }
  .xc__album {
    display: flex;
    flex-wrap: wrap;
    .xc__album--bar {
      width: 30%;
      padding-bottom: 30%;
      margin-bottom: 3%;
      position: relative;
      &:not(:nth-child(3n)) {
        margin-right: 3%;
      }
      .xc__album--item {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        object-fit: cover;
        pointer-events: unset;
      }
    }
  }
}
</style>
