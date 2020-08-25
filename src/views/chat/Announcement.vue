<template>
  <div class="page-Announcement-root">
    <x-header @click-right="onClickRight">
      {{ announcement ? '完成' : '编辑' }}
    </x-header>
    <van-field type="textarea" v-model="announcement" />
    <div class="tip">-仅房间管理员可编辑-</div>
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
      announcement: ''
    }
  },
  methods: {
    onClickRight() {
      this.$notify({
        type: 'success',
        message: '已保存'
      })
      this.go(-1)
    }
  }
}
</script>

<style lang="scss">
.page-Announcement-root {
  .van-field__control {
    height: 500px;
  }
  .van-field:not(:last-child)::after {
    right: 0;
  }
  .tip {
    font-size: 13px;
    color: $txt;
    text-align: center;
    padding: 15px 0;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
