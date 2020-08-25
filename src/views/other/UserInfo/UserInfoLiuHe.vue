<template>
  <div class="page-UserInfoLiuHe-root">
    <x-tabs position v-model="x_tabs" fixed :offset-top="168">
      <!-- 收入累计 -->
      <template slot="tab-bottom" v-if="x_tabs === 0">
        <div class="selfIncome van-hairline--bottom">
          <div class="today">
            今日收入：12积分
          </div>
          <div class="alls">
            累计收入：36积分
          </div>
        </div>
      </template>
      <!-- 打赏筛选 -->
      <template slot="tab-bottom" v-if="x_tabs === 3">
        <div class="rewardBtns van-hairline--bottom">
          <van-button size="small" hairline plain :class="{ active: rewardActive == 0 }" @click="rewardActive = 0">近一周</van-button>
          <van-button size="small" hairline plain :class="{ active: rewardActive == 1 }" @click="rewardActive = 1">近一月</van-button>
          <van-button size="small" hairline plain :class="{ active: rewardActive == 2 }" @click="rewardActive = 2">全部</van-button>
        </div>
      </template>
      <!-- 我的 start -->
      <x-tab title="我的">
        <!-- 无数据状态 -->
        <x-nodata :data-s="[1]">
          您还没有发表过任何头条哦！
        </x-nodata>
        <!-- 我的列表 -->
        <x-list
          position
          v-model="selfIsLoad"
          :finished="selfIsFinished"
          :error.sync="selfIsError"
          :active="x_tabs === 0"
          @load="selfListLoad"
          finish-text="暂无更多记录"
        >
          <x-u-toutiao
            @viewimg="viewImg"
            v-for="(item, index) in test"
            :key="index"
            v-bind="{
              ico: '0-0-0-ico.png',
              nick: '美术生的那些事',
              gender: 1,
              text: '135期【马尼拉彭于晏】==稳中【八码中特】=有你们支持，明天会更好!',
              time: '2019.11.28 17:01',
              msgnum: 12,
              integral: 12,
              state: true,
              album: ['0-0-0-ico.png', '0-0-0-ico.png', '0-0-0-ico.png', '0-0-0-ico.png']
            }"
          />
        </x-list>
      </x-tab>
      <!-- 我的 end -->

      <!-- 历史 start -->
      <x-tab title="历史">
        <x-list
          position
          v-model="historyIsLoad"
          :finished="historyIsFinished"
          :error.sync="historyIsError"
          :active="x_tabs === 1"
          @load="historyListLoad"
          finish-text="暂无更多记录"
        >
          <x-u-toutiao
            @viewimg="viewImg"
            v-for="(item, index) in test"
            :key="index"
            v-bind="{
              type: 'history',
              ico: '0-0-0-ico.png',
              nick: '美术生的那些事',
              gender: 1,
              text: '135期【马尼拉彭于晏】==稳中【八码中特】=有你们支持，明天会更好!',
              time: '2019.11.28 17:01',
              msgnum: 12,
              like: 34,
              state: true,
              album: ['0-0-0-ico.png', '0-0-0-ico.png', '0-0-0-ico.png', '0-0-0-ico.png']
            }"
          />
        </x-list>
      </x-tab>
      <!-- 历史 end -->
      <x-tab title="评论">评论</x-tab>

      <!-- 打赏 start -->
      <x-tab title="打赏">
        <x-list
          position
          v-model="rewardIsLoad"
          :finished="rewardIsFinished"
          :error.sync="rewardIsError"
          :active="x_tabs === 1"
          @load="rewardListLoad"
          finish-text="暂无更多记录"
        >
          <x-u-toutiao
            @viewimg="viewImg"
            v-for="(item, index) in test"
            :key="index"
            v-bind="{
              type: 'reward',
              ico: '0-0-0-ico.png',
              nick: '美术生的那些事',
              gender: 1,
              text: '135期【马尼拉彭于晏】==稳中【八码中特】=有你们支持，明天会更好!',
              time: '2019.11.28 17:01',
              msgnum: 12,
              like: 34,
              state: false,
              reward: 25,
              album: ['0-0-0-ico.png', '0-0-0-ico.png', '0-0-0-ico.png', '0-0-0-ico.png']
            }"
          />
        </x-list>
      </x-tab>
      <!-- 打赏 end -->
    </x-tabs>

    <!-- 图片查看组件 -->
    <x-img-view ref="xiv" :is-footer="false" :idx="albumIndex" :picture="albumPicture" @close="albumPicture = []" />
  </div>
</template>

<script>
// 组件
import xNodata from 'cpt/x-nodata.vue'
import xImgView from 'cpt/x-img-view.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xList from 'cpt/x-list/x-list.vue'
import xUToutiao from 'cpt/x-u-toutiao.vue'
//
export default {
  components: { xNodata, xTabs, xTab, xList, xUToutiao, xImgView },
  data() {
    return {
      x_tabs: 0,
      test: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

      selfIsLoad: false,
      selfIsFinished: false,
      selfIsError: false,

      historyIsLoad: false,
      historyIsFinished: false,
      historyIsError: false,

      rewardIsLoad: false,
      rewardIsFinished: false,
      rewardIsError: false,

      albumIndex: 0,
      albumPicture: [],

      rewardActive: 0
    }
  },
  methods: {
    selfListLoad() {
      // 我的列表加载函数
    },
    historyListLoad() {
      // 历史列表加载函数
    },
    rewardListLoad() {
      // 打赏列表加载函数
    },
    viewImg(picture, idx) {
      this.albumIndex = idx
      this.albumPicture = picture
      this.$refs.xiv.onClickImg(idx)
    }
  }
}
</script>

<style lang="scss">
.page-UserInfoLiuHe-root {
  .van-tabs__content,
  .x-nodata {
    background-color: $gray-f5;
  }
  .x-nodata {
    color: $gray-d6;
  }
  .van-tabs--line .van-tabs__wrap {
    height: 40px;
    .van-tab {
      line-height: 40px;
      font-size: 17px;
      color: $txt;
      &.van-tab--active {
        color: $rootColor;
      }
    }
  }
  .x-tab {
    background-color: $gray-f5;
  }
  .selfIncome {
    padding: 0 15px;
    display: flex;
    > * {
      flex: 1;
      position: relative;
      line-height: 35px;
      font-size: 13px;
      color: $gray-66;
      padding-left: 10px;
    }
    .today {
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 4px;
        height: 14px;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: $rootColor;
      }
    }
  }
  .rewardBtns {
    display: flex;
    height: 44.5px;
    align-items: center;
    justify-content: space-evenly;
    .van-button {
      border-radius: 10px;
    }
    .van-button.active {
      .van-button__text {
        color: $rootColor;
      }
      &.van-button--hairline::after {
        border-color: $rootColor;
      }
    }
    .van-button__text {
      font-size: 13px;
      color: $txt;
    }
    .van-button--hairline::after {
      border-color: $gray-99;
      border-radius: 10px;
    }
  }
}
</style>
