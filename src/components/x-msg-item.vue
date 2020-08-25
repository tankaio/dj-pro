<template>
  <div class="x-msg-item van-hairline--bottom" @click="$router.push(to)">
    <x-member-avatar
      v-bind="{
        src,
        name,
        state,
        newMsg
      }"
    />
    <div class="xm-center">
      <div class="xm-nick" v-if="$slots.nick">
        <slot name="nick"></slot>
      </div>
      <template v-else>
        <div class="xm-nick" v-if="search" v-html="searchNick"></div>
        <div class="xm-nick" v-else>{{ nick }}{{ username }}</div>
      </template>

      <div class="xm-msg">{{ lastMsg }}</div>
    </div>
    <div class="xm-right">{{ time }}</div>
  </div>
</template>

<script>
import xMemberAvatar from 'cpt/x-member-avatar.vue'
export default {
  components: {
    xMemberAvatar
  },
  props: {
    src: String,
    name: String,
    state: String,
    newMsg: String,
    nick: String,
    username: String,
    lastMsg: String,
    time: [Date, String],
    to: String,
    search: String
  },
  computed: {
    searchNick() {
      return this.nick.replace(this.search, `<i class="special">${this.search}</i>`)
    }
  }
}
</script>

<style lang="scss">
.x-msg-item {
  display: flex;
  .xm-center {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    > * {
      flex: 1;
      line-height: 24px;
    }
  }
  .xm-nick {
    font-size: 15px;
    color: $txt;
  }
  .xm-msg {
    font-size: 12px;
    color: $gray-99;
  }
  .xm-right {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: $gray-99;
  }
  .special {
    color: $green;
  }
}
</style>
