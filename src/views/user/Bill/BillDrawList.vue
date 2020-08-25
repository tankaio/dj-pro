<template>
  <div class="bill-draw-list">
    <div class="sticky-bar">
      <div class="sticky-container">
        <div class="list-hd van-hairline--bottom">
          <div class="item">时间</div>
          <div class="item">提款状态</div>
          <div class="item">提款金额</div>
          <div class="item">消耗金币</div>
        </div>
      </div>
    </div>

    <x-list v-model="loading" :finished="finished" :error.sync="error" @load="GetDrawingOrders" :active="idx === 3">
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :to="{
          path: `/orderDetail/draw/${item.orderid}`,
          query: {
            t: item.time,
            s: item.state,
            a: item.amount,
            b: item.balance,
            r: item.remark
          }
        }"
      >
        <div class="item">{{ item.time }}</div>
        <div class="item">{{ item.state | filterState }}</div>
        <div class="item">{{ item.amount }}</div>
        <div class="item">{{ item.balance }}金币</div>
      </van-cell>
    </x-list>

    <x-filter-rpop v-model="show_filter_pop" @confirm="filterConfirm" @reset="filterReset">
      <x-filter-item tit="提款状态" type="playMathod" bar="bill_type">
        <x-act-button cls="active" :idx="1" v-model="order_state">
          提款成功
        </x-act-button>
        <x-act-button cls="active" :idx="2" v-model="order_state">
          提款失败
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
import { GetDrawingOrders } from '@/api/user'
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
      this.GetDrawingOrders()
    },
    filterReset() {
      this.show_filter_pop = false
      this.start_time = ''
      this.end_time = ''
      this.order_state = ''

      this.reset = true
      this.startind = 0
      this.$emit('update:filterActive', false)
      this.GetDrawingOrders()
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
    async GetDrawingOrders() {
      let params = {
        startind: this.list.length
      }

      if (this.start_time) params.date1 = this.start_time
      if (this.end_time) params.date2 = this.end_time
      if (this.order_state) params.state = this.order_state

      let { ok, msg } = await GetDrawingOrders(params)

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
      if (news === 3 && !this.list.length) {
        this.GetDrawingOrders()
      }
    }
  },
  filters: {
    filterState(val) {
      switch (val) {
        case 1:
          return '待审核'
        case 2:
          return '审核中'
        case 3:
          return '提款成功'
        case 4:
          return '提款失败'
        default:
          break
      }
    }
  },
  created() {
    let popActive = () => {
      if (this.idx === 3) {
        this.show_filter_pop = true
      }
    }
    this.$eventBus.$on('pop:active', popActive)
    this.$on('hook:destroyed', () => this.$eventBus.$off('pop:active', popActive))
  }
}
</script>

<style lang="scss"></style>
