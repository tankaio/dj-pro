<template>
  <x-layout modifier="circleMessage">
    <template #header>
      <x-header :is-right="false" />
    </template>
    <van-cell title="打赏" is-link @click="linkTo('unreadtipm')">
      <van-tag round type="danger" v-show="rewardNews">
        {{ rewardNews }}
      </van-tag>
      <van-icon name="balance-o" slot="icon" />
    </van-cell>
    <van-cell title="评论" is-link @click="linkTo('unreadmsg')">
      <van-tag round type="danger" v-show="commentNews">
        {{ commentNews }}
      </van-tag>
      <van-icon name="chat-o" slot="icon" />
    </van-cell>
    <van-cell title="点赞" is-link @click="linkTo('unreadlike')">
      <van-tag round type="danger" v-show="thumbsUpNews">
        {{ thumbsUpNews }}
      </van-tag>
      <van-icon name="like-o" slot="icon" />
    </van-cell>
  </x-layout>
  <!-- <x-page rootClass="circleMessage"> </x-page> -->
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import xHeader from 'cpt/x-header.vue'

export default {
  components: {
    xHeader
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity', 'getCircelNewMsg']),
    commentNews() {
      if (this.getCircelNewMsg) return this.getCircelNewMsg.unreadmsg
    },
    thumbsUpNews() {
      if (this.getCircelNewMsg) return this.getCircelNewMsg.unreadlike
    },
    rewardNews() {
      if (this.getCircelNewMsg) return this.getCircelNewMsg.unreadtipm
    }
  },
  methods: {
    ...mapMutations(['setCircelNewMsgReaded']),
    linkTo(type) {
      switch (type) {
        case 'unreadmsg':
          this.$router.push('/circle/circleMessageComment')
          break
        case 'unreadtipm':
          this.$router.push('/circle/circleMessageReward')
          break
        case 'unreadlike':
          this.$router.push('/circle/circleMessageThumbsUp')
          break
        default:
          break
      }
      this.setCircelNewMsgReaded(type)
    },
    onLoad() {},
    mainLeftClick() {
      // this.$router.push('/circle');
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   // ...
  //   next(vm => {
  //     let { m, t, l } = to.query;
  //     vm.commentNews = m;
  //     vm.thumbsUpNews = l;
  //     vm.rewardNews = t;
  //   });
  // }
}
</script>

<style lang="scss">
.page-circleMessage-root {
  .van-cell__title {
    margin-left: 20.5px;
  }
}
</style>
