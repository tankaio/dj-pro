<template>
  <div class="page-ChangeRoomName-root">
    <x-header center-text="设置备注" @click-right="onClickRight">
      完成
    </x-header>
    <van-field v-model="nick" clearable></van-field>
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
.page-ChangeRoomName-root {
  flex: 1;
  background-color: $gray-f5;
  .tip {
    font-size: 12px;
    color: $gray-66;
    padding: 5px 14px;
  }
}
</style>
