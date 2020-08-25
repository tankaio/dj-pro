<template>
  <div class="x-fold-camera foldItemBar" @click="onClick">
    <div class="iconBar">
      <span class="xIcon-camera-fold"></span>
    </div>
    <div class="txt">
      拍照
    </div>
    <input type="file" accept="image/*" id="camera" @change="onChange" :capture="isIos" />
  </div>
</template>

<script>
import { PlayerSendChatPic } from '@/api/chat'
import { mapGetters } from 'vuex'
import strg from '@/utils/storage.util.js'
export default {
  name: 'x-fold-camera',
  computed: {
    ...mapGetters(['getRid']),
    isIos() {
      var ua = navigator.userAgent.toLowerCase()
      var ua_match = ua.match(/iPhone\sOS/i)
      if (ua_match && ua_match[0] == 'iphone os') {
        return true
      } else {
        return 'camera'
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
      $('#camera').click()
    },
    onChange(e) {
      this.$emit('upload-before')
      PlayerSendChatPic(e, { rid: this.getRid }).then(({ ok, msg, zip_file }) => {
        if (ok) {
          this.$emit('upload')
        }
      })
    }
  },
  mounted() {
    strg.init()
  }
}
</script>

<style lang="scss">
.x-fold-camera {
  position: relative;
  #camera {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
}
</style>
