<template>
  <div class="x-calendar2">
    <div
      class="xc__composition"
      @touchmove.prevent="onTouchMove"
      @touchstart.prevent="onTouchStart"
      @touchend.prevent="onTouchEnd"
      :style="{ ['transition-duration']: `${duration}ms`, transform: `translateY(${excursion}px)` }"
    >
      <div
        class="xc__panel"
        :style="{ height: `${xcPanelHeight}px`, transform: `translateY(${xcPanelHeight * posi_item.idx}px)` }"
        v-for="(posi_item, posi_idx) in positionIndex"
        :key="posi_idx"
      >
        <div class="xc__mouth">{{ posi_item.year }}年{{ posi_item.month }}月</div>
        <!-- 月份 -->
        <div class="xc__container van-hairline--bottom">
          <div
            class="xc__day"
            :class="{
              someMonth: item.someMonth,
              open: item.open,
              today: item.today,
              ['van-hairline--top']: item.someMonth
            }"
            v-for="(item, index) in posi_item.list"
            :key="index"
          >
            <span class="xc__content">{{ item.time }}</span>
          </div>
        </div>
        <!-- 标记 -->
        <div class="xc__example">
          <span class="xc__square"></span>
          <span>开奖日</span>
          <span class="xc__circle"></span>
          <span>当前日期</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { frameDate } from './core'
import { getHkcOpenDay } from '@/api/home'
export default {
  name: 'x-calendar2',
  props: {
    calendar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      positionIndex: [-1, 0, 1],
      initData: [],
      index: 0,
      xcPanelHeight: 0,
      duration: 0,
      excursion: 0,
      yDiff: 0,
      nowY: 0
    }
  },
  methods: {
    // [last month,this month,next month]
    init() {
      this.positionIndex = this.positionIndex.map((item, index) => {
        let res = frameDate(item, this.initData)
        return {
          idx: item,
          list: res.res,
          month: res.month,
          year: res.year
        }
      })
    },
    draw(index) {
      let res = frameDate(index, this.calendar)
      return res.res
    },
    layout() {
      this.$nextTick(() => {
        this.xcPanelHeight = $('.x-calendar2').height()
        if (this.xcPanelHeight === 0) {
          G.delay(() => {
            this.layout()
          }, 100)
        }
      })
    },
    onTouchStart(e) {
      this.duration = 0
      let { x, y } = G.$swiper(e).page
      this.nowY = y
    },
    onTouchMove(e) {
      G.$swiper.direction(e, (__, y) => {
        this.yDiff = y - this.nowY
        this.excursion = this.yDiff + this.index * this.xcPanelHeight
      })
    },
    onTouchEnd(e) {
      let critical = 0
      this.duration = 200
      if (Math.abs(this.yDiff) > 200) {
        if (this.yDiff > 0) {
          critical = Math.abs(this.positionIndex[0].idx)
          this.index++
        } else {
          critical = Math.abs(this.positionIndex[this.positionIndex.length - 1].idx)
          this.index--
        }
        //   边界溢出处理
        if (Math.abs(this.index) === critical) {
          let idx = this.index < 0 ? critical + 1 : -critical - 1
          let res = frameDate(idx)
          let item = {
            idx,
            list: res.res,
            month: res.month,
            year: res.year
          }

          // 根据返回的月份请求信息
          this.getCanlendarData(res.year, res.month, data => {
            console.log(res.year, res.month, data, 'data')
            res = frameDate(idx, data || [])
            item = {
              idx,
              list: res.res,
              month: res.month,
              year: res.year
            }
            if (this.index < 0) {
              // 请求前一个月数据
              this.positionIndex.push(item)
              this.index = -critical
            } else {
              // 请求后一个月数据
              this.positionIndex.unshift(item)
              this.index = critical
            }
          })
        }
      }
      this.excursion = this.index * this.xcPanelHeight
    },
    async getCanlendarData(year, month, callback = () => {}) {
      let { ok, msg } = await getHkcOpenDay({
        year,
        month
      })
      if (year === 0 && month === 0) {
        this.initData = msg
        this.init()
      } else {
        // 其他按月请求
        callback(msg)
      }
    }
  },
  created() {},
  mounted() {
    this.layout()
    this.getCanlendarData(0, 0)
  }
}
</script>

<style lang="scss">
.x-calendar2 {
  height: calc(100% - 30px);
  max-width: 100vw;
  position: relative;
}
.xc__panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.xc__mouth {
  height: 50px;
  font-size: 17px;
  font-weight: 600;
  color: $red-f0;
  text-align: center;
  padding-top: 25px;
  box-sizing: border-box;
}
.xc__container {
  display: flex;
  flex-wrap: wrap;
}
.xc__day {
  height: 70px;
  width: 14%;
  text-align: center;
  opacity: 0;
  &.someMonth {
    opacity: 1;
  }
  &.open {
    .xc__content {
      border-radius: 50%;
      border: 1px solid $red-f0;
      color: $red-f0;
    }
  }
  &.today {
    .xc__content {
      background-color: $red-f45;
      border-radius: 50%;
      overflow: hidden;
      color: $white;
    }
  }
}
.xc__content {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
  display: inline-block;
  font-size: 17px;
  font-weight: 600;
  margin-top: 4px;
}
.xc__example {
  padding: 0 42.5px;
  margin-top: 18px;
  display: flex;
  align-items: center;
}
.xc__square {
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
  border: 1px solid $red-f45;
}
.xc__circle {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  background-color: $rootColor;
  margin-left: 30px;
  margin-right: 10px;
}
</style>
