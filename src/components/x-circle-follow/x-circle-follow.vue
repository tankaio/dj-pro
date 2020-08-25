<template>
  <div class="x-circle-follow">
    <van-cell-group v-for="(item, index) in getMomentData" :key="index">
      <van-cell class="cell-info">
        <div class="xc-header">
          <div class="avatar-bar" @click="handlerImgClick(item)">
            <x-img :src="item.icon" class="avatar" dft />
          </div>
          <div class="xc__infos">
            <div class="xc__infos-top">
              <span class="xc__nick" @click="handlerImgClick(item)">{{ item.nick }}</span>
              <span v-if="item.level == 1" class="xIcon-specialist" />
            </div>
            <div class="xc__infos-bottom">
              <span class="xc__time">{{ item.time | timestampdispose }}</span>
            </div>
          </div>
          <!-- item.userid !== userInfo.id -->
          <template v-if="!isCloseRt && !userInfo.guest">
            <x-follow-btn-group class="xc__btn-bar" :isfollow="item.isfollow" :userid="item.userid" @follow="handleAddFollow(item)" />
            <div class="deleteLayoud" @click="deleteCircle(item)" v-if="!isMyUser(item)">
              <van-icon name="delete" />
            </div>
          </template>
        </div>
        <!-- 内容 -->
        <x-circle-main :text="item.text" :plan="item.plan" @click="handleDetails(item)" />
        <div class="xc__album" v-if="item.picture">
          <div class="xc__album--bar" v-for="(pic, pic_idx) in item.picture.split(',')" :key="pic_idx">
            <x-img class="xc__album--item" :src="pic" @click="onClickImg(item, pic_idx)" />
          </div>
        </div>
      </van-cell>
      <template>
        <!-- v-if="isMyUser(item)" -->
        <van-row class="xc-footer" type="flex" justify="space-around" align="center">
          <van-col v-if="isMyUser(item) || type === 'circleFinDetail'" @click="rewardPopupOpen(item, index)" span="6">
            <van-icon name="balance-o" />
            <span class="icon__span-text" :class="{ active: item.rewardDisplay }">打赏 {{ item.tipcount }}</span>
          </van-col>

          <van-col span="6" @click="handleCommentClick(item)">
            <van-icon name="chat-o" />
            <span class="icon__span-text" :class="{ active: item.commentDisplay }">评论 {{ item.msgcount }}</span>
          </van-col>

          <van-col span="6" @click="handleFollow(item)">
            <van-icon v-if="item.islike" name="like" color="red" />
            <van-icon v-else name="like-o" />
            <span class="icon__span-text" :class="{ active: item.thumbsUpDisplay }">点赞 {{ item.likecount }}</span>
          </van-col>
        </van-row>
      </template>
    </van-cell-group>

    <x-img-view
      ref="xiv"
      :info="album_info"
      :picture="album_picture"
      :idx="album_index"
      @close="album_picture = []"
      @like="likeMomentInter"
      @repy="handleCommentClick(album_info)"
    />
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
import xFollowBtnGroup from 'cpt/x-circle-follow/x-follow-btn-group.vue'
import xCircleMain from 'cpt/x-circle-follow/x-circle-main.vue'
import xImgView from 'cpt/x-img-view.vue'

import { mapGetters, mapMutations } from 'vuex'
import Http from '@/utils/http/index.ws.js'
import { timestampdispose } from '@/utils/formant.util.js'
import { getMomentTips, getMomentMsgs, likeMoment, cancelLikeMoment, removeMoment, followSomebody } from '@/api/circle'

export default {
  components: {
    xImg,
    xFollowBtnGroup,
    xCircleMain,
    xImgView
  },
  name: 'x-circle-follow',
  filters: {
    timestampdispose(value) {
      return timestampdispose(value)
    }
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    isCloseRt: {
      type: Boolean,
      default: false // 是否关闭右上角操作按钮
    }
  },
  data() {
    return {
      followData: '添加关注可以看到更多关注人的动态哦',
      tiplist: [],
      msglist: [],
      contentHidden: [],
      contentText: [],
      album_info: {},
      album_picture: [],
      album_index: 1
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity']),
    getMomentData() {
      let _this = this
      let data = this.dataList.map(v => {
        // 评论
        this.$set(v, 'commentDisplay', false)
        // 点赞
        this.$set(v, 'thumbsUpDisplay', false)
        // 打赏
        this.$set(v, 'rewardDisplay', false)
        // 展开全部回复和收起
        this.$set(v, 'replyFlag', false)
        return v
      })
      return data
    }
  },
  methods: {
    ...mapMutations(['setDetailsParams', 'setOwnUserInfo']),
    onClickImg(item, idx) {
      this.album_info = item
      this.album_index = idx
      this.album_picture = item.picture.split(',')
      this.$refs.xiv.onClickImg(idx)
    },
    // 点赞接口
    async likeMomentInter(item) {
      let { ok, msg } = await likeMoment({ id: item.id })
      if (ok) {
        item.islike = !item.islike
        item.likecount++
        // this.$emit('loadData')
      }
    },
    // 取消点赞接口
    async cancelLikeMomentInter(item) {
      let { ok, msg } = await cancelLikeMoment({ id: item.id })
      if (ok) {
        item.islike = !item.islike
        item.likecount--
        // this.$emit('loadData')
      }
    },
    // 删除晒单接口
    async removeMomentInter(item) {
      let { ok, msg } = await removeMoment({ id: item.id })
      if (ok) {
        this.$emit('loadData')
      }
    },
    // 关注取消关注接口
    async followSomebody(nick, follow) {
      let _data = {
        nick: nick,
        follow: follow
      }
      let { ok, msg } = await followSomebody(_data)
      if (ok) {
        this.$emit('loadData')
      }
    },
    // 判断是否是自己
    isMyUser(item) {
      return parseInt(item.userid) !== parseInt(this.userInfo.id)
    },
    // 删除自己的晒单
    deleteCircle(item) {
      G.$dialog
        .confirm({ message: '确定删除这条晒单吗' })
        .then(() => {
          this.removeMomentInter(item)
        })
        .catch(() => {})
    },
    // 添加关注
    handleAddFollow(item) {
      let changeFollowState = () => {
        let v
        switch (item.isfollow) {
          case 0:
            v = 1
            break
          case 1:
            v = 2
            break
          case 2:
            v = 3
            break
          case 3:
            v = 2
            break
          default:
            break
        }
        this.getMomentData.forEach(ele => {
          if (ele.userid === item.userid) ele.isfollow = v
        })
      }

      if (item.isfollow === 0 || item.isfollow === 2) {
        this.followSomebody(item.nick, true)
        changeFollowState()
        this.$toast('已关注')
      } else if (item.isfollow === 1 || item.isfollow === 3) {
        G.$dialog
          .confirm({ message: '确认不在关注？' })
          .then(() => {
            this.followSomebody(item.nick, false)
            changeFollowState()
            this.$toast('已取关')
          })
          .catch(() => {})
      }
    },
    // 点击点赞
    handleFollow(item) {
      if (!this.$root.loginVerify()) return
      if (!item.islike) {
        this.likeMomentInter(item)
      } else {
        this.cancelLikeMomentInter(item)
      }
    },
    // 打开打赏窗口
    rewardPopupOpen(item, idx) {
      if (!this.$root.loginVerify()) return
      this.$emit('rewardPopupOpen', {
        id: item.id,
        idx
      })
    },
    // 点击评论
    handleCommentClick(item) {
      if (!this.$root.loginVerify()) return
      this.setDetailsParams(item)
      this.$router.push(`/circle/dryingListDetails/${item.id}`)
    },
    // 查看回复
    handleReplyViewClick(item) {
      item.replyFlag = !item.replyFlag
    },
    // 点击某条晒圈或评论进入详情页
    handleDetails(item) {
      this.setDetailsParams(item)
      if (this.type === 'circleFinDetail') {
        item.thumbsUpDisplay = false
        item.rewardDisplay = false
        return
      }
      this.$router.push(`/circle/dryingListDetails/${item.id}`)
    },
    // 点击头像，用户名
    handlerImgClick(item) {
      const useinfo = {
        userid: item.userid,
        nick: item.nick,
        icon: item.icon
      }
      this.setOwnUserInfo(useinfo)
      // 如果已经在个人或他人主页，点击不生效
      if (this.type === 'circleOwn') {
        return
      }
      if (item.userid == this.userInfo.id) {
        this.$router.push(`/userInfo/userInfoCircle/?id=${item.userid}&nick=${item.nick}`)
      } else {
        this.$router.push(`/userInfo/userInfoCircle?id=${item.userid}&nick=${item.nick}`)
      }
    }
  },
  mounted() {
    $('.xc__main--text').each((idx, ele) => {
      console.log(ele.clientHeight, ele.scrollHeight)
    })
  }
}
</script>

<style lang="scss">
.x-circle-follow {
  .xc-header {
    display: flex;
    align-items: center;
  }
  .avatar-bar {
    overflow: hidden;
    display: flex;
    align-items: center;
    .avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .deleteLayoud {
    padding: 0 10px;
    font-size: 18px;
  }
  .xc__infos {
    padding-left: 10px;
    flex: 1;
  }
  .xc__infos-top {
    display: flex;
    align-items: center;
  }
  .xc__nick {
    font-size: 15px;
    color: $txt;
    margin-right: 5px;
  }

  .xc__time {
    font-size: 11px;
    color: $gray-99;
  }
  .xc__btn-bar {
    background-color: transparent;
  }

  .xc-footer {
    height: 35px;
    background-color: $white;
    > .van-col {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .icon__span-text {
    font-size: 13px;
  }
  .xc__album {
    display: flex;
    flex-wrap: wrap;
    .xc__album--bar {
      width: 32%;
      padding-bottom: 32%;
      margin-bottom: 3%;
      position: relative;
      &:not(:nth-child(3n)) {
        margin-right: 2%;
      }
      .xc__album--item {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        object-fit: cover;
        pointer-events: unset;
      }
    }
  }
}
</style>
