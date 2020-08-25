<template>
  <x-layout modifier="circleMessageThumbsUp">
    <template #header>
      <x-header :is-right="false" />
    </template>
    <x-list>
      <x-interaction-history v-for="(item, index) in list" v-bind="item" :key="index">
        {{ item.info.replymsgid ? '回复了您:' : '评论了您的晒单:' }}
        {{ item.info.text }}
        <template #info>
          <van-button size="small" type="danger" @click="onClickRepy(item.info)">
            回复
          </van-button>
        </template>
      </x-interaction-history>
    </x-list>
    <div class="footer" v-if="input_ctr">
      <van-field v-model="msg" :placeholder="placeholder"></van-field>
      <van-button size="small" @click="onCancel">取消</van-button>
      <van-button size="small" type="danger" @click="onConfirm">
        发送
      </van-button>
    </div>
  </x-layout>
  <!-- <x-page rootClass="circleMessageThumbsUp" :is-footer="input_ctr"> </x-page> -->
</template>

<script>
import { requestMsgMeList, replyMoment } from '@/api/circle.js'
import { mapGetters, mapMutations } from 'vuex'

import xHeader from 'cpt/x-header.vue'
import xList from 'cpt/x-list/x-list.vue'
import xInteractionHistory from 'cpt/x-circle-list/x-interaction-history.vue'

export default {
  components: {
    xList,
    xInteractionHistory,
    xHeader
  },
  filters: {},
  data() {
    return {
      input_ctr: false,
      startind: 0,
      msg: '',
      placeholder: '',
      repyId: '',
      repyNick: '',
      rootMsgId: '',
      repyMemoId: '',
      repyMsgId: '',
      list: []
    }
  },
  created() {
    this.requestMsgMeList()
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity'])
  },
  methods: {
    onLoad() {},
    mainLeftClick() {
      // this.$router.push('/circle');
    },
    async requestMsgMeList() {
      let { ok, msg } = await requestMsgMeList({
        startind: this.startind
      })
      if (ok) {
        let msgss = G.get(msg, 'tips', [])
        let moments = G.get(msg, 'moments', [])
        let data = []
        msgss.forEach(ele => {
          let momeid = ele.momeid
          moments.forEach(mmts => {
            if (mmts.id === momeid) {
              mmts.nick = this.userInfo.nick
              data.push({
                info: ele,
                target: mmts
              })
            }
          })
        })
        this.list = data
      }
    },
    onClickRepy(item) {
      console.log(item)

      this.input_ctr = true
      this.repyId = item.id // 回复的消息 id
      this.repyNick = item.nick
      this.repyMemoId = item.momeid //
      this.repyMsgId = item.replymsgid // 回复的消息 id
      this.rootMsgId = item.rootmsgid // 主消息 id
      this.placeholder = `@${this.repyNick}`
    },
    onCancel() {
      this.input_ctr = false
      this.repyId = ''
      this.repyNick = ''
      this.placeholder = ''
      this.repyMemoId = ''
      this.repyMsgId = ''
      this.rootMsgId = ''
      this.msg = ''
    },
    async onConfirm() {
      let { ok, msg } = await replyMoment({
        id: this.repyMemoId,
        rootmsgid: this.rootMsgId,
        replymsgid: this.repyId,
        text: this.msg
      })
      if (ok) {
        this.$toast('回复成功')
        this.input_ctr = false
        this.repyId = ''
        this.repyNick = ''
        this.placeholder = ''
        this.repyMemoId = ''
        this.rootMsgId = ''
        this.repyMsgId = ''
        this.msg = ''
      }
    }
  }
}
</script>

<style lang="scss">
.page-circleMessageThumbsUp-root {
  .van-cell__title {
    margin-left: 20.5px;
  }
  &.isFooter {
    padding-bottom: 44px;
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 34px;
    display: flex;
    align-items: center;
    padding: 5px;
    .van-field {
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .van-button--default {
      margin-right: 10px;
    }
  }
}
</style>
