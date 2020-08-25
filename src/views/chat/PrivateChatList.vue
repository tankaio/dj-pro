<template>
  <div class="page-PrivateChatList-root">
    <x-header :is-right="false" />
    <x-fixed offset-top="44" bar-height="44">
      <van-field type="text" clearable placeholder="昵称/用户名" v-model="nick" />
    </x-fixed>
    <div class="chatHistory">
      <x-msg-item
        to="/chat/memberInfo"
        v-for="(item, index) in 20"
        :key="index"
        v-bind="{
          src: '1.png',
          state: 'admin',
          nick: '昵称123',
          username: '(用户名)',
          lastMsg: '最后一条消息',
          time: '昨天15:00',
          newMsg: '15'
        }"
      />
    </div>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'
import xMsgItem from 'cpt/x-msg-item.vue'
export default {
  components: {
    xHeader,
    xFixed,
    xMsgItem
  },
  data() {
    return {
      nick: ''
    }
  }
}
</script>

<style lang="scss">
.page-PrivateChatList-root {
  .x-fixed .xf-container {
    padding: 7.5px 15px;
    box-sizing: border-box;
    background-color: $rootColor;
    .van-field {
      padding-top: 2.5px;
      padding-bottom: 2.5px;
      border-radius: 5px;
    }
  }
  .chatHistory {
    padding: 0 15px;
    overflow: hidden;
    .x-msg-item {
      padding-top: 15px;
    }
  }
}
</style>
