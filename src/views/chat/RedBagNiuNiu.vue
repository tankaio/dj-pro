<template>
  <div class="page-RedBagNiuNiu-root">
    <x-header @click-right="sendRedRule">
      <van-icon name="warning-o" />
    </x-header>
    <div class="main">
      <van-field
        input-align="right"
        label="最低下注金额"
        :placeholder="`${lower_interval}-${upper_interval}`"
        type="tel"
        v-model="amount"
        v-cursor
      >
        <template #right-icon>
          元
        </template>
      </van-field>

      <van-field
        class="redBagNum"
        input-align="right"
        label="红包个数"
        :placeholder="red_num_placeholder"
        :disabled="red_num_disable"
        type="tel"
        v-model="red_count"
        v-cursor
      >
        <template #right-icon>
          个
        </template>
      </van-field>

      <van-cell class="tip" title="最高下注金额" :value="`${upper_interval}元`" />

      <van-field type="textarea" v-model="remark" placeholder="恭喜发财，牛气冲天" />

      <div class="amountNum">
        ￥
        <span class="special">
          0.00
        </span>
      </div>

      <van-button class="wd245 pushRedBagBtn" :disabled="send_red_btn_disable" @click="dispenseRed" type="danger">发红包</van-button>

      <div class="footerTip">
        未领取的红包将于3分钟之后发起退回
      </div>
    </div>
  </div>
</template>

<script>
import strg from '@/utils/storage.util.js'
import { mapGetters, mapMutations } from 'vuex'
import { StartNiuNiuFuli, GetNiuNiuConf } from '@/api/chat'
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  },
  data() {
    return {
      red_count: '', // 红包个数
      amount: '', // 最低下注金额
      remark: '',

      upper_interval: 100, //  最高
      lower_interval: 30, // 最低
      red_count_placeholder: '', // 红包最低下注金额

      red_num_disable: true, // 红包个数输入禁止
      red_num_lower: 3,
      red_num_upper: 0,

      send_red_btn_disable: true, // 发红包按钮
      highest_odds: 10, // 最高赔率

      user_balance: 20000 // 用户余额
    }
  },
  computed: {
    ...mapGetters(['getAvatar', 'userInfo', 'getRid']),
    red_num_placeholder() {
      if (this.red_num_upper === 0) {
        return `${this.red_num_lower}-N`
      } else if (this.red_num_lower >= this.red_num_upper) {
        return this.red_num_lower
      } else {
        return `${this.red_num_lower}-${this.red_num_upper}`
      }
    }
  },
  methods: {
    ...mapMutations(['setGameing', 'setNnConfig']),
    dispenseRed() {
      // 使用该函数模拟服务端消息的返回
      let upper_interval_n = G.toNumber(this.upper_interval)
      let highest_odds_n = G.toNumber(this.highest_odds)
      let red_count_n = G.toNumber(this.red_count)
      let user_balance_n = G.toNumber(this.user_balance)

      let need = upper_interval_n * (red_count_n - 1) * highest_odds_n

      if (user_balance_n < need) {
        G.$dialog
          .confirm({
            title: '余额不足',
            message: '您的钱包内余额不足',
            confirmButtonText: '去充值',
            cancelButtonText: '下次再说'
          })
          .then(() => {
            this.$router.push('/chat/gameWallet')
          })
      } else {
        G.delay(() => {
          strg.msgDispose({
            rid: this.getRid,
            chats: [
              {
                nick: this.userInfo.nick,
                spkid: this.userInfo.id,
                ordid: '1212121122',
                time: new Date(),
                type: 'redbag'
              }
            ]
          })
        }, 1200)
        this.go(-1)

        // TODO 参数问题
        // StartNiuNiuFuli({
        //   bankerid=23213,        //庄家
        //   fulitotal=10,    //红包个数
        //   remark="恭喜发财",    //红包备注
        //   roomid:this.getRid,    //房间id
        //   spkid=1232323,
        // })
        this.go(-1)
      }
    },
    sendRedRule() {
      G.$dialog.alert({
        title: '提示',
        className: 'niuniuTip',
        message: `1.最低下注金额：房间有最低准入限制，可以在房间最低限入金额上自行调整.
2.可下注人数：系统会根据你填写的最低下注金额计算你的钱包余额，自行给出你能承受的最大红包个数。
3.最高下注金额：系统会根据你填写的可下注人数，计算后给出你的钱包理论上所能承受最高下注额。但最高不会超过该房间限制。`,
        confirmButtonText: '知道了'
      })
    },
    async GetNiuNiuConf() {
      // 参数错误
      let { ok, msg } = await GetNiuNiuConf()
      if (ok) {
        this.setNnConfig(msg)
      }
    }
  },
  created() {
    this.GetNiuNiuConf()
    this.amount_debounce = G.debounce(amount => {
      /**
       * 当前红包的最多个数计算规则
       *  用户余额 / (最高赔率 * 当前键入下注金额) = 最大红包个数
       * 若最低红包个数等于最大红包个数则显示最低个数
       *
       * */
      this.red_num_disable = true
      this.send_red_btn_disable = true

      let amount_n = G.toNumber(amount)
      let upper_interval_n = G.toNumber(this.upper_interval)
      let lower_interval_n = G.toNumber(this.lower_interval)
      let user_balance_n = G.toNumber(this.user_balance)
      let highest_odds_n = G.toNumber(this.highest_odds)
      let red_num_lower_n = G.toNumber(this.red_num_lower)
      let red_num_upper_n = G.toNumber(this.red_num_upper)
      // 当金额变动时红包个数置空
      this.red_count = ''

      let red_count_n = Math.floor(user_balance_n / (amount_n * highest_odds_n))

      if (red_count_n < red_num_lower_n) {
        // 当可发红包数低于最低红包数,当前最大可发红包数为最低红包数
        this.red_num_upper = red_num_lower_n
      } else {
        this.red_num_upper = red_count_n
      }

      if (amount_n > upper_interval_n) {
        return this.$notify(`最高下注金额不能超过${upper_interval_n}元`)
      }
      if (amount_n < lower_interval_n) {
        return this.$notify(`最低下注金额不能低于${lower_interval_n}元`)
      }
      this.red_num_disable = false
    }, 300)

    this.red_count_debounce = G.debounce(red_count => {
      this.send_red_btn_disable = true

      let red_count_n = G.toNumber(this.red_count)
      let red_num_lower_n = G.toNumber(this.red_num_lower)
      let red_num_upper_n = G.toNumber(this.red_num_upper)

      if (red_count_n < red_num_lower_n) {
        return this.$notify(`最低红包数不能低于${red_num_lower_n}元`)
      }
      if (red_count_n > red_num_upper_n) {
        return this.$notify(`最高红包数不能超过${red_num_upper_n}元`)
      }
      this.send_red_btn_disable = false
    }, 300)
  },
  watch: {
    amount(news) {
      this.amount_debounce(news)
    },
    red_count(news) {
      this.red_count_debounce(news)
    }
  }
}
</script>

<style lang="scss">
.page-RedBagNiuNiu-root {
  flex: 1;
  background-color: $baseBgColor;
  .xh-right {
    .van-icon-warning-o {
      color: $white;
      font-size: 20px;
    }
  }
  .van-field {
    .van-field__right-icon {
      color: $txt;
    }
  }
  .main {
    padding: 15px;
    .van-field {
      margin-bottom: 15px;
      border-radius: 4px;
      overflow: hidden;
    }
    .redBagNum {
      margin-bottom: 0;
    }
    .tip {
      background-color: transparent;
    }
    .amountNum {
      margin-top: 124px;
      text-align: center;
      font-size: 25px;
      font-weight: 600;
      .special {
        font-size: 40px;
        vertical-align: text-top;
      }
    }
    .pushRedBagBtn {
      display: block;
      margin: 15px auto 0;
    }
    .footerTip {
      position: fixed;
      font-size: 12px;
      color: $gray-66;
      text-align: center;
      left: 0;
      right: 0;
      bottom: 15px;
    }
  }
}
.niuniuTip {
  .van-dialog__message {
    text-align: left;
  }
}
</style>
