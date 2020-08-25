<template>
  <x-layout modifier="message">
    <x-header :is-right="false" slot="header"/>
    <van-cell :title="title" :label="time"></van-cell>
    <div class="main" v-html="html"></div>
  </x-layout>
</template>

<script>
import { GetSysMsgById } from '@/api/other'

import xHeader from 'cpt/x-header.vue'

export default {
  components: {
    xHeader
  },
  data() {
    return {
      id: 0,
      html: '',
      title: '',
      time: ''
    }
  },
  methods: {
    async GetSysMsgById() {
      let { ok, msg } = await GetSysMsgById({
        id: Number(this.id)
      })
      if (ok) {
        let getData = G.curry(G.get)(msg)
        this.id = getData('id', this.id)
        this.title = getData('title', '')
        this.html = getData('content', '12')
        this.time = getData('time', '')
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.id = vm.$route.params.id
      vm.GetSysMsgById()
    })
  }
}
</script>

<style lang="scss">
.page-message-root {
  // //padding-top: 44px;
  color: $txt;
  .van-cell ::after {
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
  .main {
    padding: 10px 15px;
    font-size: 13px;
    color: $txt;
    line-height: 1.5;
  }
}
</style>
