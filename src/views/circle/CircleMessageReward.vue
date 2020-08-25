<template>
  <!-- <x-page :is-right="false" rootClass="circleMessageThumbsUp"> </x-page> -->
  <x-layout modifier="circleMessageReward">
    <template #header>
      <x-header :is-right="false" />
    </template>
    <x-interaction-history v-for="(item, index) in list" v-bind="item" :key="index">
      打赏了您的晒单
      <i class="integral">
        {{ item.info.amount }}
      </i>
      积分
    </x-interaction-history>
  </x-layout>
</template>

<script>
import { requestTipMeList } from '@/api/circle'
import { mapGetters, mapMutations } from 'vuex'

import xInteractionHistory from 'cpt/x-circle-list/x-interaction-history.vue'

export default {
  components: {
    xInteractionHistory
  },
  filters: {},
  data() {
    return {
      startIndex: 0,
      list: []
    }
  },
  created() {
    this.requestTipMeList()
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity']),
    getData() {
      return data
    }
  },
  methods: {
    async requestTipMeList() {
      const _tmp = {
        startind: this.startIndex * 10
      }
      let { ok, msg } = await requestTipMeList(_tmp)
      if (ok) {
        let data = []
        let tips = G.get(msg, 'tips', [])
        let moment = G.get(msg, 'moments', [])
        tips.forEach(tip => {
          moment.forEach(mmts => {
            if (tip.momeid === mmts.id) {
              mmts.nick = this.userInfo.nick
              data.push({
                info: tip,
                target: mmts
              })
            }
          })
        })
        this.list = data
      }
    }
  }
}
</script>

<style lang="scss">
.page-circleMessageReward-root {
  .van-cell__title {
    margin-left: 20.5px;
  }
  .integral {
    color: $rootColor;
  }
}
</style>
