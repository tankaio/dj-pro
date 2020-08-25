<template>
  <div class="x-calendar">
    <div class="xc-bar">
      <div class="xc-header">
        <div class="xc-left-btn" @click="reduce">
          <van-icon name="arrow-left" />
        </div>
        <div class="xc-center-tit">{{ year }}年{{ month }}月</div>
        <div class="xc-right-btn" @click="add">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="xc-body">
        <div class="weeks">
          <span class="special">日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
        </div>
      </div>
      <div class="days">
        <span
          v-for="(item, index) in calendar_list"
          :key="index"
          :class="{
            someMonth: item.someMonth,
            today: item.today,
            open: item.open
          }"
        >
          <i>{{ item.time }}</i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { frameDate } from './core'
export default {
  props: {
    calendar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      calendar_list: [],
      month: '',
      year: '',
      index: 0
    }
  },
  methods: {
    draw() {
      let res = frameDate(this.index, this.calendar)
      this.calendar_list = res.res
      this.month = res.month
      this.year = res.year
    },
    reduce() {
      this.index--
      this.draw()
      this.$emit('change', {
        month: this.month,
        year: this.year
      })
    },
    add() {
      this.index++
      this.draw()
      this.$emit('change', {
        month: this.month,
        year: this.year
      })
    }
  },
  watch: {
    calendar(news) {
      this.draw()
    }
  }
}
</script>

<style lang="scss">
.x-calendar {
  display: block;
  height: 276px;
  width: 290px;
  padding-top: 20px;
  background-color: $white;
  position: relative;
  margin: 100px auto 0;
  &::after,
  &::before {
    display: block;
    position: absolute;
    content: '';
    background-color: $rootColor;
    border: 1.5px solid $white;
    width: 10px;
    height: 30.7px;
    border-radius: 5px;
    top: 0;
  }
  &::after {
    left: 66.5px;
  }
  &::before {
    right: 66.5px;
  }
  .xc-bar {
  }
  .xc-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    overflow: hidden;
    > * {
      background-color: $rootColor;
      height: 40px;
      line-height: 40px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      .van-icon {
        color: $white;
      }
    }
  }
  .xc-left-btn {
    width: 30px;
    margin-right: 5px;
  }
  .xc-center-tit {
    flex: 1;
    font-size: 15px;
    color: $white;
  }
  .xc-right-btn {
    width: 30px;
    margin-left: 5px;
  }
  .xc-body {
  }
  .weeks {
    display: flex;
    background-color: $baseBgColor;
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
  .days {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    color: $gray-99;
    &::after,
    &::before {
      display: block;
      position: absolute;
      content: '';
      left: 0;
    }
    &::before {
      top: 0;
      bottom: 0;
      height: 100%;
      border-left: 1px solid $gray-f5;
      transform: rotateY(45deg);
    }
    &::after {
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      border-top: 1px solid $gray-f5;
      transform: rotateX(45deg);
    }
    span {
      width: 40.5px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after,
      &::before {
        display: block;
        position: absolute;
        content: '';
        right: 0;
        bottom: 0;
      }
      &::after {
        top: 0;
        height: 100%;
        border-right: 1px solid $gray-f5;
        transform: rotateY(45deg);
      }
      &::before {
        left: 0;
        width: 100%;
        border-bottom: 1px solid $gray-f5;
        transform: rotateX(45deg);
      }
      &.someMonth {
        color: $txt;
      }
      &.open {
        background-color: $minTag;
      }
      &.today i {
        display: block;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-color: $rootColor;
        color: $white;
      }
    }
  }
}
</style>
