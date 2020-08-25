<template>
  <div class="page-ChangeRoomNick-root">
    <x-header center-text="我在聊天室的昵称" @click-right="onClickRight">
      完成
    </x-header>
    <van-field v-model="nick" clearable></van-field>
    <div class="tip">
      在这里可以设置你在这个聊天室的昵称。这个昵称只会在此聊天室 内显示
    </div>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  },
  data() {
    return {
      nick: ''
    }
  },
  methods: {
    onClickRight() {
      this.go(-1)
    }
  }
}
</script>

<style lang="scss">
.page-ChangeRoomNick-root {
  flex: 1;
  background-color: $gray-f5;
  .tip {
    font-size: 12px;
    color: $gray-66;
    padding: 5px 14px;
  }
}
</style>
