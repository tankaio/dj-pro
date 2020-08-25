<template>
  <div class="page-openPlay-container">
    <x-lazy-cpt :height="152" v-for="(item, index) in list" :key="index">
      <x-issue-item
        @click="onClick(item)"
        v-bind="{
          state: true,
          ad: item.bettype,
          btn: '发布计划',
          type: 'public',
          tag: item.betrgn,
          sum: item.publishcount,
          s: item.wintimes,
          wintimes: item.winagain
        }"
      />
    </x-lazy-cpt>
  </div>
</template>

<script>
import { getPlay, big_plays, plays } from '@/utils/plan.util.js'
import { GetCanBuyPlans } from '@/api/other'

import xIssueItem from 'cpt/x-issue-item.vue'
import xLazyCpt from 'cpt/x-lazy-cpt/x-lazy-cpt.vue'

export default {
  components: {
    xIssueItem,
    xLazyCpt
  },
  data() {
    return {
      startind: 0,
      list: []
    }
  },
  methods: {
    async GetCanBuyPlans() {
      let { ok, msg } = await GetCanBuyPlans({
        startind: this.startind
      })
      if (ok) {
        this.list = msg || []
      }
    },
    onClick(item) {
      let { bettype, betrgn } = item
      let bettype_map = {}
      plays[bettype].forEach(ele => {
        let [betrgn, path] = ele.split(' ')
        bettype_map[betrgn] = path
      })
      this.$route.meta.play = `${bettype} ${betrgn}`
      this.$router.replace({
        path: `/publish/${big_plays[bettype]}/${bettype_map[betrgn]}`,
        query: {
          bettype,
          betrgn
        }
      })
    }
  },
  created() {
    this.$root.animateDelay(() => this.GetCanBuyPlans())
  }
}
</script>

<style lang="scss">
.page-openPlay-container {
}
</style>
