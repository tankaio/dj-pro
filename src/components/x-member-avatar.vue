<template>
  <div class="x-member-avatar">
    <div class="xm-avatar-bar">
      <x-img :src="src" dft />
      <span v-if="state" :class="`xIcon-${state}-room xm-state`"></span>
      <span class="xm-new-msg" v-if="newMsg">{{ newMsg }}</span>
    </div>
    <div class="xm-name" v-if="name" v-text="name" />
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  name: 'x-member-avatar',
  props: {
    src: String,
    name: String,
    state: String, // admin muted
    newMsg: String
  }
}
</script>

<style lang="scss">
.x-member-avatar {
  width: 48px;
  .xm-avatar-bar {
    position: relative;
    font-size: 0;
  }
  .xm-state {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateY(10%) translateX(30%);
  }
  .x-img {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    overflow: hidden;
    font-size: 0;
  }
  .xm-name {
    width: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: $txt;
    margin-top: 3.5px;
  }
  .xm-new-msg {
    min-width: 15px;
    height: 15px;
    border-radius: 50%;
    color: $white;
    text-align: center;
    line-height: 15px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-50%) translateX(50%);
    background-color: $rootColor;
    font-size: 10px;
  }
}
</style>
