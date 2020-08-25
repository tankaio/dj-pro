<template>
  <div class="x-img-view">
    <van-popup get-container="#box" class="album-popup" close-on-popstate v-model="albumShow" position="right">
      <div class="album__header">
        <div class="album__header--left" @click="onClose">
          <van-icon name="arrow-left" />
        </div>
        <div class="album__header--center">{{ index }}/{{ picture.length }}</div>
        <div class="album__header--right"></div>
      </div>
      <van-swipe
        indicator-color="white"
        :show-indicators="false"
        :height="$root.viewHeight"
        :width="$vw"
        @change="onChange"
        :initial-swipe="begin_index"
      >
        <van-swipe-item v-for="(item, index) in picture" :key="index">
          <x-img :src="item" />
        </van-swipe-item>
      </van-swipe>
      <div class="album__footer" v-if="isFooter">
        <span class="album__footer--item" @click="onClickRepy">
          <van-icon name="chat-o" />
          <span> 评论 {{ info.msgcount }}</span>
        </span>
        <span class="album__footer--item" @click="onClickLike">
          <van-icon v-if="info.islike" name="like" color="red" />
          <van-icon v-else name="like-o" />
          <span> 点赞 {{ info.likecount }}</span>
        </span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  name: 'x-img-view',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    picture: {
      type: Array,
      default: () => []
    },
    isFooter: {
      type: Boolean,
      default: true
    },
    idx: Number
  },
  data() {
    return {
      albumShow: false,
      index: 1,
      begin_index: 0
    }
  },
  methods: {
    onClose() {
      if (this.$router) {
        this.$router.back()
      } else {
        // this.$eventBus.$emit('bridge:back')
        history.back()
      }
      this.albumShow = false
      this.$emit('close')
    },
    onChange(index) {
      this.index = index + 1
    },
    onClickImg(index) {
      this.albumShow = true
      this.begin_index = index
      this.index = index + 1
      G.$routeHook(() => {
        this.$emit('close')
        this.albumShow = false
      })
    },
    onClickRepy() {
      this.$emit('repy')
      this.albumShow = false
    },
    onClickLike() {
      this.$emit('like', this.info)
    }
  },
  created() {
    this.index = this.idx
  }
}
</script>

<style lang="scss">
.album-popup {
  // top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  .van-swipe {
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
  }
  .album__header {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    background-color: #1a1a1a;
    height: 50px;
    z-index: 10;
    display: flex;
  }
  .album__footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background-color: #1a1a1a;
    height: 50px;
    z-index: 10;
  }
  .van-swipe {
    width: 100vw;
  }
  .van-swipe-item {
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: rgba($color: #000000, $alpha: 0.4);
  }
  .x-img {
    flex: 1;
    max-width: 100vw;
    max-height: 80vh;
    width: auto;
    object-fit: contain;
  }
  .album__header,
  .album__footer {
    font-size: 17px;
    color: $white;
    line-height: 50px;
    text-align: center;
    width: 100vw;
    box-sizing: border-box;
  }
  .album__header--left {
    width: 30%;
    display: flex;
    align-items: center;
    padding-left: 15px;
  }
  .album__header--center {
    flex: 1;
  }
  .album__header--right {
    width: 30%;
  }
  .album__footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
  }
  .album__footer--item {
    padding: 0 10px;
    display: flex;
    align-items: center;
    > span {
      margin-left: 5px;
      font-size: 13px;
      line-height: 1;
    }
  }
}
</style>
