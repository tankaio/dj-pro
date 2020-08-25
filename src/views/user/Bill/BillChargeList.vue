<template>
  <div class="bill-charge-list">
    <div class="sticky-bar">
      <div class="sticky-container">
        <div class="list-hd van-hairline--bottom">
          <div class="item">时间</div>
          <div class="item">充值类型</div>
          <div class="item">充值金额</div>
          <div class="item">充值积分</div>
        </div>
      </div>
    </div>

    <x-list v-model="loading" :finished="finished" :error.sync="error" @load="GetLoadingOrders" :active="idx === 2">
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :to="{
          path: `/orderDetail/charge/${item.orderid}`,
          query: {
            t: item.time,
            s: item.state,
            a: item.amount,
            b: item.balance,
            r: item.remark,
            sa: item.stramount
          }
        }"
      >
        <div class="item">{{ item.time }}</div>
        <div class="item">
          {{ item.type | filterType }}
          <span class="success-tick" v-if="item.state == 1"></span>
          <span class="fail-circle" v-else></span>
        </div>
        <div class="item">{{ item.amount }}</div>
        <div class="item">{{ item.balance }}积分</div>
      </van-cell>
    </x-list>

    <x-filter-rpop v-model="show_filter_pop" @confirm="filterConfirm" @reset="filterReset">
      <x-filter-item tit="账变类型" type="playMathod" bar="bill_type">
        <x-act-button cls="active" :idx="1" v-model="bill_type">
          线下充值
        </x-act-button>
        <x-act-button cls="active" :idx="2" v-model="bill_type">
          客服快充
        </x-act-button>
      </x-filter-item>
      <x-filter-item tit="订单状态" type="playMathod" bar="bill_type">
        <x-act-button cls="active" :idx="1" v-model="order_state">
          充值成功
        </x-act-button>
        <x-act-button cls="active" :idx="2" v-model="order_state">
          充值失败
        </x-act-button>
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
import { GetLoadingOrders } from '@/api/user'
import { getTime, getWithTimeYMD } from '@/utils/formant.util.js'

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
    xActButton,
    xNodata
  },
  props: ['idx', 'filterActive'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,

      show_filter_pop: false,

      order_state: 0,
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
      this.GetLoadingOrders()
    },
    filterReset() {
      this.show_filter_pop = false
      this.bill_type = ''
      this.start_time = ''
      this.end_time = ''
      this.order_state = ''

      this.startind = 0
      this.reset = true
      this.$emit('update:filterActive', false)
      this.GetLoadingOrders()
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
    async GetLoadingOrders() {
      let params = {
        startind: this.list.length
      }

      if (this.start_time) params.date1 = this.start_time
      if (this.end_time) params.date2 = this.end_time
      if (this.bill_type) params.type = this.bill_type
      if (this.order_state) params.state = this.order_state

      let { ok, msg } = await GetLoadingOrders(params)

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
  filters: {
    filterType(val) {
      switch (val) {
        case 1:
          return '线下充值'
        case 2:
          return '客服快充'
        default:
          break
      }
    }
  },
  watch: {
    idx(news) {
      // 页面激活且
      if (news === 2 && !this.list.length) {
        this.GetLoadingOrders()
      }
    }
  },
  created() {
    let popActive = () => {
      if (this.idx === 2) {
        this.show_filter_pop = true
      }
    }
    this.$eventBus.$on('pop:active', popActive)
    this.$on('hook:destroyed', () => this.$eventBus.$off('pop:active', popActive))
  }
}
</script>

<style lang="scss"></style>
