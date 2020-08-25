<template>
  <div class="x-uploader" :class="keyCls">
    <div class="xu-upload-bar">
      <van-uploader
        :capture="upload_type"
        v-model="uploadImgList"
        :after-read="afterRead"
        :max-size="5242880"
        @oversize="onOverSize"
        @delete="bindEvent"
      />
    </div>

    <van-action-sheet v-model="cameraProp" :actions="actions" @select="onSelect" cancel-text="取消" @cancel="cameraProp = false" />
  </div>
</template>

<script>
import { UploadPicByPlayer } from '@/api/circle'
export default {
  data() {
    return {
      cameraProp: false,
      uploadImgList: [],
      uploaderDisable: true,
      upload_type: '',
      keyCls: `xu-${Math.random()}`,
      actions: [
        {
          name: '拍照',
          ident: 0
        },
        {
          name: '从手机相册选择',
          ident: 1
        }
      ]
    }
  },
  methods: {
    afterRead(file) {
      this.bindEvent()
      // console.log(file);
    },
    onSelect(val) {
      if (val.ident === 0) {
        this.upload_type = 'camera'
        this.rootDom.find('.van-uploader__input').click()
      } else if (val.ident === 1) {
        this.rootDom.find('.van-uploader__input').click()
      }
      this.cameraProp = false
    },
    onOverSize(file, detail) {
      this.$notify({
        type: 'danger',
        message: '文件大小超过限制'
      })
    },
    uploadFn() {
      this.upload_type = false
      this.cameraProp = true
    },
    bindEvent() {
      this.$nextTick(() => {
        if (!this.rootDom) {
          this.rootDom = $(document.getElementsByClassName(this.keyCls))
        }
        this.rootDom.find('.van-uploader__upload').on('click', this.uploadFn)
        this.rootDom.find('.van-uploader__preview').off('click', this.uploadFn)
      })
    },
    uoLoadImage(cb) {
      let len = this.uploadImgList.length
      let index = 0
      let _that = this
      let imgs = []
      if (len === 0) {
        return cb([])
      }
      async function upload() {
        UploadPicByPlayer({
          target: {
            files: [_that.uploadImgList[index].file]
          }
        }).then(file => {
          if (file) {
            imgs.push(file)

            if (index === len - 1) {
              cb(imgs)
            } else {
              index++
              upload()
            }
          } else {
            _that.$notify({
              type: 'danger',
              message: '图片上传失败'
            })
          }
        })
      }
      upload()
    }
  },
  mounted() {
    $(`${this.keyCls} .van-uploader__input`).on('click', e => {
      e.stopPropagation()
    })
    this.bindEvent()
  }
}
</script>

<style lang="scss">
.x-uploader {
  .van-uploader__input {
    pointer-events: none;
  }
}
</style>
