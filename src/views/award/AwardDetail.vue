<template>
  <x-layout modifier="awardDetial">
    <x-header slot="header" :is-right="false" />
    <x-lottery :period="`${date}第${round}期开奖结果`" :rightArrow="false" is-size is-double :nums="draws" pure />
    <x-panel :list="statistics"></x-panel>
    <x-panel v-if="recommend.length" :list="recommend" :title="`第${round}期 系统推荐`"></x-panel>
  </x-layout>
</template>

<script>
import { getHkcDrawDetails } from '@/api/home'
import { getSpecialSum, getSum, getSize, odd_even } from '@/utils/rule/openLottery.rule.js'

import xPage from 'cpt/x-page.vue'
import xHeader from 'cpt/x-header.vue'
import xLottery from 'cpt/x-lottery/x-lottery.vue'
import xPanel from 'cpt/x-lottery/x-panel.vue'

export default {
  components: {
    xPage,
    xLottery,
    xPanel,
    xHeader
  },
  data() {
    return {
      draws: [],
      round: '', //
      recommend: [],
      theyear: '',
      date: ''
    }
  },
  methods: {
    async getHkcDrawDetails() {
      let params = {
        round: this.round
      }
      let { ok, msg } = await getHkcDrawDetails(params)
      let getMsg = G.curry(G.get)(msg)
      if (ok) {
        this.theyear = getMsg('theyear', '')
        this.draws = getMsg('draws', [])
        this.recommend = getMsg('recommend', [])
        this.date = getMsg('date', '')
      }
    }
  },
  created() {
    this.round = this.$route.params.id
    this.getHkcDrawDetails()
  },
  computed: {
    statistics() {
      let sum = getSum(this.draws)
      let special = G.get(this.draws, 6, 0)
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
          bet: special
        },
        {
          rgn: '特码合大小/单双: ',
          bet: `${getSize(special)}/${odd_even(special)}`
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.page-awardDetial-root {
  .period-bar {
    padding: 10px;
  }
}
</style>
