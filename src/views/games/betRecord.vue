<template>
  <div class="bet-record">
    <x-header :is-right="true" @betrecord-right="changeright" />

    <van-cell class="titlebg">
      <van-row v-for="(v, i) in titles" :key="i">{{ v }}</van-row>
    </van-cell>
    <van-list v-model="loading" :finished="finished" @load="getOrders(startind)">
      <van-cell v-for="(item, index) in recorddatas" :key="index" @click="detailsBtn(orderid[index])">
        <van-row v-for="(e, i) in recorddatas[index]" :key="i" :class="e == '已中奖' ? 'red' : ''">
          {{ e }}
        </van-row>
      </van-cell>
    </van-list>
    <van-popup v-model="show" closeable position="right" :style="{ width: '80%', height: '100%' }">
      <div class="record-right">
        <div class="record80">
          <div class="type-title">
            注单状态
          </div>
          <div class="btns-type">
            <div
              v-for="(item, index) of types"
              :key="typesnum.index"
              class="btns"
              :class="{ checked: typesnum[index] == num }"
              @click="changeList(typesnum[index])"
            >
              {{ item }}
            </div>
          </div>
          <div class="type-title">
            投注时间
          </div>
          <div class="btns-type">
            <div
              v-for="(item, index) of days"
              :key="daysnum.index"
              class="btns"
              :class="{ checked: daysnum[index] == daynum }"
              @click="changeDays(daysnum[index])"
            >
              {{ item }}
            </div>
          </div>
          <div class="btns-type">
            <x-filter-item type="interval">
              <van-field disabled @click="showDate1 = true" v-model="start_time"></van-field>
              <i class="itv">-</i>
              <van-field disabled @click="showDate2 = true" v-model="end_time"></van-field>
            </x-filter-item>
          </div>
          <div class="t-btns">
            <div class="chongzhi" @click="resetBet">重置</div>
            <div class="queren" @click="getOrders(-1)">确认</div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showDate1" position="bottom">
      <van-datetime-picker v-model="date1" type="date" :min-date="minDate1" :max-date="maxDate1" @confirm="date1Confirm" @cancel="cancel" />
    </van-popup>

    <van-popup v-model="showDate2" position="bottom">
      <van-datetime-picker v-model="date2" type="date" :min-date="minDate2" :max-date="maxDate2" @confirm="date2Confirm" @cancel="cancel" />
    </van-popup>
    <!-- <button @click="getOrders(startind)">加载</button> -->
    <div v-if="dataTip" class="dataTip">没有更多数据了</div>
  </div>
</template>
<script>
import { getOrders } from '@/api/games'
import { getWithTimeYMD } from '@/utils/formant.util.js'
import { log } from 'util'

import xHeader from 'cpt/x-header.vue'
import xFilterItem from 'cpt/x-filter-item.vue'

export default {
  components: {
    xHeader,
    xFilterItem
  },
  name: 'betrecord',
  data() {
    return {
      show: false, //右侧弹出
      loading: false,
      finished: false,

      start_time: '',
      end_time: '',

      showDate1: false,
      date1: new Date(), //
      minDate1: new Date(2018, 11, 20), //
      maxDate1: new Date(), //

      showDate2: false,
      date2: new Date(), //
      minDate2: new Date(2019, 11, 20), //
      maxDate2: new Date(), //
      /*************************时间************************ */
      name: 'betrecord',
      titles: ['彩种', '期号', '投注积分', '状态'],
      recorddatas: [],
      types: ['已中奖', '未中奖', '待开奖', '已撤单', '全部'],
      typesnum: [102, 103, 100, 101, '100,101,102,103'],
      num: null, //默认
      days: ['今天', '近3天', '近7天'],
      daysnum: [0, -3, -7], //0当天，
      daynum: null,
      dataTip: false,
      maxorderid: Infinity,
      startind: 0,
      orderid: [] //单号数组
    }
  },
  created() {
    // this.getOrders()
    window.onscroll = this.jiazai
  },
  methods: {
    detailsBtn(n) {
      this.$router.push({ path: '/games/betDetails', query: { id: n } })
    },
    cancel() {
      //取消-隐藏时间控件
      this.showDate1 = false
      this.showDate2 = false
    },
    jiazai() {
      if (!this.dataTip) {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight //滚动条到底部的条件
        if (scrollTop + windowHeight >= scrollHeight - 1) {
          //写后台加载数据的函数
          //console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
          this.getOrders(this.startind)
        }
      }
    },
    /********************************************************************** */
    resetBet() {
      this.start_time = ''
      this.end_time = ''
      this.date1 = new Date()
      this.date2 = new Date()
      this.num = ''
      this.daynum = null
      this.maxorderid = Infinity
      console.log(this.date1)
      console.log(this.date2)
    },
    getDay(day) {
      var today = new Date()
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds) //注意，这行是关键代码
      var tYear = today.getFullYear()
      var tMonth = today.getMonth()
      var tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      this.start_time = tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth(month) {
      var m = month
      if (month.toString().length == 1) {
        m = '0' + month
      }
      return m
    },
    date1Confirm(v) {
      this.showDate1 = false
      let ymd = getWithTimeYMD(v)
      this.start_time = ymd
      //去掉快捷选时-状态
      this.daynum = null
    },
    date2Confirm(v) {
      this.showDate2 = false
      let ymd = getWithTimeYMD(v)
      this.end_time = ymd
      //去掉快捷选时-状态
      this.daynum = null
    },
    getOrdersBtn() {
      this.getOrders()
      // this.getOrders()
    },
    async getOrders(e) {
      //加载状态开始
      this.loading = true
      this.dataTip = false
      console.log(this.dataTip)
      if (e == -1) {
        this.startind = 0
        this.recorddatas = []
        console.log(this.recorddatas)

        this.maxorderid = Infinity
        this.show = false
        this.dataTip = false
        e = 0
      }
      let datas = {
        amounttype: 0, //0积分/1金币
        type: this.num || '100,101,102,103,104',
        date1: this.start_time || getWithTimeYMD(this.date1),
        date2: this.end_time || getWithTimeYMD(this.date2),
        startind: e || 0 // 起始单号
      }
      console.log(this.start_time)

      console.log(datas)
      let { ok, msg } = await getOrders(datas)
      if (ok) {
        this.finished = true
        let arr = msg.filter(item => {
          return item.gamename != '' && item.orderid < this.maxorderid
        })
        this.startind = this.startind + arr.length
        // console.log(this.startind);

        // console.log(arr);
        if (arr.length == 0) {
          this.dataTip = true
          //没有数据 关闭加载
          console.log('关闭')
        } else {
          this.dataTip = false
          this.maxorderid = msg[msg.length - 1].orderid
          arr.map(item => {
            let types = item.type
            switch (types) {
              case 100:
                types = '未开奖'
                break
              case 101:
                types = '已撤单'
                break
              case 102:
                types = '已中奖'
                break
              case 103:
                types = '未中奖'
                break
              case 104:
                types = '和局'
                break
            }
            this.recorddatas.push([item.gamename, item.round, item.amount, types])
            this.orderid.push(item.orderid)
          })
        }
        //加载状态结束
        this.loading = false

        this.show = false
        // console.log(this.recorddatas);
      } else {
        console.log(msg)
      }
    },
    changeright() {
      this.show = true
      // this.changinfo=!this.changinfo
      // console.log(this.changinfo);
    },
    changeList(index) {
      console.log(index)

      this.num = index
      // this.types = index;//this指向app
    },
    changeDays(index) {
      this.daynum = index
      this.getDay(index)
      console.log(index)
    }
  }
}
</script>
<style lang="scss">
.bet-record {
  padding-bottom: 50px;
  // //padding-top: 44px;
  background-color: $roomBg;
  flex: 1;
  .titlebg {
    margin-bottom: 5px;
  }
  .dataTip {
    line-height: 34px;
    text-align: center;
    color: #999;
  }
  .record-right {
    width: 100%;
    height: 100%;
    z-index: 99;
    display: flex;
    top: 0;
    position: fixed;
    left: 0;
    .record80 {
      width: 100%;
      background: #fff;
      padding: 44px 10px 0;
      color: #333;
      .type-title {
        line-height: 34px;
        width: 100%;
      }
      .btns-type {
        width: 100%;
        .x-filter-item {
          padding: 0 0.06rem;
        }
        .btns {
          width: 83px;
          border: 1px solid #d7d7d7;
          line-height: 34px;
          text-align: center;
          border-radius: 5px;
          margin: 4px;
          display: inline-block;
        }
        .checked {
          background: #f74e60;
          color: #fff;
          border: 1px solid #f74e60;
        }
      }
      .t-btns {
        width: 100%;
        height: 44px;
        position: fixed;
        bottom: 0;
        left: 0;
        text-align: center;
        .chongzhi {
          width: 50%;
          display: inline-block;
          background: #f5f5f5;
          line-height: 44px;
          font-size: 13px;
          color: #333;
        }
        .queren {
          width: 50%;
          display: inline-block;
          background: #ec293c;
          line-height: 44px;
          font-size: 13px;
          color: #fff;
        }
      }
    }
    .record-right-bg {
      width: 100%;
      height: 100%;
      background: rgba(#000, 0.3);
      position: fixed;
      z-index: -1;
    }
  }
  .record-table {
    width: 100%;
    text-align: center;
    thead {
      background: $gray-d7;
      line-height: 32px;
    }
    tbody {
      line-height: 44px;
      font-size: 14px;
      tr {
        background: $white;

        margin-bottom: 1px;
        td {
          border-bottom: 1px solid $gray-d7;
        }
        td.red {
          color: red;
        }
      }
    }
  }
  .van-cell__value {
    width: 100%;
    display: contents;
  }
  .van-row {
    flex: 1;
    text-align: center;
    // line-height: 1;
  }
}
</style>
