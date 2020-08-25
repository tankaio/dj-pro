<template>
  <x-layout modifier="RunChart" :main-top="mainTop">
    <template #header>
      <x-header :is-right="false">
        <template #title>
          <van-dropdown-menu>
            <van-dropdown-item v-model="value" :options="option" />
          </van-dropdown-menu>
        </template>
      </x-header>
      <van-tabbar :fixed="false" v-model="playfun_active" @change="onMaxClsChange">
        <van-tabbar-item name="号码" @click="playClick('号码')">
          号码
        </van-tabbar-item>
        <van-tabbar-item name="生肖" @click="playClick('生肖')">
          生肖
        </van-tabbar-item>
        <van-tabbar-item name="大小" @click="playClick('大小')">
          大小
        </van-tabbar-item>
        <van-tabbar-item name="单双" @click="playClick('单双')">
          单双
        </van-tabbar-item>
        <van-tabbar-item name="混合" @click="playClick('混合')">
          混合
        </van-tabbar-item>
      </van-tabbar>

      <x-btn-bar v-if="playfun_active === '号码' || playfun_active === '生肖'" v-model="min_playfun_active" class="minPlayFunBar">
        <x-btn-item name="码一">码一</x-btn-item>
        <x-btn-item name="码二">码二</x-btn-item>
        <x-btn-item name="码三">码三</x-btn-item>
        <x-btn-item name="码四">码四</x-btn-item>
        <x-btn-item name="码五">码五</x-btn-item>
        <x-btn-item name="码六">码六</x-btn-item>
        <x-btn-item name="特码">特码</x-btn-item>
      </x-btn-bar>
      <div class="chartTitle" v-if="playfun_active === '号码' || playfun_active === '生肖'">{{ min_playfun_active }}走势</div>
    </template>
    <div class="chartBody">
      <x-chart
        v-if="chart_data"
        :chart_data="chart_data"
        :type="chart_type"
        :theyear="theyear"
        :min_playfun_active="min_playfun_active"
        ref="xChart"
      />
    </div>
  </x-layout>
  <!-- <div class="page-RunChart-root">
    <x-fixed offset-top="44" ref="fixed"> </x-fixed>
   
  </div> -->
</template>

<script>
import { getLottoHistory } from '@/api/games'

import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'
import xBtnBar from 'cpt/x-btn-combo/x-btn-bar.vue'
import xBtnItem from 'cpt/x-btn-combo/x-btn-item.vue'
import xChart from 'cpt/x-chart/x-chart.vue'

export default {
  components: {
    xHeader,
    xFixed,
    xBtnBar,
    xBtnItem,
    xChart
  },
  data() {
    return {
      min_playfun_active: '特码',
      playfun_active: '号码',
      value: 0,
      option: [{ text: '香港六合彩', value: 0 }],
      chart_type: 'coom',
      chart_data: null,
      theyear: ''
    }
  },
  computed: {
    mainTop() {
      if (this.playfun_active === '号码' || this.playfun_active === '生肖') return 168
      else return 88
    }
  },
  created() {
    this.getLottoHistory()
  },
  methods: {
    async getLottoHistory() {
      let par = {
        gametype: 1,
        startind: 0
      }
      let { ok, msg } = await getLottoHistory(par)
      if (ok) {
        this.chart_data = msg.draws
        this.theyear = msg.theyear
      } else {
      }
    },
    playClick(val) {
      this.playfun_active = val
      this.$nextTick(() => {
        G.delay(() => {
          this.$refs.xChart.refresh()
        }, 100)
      })
    },
    onMaxClsChange() {
      if (this.playfun_active === '号码') {
        this.chart_type = 'coom'
        // this.chart_data = [];
      } else if (this.playfun_active === '生肖') {
        this.chart_type = 'zodiac'
        // this.chart_data = [];
      } else if (this.playfun_active === '大小') {
        this.chart_type = 'size'
        // this.chart_data = [];
      } else if (this.playfun_active === '单双') {
        this.chart_type = 'oddeven'
        // this.chart_data = [];
      } else if (this.playfun_active === '混合') {
        this.chart_type = 'hunhe'
        // this.chart_data = [];
      }
      // this.$nextTick(() => {
      //   this.$refs.fixed.refresh()
      // })
    }
  }
}
</script>

<style lang="scss">
.page-RunChart-root {
  .xl-header {
    background-color: $white;
  }
  .van-tabbar-item__text {
    font-size: 16px;
  }
  .van-dropdown-menu {
    height: 44px;
    background-color: $rootColor;
    .van-dropdown-menu__title {
      color: $white;
    }
  }
  .van-tabbar {
    height: 44px;
    .van-tabbar-item {
      position: relative;
      transition-property: all;
      transition-duration: 500ms;
      &::after {
        display: block;
        content: '';
        position: absolute;
        transition-property: all;
        transition-duration: 500ms;
        transition-timing-function: ease-out;
        width: 0;
        left: 0;
        bottom: 0;
        border-top: 2px solid $rootColor;
        transform: translateX(-150%);
      }
    }
    .van-tabbar-item--active {
      color: $rootColor;
      position: relative;
      &::after {
        width: 50%;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .minPlayFunBar {
    padding: 13px 15px;
    justify-content: space-evenly;
    .x-btn-item {
      height: 20px;
      border-radius: 10px;
      line-height: 20px;
      background-color: #ededed;
      &.xb-active {
        background-color: #ffd9dd;
        color: $rootColor;
      }
    }
  }

  .chartTitle {
    font-size: 15px;
    color: $txt;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    background-color: #f5f5f5;
  }
}
</style>
