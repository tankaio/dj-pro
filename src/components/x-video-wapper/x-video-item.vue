<template>
  <div class="xvw-item">
    <div class="xvw-item-content">
      <x-img :src="url" class="xvw-img" />
      <div class="xvw-auth" v-if="auth">{{ auth }}</div>
      <div class="xvw-play"></div>
      <div class="xvw-footer">
        <div class="xvw-desc van-ellipsis">
          {{ desc }}
        </div>
        <div class="xvw-info-bar">
          <div class="xvw-time">{{ publish_time }}</div>
          <div class="xvw-video-time">{{ nums }} | {{ video_time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  name: 'x-video-item',
  props: ['desc', 'publish_time', 'nums', 'video_time', 'url', 'auth']
}
</script>
