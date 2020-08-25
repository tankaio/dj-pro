<template>
  <div class="x-user-item" @click="$emit('click')">
    <x-img :src="info.icon" class="avatar" dft />
    <div class="xu__center">
      <div class="xu__center--top">
        <span class="xu__username">
          {{ info.nick }}
        </span>
        <span v-if="info.level === 1" class="xIcon-specialist"></span>
      </div>
      <div class="xu__center--bottom">
        {{ showTime }}
      </div>
    </div>
    <div class="xu__right">
      <slot></slot>
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
  name: 'x-user-item',
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
.x-user-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  .avatar {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    overflow: hidden;
  }
  .xu__center {
    padding-left: 10px;
    flex: 1;
  }
  .xu__username {
    font-size: 14px;
    color: $txt;
    margin-right: 5px;
  }
  .xu__center--top {
    display: flex;
    align-items: center;
  }
  .xu__center--bottom {
    font-size: 11px;
    color: $txt;
    margin-top: 3px;
  }
  .xu__right {
    text-align: center;
    font-size: 14px;
    color: $txt;
    line-height: 35px;
    padding: 0 10px;
  }
}
</style>
