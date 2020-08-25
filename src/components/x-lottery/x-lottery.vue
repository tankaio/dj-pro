<template>
  <div class="x-lottery">
    <div class="title van-hairline--top" v-if="period">
      <van-cell class="van-hairline--bottom">
        <template slot="icon">
          <span class="xIcon-period-cm"></span>
        </template>
        <template slot="title">
          <span>{{ period }}</span>
          <span class="lottery-num" v-if="isLotteryNum">{{ lotteryNum }}</span>
        </template>
      </van-cell>
    </div>
    <div class="period-bar" @click.stop="onRootClick">
      <div class="item" :class="{ special: item.special }" v-for="(item, index) in column" :key="'key_' + index">
        <template v-if="item.special">
          <div class="special">
            +
          </div>
        </template>
        <template v-else>
          <template v-if="index === 7">
            <x-openlottery :pure="pure">
              <x-circle :txt="item.txt" :num="item.num" />
            </x-openlottery>
          </template>
          <template v-else>
            <x-circle :txt="item.txt" :num="item.num" :animate="item.animate" />
          </template>
        </template>
      </div>
      <van-icon v-if="rightArrow" name="arrow" />
    </div>
    <div class="attr" v-if="isSize || isDouble">
      <div class="size van-hairline--top" v-if="isSize">
        <span v-for="(item, index) in size" :class="{ special: item === '' }" :key="index">{{ item }}</span>
      </div>
      <div class="double van-hairline--top" v-if="isDouble">
        <span v-for="(item, index) in double" :class="{ special: item === '' }" :key="index">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import xCircle from "./x-circle";
import { BuildBallsXiao } from '@/utils/rule/zodiac.rule.js'
import { mapGetters, mapMutations } from 'vuex'

import xOpenlottery from 'cpt/x-lottery/x-openlottery.vue'
import xCircle from 'cpt/x-lottery/x-circle.vue'

import { getSize, odd_even, getSum, getSingleSize, getSingleOddEven } from '@/utils/rule/openLottery.rule.js'
export default {
  components: {
    xOpenlottery,
    xCircle
  },
  name: 'x-lottery.vue',
  props: {
    url: String,
    period: String,
    pure: {
      type: Boolean,
      default: false
    },
    rightArrow: {
      type: Boolean,
      default: true
    },
    nums: {
      type: Array,
      default: () => []
    },
    animate: Boolean,
    isSize: Boolean,
    isDouble: Boolean,
    isLotteryNum: Boolean
  },
  model: {
    prop: 'nums',
    event: 'sync'
  },
  data() {
    return {
      specialCode: false,
      special_open: false
    }
  },
  methods: {
    ...mapMutations(['clearOpenLottery', 'setSpecialRun']),
    lotterySpecialOpen() {
      // 当前特码开奖
      ls('openSpecialNumberState', {
        issue: this.getNowIssue,
        open: true
      })
      this.setSpecialRun(false)
    },
    onRootClick() {
      this.$emit('click')
      if (this.url) {
        this.$router.push(this.url)
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getCuryear', 'getOpenLottery', 'getSpecialRun', 'getNowIssue']),
    // specialRun() {
    //   let openSpecialNumberState = ls("openSpecialNumberState");
    //   if (this.getSpecialRun) {
    //     ls("openSpecialNumberState", {
    //       issue: this.getNowIssue,
    //       open: false
    //     });
    //   }
    //   if (G.isEmpty(openSpecialNumberState)) {
    //     this.setSpecialRun(true);
    //     return true;
    //   } else {
    //     let { issue, open } = openSpecialNumberState;
    //     if (this.getNowIssue > issue) {
    //       this.setSpecialRun(true);
    //       return true;
    //     } else if (open) {
    //       this.setSpecialRun(false);
    //       return false;
    //     } else {
    //       this.setSpecialRun(true);
    //       return true;
    //     }
    //   }
    // },
    lotteryNum() {
      let sum = getSum(this.nums)
      return `[总和: ${getSize(sum)}/${odd_even(sum)} ${sum}]`
    },
    size() {
      return getSingleSize(this.nums)
    },
    double() {
      return getSingleOddEven(this.nums)
    },
    column() {
      if (!this.getCuryear) return []
      let res = []
      let xiao = BuildBallsXiao(this.getCuryear)
      this.nums.forEach((item, index) => {
        if (index == 6) {
          res.push({
            special: true
          })
        }
        res.push({
          num: item,
          txt: xiao[item]
        })
      })
      if (this.animate) {
        this.specialCode = true
        // res 8 位
        res.forEach((item, index) => {
          if (index != 6) {
            item.animate = true
          }

          // 如果开奖号码已被传入则停止动画
          // getOpenLottery 7 位
          let open_lottery_number = this.getOpenLottery[index === 7 ? 6 : index]
          if (open_lottery_number !== undefined && index !== 6) {
            if (index !== 7) {
              item.animate = false
            }
            item.num = open_lottery_number
            item.txt = xiao[open_lottery_number]
          }
        })
      }
      if (this.getSpecialRun && res.length) {
        res[res.length - 1].animate = false
      }
      return res
    }
  },
  watch: {
    animate(news) {
      if (news) {
      }
    }
  }
}
</script>

<style lang="scss">
.x-lottery {
  .period-bar {
    display: flex;
    padding: 10px 10px 0;
  }
  .attr {
    padding: 0 10px;
  }
  .container {
    margin-top: 5px;
    padding-bottom: 10px;
    flex: 1;
    display: flex;
  }
  .item {
    flex: 1;
    &.special {
      flex: none;
      width: 20px;
    }
  }
  .special {
    height: 34px;
    text-align: center;
    line-height: 34px;
  }
  .van-icon {
    height: 67px;
    line-height: 67px;
    color: $gray-99;
  }
  .van-cell__title {
    margin-left: 9px;
  }
  .lottery-num {
    margin-left: 29px;
  }
  .van-cell {
    align-items: center;
  }
  .size,
  .double {
    display: flex;
    font-size: 13px;
    color: $txt;
    > * {
      flex: 1;
      text-align: center;
      line-height: 33px;
      height: 33px;
    }
    .special {
      flex: none;
      width: 20px;
    }
  }
}
</style>
