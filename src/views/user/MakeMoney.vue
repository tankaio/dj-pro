<template>
  <!-- <x-page rootClass="makeMoney"></x-page> -->
  <x-layout modifier="makeMoney">
    <template v-slot:header>
      <x-header>
        <van-icon name="question-o" />
      </x-header>
    </template>
    <van-collapse v-model="activeNames">
      <van-collapse-item class="welcCode" :title="`我的邀请码：${userInfo.id}`" name="1">
        <van-icon name="qr" slot="value" />
        <div class="share-container">
          <div class="code">邀请码：{{ userInfo.id }}</div>
          <div id="qr"></div>
          <p class="desc">
            您可以将您的邀请码分享给他人，对方在本站注册时或 注册登录后通过个人中心-我要赚钱-领取积分成功绑定
            您的邀请码成为您的助力伙,对方免费获得10元积分,领取成功后他们每花费积分查看一次计划,您可以获得花费积分数量10%的金币收入.
          </p>
          <div class="footer">
            <div class="tit">分享到</div>
            <div class="container van-hairline--top">
              <div class="item">
                <span class="icon xIcon-friend-share"></span>
                <span class="txt">朋友圈</span>
              </div>
              <div class="item">
                <span class="icon xIcon-wechat-share"></span>
                <span class="txt">微信</span>
              </div>
              <div class="item">
                <span class="icon xIcon-qq-share"></span>
                <span class="txt">QQ</span>
              </div>
              <div class="item">
                <span class="icon xIcon-message-share"></span>
                <span class="txt">短信</span>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

    <!-- <van-cell class="welcCode" :title="`我的邀请码：${userInfo.id}`" is-link>
      <van-icon name="qr" />
    </van-cell>-->

    <van-cell title="领取积分" is-link to="/user/getIntegral"></van-cell>
    <van-cell title="我的助力伙伴" is-link to="/user/myFriends">
      <x-img :src="item" v-for="(item, index) in getChildHasplan" :key="index" class="avatar" />
    </van-cell>
  </x-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { GetTgUrl } from "@/api/user";
import QRCode from "qrcode";

import xPage from "cpt/x-page.vue";
import xImg from "cpt/x-img.vue";

export default {
  components: {
    xPage,
    xImg
  },
  data() {
    return {
      activeNames: []
    };
  },
  computed: {
    ...mapGetters(["userInfo", "getChildHasplan"])
  },
  methods: {
    async GetTgUrl() {
      let { ok, msg } = await GetTgUrl();
      if (ok) {
        QRCode.toCanvas(`${msg}/${this.userInfo.id}`, {}, (err, canvas) => {
          if (err) {
            return;
          }
          var container = $("#qr")[0];
          container.appendChild(canvas);
        });
      }
    }
  },
  created() {
    this.GetTgUrl();
  }
};
</script>

<style lang="scss">
.page-makeMoney-root {
  background-color: $white;
  .share-container {
    .code {
      font-size: 15px;
      text-align: center;
      margin: 30px auto 0;
    }
    #qr {
      display: block;
      font-size: 100px;
      margin: 25px auto 0;
      text-align: center;
    }
    .desc {
      font-size: 13px;
      width: 314px;
      display: block;
      margin: 0 auto 0;
      line-height: 1.5;
    }
    .footer {
      .tit {
        font-size: 16px;
        text-align: center;
        color: $txt;
        padding: 15px 0;
      }
      .container {
        display: flex;
        .item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 90px;
          .icon {
            width: 34px;
            height: 34px;
          }
          .txt {
            margin-top: 9px;
          }
        }
      }
    }
  }
  .welcCode {
    .van-cell__title {
      flex: 1;
    }
    .van-cell__value {
      flex: none;
      display: flex;
      align-items: center;
    }
  }
  .van-cell {
    .van-cell__value {
      height: 25px;
      overflow: hidden;
      .avatar {
        display: inline-block;
        height: 25px;
        width: 25px;
        border-radius: 50%;
        background-color: $baseBgColor;
        overflow: hidden;
        &:not(:nth-child(1)) {
          margin-left: -5px;
        }
      }
    }
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
}
</style>
