<!--
    聊天底部 - 表情总面板
-->

<template>
  <div class="cont unsel">
    <div id="emoji" class="emoji">
      <x-emoji-wx :initid="1" :pmoved="moved" @setemoji="onsetemoji" />
    </div>
    <div id="pmain" class="pagemain">
      <div class="imgcont">
        <!-- <x-img class="img" src="../assets/face0.png" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import xEmojiWx from 'cpt/x-room/x-emoji-wx.vue'
export default {
  components: {
    xEmojiWx
  },
  data() {
    return {
      moved: false
    }
  },
  methods: {
    getHeight() {
      return this.$el.clientHeight
    },
    onsetemoji(id) {
      this.$emit('setemoji', id)
    }
  }
}
</script>

<style scoped>
/* 总样式 */
.cont.unsel {
  position: absolute;
  background: rgb(244, 244, 244);
  border-top: solid rgb(216, 216, 216) 1px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 230px;
  overflow: hidden;
}
/* 表情面板 */
.emoji {
  position: absolute;
  width: 100%;
  top: 0;
  height: 188px;
}
/* 表情种类翻页 */
.pagemain {
  position: absolute;
  width: 100vw;
  bottom: 0;
  height: 41px;
  border-top: solid rgb(216, 216, 216) 1px;
  overflow: hidden;
}
/* 总表情图标容器 */
.imgcont {
  height: 40px;
  width: 100vw;
  background: rgb(216, 216, 216);
}
.img {
  width: 28px;
  margin-top: 4.8px;
  margin-left: 12.8px;
}
</style>
