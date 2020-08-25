<template>
  <x-layout modifier="special">
    <x-header slot="header" />
    <div v-pre>
      <h2>什么是专家？</h2>
      <p>专家是在六合彩方面有专门研究或特长的人，利用您的经 验成为专家，只要成绩好，月赚百万不是梦。</p>
      <h2>专家有什么好处？</h2>
      <p>本平台每天有数百万人使用，专家可以在本平台分享计 划，有用户查看购买计划即可获得相应的积分，专家收益是用 户消费积</p>
      <h2>如何成为专家？</h2>
      <p>专家必须是本平台的会员，目前有两种渠道可帮助您成为 专家：</p>
      <ul>
        <li>1.点击“申请成为专家",推荐本平台给朋友注册成为会员后绑定 您的邀请码，您的邀请码绑定人数达到15个，我们会在每周一 至周五</li>
        <li>2.参与模拟购彩专家竞选，推荐计划，在周期内胜利一定的期 数证明您的实力后，我们会在每周一直接为您开通专家资格（ 节假日延后处</li>
      </ul>
      <h2>专家注意事项</h2>
      <p>专家每期最多可发布15类计划（单双、大小、色波、 特码半波、平特一肖、连肖、特码合肖、特肖、正码一 肖、正码、正码直</p>
      <p>专家推荐的计划会出现在大神榜、连胜榜、胜率榜、 往期冠军（按照优胜劣汰原则排序）和个人主页。</p>
      <p>为保证计划质量，专家推荐的计划如果连续多期不中， 则所发的计划无法被用户购买，需连胜两期方可开放购买</p>
      <p>为勉励专家持续研究六合资料，专家如果连续三期不 发布计划则取消其专家资格。</p>
      <p>注意：开奖当天晚上20:30至21:35禁止发布计划，其他 时间不做限制。</p>
    </div>
    <div slot="bottom" class="footer ios-bt" @click="onApplyExpert">{{ isApplying ? '正在审核中...' : '申请成为专家' }}</div>
    <van-dialog
      class="applyExpertDialog"
      v-model="showApplyExpert"
      get-container="#box"
      show-cancel-button
      close-on-click-overlay
      close-on-popstate
      confirm-button-text="邀请伙伴"
      cancel-button-text="参加活动"
      :title="!reApplyFlag ? '你未满足专家申请条件' : '你未满足重新申请专家条件'"
      @confirm="onApplyExpertDialogConfirm"
      @cancel="onApplyExpertDialogCancel"
    >
      <p>满足以下条件之一即可申请成为专家</p>
      <p>
        1.分享{{ title }}和
        <router-link to="/user/makeMoney">您的邀请码</router-link>
        给朋友，对方免费注册成为会员且绑定您的邀请码成为您的助力伙伴，当您的助力伙伴人数达到
        <i>15</i>
        个，目前您的助力伙伴数：
        <i>{{ child }}</i>
      </p>
      <p v-if="!reApplyFlag">2.通过到{{ activty }}活动进行比赛，拿到好成绩客服人员会为您开通</p>
      <p v-else>
        2.提交申请，平台会对您以往活跃度、计划发布情况等作出评估，并尽快反馈审核结果至您的站内信。
      </p>
    </van-dialog>
  </x-layout>
</template>

<script>
import { getCanApplyToBeAnExpert, ApplyToBeAnExpert } from '@/api/user'
import xHeader from 'cpt/x-header.vue'

const TITLE = process.env.VUE_APP_TITLE

export default {
  components: {
    xHeader
  },
  data() {
    return {
      showApplyExpert: false,
      // 是否为重新申请
      reApplyFlag: false,
      // 是否审核中
      isApplying: false,
      // 是否满足审核条件
      isApplyCondition: false,
      child: 0,
      activty: '',
      title: TITLE
    }
  },
  methods: {
    onApplyExpert() {
      if (this.isApplying) {
        // 审核中
        return
      }
      if (this.isApplyCondition === false) {
        // 展示条件弹窗
        this.showApplyExpert = true
      } else {
        // 申请审核
        this.ApplyToBeAnExpert()
      }
    },
    async getCanApplyToBeAnExpert() {
      let { ok, msg } = await getCanApplyToBeAnExpert()

      /**
       * 1. 未满足专家申请条件
       * 2. 之前是专家未满足重新申请为专家的条件
       * 3. 已经在审核中的底部按钮状态
       */
      let { canapply, reason, everbeen, child, review } = msg
      this.child = child
      if (review) {
        this.isApplying = true
      }
      if (canapply === false) {
        // 不满足条件
        if (everbeen === true) {
          // 之前是专家
          this.reApplyFlag = true
        }
        this.isApplyCondition = false
      } else {
        // 可以申请
        this.isApplyCondition = true
      }
    },
    async ApplyToBeAnExpert() {
      let { ok, msg } = await ApplyToBeAnExpert()
      if (ok) {
        G.$dialog.alert({
          title: '提交审核',
          message: '您的申请已提交处理，请耐性等待，我们会第一时间处理您的申请，并通知您审核结果。'
        })
        this.isApplying = true
      }
    },
    onApplyExpertDialogConfirm() {
      this.$router.push('/user/makeMoney')
    },
    onApplyExpertDialogCancel() {
      this.$notify('活动尚未开始，请关注活动公告')
    }
  },
  created() {
    this.getCanApplyToBeAnExpert()
  }
}
</script>

<style lang="scss">
.page-special-root {
  padding: 0 10px;
  padding-bottom: 44px;
  width: 100vw;
  box-sizing: border-box;
  background-color: $white;
  h2 {
    margin-top: 20px;
    font-size: 16px;
    color: $txt;
    font-weight: 600;
  }
  p,
  ul {
    font-size: 13px;
    color: $txt;
    margin-top: 10px;
    line-height: 1.5;
  }
  p {
    text-indent: 20px;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $rootColor;
    color: $white;
    text-align: center;
    height: 44px;
    line-height: 44px;
    font-size: 15px;
    box-shadow: 0 -1px 4px 0 rgba($color: #000000, $alpha: 0.2);
  }
}
.applyExpertDialog {
  .van-dialog__header {
    font-weight: 500;
  }
  .van-dialog__content {
    padding: 10px 24px 24px;
    font-size: 14px;
    color: $tit;
    p {
      line-height: 20px;
      padding: 3px 0;
    }
    i {
      color: $rootColor;
    }
  }
}
</style>
