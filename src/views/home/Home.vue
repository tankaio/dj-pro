<template>
  <x-layout modifier="home" is-bottom>
    <x-header :leftText="showUserState" :center-text="homeTitle" :leftArrow="false" :click-left="onClickLeft" slot="header" />
    <van-pull-refresh v-model="isLoading" @refresh="getMainInfo">
      <x-cpt-loading :is-show="!!swipe_img.length" w="375" h="160">
        <x-wapper :list="swipe_img" />
      </x-cpt-loading>
      <!-- 开奖区 -->
      <div class="prize-bar">
        <div class="prize open-lottery-bg">
          <x-cpt-loading :is-show="!!draws.length" h="117" w="345">
            <div class="tit">
              {{ animate_lottery ? `第${lastround}期 正在开奖` : `第${lastround}期最新开奖结果` }}
            </div>
            <div class="lotteryShow">
              <x-lottery @click="onLotteryClick" v-model="draws" :animate.sync="animate_lottery" @end="endAnimate" />
            </div>
            <div class="bottomTip">下期开奖时间：{{ nexttime }}</div>
          </x-cpt-loading>
        </div>
      </div>
      <!-- 榜单与公告区 -->
      <div class="zone gray-8">
        <!-- 公告 -->
        <van-notice-bar scrollable color="#333333" :text="marquee" left-icon="volume-o">
          <span slot="left-icon" class="xIcon-notice-cm"></span>
        </van-notice-bar>

        <!-- 榜单区 -->
        <div class="zoneBar">
          <x-zone tit="大神榜" txt="人气高手 各显神通" :desc="`当前心水数量:${dashen}`" color="#F74E60" url="/manito">
            <span slot="icon" class="xIcon-dasheng-zone"></span>
          </x-zone>
          <x-zone tit="连胜榜" txt="精华好料 赢了加赢" :desc="`当前最高连胜:${liansheng}`" color="#6EA7F5" :combo="liansheng_sum" url="/combo">
            <span slot="icon" class="xIcon-liansheng-zone"></span>
          </x-zone>
          <x-zone tit="胜率榜" txt="精准预测 十拿九稳" :desc="`当前心水数量:${shenglv}`" color="#FAB84D" url="/winRate">
            <span slot="icon" class="xIcon-shenglv-zone"></span>
          </x-zone>
          <x-zone tit="历史冠军" txt="昔日王者 谁与争锋" :desc="`当前心水数量:${champions}`" color="#FF7D50" url="/champion">
            <span slot="icon" class="xIcon-guanjun-zone"></span>
          </x-zone>
        </div>
      </div>
      <!-- 六合头条区 -->
      <div class="topLineBar" v-if="news.length">
        <x-top-line logo="@/img/sexhe-logo.png" :list="news"></x-top-line>
      </div>

      <!-- 热门推荐 -->
      <x-hotrecommended v-if="hot_recmd_list.length" :list="hot_recmd_list" />
      <!-- 夜色公馆 -->
      <!-- <div class="gray-8">
        <x-video-wapper>
          <x-video-item
            v-for="(item, index) in videos"
            :key="index"
            v-bind="{
              url: '',
              desc: item.desc,
              auth: item.exponly ? '会员尊享' : '',
              publish_time: item.time,
              nums: item.audience,
              video_time: item.len
            }"
          ></x-video-item>
        </x-video-wapper>
      </div>
      <van-cell title="去夜色公馆频道看更多" is-link class="ysCell"></van-cell> -->

      <!-- 分享赚钱滚动公告需要优化,手指按住屏幕时禁止滚动 -->
      <!-- 分享赚钱 -->
      <div class="x-carousal-bar gray-8">
        <!-- <x-carousal></x-carousal> -->
      </div>

      <van-cell-group v-if="login">
        <van-cell title="我的关注" is-link to="/user/follow">
          <span slot="icon" class="xIcon-follow-cm"></span>
          <x-img v-for="(item, index) in follow" :key="index" :src="item" class="avatar" />
        </van-cell>
        <van-cell title="我的粉丝" is-link to="/user/fans">
          <span slot="icon" class="xIcon-fans-cm"></span>
          <x-img v-for="(item, index) in fans" :key="index" :src="item" class="avatar" />
        </van-cell>
      </van-cell-group>

      <div class="gray-8" v-else>
        <van-cell-group class="auth">
          <van-button class="van-hairline--right" @click="$router.push('/sign')">
            登陆
          </van-button>
          <van-button @click="$router.push('/login')">
            注册
          </van-button>
        </van-cell-group>
      </div>
      <!-- canvas刮奖 -->
      <x-scratch @open="endAnimate" :num="special_number" v-model="scratchShow" />
    </van-pull-refresh>
  </x-layout>
</template>

<script>
import { getMainInfo } from '@/api/home'
import wsDispose from '@/api/ws_dispose'
import { mapGetters, mapMutations } from 'vuex'

import xPage from 'cpt/x-page.vue'
import xHeader from 'cpt/x-header.vue'
import xPullrefresh from 'cpt/x-pullrefresh.vue'
import xWapper from 'cpt/x-wapper/x-wapper.vue'
import xLottery from 'cpt/x-lottery/x-lottery.vue'
import xZone from 'cpt/x-zone.vue'
import xTopLine from 'cpt/x-top-line.vue'
import xHotrecommended from 'cpt/x-hotrecommended.vue'
import xVideoItem from 'cpt/x-video-wapper/x-video-item.vue'
import xVideoWapper from 'cpt/x-video-wapper/x-video-wapper.vue'
import xCarousal from 'cpt/x-carousal.vue'
import xImg from 'cpt/x-img.vue'
import xScratch from 'cpt/x-scratch/x-scratch.vue'

const HOME_TITLE = process.env.VUE_APP_TITLE

export default {
  components: {
    xPage,
    xHeader,
    xPullrefresh,
    xWapper,
    xLottery,
    xZone,
    xTopLine,
    xHotrecommended,
    xVideoItem,
    xVideoWapper,
    xCarousal,
    xImg,
    xScratch
  },
  name: 'home',
  data() {
    return {
      homeTitle: HOME_TITLE,
      swipe_img: [],
      draws: [],
      videos: [],
      hot_recmd_list: [],
      login: false,
      lastround: '',
      nexttime: '',
      marquee: '',
      news: [],
      champions: 0,
      dashen: 0,
      liansheng: 0,
      shenglv: 0,
      liansheng_sum: 0,
      animate_lottery: false,
      special_number: 0,
      scratchShow: false,
      follow: [],
      fans: [],
      animated: false,
      isLoading: false
    }
  },
  created() {
    let that = this
    this.getMainInfo()
    this.$eventBus.$on('open-special', this.onOpenSpecial)
    this.$on('hook:destroyed', () => this.$eventBus.$off('open-special'))
    wsDispose.listen_msg('hkcdraws', body => {
      this.animate_lottery = true
      this.lastround = body.round
      this.setOpenIssue(body.round)
      this.setSpecialRun(true)
    })
  },
  activated() {
    this.getMainInfo()
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity', 'getOpenLottery', 'getSpecialRun', 'getOpenIssue']),
    showUserState() {
      switch (this.userIdentity) {
        case 0:
          this.login = false
          return '游客'
        case 1: // 会员
          this.login = true
          return '会员'
        case 2: // 专家
          this.login = true
          return '专家'
        default:
          break
      }
    }
  },
  methods: {
    ...mapMutations(['updatedOpenLottery', 'clearOpenLottery', 'setOpenIssue', 'setSpecialRun', 'setNowIssue']),
    onOpenSpecial() {
      this.scratchShow = true
      console.log(this.scratchShow)
      if (this.getOpenLottery.length === 7) {
        this.special_number = this.getOpenLottery[this.getOpenLottery.length - 1]
      } else if (this.getSpecialRun) {
        this.special_number = this.draws[this.draws.length - 1]
      }
    },
    pullLoading() {
      this.getMainInfo()
    },
    onLotteryClick() {
      // url="/awardInfo
      // 判断当前是否处于开奖状态,判断特码是否开奖
      if (this.getSpecialRun === false) {
        // 当前彩票已刮开
        this.$router.push('/awardInfo')
      }
    },
    endAnimate() {
      //当前事件为用户点击特码后的事件
      this.animate_lottery = false
      if (this.getOpenLottery.length === 7) {
        this.draws = this.getOpenLottery
      }
      this.clearOpenLottery()
      ls('openSpecialNumberState', {
        issue: this.getOpenIssue,
        open: true
      })
      this.setSpecialRun(false)
      this.scratchShow = false
    },
    onClickLeft() {
      switch (this.userIdentity) {
        case 0: // 未登陆
          this.$router.push('/sign')
          break
        case 1: // 会员
        case 2: // 专家
          this.$router.push('/user')
          break
        default:
          break
      }
    },
    async getMainInfo() {
      let { ok, msg } = await getMainInfo()
      this.isLoading = false
      if (G.isEmpty(msg)) {
        this.$notify(msg)
      } else {
        let getMsg = G.curry(G.get)(msg)
        let lastdraw = getMsg('draws.lastdraws', [])

        this.swipe_img = getMsg('banner', [])
        this.lastround = getMsg('draws.lastround', '')
        this.setOpenIssue(this.lastround)
        this.nexttime = getMsg('draws.nexttime', '')
        this.marquee = getMsg('marquee', '')
        this.news = getMsg('news', [])
        this.champions = getMsg('ranking.champions.sum', 0)
        this.dashen = getMsg('ranking.dashen.sum', 0)
        this.liansheng = getMsg('ranking.liansheng.max', 0)
        this.liansheng_sum = getMsg('ranking.liansheng.sum', 0)
        this.shenglv = getMsg('ranking.shenglv.sum', 0)
        this.hot_recmd_list = getMsg('recommend', [])
        this.follow = getMsg('follow', [])
        this.fans = getMsg('fans', [])

        this.animated = true

        function disposeNexttime(time) {
          let ymd = time.split(' ')[0]
          return ymd
            .replace('年', '-')
            .replace('月', '-')
            .replace('日', '')
        }

        this.setNowIssue({
          date: disposeNexttime(this.nexttime),
          round: this.lastround + 1
        })

        if (lastdraw && lastdraw.length < 7) {
          this.draws = [1, 2, 3, 4, 5, 6, 7]
          wsDispose.follow('hkcdraws', {
            round: this.lastround,
            nums: lastdraw,
            openday: this.nexttime
          })
        } else {
          let openSpecialNumberState = ls('openSpecialNumberState')
          // 本地数据为空也视为未刮奖
          if (G.isEmpty(openSpecialNumberState)) {
            this.setSpecialRun(true)
          } else {
            let { issue, open } = openSpecialNumberState
            // 当前期号大于之前的期号
            if (this.lastround > issue) {
              this.setSpecialRun(true)
            } else if (this.lastround <= issue) {
              // 当前期号不大于之前期号根据本地数据判断
              if (open) {
                this.setSpecialRun(false)
              } else {
                this.setSpecialRun(true)
              }
            } else {
              this.setSpecialRun(true)
            }
          }
          this.draws = lastdraw || []
        }
      }
    }
  }
}
</script>

<style lang="scss">
.page-home-root {
  background-color: #fff;
  .x-wapper {
    padding-top: 5px;
    .x-wapper-item {
      min-height: 150px;
      max-height: 150px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      &.active {
        &.animate {
          img {
            transition-property: all;
            transition-duration: 500ms;
          }
        }
        img {
          flex: none;
          height: 100%;
          width: 100%;
        }
      }

      img {
        display: block;
        font-size: 0;
        height: 90%;
        border-radius: 10px;
        overflow: hidden;
        width: 96%;
        object-fit: cover;
      }
    }
  }
  .ysCell {
    justify-content: center;
    .van-cell__title {
      flex: none;
      font-size: 15px;
    }
  }
  .prize-bar {
    background-color: $white;
    padding: 10px;
    .prize {
      // background-size: contain;
      background-size: 100% 100%;
      margin: 5px;
      min-height: 117px;
      min-width: 345px;
      .period-bar {
        padding: 0 5px;
      }
      .tit,
      .bottomTip {
        color: #404040;
        font-weight: 600;
        font-size: 15px;
        text-align: center;
        padding: 5px 0;
      }
      .bottomTip {
        font-weight: unset;
        font-size: 13px;
      }
    }
  }
  .zone {
    background-color: $white;
    .van-notice-bar {
      background-color: $white;
      .xIcon-notice-cm {
        margin-right: 5px;
      }
    }
  }
  .zoneBar {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    padding: 0 15px 15px;
    height: 174px;
    .x-zone {
      width: calc(50% - 4.5px);
    }
  }
  .topLineBar {
    margin-top: 8px;
  }
  .van-cell-group {
    &.auth {
      display: flex;
      justify-content: center;
      background-color: $white;
      padding-bottom: 20px;
    }
    .van-cell__title {
      color: $tit;
      margin-left: 11.5px;
    }
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
    .van-button {
      background-color: #ff5f6f;
      width: 170px;
      position: relative;
      border-radius: 5px;
      color: $white;
      font-size: 15px;
      box-shadow: 0 2px 3px 0 #d73c4b;
      border: none;
      &::after,
      &::before {
        display: none;
      }
      &:nth-child(2) {
        margin-left: 10px;
      }
    }
  }
  .x-carousal-bar {
    background-color: $white;
    .x-carousal {
      margin: 10px;
    }
  }
  .gray-8 {
    background-color: $white;
    .x-video-wapper {
      margin-top: 10p;
    }
  }
  .xvw-img {
    background-color: $baseBgColor;
  }
}
</style>
