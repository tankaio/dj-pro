<template>
  <!-- 六合头条个人中的头条单项 -->
  <div class="x-u-toutiao" ref="xut" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div class="xu__hd">
      <div class="xu__hd--left">
        <x-img class="xu__avatar" :src="ico" />
        <span class="xu__nick">{{ nick }}</span>
        <span :class="gender | Gander('icon')" />
      </div>
      <div class="xu__hd--right">
        <template v-if="state && type === 'self'">
          <van-button round plain type="danger" size="small">编辑</van-button>
          <van-button round plain size="small">已锁定</van-button>
        </template>

        <div class="xu__reward-integral" v-if="type === 'reward'">
          打赏过
          <i>{{ reward }}</i>
          积分
        </div>
      </div>
    </div>
    <div class="xu__bd">
      <!-- 未删除 -->
      <template v-if="state">
        <!-- 文本 start -->
        <div class="xu__text">
          {{ text }}
        </div>

        <!-- 图片 start-->
        <div class="xu__albums">
          <div class="xu__album-bar" v-for="(item, index) in album" :key="index" @click="$emit('viewimg', album, index)">
            <x-img class="xu__album" :src="item" />
          </div>
        </div>
      </template>

      <!-- 删除 start -->
      <div class="xu__db--del" v-else>
        头条已被删除
      </div>
      <!-- 删除 end -->
    </div>
    <div class="xu__ft van-hairline--top">
      <!-- 发帖时间 -->
      <div class="xu__time">
        {{ time }}
      </div>
      <!-- 被删除 -->
      <template v-if="state">
        <!-- 留言数量 -->
        <div class="xu__msg-num">
          <van-icon name="comment-o" />
          {{ Number(msgnum) > 99 ? `${msgnum}+` : msgnum }}
        </div>
        <!-- 被打赏积分 -->
        <div class="xu__reward" v-if="type === 'self'">
          <van-icon name="points" />
          +{{ integral }}
        </div>
        <!-- 被点赞数 -->
        <div class="xu__like" v-if="type === 'history' || type === 'reward'">
          <van-icon name="good-job-o" />
          {{ likeShow }}
        </div>
        <!-- 被打赏积分 end -->
      </template>
    </div>
    <!-- 删除窗 -->
    <div class="xu__del" v-if="isDel">
      <div class="xu__del-mask" @click.stop.prevent @touchmove.stop.prevent />
      <div class="xu__cancel-btn" @click="onClickCancel">取消</div>
      <div class="xu__confirm-btn" @click="onClickConfirm">确认</div>
    </div>
  </div>
</template>

<script>
// 组件
import xImg from 'cpt/x-img.vue'
// Emit
// $emit('viewimg', album, index)

export default {
  name: 'x-u-toutiao',
  components: { xImg },
  props: {
    type: {
      type: String,
      default: 'self' // self 我的,history 历史,msg 评论,reward 打赏
    },
    ico: String,
    nick: String,
    gender: { type: Number, default: 0 },
    text: String,
    time: String,
    msgnum: Number,
    integral: Number,
    reward: Number, // 打赏别人的积分数
    like: {
      type: Number,
      default: 0
    },
    state: [Number, Boolean], // 是否为删除状态或是其他
    album: { type: Array, default: () => [] }
  },
  data() {
    return {
      isDel: false
    }
  },
  computed: {
    likeShow() {
      if (this.like === 0) {
        return '赞'
      } else if (this.like > 99) {
        return '99+'
      } else {
        return this.like
      }
    }
  },
  methods: {
    onTouchStart() {
      this.time_count = new Date().getTime()
      this.touch = true
      this.countTime()
    },
    onTouchMove() {
      this.touch = false
      clearTimeout(this.timer)
    },
    onTouchEnd() {
      this.touch = false
      clearTimeout(this.timer)
    },
    countTime() {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        if (this.touch && !this.isDel) {
          navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate
          if (navigator.vibrate) {
            navigator.vibrate(100)
          }
          this.isDel = true
          this.touch = false
        }
      }, 800)
    },
    onClickCancel() {
      this.isDel = false
    },
    onClickConfirm() {
      this.isDel = false
      G.$dialog
        .confirm({
          message: '记录删除后无法恢复，请确认是 否删除？'
        })
        .then(() => {})
    }
  }
}
</script>

<style lang="scss">
.x-u-toutiao {
  padding: 15px 15px 0;
  margin-bottom: 8px;
  background-color: $white;
  position: relative;
  .van-button {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
  .van-button--default {
    color: $gray-99;
    border-color: $gray-99;
    &::before {
      border-color: $gray-99;
    }
  }
  //   &:active::before {
  //     position: absolute;
  //     display: block;
  //     content: '';
  //     top: 0;
  //     left: 0;
  //     right: 0;
  //     bottom: 0;
  //     width: 100%;
  //     height: 100%;
  //     background-color: #000;
  //     opacity: 0.1;
  //     z-index: 10;
  //   }
}
//  header
.xu__hd {
  display: flex;
  align-items: center;
}
.xu__hd--left,
.xu__hd--right {
  display: flex;
}
.xu__hd--left {
  display: flex;
  align-items: center;
  > * {
    margin-right: 10px;
  }
}
.xu__avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.xu__nick {
  font-size: 14px;
  font-weight: 600;
}
.xu__hd--right {
  flex: 1;
  justify-content: flex-end;
}
.xu__reward-integral {
  font-size: 13px;
  color: $gray-66;
  text-align: right;

  > i {
    color: $rootColor;
    font-size: 16px;
  }
}
// body
.xu__bd {
  padding: 10px 0 15px;
}
.xu__text {
  font-size: 15px;
  color: $txt;
  line-height: 23px;
  //   letter-spacing: 3px;
}
.xu__db--del {
  font-size: 15px;
  color: $rootColor;
  text-align: center;
}
.xu__albums {
  display: flex;
  flex-wrap: wrap;
}
.xu__album-bar {
  width: 32%;
  padding-bottom: 32%;
  margin-right: 2%;
  margin-top: 2%;
  position: relative;
  &:nth-child(3n) {
    margin-right: 0;
  }
}
.xu__album {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}
// footer
.xu__ft {
  display: flex;
  font-size: 13px;
  color: $gray-66;
  line-height: 36px;
}
.xu__time {
  flex: 4;
}
.xu__msg-num {
  flex: 3;
}
.xu__reward {
  flex: 3;
}
.xu__like {
  flex: 3;
}
.xu__msg-num,
.xu__reward,
.xu__like {
  display: flex;
  align-items: center;
  justify-content: center;
  .van-icon {
    margin-right: 5px;
  }
}
.xu__del {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.xu__del-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
}
.xu__cancel-btn,
.xu__confirm-btn {
  position: relative;
  z-index: 10;
  font-size: 15px;
  line-height: 80px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  text-align: center;
}
.xu__cancel-btn {
  background-color: $white;
  color: $txt;
}
.xu__confirm-btn {
  background-color: $rootColor;
  color: $white;
}
</style>
