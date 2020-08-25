<template>
  <div class="page-ToutiaoIndex-root">
    <x-header @click-right="ifSearch = true" z-index="20">
      <van-icon name="search" color="#fff" />
    </x-header>
    <!-- 搜索栏 -->
    <transition enter-active-class="fadeInDown animated faster">
      <div class="searchBar" v-if="ifSearch">
        <div class="searchContent">
          <van-search clearable v-model="search"></van-search>
          <van-button class="searchStartBtn">搜索</van-button>
        </div>
      </div>
    </transition>
    <!-- 六合奖期展示 -->
    <transition>
      <div class="lotteryBar van-hairline--bottom" :class="{ sticky: isFold, search: ifSearch }">
        <x-lottery
          :url="`/awardInfo/awardDetail/${getNowIssue.round}`"
          :period="`${getNowIssue.date}第${getNowIssue.round}期`"
          :nums="[1, 2, 3, 4, 5, 6, 7]"
          pure
          isLotteryNum
          :right-arrow="false"
          :class="{ fold: isFold }"
        />
        <div class="ctrBtn" @click="onLotteryClick"></div>
      </div>
    </transition>
    <!-- 内容列表 -->
    <x-tabs v-model="x_tabs" :offset-top="44" @sticky="onTabSticky">
      <x-tab title="最新">
        <x-list>
          <x-nodata tip="暂时没有最新头条" desc="空空如也~" :data-s="newsList" bg />
          <x-h-toutiao v-for="(item, index) in newsList" :key="index" v-bind="item" @click="$router.push('/toutiaoDetial')" />
        </x-list>
      </x-tab>
      <x-tab title="精华">精华</x-tab>
      <x-tab title="热门">热门</x-tab>
      <x-tab title="当期">当期</x-tab>
    </x-tabs>
    <!-- 底部操作区 -->
    <div class="footer van-hairline--top">
      <div class="followFans van-hairline--right">
        关注/粉丝
      </div>
      <div class="post van-hairline--right" v-if="userInfo.level === 1" @click="$router.push('/toutiaoEdit')">
        <van-icon name="edit" />
        发帖
      </div>
      <div class="my" @click="$router.push('/userInfo/UserInfoLiuHe')">
        <van-icon name="user-o" />
        我的
      </div>
    </div>
  </div>
</template>

<script>
// 组件
import xHeader from 'cpt/x-header'
import xFixed from 'cpt/x-fixed'
import xLottery from 'cpt/x-lottery/x-lottery'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xList from 'cpt/x-list/x-list.vue'
import xNodata from 'cpt/x-nodata.vue'
import xHToutiao from 'cpt/x-h-toutiao.vue'
//
import { mapGetters } from 'vuex'
//
export default {
  components: { xHeader, xFixed, xLottery, xTabs, xTab, xList, xNodata, xHToutiao },
  data() {
    return {
      search: '',
      ifSearch: false,
      x_tabs: 0,
      isFold: false,
      newsList: [
        {
          tit: '134期【马尼拉彭于晏】== 30中30《八码中特》 买不了吃亏买不了上当，明天见分晓！',
          essence: true,
          top: true,
          name: '马尼拉彭于晏',
          read: 78,
          time: new Date()
        },
        {
          tit: '134期 官方活动 一码中特 在此贴下回复参与活动中 奖可领888元奖励！',
          essence: false,
          top: true,
          name: '管理员002',
          read: 2300,
          time: new Date()
        },
        {
          tit: '上一期全中，明天出发马尔代夫， 别墅靠海哦！',
          essence: false,
          top: false,
          name: '小土豆',
          read: 2300,
          time: new Date(),
          picture: ['']
        },
        {
          tit: '134期【赌侠陈小刀】==《平特一肖》跟上就是白给 赌神亲传绝学各位观众三条Ace...',
          essence: false,
          top: false,
          name: '马尼拉彭于晏',
          read: 78,
          time: new Date(),
          picture: ['', '', '']
        },
        {
          tit: '134期【赌侠陈小刀】==《平特一肖》跟上就是白给 赌神亲传绝学各位观众三条Ace...',
          essence: false,
          top: false,
          name: '马尼拉彭于晏',
          read: 78,
          time: new Date(),
          picture: ['', '', '']
        },
        {
          tit: '134期【赌侠陈小刀】==《平特一肖》跟上就是白给 赌神亲传绝学各位观众三条Ace...',
          essence: false,
          top: false,
          name: '马尼拉彭于晏',
          read: 78,
          time: new Date(),
          picture: ['', '', '']
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getNowIssue', 'userInfo'])
  },
  methods: {
    onTabSticky() {
      this.ifSearch = false
    },
    onLotteryClick() {
      this.isFold = !this.isFold
    }
  }
}
</script>

<style lang="scss">
.page-ToutiaoIndex-root {
  padding-bottom: 49px;
  .searchBar {
    height: 55px;
    background-color: $rootColor;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 12;
    position: relative;
    .searchContent {
      height: 35px;
      width: 345px;
      border-radius: 5px;
      background-color: $white;
      display: flex;
      .van-search {
        flex: 1;
        * {
          background-color: #fff;
        }
        .van-icon-search {
          color: $rootColor;
        }
      }
      .searchStartBtn {
        color: $rootColor;
        background-color: $white;
        height: 35px;
        line-height: 35px;
        border: none;
        &::before {
          display: block;
          position: absolute;
          content: '';
          height: 15px;
          background-color: $gray-d5;
          width: 1px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          opacity: 1;
        }
        .van-button__text {
          font-size: 14px;
          //   line-height: 35px;
        }
      }
    }
  }

  .lotteryBar {
    position: relative;
    &.van-hairline--bottom::after {
      z-index: 13;
    }
    &.sticky {
      position: fixed;
      width: 100%;
      z-index: 11;
      top: 44px;
      left: 0;
      right: 0;
      &.search {
        top: 0;
        position: relative;
      }
    }
    .x-lottery {
      z-index: 12;
      position: relative;
      background-color: $white;
      overflow: hidden;
      &.fold {
        height: 0px;
      }
    }
    .ctrBtn {
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 94px;
      height: 48px;
      border-radius: 12px;
      transform-origin: 50% 50%;
      transform: translateX(-50%) scale(0.5) translateY(100%);
      box-shadow: 0 0 3px 0 rgba($color: #000000, $alpha: 0.2);
      background-image: linear-gradient(0deg, #d2cfd2, #fffeff 40%);
      z-index: 11;
      &:after {
        display: block;
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-top: 3px solid #000;
        border-right: 3px solid #000;
        left: 50%;
        top: 60%;
        transform: translateX(-50%) rotateY(0deg) rotateX(45deg) rotateZ(-45deg);
      }
    }
  }
  .xt-middle {
    z-index: 10;
  }
  .xt-item {
    font-size: 15px;
    font-weight: 600;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 49px;
    line-height: 49px;
    background-color: $white-fa;
    font-size: 15px;
    color: $txt;
    display: flex;
    > * {
      flex: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .van-icon {
        margin-right: 5px;
      }
    }
  }
}
</style>
