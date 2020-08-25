<template>
  <!-- xc__btn-bar -->
  <div class="x-follow-btn-group" v-if="isMe">
    <van-button v-if="isfollow === 0" @click="$emit('follow')" type="danger" size="small">
      + 关注
    </van-button>
    <van-button v-else-if="isfollow === 1" @click="$emit('follow')" type="danger" size="small">
      已关注
    </van-button>

    <van-button v-else-if="isfollow === 2" @click="$emit('follow')" type="danger" size="small">
      被关注
    </van-button>

    <van-button v-else type="danger" size="small" @click="$emit('follow')">
      相互关注
    </van-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'x-follow-btn-group',
  props: {
    isfollow: Number, // 关注状态
    userid: [Number, String] // 该帖子的用户id
  },
  computed: {
    ...mapGetters(['userInfo']),
    isMe() {
      return parseInt(this.userid) !== parseInt(this.userInfo.id)
    }
  }
}
</script>

<style lang="scss">
.x-follow-btn-group {
  .van-button {
    height: 24px;
    line-height: 24px;
  }
}
</style>
