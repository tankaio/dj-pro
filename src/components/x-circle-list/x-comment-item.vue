<template>
  <div class="x-comment-item" @click.stop="$emit('repy')">
    <x-img :src="info.icon" class="xc__avatar" dft />
    <div class="xc__main">
      <!-- 留言头 -->
      <div class="xc__infos">
        <div class="xc__infos--top">
          <span class="xc__username">
            {{ info.nick }}
          </span>
          <span v-if="info.level === 1" class="xIcon-specialist"></span>
        </div>
        <div class="xc__infos--bottom">
          <span class="xc__time">
            {{ showTime }}
          </span>
        </div>
      </div>
      <!-- 留言体 -->
      <div class="xc__body">回复 {{ info.replynick }}:{{ info.msgtext }}</div>
      <div class="xc__children">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
import { timestampdispose } from '@/utils/formant.util.js'
export default {
  components: {
    xImg
  },
  name: 'x-comment-item',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    showTime() {
      if (this.info.time) {
        return timestampdispose(this.info.time)
      }
    }
  }
}
</script>

<style lang="scss">
.xc__children {
  .x-comment-item {
    padding: 5px 0;
  }
}
.x-comment-item {
  // padding: 10px 15px;
  padding: 10px 0;
  display: flex;
  .xc__avatar {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    overflow: hidden;
  }
  .xc__main {
    flex: 1;
    margin-left: 10px;
  }
  .xc__infos--top,
  .xc__infos--bottom {
    display: flex;
    align-items: center;
    > *:not(:last-child) {
      margin-right: 5px;
    }
  }
  .xc__infos--bottom{
    margin-top: 3px;
  }
  .xc__username {
    font-size: 14px;
    color: $txt;
  }
  .xc__time {
    color: #999999;
    font-size: 11px;
    padding: 2px 0;
  }
  .xc__body {
    font-size: 15px;
    color: $txt;
    word-break: break-all;
    margin-top: 3px;
  }
}
</style>
