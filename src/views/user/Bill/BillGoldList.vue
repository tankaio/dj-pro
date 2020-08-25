<template>
  <div class="bill-gold-list">
    <div class="sticky-bar">
      <div class="sticky-container">
        <div class="list-hd van-hairline--bottom">
          <div class="item">时间</div>
          <div class="item">类型</div>
          <div class="item">账变数额</div>
          <div class="item">账变后余额</div>
        </div>
      </div>
    </div>

    <x-list v-model="loading" :finished="finished" :error.sync="error" @load="GetOrders" :active="idx === 0">
      <van-cell v-for="(item, index) in list" :key="index">
        <div class="item">{{ item.time }}</div>
        <div class="item">{{ item.type | filterType }}</div>
        <div class="item">{{ item.amount }}</div>
        <div class="item">{{ item.balan_c }}</div>
      </van-cell>
    </x-list>

    <x-filter-rpop v-model="show_filter_pop" @confirm="filterConfirm" @reset="filterReset">
      <x-filter-item tit="账变类型" type="playMathod" bar="bill_type">
        <x-act-button cls="active" :idx="1" v-model="bill_type">计划卖出</x-act-button>
        <x-act-button cls="active" :idx="2" v-model="bill_type">伙伴消费</x-act-button>
        <x-act-button cls="active" :idx="3" v-model="bill_type">金币兑换</x-act-button>
        <x-act-button cls="active" :idx="4" v-model="bill_type">绑定邀请码</x-act-button>
        <x-act-button cls="active" :idx="5" v-model="bill_type">提款</x-act-button>
        <x-act-button cls="active" :idx="6" v-model="bill_type">活动奖励</x-act-button>
        <x-act-button cls="active" :idx="7" v-model="bill_type">被打赏(头条)</x-act-button>
        <x-act-button cls="active" :idx="8" v-model="bill_type">被打赏(晒单圈)</x-act-button>
        <x-act-button cls="active" :idx="9" v-model="bill_type">返奖</x-act-button>
        <x-act-button cls="active" :idx="10" v-model="bill_type">撤奖</x-act-button>
        <x-act-button cls="active" :idx="11" v-model="bill_type">重新派奖</x-act-button>
      </x-filter-item>
      <x-filter-item tit="账变时间区间" type="interval">
        <van-field disabled @click="showDate1 = true" v-model="start_time"></van-field>
        <i class="itv">-</i>
        <van-field disabled @click="showDate2 = true" v-model="end_time"></van-field>
      </x-filter-item>
    </x-filter-rpop>

    <van-popup get-container="#box" v-model="showDate1" position="bottom">
      <van-datetime-picker v-model="date1" type="date" :min-date="minDate1" :max-date="maxDate1" @confirm="date1Confirm" />
    </van-popup>

    <van-popup get-container="#box" v-model="showDate2" position="bottom">
      <van-datetime-picker v-model="date2" type="date" :min-date="minDate2" :max-date="maxDate2" @confirm="date2Confirm" />
    </van-popup>
  </div>
</template>

<script>
import { GetOrders } from '@/api/user'
import { getWithTimeYMD, getTime } from '@/utils/formant.util.js'

import xList from 'cpt/x-list/x-list.vue'
import xFilterRpop from 'cpt/x-filter-rpop.vue'
import xFilterItem from 'cpt/x-filter-item.vue'
import xActButton from 'cpt/x-act-button.vue'
import xNodata from 'cpt/x-nodata.vue'
export default {
  components: {
    xList,
    xFilterRpop,
    xFilterItem,
    xNodata,
    xActButton
  },
  props: ['idx', 'filterActive'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,

      show_filter_pop: false,

      bill_type: 0,
      start_time: '',
      end_time: '',

      showDate1: false,
      date1: new Date(), //
      minDate1: new Date(2019, 11, 20), //
      maxDate1: new Date(2025, 12, 30), //

      showDate2: false,
      date2: new Date(), //
      minDate2: new Date(2019, 11, 20), //
      maxDate2: new Date(2025, 12, 30), //
      startind: 0,
      reset: false
    }
  },
  methods: {
    filterConfirm() {
      // 这里还需要激活与重置判定
      this.reset = true
      this.startind = 0
      this.$emit('update:filterActive', true)
      this.GetOrders()
    },
    filterReset() {
      this.show_filter_pop = false
      this.bill_type = ''
      this.start_time = ''
      this.end_time = ''
      this.reset = true
      this.startind = 0
      this.$emit('update:filterActive', false)
      this.GetOrders()
    },
    date1Confirm(v) {
      this.showDate1 = false
      let ymd = getWithTimeYMD(v)
      this.minDate2 = new Date(v)
      this.start_time = ymd
    },
    date2Confirm(v) {
      this.showDate2 = false
      let ymd = getWithTimeYMD(v)
      this.end_time = ymd
    },
    async GetOrders() {
      let params = {
        amounttype: 1,
        startind: this.list.length
      }

      if (this.start_time) params.date1 = this.start_time
      if (this.end_time) params.date2 = this.end_time
      if (this.bill_type) params.type = this.bill_type

      let { ok, msg } = await GetOrders(params)

      if (ok) {
        if (this.reset) {
          this.list = msg
          this.reset = false
        } else {
          this.list.push.apply(this.list, msg)
        }

        // this.startind++;
      }
    }
  },
  watch: {
    idx(news) {
      // 页面激活且
      if (news === 1 && !this.list.length) {
        this.GetOrders()
      }
    }
  },
  filters: {
    filterType(val) {
      switch (val) {
        case 1:
          return '计划卖出'
        case 2:
          return '伙伴消费'
        case 3:
          return '金币兑换'
        case 4:
          return '绑定邀请码'
        case 5:
          return '提款'
        case 6:
          return '活动奖励'
        case 7:
          return '被打赏(头条)'
        case 8:
          return '被打赏(晒单圈)'
        case 9:
          return '返奖'
        case 10:
          return '撤奖'
        case 11:
          return '重新派奖'
        default:
          break
      }
    }
  },
  created() {
    let popActive = () => {
      if (this.idx === 1) {
        this.show_filter_pop = true
      }
    }
    this.$eventBus.$on('pop:active', popActive)
    this.$on('hook:destroyed', () => this.$eventBus.$off('pop:active', popActive))
  }
}
</script>

<style lang="scss"></style>
