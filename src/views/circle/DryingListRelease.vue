<template>
  <x-layout modifier="dryingListRelease">
    <template #header>
      <x-header :click-left="handleCancel" left-text="取消" :left-arrow="false" :is-right="false">
        <van-button size="small" type="danger" :disabled="!message.length" @click="debounceHandleRelease">
          发布
        </van-button>
      </x-header>
    </template>
    <van-field v-model="message" rows="3" autosize type="textarea" maxlength="500" placeholder="请输入留言" show-word-limit />
    <x-uploader ref="xUploader" />
  </x-layout>
</template>

<script>
import { PublishMoment, UploadPicByPlayer } from '@/api/circle'
import { mapGetters, mapMutations } from 'vuex'

import xHeader from 'cpt/x-header.vue'
import xUploader from 'cpt/x-uploader.vue'

export default {
  components: {
    xHeader,
    xUploader
  },
  name: 'CircleRelease',
  data() {
    return {
      fileList: [],
      uploadImgList: [],
      message: '',
      cameraProp: false
    }
  },
  computed: {
    // ...mapGetters(["userInfo", "userIdentity"]),
    // showUserState() {
    //   switch (this.userIdentity) {
    //     case 0:
    //       this.login = false;
    //       return "游客";
    //     case 1: // 会员
    //       this.login = true;
    //       return "会员";
    //     case 2: // 专家
    //       this.login = true;
    //       return "专家";
    //     default:
    //       break;
    //   }
    // }
  },
  methods: {
    // 取消
    handleCancel() {
      this.$router.back()
    },
    // 发布按钮点击
    handleRelease() {
      if (this.$refs.xUploader.uploadImgList.length === 0) {
        return this.publishMoment('')
      }
      this.$toast.loading({
        message: '图片上传中...',
        forbidClick: true,
        duration: 0
      })

      this.$refs.xUploader.uoLoadImage(imgs => {
        this.publishMoment(imgs.join(','))
      })
      // this.publishMoment("");
    },
    // 发布
    async publishMoment(picture) {
      const _tmp = {
        text: this.message,
        picture: picture
      }
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0
      })
      let { ok, msg } = await PublishMoment(_tmp)
      if (ok) {
        this.$notify({
          type: 'success',
          message: '发布成功'
        })
        this.$router.replace('/circle')
      } else {
        // TODOVITOR 调用接口后跳转 msg
      }
    },
    afterRead(file) {}
  },
  created() {
    this.debounceHandleRelease = G.debounce(() => this.handleRelease(), 800)
  }
}
</script>

<style lang="scss">
.page-dryingListRelease-root {
  .van-uploader {
    margin-top: 10px;
  }
  .fill_center {
    background-color: $white;
    padding: 0 10px;
  }
}
</style>
