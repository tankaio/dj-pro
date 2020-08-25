<template>
  <x-layout modifier="awardInfo" main-center-color="#fff">
    <x-header @click-right="clickRight" slot="header">
      选择年份
    </x-header>
    <x-tabs position fixed :offset-top="44" v-model="active">
      <x-tab title="开奖记录" sticky :offset-top="44">
        <x-list position v-model="loading" :finished="finished" :error.sync="error" :offset="10" @load="onLoad" :active="active === 0">
          <x-lottery
            v-for="(item, index) in data_list"
            :key="index"
            :url="`/awardInfo/awardDetail/${item.round}`"
            :period="`${item.date}第${item.round}期`"
            :nums="item.nums"
            pure
            isLotteryNum
          />
        </x-list>
      </x-tab>
      <x-tab title="开奖日期" class="tab2">
        <div class="weeks">
          <span class="special">日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
        </div>
        <x-calendar2 :calendar="calendar"></x-calendar2>
      </x-tab>
    </x-tabs>
    <van-popup get-container="#box" v-model="time_picker" position="bottom">
      <van-picker title="选择年份" show-toolbar :default-index="5" :columns="columns" @cancel="onCancel" @confirm="onConfirm" />
    </van-popup>
  </x-layout>
</template>

<script>
import { getHkcDrawsByYear, getHkcOpenDay } from '@/api/home'

import xPage from 'cpt/x-page.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xList from 'cpt/x-list/x-list.vue'
import xLottery from 'cpt/x-lottery/x-lottery.vue'
import xCalendar from 'cpt/x-calendar/x-calendar.vue'
import xCalendar2 from 'cpt/x-calendar/x-calendar2.vue'

export default {
  components: {
    xPage,
    xTabs,
    xTab,
    xList,
    xLottery,
    xCalendar,
    xCalendar2
  },
  data() {
    return {
      active: 0,
      time_picker: false,
      columns: [],
      data_list: [],
      page_index: 0,
      loading: false,
      finished: false,
      error: false,
      theyear: '', // 当年生肖
      calendar: []
    }
  },
  methods: {
    clickRight() {
      this.time_picker = true
    },
    onCancel() {
      this.time_picker = false
    },
    onConfirm(val, index) {
      if (val !== this.year) {
        this.year = val
        this.getHkcDrawsByYear()
      }
      this.time_picker = false
    },
    async getHkcDrawsByYear(scroll) {
      let { ok, msg } = await getHkcDrawsByYear({
        year: this.year,
        startind: this.data_list.length
      })
      if (ok) {
        let data_list = G.get(msg, 'draws', [])
        this.theyear = G.get(msg, 'theyear', '')
        if (scroll) {
          this.data_list.push.apply(this.data_list, data_list)
          // this.page_index++;
          if (!data_list.length) this.finished = true
        } else {
          // this.page_index = 0;
          this.data_list = data_list
          this.finished = false
          this.error = false
        }
        this.loading = false
      } else {
        this.error = true
      }
    },
    onLoad() {
      this.getHkcDrawsByYear(true)
    },
    async onCanlendarChange(time) {
      let params = {}
      if (time) {
        params.month = time.month
        params.year = time.year
      } else {
        let date = new Date()
        params.month = date.getMonth()
        params.year = date.getFullYear()
      }
      let { ok, msg } = await getHkcOpenDay(params)
      this.calendar = msg || []
    }
  },
  created() {
    this.year = new Date().getFullYear()
    for (let i = 0; i < 10; i++) {
      this.columns.push(this.year - i)
    }
    this.$root.animateDelay(() => {
      this.getHkcDrawsByYear()
      this.onCanlendarChange()
    })
  }
}
</script>

<style lang="scss">
.page-awardInfo-root {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .xt-tabbar {
    height: 40px;
  }
  .xt-middle {
    position: fixed;
    top: 44px;
    background-color: $white;
  }
  .x-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    .xt-containers {
      flex: 1;
      display: flex;
      flex-direction: column;
      .xt-context {
        flex: 1;
        height: 100%;
        .x-tab {
          width: 375px;
          min-width: 375px;
          max-width: 375px;
          &.tab2 {
            overflow: hidden;
          }
          .weeks {
            display: flex;
            background-color: $baseBgColor;
            position: relative;
            z-index: 5;
            span {
              flex: 1;
              height: 30px;
              font-size: 15px;
              color: $txt;
              text-align: center;
              line-height: 30px;
              &.special {
                color: $rootColor;
              }
            }
          }
        }
      }
    }
  }
}
</style>
