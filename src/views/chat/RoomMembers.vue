<template>
  <div class="page-RoomMembers-root">
    <x-header :is-right="false" center-text="房间成员（99）" :left-arrow="false" left-text="取消" />
    <x-fixed offset-top="44" bar-height="44">
      <van-field type="text" clearable placeholder="昵称/用户名" v-model="nick" />
    </x-fixed>
    <div class="searchList" v-if="!!nick">
      <x-msg-item
        to="/chat/memberInfo"
        v-for="(item, index) in 20"
        :key="index"
        v-bind="{
          nick: '123',
          src: '1.png',
          lastMsg: '用户名',
          search: nick
        }"
      />
    </div>
    <div class="main" v-else>
      <div class="members-bar">
        <x-member-avatar v-for="(item, index) in 60" :key="index" src="1.png" name="1feafea23" state="admin" new-msg="99" />
      </div>
    </div>
  </div>
</template>

<script>
import { log } from 'util'

import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'
import xMsgItem from 'cpt/x-msg-item.vue'
import xMemberAvatar from 'cpt/x-member-avatar.vue'

export default {
  components: {
    xHeader,
    xFixed,
    xMsgItem,
    xMemberAvatar
  },
  data() {
    return {
      nick: ''
    }
  }
}
</script>

<style lang="scss">
.page-RoomMembers-root {
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
  .members-bar {
    display: flex;
    flex-wrap: wrap;
    padding: 0 27px;
    .x-member-avatar {
      margin-top: 18.5px;
    }
    .x-member-avatar:not(:nth-child(5n)) {
      margin-right: 19.5px;
    }
  }
  .searchList {
    width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 15px 15px;
    .x-msg-item {
      margin-top: 15px;
    }
  }
}
</style>
