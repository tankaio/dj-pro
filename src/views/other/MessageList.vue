<template>
  <x-layout modifier="messageList">
    <x-header @click-right="OnceReadSysMsgs" slot="header">一键已读</x-header>
    <x-list v-model="loading" :finished="finished" :error.sync="error" @load="GetSysMsg">
      <van-cell is-link :title="item.title" :value="item.time" v-for="(item, index) in list" :key="index" @click="onClickMessage(item.id, index)">
        <span :class="`xIcon-${item.read ? 'auth' : 'unmsg'}-cm`" slot="icon"></span>
      </van-cell>
    </x-list>
  </x-layout>
</template>

<script>
import { GetSysMsg, OnceReadSysMsgs } from '@/api/other'

import xHeader from 'cpt/x-header.vue'
import xList from 'cpt/x-list/x-list.vue'

export default {
  components: {
    xHeader,
    xList
  },
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      startind: 0,
      list: []
    }
  },
  methods: {
    async GetSysMsg() {
      let { ok, msg } = await GetSysMsg({
        startind: this.list.length
      })
      if (ok) {
        this.list.push.apply(this.list, msg)
        this.loading = false
        // this.startind++;
        if (!msg.length) this.finished = true
      } else {
        this.error = true
      }
    },
    async OnceReadSysMsgs() {
      let { ok, msg } = await OnceReadSysMsgs()
      if (ok) {
        this.list = this.list.map(item => {
          item.read = true
          return item
        })
      }
    },
    onClickMessage(messageId, idx) {
      ;(this.list[idx] || {}).read = true
      // :to="`/message/${item.id}`"
      this.$router.push(`/message/${messageId}`)
    }
  },
  created() {
    this.GetSysMsg()
  }
}
</script>

<style lang="scss">
.page-messageList-root {
  // //padding-top: 44px;
  background-color: $white;
  color: $txt;
  .xIcon-auth-cm,
  .xIcon-unmsg-cm {
    margin-right: 10px;
  }
  .van-cell {
    align-items: center;
  }
  .van-cell__value {
    color: $txt;
  }
}
</style>
