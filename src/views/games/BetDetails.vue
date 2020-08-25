<template>
  <div class="page-BetDetails-root">
    <x-header :is-right="false" />
    <van-cell>
      <span>单号：{{ $route.query.id }}</span>
      <span class="fr">{{ data | typeTit }}</span>
      <div class="game-info">
        <van-row type="flex">
          <van-col span="6" align="center">
            <span class="games-img" :class="data | xhIcon"></span>
            <p class="name-title">{{ data.gnick }}</p>
          </van-col>
          <van-col span="18">
            <p>第{{ data.round }}期</p>
            <p>下注时间：{{ data.time }}</p>
            <p>开奖号码</p>

            <div class="lottery-info">
              <div v-if="!LotteryBalls" v-for="(v, n) in 7" class="balls-bg"></div>
              <div v-for="(item, index) in LotteryBalls" :key="index" class="balls-info">
                <div v-if="index < 6">
                  <div :class="`c-${LotteryBalls[index]}`" class="balls">
                    <div class="core">{{ LotteryBalls[index] }}</div>
                  </div>
                  <div>
                    {{ shengxiaos[(LotteryBalls[index] + nowyear - 1) % 12] }}
                  </div>
                </div>
                <div v-else>
                  <div class="numpua">+</div>
                  <div class="fl">
                    <div :class="`c-${LotteryBalls[index]}`" class="balls">
                      <div class="core">{{ LotteryBalls[index] }}</div>
                    </div>
                    <div>
                      {{ shengxiaos[(LotteryBalls[index] + nowyear - 1) % 12] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </van-cell>

    <van-cell class>
      投注积分：
      <span class="tit">{{ data.amount }}</span
      >积分
    </van-cell>
    <van-cell v-if="data.type == 102" class>
      中奖金币：
      <span class="tit">{{ win }}</span
      >金币
    </van-cell>
    <van-cell class>
      <span>我的投注：</span>
      <div class="bet-info">
        <span v-if="data.type == 102" class="xIcon-games-win-cm win-img"></span>
        <p>{{ data.bets }}</p>
        <p>赔率：{{ data.odds }}</p>
      </div>
    </van-cell>
    <div v-if="data.type == 100" class="BetDetails-foot">
      <p @click="$router.push(`/games/lhc/${gnick}`)">继续下单</p>
      <p class="btnback" @click="cancelOrder">撤单</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getOrderDetail } from '@/api/games'
import { lottoCancel } from '@/api/games'

import xHeader from 'cpt/x-header.vue'

export default {
  components: {
    xHeader
  },
  name: 'BetDetails',
  data() {
    return {
      win: null,
      LotteryBalls: [],
      // nowyear:11,
      shengxiaos: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
      data: {},
      gnick: null
    }
  },
  created() {
    // this.$route.query.id
    this.getOrderDetail()
  },
  filters: {
    xhIcon(e) {
      let icon_map = {
        香港六合彩: 'liuhe-xg'
      }
      return `xIcon-${icon_map[e.game]}-hotrecommended`
    },
    typeTit(e) {
      let types = {
        100: '未开奖',
        101: '已撤单',
        102: '已中奖',
        103: '未中奖',
        104: '和局'
      }
      return types[e.type]
    }
  },
  computed: {
    ...mapGetters(['getCuryear']),
    nowyear() {
      return this.shengxiaos.indexOf(this.getCuryear)
    }
  },
  methods: {
    async getOrderDetail() {
      let id = { orderid: this.$route.query.id }
      let { ok, msg } = await getOrderDetail(id)
      if (ok) {
        console.log(msg)
        this.data = msg
        this.LotteryBalls = msg.draws
        this.gnick = msg.gnick
        this.win = (msg.odds * 10000 * msg.amount) / 10000
      } else {
        console.log(msg)
      }
    },
    cancelOrder() {
      G.$dialog
        .alert({
          title: '是否确定撤单吗？',
          // message:msg,
          showCancelButton: true
        })
        .then(() => {
          // on confirm
          this.lottoCancel()
        })
        .catch(() => {
          // on cancel
        })
    },
    async lottoCancel() {
      let id = {
        orderid: this.$route.query.id,
        gnick: this.gnick
      }
      let { ok, msg } = await lottoCancel(id)
      if (ok) {
        G.$dialog.alert({
          title: '撤单成功'
        })
        this.data.type = 101
      } else {
        G.$dialog.alert({
          title: '撤单失败',
          message: msg
        })
      }
    }
  }
}
</script>
<style lang="scss">
.page-BetDetails-root {
  background-color: #fff;
  padding-bottom: 50px;
  .lottery-info {
    width: 100%;
    text-align: center;
    .balls-bg {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #dedede;
      display: inline-block;
      margin: 0 3px;
    }
    .balls-info {
      margin: 0 2px;
      float: left;
      text-align: center;
      .numpua {
        height: 45px;
        line-height: 45px;
        float: left;
        display: block;
        // width: 28px;
        margin-right: 5px;
      }
      .balls {
        $var: 3px;
        position: relative;
        height: 26px;
        width: 26px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        margin-bottom: 3px;
        &::after,
        &::before,
        .core::after,
        .core::before {
          content: '';
          display: block;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          background-color: $white;
          position: absolute;
        }
        &::after {
          bottom: 21px + $var;
        }
        &::before {
          top: 21px + $var;
        }
        @each $k, $v in $circleLottery {
          &.c-#{$k} {
            background-color: #{$v};
            border: 1px solid #{$v};
          }
        }
        .core::after {
          left: -18px - $var;
          top: 50%;
          transform: translateY(-50%);
        }
        .core::before {
          left: 18 + $var;
        }
        .core {
          position: relative;
          height: 20px;
          width: 20px;
          line-height: 20px;
          border-radius: 50%;
          background-color: $white;
        }
      }
    }
  }
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .tit {
    color: #ec293c;
  }
  span {
    line-height: 34px;
  }
  .game-info {
    border: 1px solid #d7d7d7;
    min-height: 130px;
    border-radius: 5px;
    padding: 10px 5px;
    .name-title {
      font-size: 14px;
    }
    .games-img {
      width: 60px;
      height: 60px;
      display: inline-block;
    }
  }
  .bet-info {
    border: 1px solid #d7d7d7;
    min-height: 80px;
    border-radius: 5px;
    padding: 10px;
    .win-img {
      position: absolute;
      top: 0;
      right: 0;
      width: 109px;
      height: 78px;
    }
  }
  .BetDetails-foot {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    line-height: 44px;
    background: #f5f5f5;
    text-align: center;
    height: 44px;
    p {
      text-align: center;
      display: inline-block;
      min-width: 50%;
      position: initial;
    }
    .btnback {
      width: 50%;
      background: #ec293c;
      display: inline-block;
      color: #fff;
    }
  }
}
</style>
