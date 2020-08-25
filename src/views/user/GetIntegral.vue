<template>
  <!-- <x-bind-page
    rootClass="getIntegral"
    tip="成功绑定推荐人邀请码可免费获得10元积分，邀请码 仅能绑定一次。"
    tip-icon
    left-text
    :left-arrow="true"
  ></x-bind-page>-->
  <x-layout modifier="getIntegral" :main-top="96">
    <template v-slot:header>
      <x-header></x-header>
      <div class="tip">成功绑定推荐人邀请码可免费获得10元积分，邀请码 仅能绑定一次。</div>
    </template>
    <van-field label="邀请码:" placeholder="请输入推荐人的邀请码" is-link v-model="wlcode" :disabled="bind" />
    <div class="btns">
      <van-button @click="onBindRecommend" :disabled="bind" type="danger">{{ bind ? '已绑定邀请码' : '绑定邀请码' }}</van-button>
    </div>
    <div class="referrer">
      <div class="tit">您的推荐人</div>
      <x-userpanel
        v-if="agid"
        v-bind="{
          avatar: ag.agico,
          username: ag.agnick,
          gender: ag.agsex,
          expert: !!ag.aglevel,
          fans: ag.agfans,
          follow: ag.agfollow
        }"
      >
        <template #btm>
          <span>绑定时间：{{ ag.agbinddate }}</span>
        </template>
      </x-userpanel>
    </div>
    <div class="desc">
      <div class="tit">使用说明</div>
      <p>1.输入或复制邀请码后，点击“绑定邀请码”按钮进行邀请码 绑定；</p>
      <p>2.成功绑定邀请码后可获得积分奖励，自动入账，可在账户 清单查看；</p>
      <p>3.每个账号仅能绑定一次邀请码，绑定后无法取消。</p>
    </div>
  </x-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { verifyWlCode } from '@/utils/verify.util.js'
import { BindAgcodeGetBalanM, SearchAgInfo } from '@/api/user'

import xBindPage from 'cpt/x-bind-page.vue'
import xUserpanel from 'cpt/x-userpanel.vue'

export default {
  components: {
    xBindPage,
    xUserpanel
  },
  data() {
    return {
      bind: false,
      wlcode: '',
      ag: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getAg']),
    agid() {
      if (this.getAg.agid) {
        this.bind = true
        this.wlcode = this.getAg.agid
        this.ag = this.getAg
      }
      return this.getAg.agid
    }
  },
  methods: {
    ...mapMutations(['setAg']),
    onBindRecommend() {
      if (!verifyWlCode(this.wlcode)) return
      if (this.bind) {
        SearchAgInfo({
          agcode: this.wlcode
        }).then(({ ok, msg }) => {
          if (ok) {
            G.$dialog
              .confirm({
                title: '提醒',
                className: 'table',
                message: `
                推荐人：${msg.agnick}
                邀请码：${msg.agcode}
                是否绑定？`
              })
              .then(async () => {
                let { ok, msg } = await BindAgcodeGetBalanM({
                  agcode: this.wlcode
                })
                if (ok) {
                  this.ag = msg.ag || {}
                  this.setAg(this.ag)
                  this.$notify({
                    type: 'success',
                    message: '绑定成功'
                  })
                }
              })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.page-getIntegral-root {
  position: relative;
  min-height: 100vh;
  background-color: $white;
  .van-cell::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .xp-bottom {
    font-size: 12px;
  }
  &.x-bind-page .tip {
    text-align: left;
  }
  .desc {
    position: absolute;
    flex: 1;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 20px 40px;
    color: $txt;
    .tit {
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      padding-bottom: 15px;
    }
    p {
      font-size: 13px;
      margin-top: 8px;
      line-height: 1.5;
    }
  }
  .referrer {
    margin-top: 20px;
    .tit {
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      font-size: 15px;
      font-weight: 600;
      color: $txt;
    }
  }
  .x-userpanel {
    position: relative;
    &::after,
    &::before {
      display: block;
      position: absolute;
      content: '';
      border-top: 1px solid $gray-f5;
      left: 0;
      right: 0;
      transform: rotateX(45deg);
    }
    &::after {
      top: 0;
    }
    &::before {
      bottom: 0;
    }
  }
  .tip {
    background-color: $baseBgColor;
    font-size: 12px;
    color: $txt;
    padding: 12px;
    line-height: 14px;
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
.van-dialog.table {
  text-align: left;
}
.gray-8::before {
  height: 1px;
}
</style>
