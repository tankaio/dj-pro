<template>
  <x-layout modifier="circleMessageThumbsUp">
    <template #header>
      <x-header :is-right="false" />
    </template>
    <x-list>
      <x-interaction-history v-for="(item, index) in list" v-bind="item" :key="index">
        点赞了您的晒单
      </x-interaction-history>
    </x-list>
  </x-layout>
  <!-- <x-page rootClass="circleMessageThumbsUp"> </x-page> -->
</template>

<script>
import { requestLikeMeList } from '@/api/circle'
import { mapGetters, mapMutations } from 'vuex'

import xPage from 'cpt/x-page.vue'
import xList from 'cpt/x-list/x-list.vue'
import xInteractionHistory from 'cpt/x-circle-list/x-interaction-history.vue'

export default {
  components: {
    xPage,
    xList,
    xInteractionHistory
  },
  filters: {},
  data() {
    return {
      startIndex: 0, //起始位置
      list: []
    }
  },
  created() {
    this.requestLikeMeList()
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity'])
  },
  methods: {
    async requestLikeMeList() {
      let params = {
        startind: this.startIndex
      }
      let { ok, msg } = await requestLikeMeList(params)
      if (ok) {
        let likes = G.get(msg, 'likes', [])
        let moments = G.get(msg, 'moments', [])
        let data = []
        likes.forEach(like => {
          moments.forEach(mmts => {
            if (like.momeid === mmts.id) {
              mmts.nick = this.userInfo.nick
              data.push({
                info: like,
                target: mmts
              })
            }
          })
        })
        this.list = data
      }
    },
    onLoad() {},
    mainLeftClick() {
      // this.$router.push('/circle');
    }
  }
}
</script>

<style lang="scss">
.page-circleMessageThumbsUp-root {
  .van-cell__title {
    margin-left: 20.5px;
  }
}
</style>
