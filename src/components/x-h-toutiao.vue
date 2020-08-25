<template>
  <!-- 六合头条首页帖子 -->
  <div class="x-h-toutiao" @click="$emit('click')">
    <div class="xht__text van-hairline--bottom">
      <h2 class="xht__tit van-multi-ellipsis--l2"><span class="essence" v-if="essence" /> {{ tit }}</h2>
      <div class="xht__albums" v-if="picture.length > 1">
        <div class="xht__album-bar" v-for="(item, index) in picture" :key="index">
          <x-img class="xht__album" :src="item" dft />
        </div>
      </div>
      <div class="xht__footer">
        <span class="xht__top" v-if="top">置顶</span>
        <span>{{ name }}</span>
        <span>{{ read }}阅读</span>
        <span>{{ showDate }}</span>
      </div>
    </div>
    <div class="xht__one-img" v-if="picture.length === 1">
      <x-img dft :src="picture[0]" />
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
import { timestampdispose } from '@/utils/formant.util.js'
export default {
  name: 'x-h-toutiao',
  components: { xImg },
  props: {
    tit: String,
    essence: Boolean,
    top: Boolean,
    name: String,
    read: Number,
    time: [String, Date],
    picture: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showDate() {
      return timestampdispose(this.time)
    }
  }
}
</script>

<style lang="scss">
.x-h-toutiao {
  display: flex;
  padding: 10px 10px 0;
}
.xht__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.xht__tit {
  line-height: 20px;
  font-size: 15px;
  color: $txt;
}
.xht__albums {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.xht__album-bar {
  //   width: 32%;
  //   padding-bottom: 32%;
  margin-right: 9px;
  //   font-size: 0;
  position: relative;
  &:nth-child(3n) {
    margin-right: 0;
  }
  width: 109px;
  height: 81px;
}
.xht__album {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.xht__one-img {
  margin-left: 10px;
  > img {
    width: 109px;
    height: 81px;
    object-fit: cover;
  }
}
.xht__footer {
  font-size: 11px;
  color: $gray-99;
  padding: 10px 0;
  > * {
    margin-right: 5px;
  }
}
.xht__top {
  color: $rootColor;
  font-size: 12px;
}
</style>
