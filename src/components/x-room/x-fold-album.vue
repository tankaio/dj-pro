<template>
  <div class="x-fold-album foldItemBar" @click="onClick">
    <div class="iconBar">
      <span class="xIcon-img-fold"></span>
    </div>
    <div class="txt">
      相册
    </div>
    <input type="file" accept="image/*" id="album" @change="onChange" />
  </div>
</template>

<script>
import { PlayerSendChatPic } from '@/api/chat'
import { mapGetters } from 'vuex'
import strg from '@/utils/storage.util.js'
export default {
  name: 'x-fold-album',
  computed: {
    ...mapGetters(['getRid']),
    isIos() {
      var ua = navigator.userAgent.toLowerCase()
      var ua_match = ua.match(/iPhone\sOS/i)
      if (ua_match && ua_match[0] == 'iphone os') {
        return false
      } else {
        return 'camera'
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
      $('#album').click()
    },
    onChange(e) {
      this.$emit('upload-before')
      PlayerSendChatPic(e, { rid: this.getRid }).then((ok, file) => {
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
.x-fold-album {
  position: relative;
  #album {
    opacity: 0;
    z-index: -1;
    position: absolute;
  }
}
</style>
