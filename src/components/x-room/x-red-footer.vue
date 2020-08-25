<template>
  <div class="x-red-footer">
    <div class="chatWith animate">
      <!-- 红包游戏快捷 -->
      <div class="btn" v-if="play_game_ctr" @click.stop="onPlayRedGame">
        <span class="xIcon-play-game"></span>
      </div>
      <!-- 输入语音切换按钮 -->
      <div class="btn" @click="onVoiceClick" :class="{ disable: otherBtnDisable }">
        <span class="xIcon-voice-room"></span>
      </div>
      <!-- 输入框 -->
      <x-room-input
        ref="myinput"
        v-model="talk"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="onSend"
        v-show="room_input_ctr"
        :class="{ disable: otherBtnDisable }"
      />
      <!-- 录音 -->
      <div class="voiceBtn" v-show="voice_ctr" :class="{ Act: release }" @touchstart="onTouchStart" @touchend="onTouchEnd">
        {{ release ? '松开  结束' : '按住  说话' }}
      </div>
      <!-- 投注,禁言 -->
      <div class="betBtn" v-show="bet_btn_ctr" :class="{ muted: betBtnDisable }" @click="onBetClick">
        {{ betBtnText }}
      </div>

      <!-- emoji 按钮 -->
      <div class="btn" @click.stop="onClickEmojiBtn" :class="{ disable: otherBtnDisable }">
        <span class="xIcon-emoji-room"></span>
      </div>
      <!-- 发送消息按钮 -->
      <div class="btn" v-if="send_ctr" @click="onSend">
        <span class="xIcon-send-room"></span>
      </div>
      <!-- 更多功能按钮 -->
      <div class="btn" v-else v-show="add_btn_ctr" @click.stop="onClickAdd">
        <span class="xIcon-add-room"></span>
      </div>
      <!-- 倒计时 -->
      <div class="btn" :class="{ admin_bookmarker_gaming: admin_bookmarker_gaming }" v-if="count_down_ctr" @click="$emit('count-click')">
        <span class="betCountDown">
          <slot name="countdown"></slot>
        </span>
      </div>
    </div>
    <!-- 表情包 -->
    <div class="emojiBar" @click.stop :class="{ active: emoji }">
      <x-panel-emoji @setemoji="onSetEmoji" />
    </div>
    <!-- 更多功能 -->
    <div class="fold" :class="{ active: fold }">
      <van-swipe>
        <van-swipe-item class="foldsBar">
          <slot name="fold"></slot>

          <!-- <div class="foldItemBar">
            <div class="iconBar">
              <span class="xIcon-camera-fold"></span>
            </div>
            <div class="txt">
              拍照
            </div>
          </div> -->

          <div class="foldItemBar">
            <div class="iconBar">
              <span class="xIcon-muted-fold"></span>
            </div>
            <div class="txt">
              全体禁言
            </div>
          </div>

          <div class="foldItemBar">
            <div class="iconBar">
              <span class="xIcon-voice-fold"></span>
            </div>
            <div class="txt">
              语音输入
            </div>
          </div>
          <div class="foldItemBar">
            <div class="iconBar">
              <span class="xIcon-share-order-fold"></span>
            </div>
            <div class="txt">
              分享注单
            </div>
          </div>
          <div class="foldItemBar">
            <div class="iconBar">
              <span class="xIcon-share-plan-fold"></span>
            </div>
            <div class="txt">
              分享计划
            </div>
          </div>
          <div class="foldItemBar">
            <div class="iconBar">
              <span class="xIcon-jam-fold"></span>
            </div>
            <div class="txt">
              卡卷
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item class="foldsBar"> 22</van-swipe-item>
      </van-swipe>
    </div>

    <div class="redgame" :class="{ active: redgame }">
      <van-swipe>
        <van-swipe-item class="foldsBar">
          <div class="foldItemBar" v-if="red_nn_ctr" @click="$router.push('/chat/redBagNiuNiu')">
            <div class="iconBar">
              <span class="xIcon-niuniu-fold"></span>
            </div>
            <div class="txt">
              牛牛红包
            </div>
          </div>

          <div class="foldItemBar" :class="{ disable: designation_bookmarker_disable }" @click="onDesignationClick">
            <div class="iconBar">
              <span class="xIcon-bookmarker-fold"></span>
            </div>
            <div class="txt">
              {{ bookmarker_text }}
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetBackNiuNiuBanker, ReturnBackNiuNiuBanker } from '@/api/chat'

import xRoomInput from 'cpt/x-room/x-room-input.vue'
import xPanelEmoji from 'cpt/x-room/x-panel-emoji.vue'

export default {
  components: {
    xRoomInput,
    xPanelEmoji
  },
  props: {
    msg: '',
    countdown: '',
    betBtnState: [Number, String],
    betAmount: [Number, String]
  },
  model: {
    prop: 'msg',
    event: 'sync'
  },
  data() {
    return {
      redgame: false,
      focus: false,
      fold: false,
      release: false,
      mode: 'input', // voice , input, bet
      emoji: false, // 展开emoji
      talk: { talk: '', height: 0 },
      last_edit_range: 0,
      bet: 1, // 是否可以投注
      betBtnDisable: false, // 投注按钮禁止点击态
      room_type: 'red' // bet , red
    }
  },
  computed: {
    ...mapGetters(['getBookMarker', 'getAdmin', 'getGameing', 'getBookMarkerInfo']),
    // 管理员庄家且游戏中
    admin_bookmarker_gaming() {
      if (this.getGameing && this.getAdmin && this.getBookMarker) {
        return true
      }
      return false
    },
    otherBtnDisable() {
      if (this.admin_bookmarker_gaming || !this.getGameing) {
        // 游戏中
        return false
      }
      return true
    },
    send_ctr() {
      if (this.talk.talk !== '') {
        return true
      }
      return false
    },
    designation_bookmarker_disable() {
      // 如果当前房间有进行的游戏则禁止指定庄家
      if (this.getGameing) return true
      return false
    },
    bookmarker_text() {
      if (this.getBookMarker && this.getAdmin) {
        return '指定庄家'
      }
      if (this.getBookMarker && !this.getAdmin) {
        return '返还庄家'
      }
      if (!this.getBookMarker && this.getAdmin) {
        return '收回庄家'
      }
    },
    add_btn_ctr() {
      if (this.room_type === 'red') {
        if (this.getAdmin && this.getBookMarker) {
          // 管理员且庄家
          return true
        }
        if (!this.getGameing) {
          return true
        }
        return false
      }
      if (this.room_type === 'bet') {
        // 输入框有值就是 false
        if (this.talk.talk !== '') {
          return false
        }
        return true
      }
    },
    room_input_ctr() {
      if (this.getGameing && !this.getBookMarker) {
        // 游戏开始且非庄家 ,不展示input
        return false
      }
      if (this.mode === 'voice') {
        // 当前为语音模式,不展示input
        return false
      }
      return true
    },
    red_nn_ctr() {
      if (this.getBookMarker) {
        return true
      }
      return false
    },
    voice_ctr() {
      if (this.getGameing && !this.getBookMarker) {
        // 游戏开始且非庄家 ,不展示voice
        return false
      }
      if (this.mode === 'input') {
        // 当前为输入模式,不展示voice
        return false
      }
      return true
    }, // 投注按钮
    bet_btn_ctr() {
      if (this.getGameing && !this.getBookMarker) {
        // 游戏中 且非庄家
        return true
      }
      if (this.getBookMarker) {
        return false
      }
      return false
    },
    keyboard_ctr() {
      if (this.room_type === 'red') {
        return false
      }
      return false
    },
    play_game_ctr() {
      if (this.room_type === 'red') {
        if (this.getAdmin || this.getBookMarker) {
          return true
        }
      }
      return false
    },
    count_down_ctr() {
      if (this.room_type === 'red' && this.getGameing) {
        return true
      }
      return false
    },
    betBtnText() {
      switch (this.betBtnState) {
        case 0:
          this.betBtnDisable = true
          return '房间已禁言'
        case 1:
          this.betBtnDisable = false
          return '投注'
        case 2:
          // 结束投注为开奖
          this.betBtnDisable = true
          return '投注已结束'
        case 3:
          this.betBtnDisable = false
          return '一键抢红包'
        case 4:
          this.betBtnDisable = true
          return `当前投注:${this.betAmount}元`
        default:
          this.betBtnDisable = false
          break
      }
    }
  },
  methods: {
    onDesignationClick() {
      if (this.getBookMarker && this.getAdmin) {
        // 庄家且管理员
        this.$router.push('/chat/designatedBookMarker')
      } else if (this.getGameing && this.getAdmin && !this.getBookMarker) {
        // 不是庄家,是管理员,游戏进行中
        this.$notify('将在该局结束后收回庄家')
      } else if (!this.getGameing && this.getAdmin && !this.getBookMarker) {
        // 不是庄家是管理,且游戏不在进行中
        // 收回庄家
        G.$dialog
          .confirm({
            title: '收回庄家',
            message: `确认要收回${this.getBookMarkerInfo.name}的庄家吗`
          })
          .then(async () => {
            let { ok, msg } = await GetBackNiuNiuBanker()
            if (ok) {
              this.$notify({
                type: 'success',
                message: '已经收回庄家'
              })
            }
          })
          .catch(() => {})
      }
      if (this.getBookMarker && !this.getAdmin) {
        // 是庄家且不是管理
        G.$dialog
          .confirm({
            title: '返还庄家',
            message: `要返还庄家给管理员吗?`
          })
          .then(async () => {
            let { ok, msg } = await ReturnBackNiuNiuBanker()
            if (ok) {
              this.$notify({
                type: 'success',
                message: '庄家已返还'
              })
            }
          })
          .catch(() => {})
      }
    },
    // 把数字转化成指定位数的字串
    _pad(num, n) {
      let y = '000000' + num
      return y.substr(y.length - n)
    },
    onBetClick() {
      if (this.betBtnState === 1) {
        this.$emit('bet')
      }
      if (this.betBtnState === 3) {
        this.$emit('grab')
      }
    },
    onSetEmoji(id) {
      // 0 号表情为删除按钮，1 到 100 号为微信的 100 个静态小表情
      if (id > 0) {
        let url = 'http://dtapi-aj.xy50test.com/img/' + 'wx' + this._pad(id, 3) + '.png'
        this.$refs.myinput.addEmoji(url)
      } else this.$refs.myinput.delEmoji()
    },
    onTouchStart() {
      this.release = true
      this.$emit('touchstart')
    },
    onVoiceClick() {
      this.mode = this.mode === 'voice' ? 'input' : 'voice'
    },
    // 点击展开emoji
    onClickEmojiBtn() {
      this.emoji = !this.emoji
      this.fold = false
      this.redgame = false
      this.$refs.myinput.enterEmojiMode()
    },
    onClickAdd() {
      this.emoji = false
      this.redgame = false
      this.fold = !this.fold
    },
    onTouchEnd() {
      this.release = false
      this.$emit('touchend')
    },
    onSend() {
      this.$emit('sync', this.talk.talk)
      this.$emit('send')
      this.$refs.myinput.clearTalk()
      this.$refs.myinput.$el.blur()
      this.$refs.myinput.isfocus = false
      this.emoji = false
      this.talk.talk = ''
    },
    onBlur() {
      G.delay(() => {
        this.focus = false
      }, 100)
    },
    onFocus() {
      this.focus = true
      this.$refs.myinput.exitEmojiMode()
    },
    onPlayRedGame() {
      this.redgame = !this.redgame
      this.fold = false
      this.emoji = false
      // this.$router.push("/chat/designatedBookMarker");
    },
    onBodyClick() {
      this.fold = false
      this.emoji = false
      this.redgame = false
    }
  },
  created() {
    document.body.addEventListener('click', this.onBodyClick)
  },
  destroyed() {
    document.body.removeEventListener('click', this.onBodyClick)
  },
  watch: {}
}
</script>

<style lang="scss">
.x-red-footer {
  min-height: 50px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 50px;
  box-sizing: border-box;

  .chatWith {
    display: flex;
    align-items: center;
    height: 50px;
    .btn {
      min-width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 50px;
      text-align: center;
      height: 100%;
      &:active {
        border-radius: 3px;
        background-color: rgba($color: #000000, $alpha: 0.1);
      }
      &.send {
        padding: 0 10px;
      }
      &.disable {
        opacity: 0.5;
        pointer-events: none;
      }
      &.admin_bookmarker_gaming {
        max-width: 0;
        min-width: 0;
        position: relative;
        .betCountDown {
          position: absolute;
          left: 0;
          transform: translateY(-50px) translateX(-32px);
        }
      }
    }
    .roomPut {
      flex: 1;
      padding: 5px;
      border-radius: 2.5px;
      height: 34px;
      outline: none;
      background-color: $white;
      box-sizing: border-box;
      line-height: 24px;
      word-wrap: break-word;
      > img {
        height: 24px;
        width: 24px;
        display: inline-block;
        content: ' ';
        pointer-events: none;
      }
    }
    .voiceBtn {
      flex: 1;
      text-align: center;
      border-radius: 2.5px;
      background-color: $white;
      line-height: 34px;
      height: 34px;
      font-size: 15px;
      &.Act {
        background-color: $roomVoiceUnActive;
      }
    }
    .betBtn {
      flex: 1;
      height: 34px;
      border-radius: 17px;
      background-color: $rootColor;
      color: $white;
      line-height: 34px;
      text-align: center;
      font-size: 13px;
      &.muted {
        background-color: #e5e5e5;
        color: $txt;
        box-shadow: inset 0 0 4px #e9e9e9;
      }
    }
    .betCountDown {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      background-image: linear-gradient(to right, #f97600, #fba104);
      box-shadow: inset 0 0 2px #db473f;
      line-height: 28px;
      text-align: center;
      font-size: 13px;
      color: $white;
    }
  }

  .Features {
    display: flex;
    align-items: center;
    > span {
      height: 50px;
      line-height: 50px;
      text-align: center;
      flex: 1;
      font-size: 15px;
      &:not(:last-child) {
        border-right: 1px solid $gray-f5;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      flex: none;
    }
    .more {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      > * {
        line-height: 1;
        font-size: 15px;
      }
      .moreList {
        display: block;
        position: absolute;
        top: 0;
        width: 80px;
        left: 50%;
        border-radius: 2.5px;
        border: 0.5px solid $gray-d7;
        background-color: $featureBg;
        transform: translateY(calc(-100% - 10px)) translateX(-50%);
        &::after {
          position: absolute;
          display: block;
          content: '';
          background-color: $featureBg;
          height: 10px;
          width: 10px;
          box-sizing: border-box;
          border-right: 0.5px solid $gray-d7;
          border-bottom: 0.5px solid $gray-d7;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) translateY(50%) rotateZ(45deg);
        }
        .item {
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 13px;
          position: relative;
          &:not(:last-child):after {
            position: absolute;
            display: block;
            content: '';
            left: 1%;
            right: 1%;
            border-bottom: 1px solid $gray-99;
            transform: rotateY(45deg);
          }
        }
      }
    }
  }

  .fade-leave-to {
    position: absolute;
    z-index: -1;
  }
  .fade-enter-to {
    position: absolute;
    z-index: 1;
  }
  .animate {
    position: absolute;
    background-color: $gray-f5;
    width: 100vw;
    top: 0;
  }
  .fold,
  .redgame {
    transition-duration: 200ms;
    height: 0;
    overflow: hidden;
    display: flex;
    background-color: $roomFoldBg;
    &.active {
      height: 230px;
    }
    .van-swipe {
      flex: 1;
    }
    .foldsBar {
      display: flex;
      flex-wrap: wrap;
      .foldItemBar {
        min-width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .iconBar {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          background-color: $white;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          .xIcon-niuniu-fold,
          .xIcon-bookmarker-fold {
            height: 60px;
            width: 60px;
          }
        }
        .txt {
          font-size: 12px;
          text-align: center;
          color: $gray-99;
          margin-top: 8px;
        }
      }
    }
  }
  .emojiBar {
    box-sizing: border-box;
    height: 0;
    transition-duration: 200ms;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    background-color: #ededed;
    position: relative;
    &.active {
      height: 230px;
    }
    // > * {
    //   width: 37.5px;
    //   text-align: center;
    //   height: 37.5px;
    //   line-height: 37.5px;
    //   font-size: 18px;
    // }
    .emoji {
      pointer-events: unset;
    }
  }
  .redgame {
    .foldItemBar {
      max-height: 115px;
    }
  }
}
</style>
