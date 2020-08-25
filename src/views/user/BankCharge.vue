<template>
  <x-layout modifier="BankCharge" :main-top="100">
    <template #header>
      <x-header></x-header>
      <div class="tip">
        温馨提示：入款前请查看最新银行账号，若转入停用账户造成损失 我司概不负责，如有疑问请查看帮助或咨询客服。
      </div>
    </template>
    <van-field clearable label="充值账号：" :value="userInfo.nick" disabled />
    <van-field clearable type="number" label="充值金额：" :disabled="look_order" :placeholder="`最低${low}元，最高${hight}元`" v-model="money" />
    <van-field label="快捷金额：" v-if="showamounts">
      <div class="quickMoney" slot="input">
        <x-act-button
          v-for="(item, index) in quick_list"
          :key="index"
          @click="onQuickClick(item)"
          :idx="String(item)"
          :disable="look_order"
          class="quickBtn"
          cls="active"
          v-model="money"
          >{{ item }}</x-act-button
        >
      </div>
    </van-field>
    <van-field clearable label="获得积分：" disabled v-model="integral" />
    <van-field label="转入银行：" arrow-direction="down" is-link disabled placeholder="请选择提款银行" @click="onBankClick" v-model="bank" />
    <van-field clearable label="转入户名：" disabled v-model="inname">
      <van-button class="inname_copy" slot="button" size="small" type="danger" @click="onCopyInnameClick">复制</van-button>
    </van-field>
    <van-field clearable label="转入账号：" disabled v-model="inaccount">
      <van-button class="inaccount_copy" slot="button" size="small" type="danger" @click="onCopyInaccountClick">复制</van-button>
    </van-field>
    <van-field clearable label="汇款人姓名：" :disabled="look_order" placeholder="请填写汇款人姓名" v-model="name"></van-field>
    <van-field clearable label="联系方式：" type="tel" v-model="phone" :disabled="look_order" placeholder="请输入联系方式" />

    <van-field label="提交时间：" v-if="look_order" disabled v-model="committime" />
    <van-field class="process" label="订单状态：" disabled v-model="orderstate" v-if="look_order" />

    <van-popup get-container="#box" v-model="bankShow" position="bottom">
      <van-picker :columns="columns" title="开户银行" show-toolbar value-key="bknick" @cancel="bankPickerCancel" @confirm="bankPickerConfirm" />
    </van-popup>
    <div class="lookBtns" v-if="look_order">
      <van-button @click="onCancelOrderClick">取消订单</van-button>
      <van-button type="danger" @click="$router.push('/service')">联系客服</van-button>
    </div>
    <div class="chargeBtns" v-else>
      <van-button type="danger" @click="LoadingOffline">提交</van-button>
    </div>
  </x-layout>
</template>

<script>
import { GetLoadingBkInfo, GetLoadingPromotion, LoadingOffline, GetLoadingOrder, CancelTransferOrder } from '@/api/user'
import { getTime } from '@/utils/formant.util.js'
import { mapGetters } from 'vuex'

import xBindPage from 'cpt/x-bind-page.vue'
import xActButton from 'cpt/x-act-button.vue'

export default {
  components: {
    xBindPage,
    xActButton
  },
  data() {
    return {
      columns: [],
      bankShow: false,

      quick_list: [],

      bank: '',
      money: '',
      integral: '',
      inname: '', // 转入户名
      inaccount: '',
      name: '', // 汇款人姓名
      phone: '',
      hight: 0,
      low: 0,
      bkid: '',
      orderid: 0,
      showamounts: false,

      committime: '2019-01-01 00:00:00',
      orderstate: '审核中',

      look_order: false,

      order: false
    }
  },
  methods: {
    onCopyInnameClick() {
      $clip('.inname_copy', this.inname).then(() => this.$notify({ type: 'success', message: '成功复制' }))
    },
    onCopyInaccountClick() {
      $clip('.inaccount_copy', this.inaccount).then(() => this.$notify({ type: 'success', message: '成功复制' }))
    },
    onCancelOrderClick() {
      G.$dialog
        .confirm({
          title: '温馨提示',
          message: '取消订单后，此订单将无法使用，需重新填写资料再次提交订单！',
          confirmButtonText: '确认取消',
          cancelButtonText: '再想想'
        })
        .then(async () => {
          let { ok, msg } = await CancelTransferOrder({
            orderid: this.orderid
          })
          if (ok) {
            this.$notify({
              type: 'success',
              message: '订单已取消'
            })
            this.look_order = false
            this.go(-2)
          }
        })
        .catch(() => {})
    },
    onBankClick() {
      if (this.look_order) return
      this.bankShow = true
    },
    onQuickClick(num) {
      this.money = num
    },
    bankPickerCancel() {
      this.bankShow = false
    },
    bankPickerConfirm(value, index) {
      this.bank = value.bknick
      this.inname = value.name
      this.inaccount = value.bknum
      this.bkid = value.id
      this.bankShow = false
    },
    //
    async GetLoadingBkInfo() {
      let { ok, msg } = await GetLoadingBkInfo({ channel: 0 })
      if (ok) {
        this.columns = msg || []
        this.fill(this.columns[0])
      }
    },
    // 查询获得积分
    GetLoadingPromotion() {
      return new Promise(reslove => {
        if (!this.money) return reslove('')
        GetLoadingPromotion({
          amount: this.money,
          channel: 0
        }).then(({ ok, msg }) => {
          reslove(msg)
        })
      })
    },
    // 获取订单状态
    async GetLoadingOrder() {
      let { ok, msg } = await GetLoadingOrder()
      if (ok) {
        //  msg 为空代表当前没有存续订单
        if (msg) {
          let getData = G.curry(G.get)(msg)
          let state = G.get(msg, 'state', 0)
          // 用户是否可以编辑
          this.look_order = true
          // 是否展示快捷选择
          this.showamounts = false
          // 转入银行
          this.bank = getData('bknick', '')
          // 转入户名
          this.inname = getData('owner', '')
          // 转入账号
          this.inaccount = getData('paynum', '')
          // 订单id
          this.orderid = getData('orderid', 0)
          // 订单时间
          this.committime = getData('time','YYYY-mm-dd')
          
          this.phone = getData('phone','xxxxxx')

          switch (state) {
            case 1:
              // state 为 1 代表上一个订单已经完成
              this.look_order = false
              this.GetLoadingBkInfo()
              break
            case 0:
              this.integral = getData('m', 0)
              this.money = getData('amount', 0)
              // 汇款人姓名
              this.name = getData('payee', '')
              this.orderstate = '等待'
              break
            // case 2:
            //   this.orderstate = '已拒绝'
            //   break
            // case 3:
            //   this.orderstate = '会员取消'
            //   break
            // case 4:
            //   this.orderstate = '管理员取消'
            //   break
            default:
              this.look_order = false
              this.GetLoadingBkInfo()
              break
          }
        } else {
          this.look_order = false
          this.GetLoadingBkInfo()
        }
      }
    },
    async LoadingOffline() {
      // FIXME 参数校验

      G.$dialog
        .confirm({
          title: '温馨提示',
          message: `
            充值账号：${this.userInfo.nick},
            充值金额：${this.money}
            转入银行：${this.bank}
            转入户名：${this.inname}
            转入账号：${this.inaccount}
            汇款人姓名：${this.name}
            联系方式：${this.userInfo.phone}
        `,
          className: 'table'
        })
        .then(() => {
          LoadingOffline({
            nick: this.userInfo.nick,
            amount: this.money,
            payee: this.name,
            phone: this.phone,
            cardId: this.bkid
          }).then(({ ok, msg }) => {
            if (ok) {
              this.$notify({
                type: 'success',
                message: '您的充值申请已经提交，请尽快完成充值'
              })
              this.look_order = true
              let [ymd, hms] = getTime()
              this.committime = `${ymd} ${hms}`
              this.orderstate = '审核中'
              this.$router.go(-2)
            }
          })
        })
    },
    fill(value = {}) {
      let { amounts, bknick, bknum, high, low, name, showamounts, id } = value
      if (!bknick) return
      if (amounts) this.quick_list = amounts.split(',')
      this.bank = bknick
      this.hight = high
      this.low = low
      this.inname = name
      this.inaccount = bknum
      this.showamounts = showamounts
      this.bkid = id
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getBkInfo'])
  },
  created() {
    this.GetLoadingOrder()
    let GetLoadingPromotion_memoize = G.memoize(() => this.GetLoadingPromotion())
    this.GetLoadingPromotion_debounce = G.debounce(async () => {
      this.integral = await GetLoadingPromotion_memoize(this.money)
    }, 500)
    this.phone = this.userInfo.phone
    this.name = this.getBkInfo.owner
  },
  watch: {
    money() {
      this.GetLoadingPromotion_debounce()
    }
  }
}
</script>

<style lang="scss">
.page-BankCharge-root {
  background-color: $white;
  .tip {
    background-color: $baseBgColor;
    font-size: 12px;
    color: $txt;
    padding: 14px;
    line-height: 14px;
  }
  // .van-button {
  //   width: 290px;
  //   margin-top: 40px;
  //   margin-left: 40px;
  // }
  .lookBtns,
  .chargeBtns {
    text-align: center;
    padding-bottom: 40px;
    .van-button {
      width: 290px;
      margin-top: 40px;
    }
  }
  .van-button {
    border-radius: 2.5px;
  }
  .van-field__control:disabled {
    color: $txt;
    -webkit-text-fill-color: $txt;
    &::placeholder {
      color: $gray-99;
      -webkit-text-fill-color: $gray-99;
    }
  }
  .process .van-field__control {
    color: $male;
    -webkit-text-fill-color: $male;
  }
  .van-cell {
    .van-button {
      height: 24px;
      line-height: 24px;
    }
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .btnBar {
    .lookBtns {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      padding-bottom: 40px;
      .van-button {
        width: 165px;
        border-radius: 2.5px;
        &.van-button--default {
          background-color: $gray-d7;
        }
      }
    }
  }
  .quickMoney {
    display: flex;
    justify-content: space-between;
    .van-button {
      height: 24px;
      line-height: 24px;
      min-width: unset;
    }
  }
  .quickBtn {
    &.active {
      background-color: $rootColor;
      color: $white;
    }
  }
}
</style>
