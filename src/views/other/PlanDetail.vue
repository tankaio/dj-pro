<template>
  <!-- <x-page rootClass="planDetial"> </x-page> -->
  <x-layout modifier="planDetial" main-center-color="#fff">
    <x-header :is-right="false" slot="header" />
    <x-userpanel
      v-bind="{
        username: detail.nick,
        gender: detail.sex,
        expert: detail.level === 1,
        planname: detail.planname,
        avatar: detail.ico
      }"
    />

    <x-periods-tit :tit="`${detail.date}第${detail.round}期`" :right="detail.state | stateFt" />

    <x-code
      v-bind="{
        state: 0,
        numList: bet,
        bettype: detail.bettype,
        betrgn: detail.betrgn
      }"
    />
    <template v-if="state">
      <div class="periodResult">
        <div class="prBar">
          <x-lottery :period="`${detail.date}第${detail.round}期开奖结果`" :rightArrow="false" is-size is-double :nums="draws" pure />
        </div>
      </div>
      <x-panel :list="statistics" />
    </template>
  </x-layout>
</template>

<script>
import { GetPlanDetail } from '@/api/other'
import { BuyPlan } from '@/api/user'
import { mapGetters } from 'vuex'
import { getSpecialSum, getSum, getSize, odd_even, getSpecailSize } from '@/utils/rule/openLottery.rule.js'

import xPage from 'cpt/x-page.vue'
import xUserpanel from 'cpt/x-userpanel.vue'
import xPeriodsTit from 'cpt/x-periods-tit.vue'
import xCode from 'cpt/x-code.vue'
import xLottery from 'cpt/x-lottery/x-lottery.vue'
import xPanel from 'cpt/x-lottery/x-panel.vue'

export default {
  components: {
    xPage,
    xUserpanel,
    xPeriodsTit,
    xCode,
    xLottery,
    xPanel
  },
  data() {
    return {
      state: true, // 开奖与否
      id: '',
      detail: {},
      draws: [],
      bet: []
    }
  },
  methods: {
    async GetPlanDetail() {
      let { ok, msg } = await GetPlanDetail({
        planid: this.id
      })

      if (ok) {
        this.detail = G.get(msg, 'detail', '')
        this.bet = G.get(msg, 'detail.bet', [])

        if (this.detail) {
          // 如果没有详情就是tm的逻辑绕过了,拦截用户
          let drawnum = G.get(this.detail, 'drawnum', '')
          this.draws = drawnum.split(',').map(num => Number(num))
          if (this.detail.state === 0) {
            this.state = false
          }
        } else {
          
          let that = this
          judgeBuyPlan(this.id, this.userInfo.balan_m, msg.cost, {
            access() {
              /* 已经购买允许查看准入 */
              // that.$router.push(`/awardInfo/awardDetail/${that.id}`)
              that.$forceUpdate();
            },
            faild() {
              /* 购买失败 */
              that.$router.back()
            },
            cancel() {
              /* 取消 */
              that.$router.back()
            },
            charge() {
              /* 充值 */
              that.$router.push('/user/integral')
            }
          })
        }
      }

      return
    //   let { ok, msg } = await GetPlanDetail({
    //     planid: this.id
    //   })
    //   if (ok) {
    //     this.detail = G.get(msg, 'detail', '')
    //     this.bet = G.get(msg, 'detail.bet', [])

    //     if (this.detail) {
    //       // 如果没有详情就是tm的逻辑绕过了,拦截用户
    //       let drawnum = G.get(this.detail, 'drawnum', '')
    //       this.draws = drawnum.split(',').map(num => Number(num))
    //       if (this.detail.state === 0) {
    //         this.state = false
    //       }
    //     } else {
    //       G.$routeHook(deep => {
    //         this.go(-2)
    //       })
    //       G.$dialog
    //         .confirm({
    //           title: `消费${msg.cost}积分？`,
    //           message: '温馨提示：此资料纯属专家个人观点，仅供参考。请自愿选择购买。祝您中奖！'
    //         })
    //         .then(() => {
    //           // 积分是否足够
    //           if (this.userInfo.balan_m < msg.cost) {
    //             return G.$dialog
    //               .confirm({
    //                 title: '提醒',
    //                 message: '账户积分不足，请充值!'
    //               })
    //               .then(() => {
    //                 this.$router.push('/user/integral')
    //               })
    //               .catch(deep => {
    //                 this.go(-2)
    //               })
    //           } else {
    //             // 调用购买函数
    //             BuyPlan({
    //               planid: this.id
    //             }).then(res => {
    //               let { ok, msg } = res
    //               if (ok) {
    //                 //  购买成功
    //                 this.$notify({
    //                   type: 'success',
    //                   message: '购买成功',
    //                   duration: 2000
    //                 })
    //                 this.go(-1)
    //               } else {
    //                 this.$notify({
    //                   type: 'danger',
    //                   message: '购买失败',
    //                   duration: 2000
    //                 })
    //                 this.go(-2)
    //               }
    //             })
    //           }
    //         })
    //         .catch(deep => {
    //           this.go(-2)
    //         })
    //     }
    //   }
    // }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    statistics() {
      if (!G.isStr(this.draws)) return
      let sum = getSum(this.draws)
      let special = G.get(this.draws, 6, 0)
      let special_he = getSpecialSum(special)
      return [
        {
          rgn: '总和值: ',
          bet: sum
        },
        {
          rgn: '总和大小/单双: ',
          bet: `${getSize(sum)}/${odd_even(sum)}`
        },
        {
          rgn: '特码合: ',
          bet: special_he
        },
        {
          rgn: '特码合大小/单双: ',
          bet: `${getSpecailSize(special_he)}/${odd_even(special_he)}`
        }
      ]
    }
  },
  created() {},
  filters: {
    stateFt(old) {
      switch (old) {
        case 0:
          return '未开奖'
        case 1:
          return '胜'
        case 2:
          return '输'
        default:
          break
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      vm.id = to.params.id
      vm.GetPlanDetail()
    })
  }
}
</script>

<style lang="scss">
.page-planDetial-root {
  .periodResult {
    background-color: $baseBgColor;
    padding-top: 8px;
    .prBar {
      padding: 0 10px;
      background-color: $white;
      .prTit {
        font-size: 15px;
        color: $txt;
        text-align: center;
        padding: 10px 0;
      }
    }
  }
}
</style>
