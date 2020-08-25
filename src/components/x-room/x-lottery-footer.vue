<template>
  <div class="x-lottery-footer">
    <transition-group
      :appear="false"
      mode="out-in"
      name="fade"
      leave-active-class="animated fadeOutDown faster"
      enter-active-class="animated fadeInUp faster"
    >
      <div class="chatWith animate" :key="1" v-show="chat">
        <!-- 键盘与投注切换 -->
        <div class="btn" @click="onKeyBoardClick">
          <span class="xIcon-keyboard-room"></span>
        </div>
        <!-- 输入语音切换按钮 -->
        <div class="btn" @click="onVoiceClick">
          <span class="xIcon-voice-room"></span>
        </div>
        <!-- 输入框 -->
        <x-room-input ref="myinput" v-model="talk" @focus="onFocus" @blur="onBlur" @keyup.enter="onSend" v-show="room_input_ctr" />
        <!-- 录音 -->
        <div class="voiceBtn" v-show="voice_ctr" :class="{ Act: release }" @touchstart="onTouchStart" @touchend="onTouchEnd">
          {{ release ? '松开  结束' : '按住  说话' }}
        </div>

        <!-- emoji 按钮 -->
        <div class="btn" @click.stop="onClickEmojiBtn" @touchstart.stop>
          <span class="xIcon-emoji-room"></span>
        </div>
        <!-- 发送消息按钮 -->
        <div class="btn" v-show="send_ctr" @click="onSend">
          <span class="xIcon-send-room"></span>
        </div>
        <!-- 更多功能按钮 -->
        <div class="btn" v-show="add_btn_ctr" @touchstart.stop @click.stop="onClickAdd">
          <span class="xIcon-add-room"></span>
        </div>
      </div>

      <div class="Features animate" :key="2" v-show="!chat">
        <div class="btn van-hairline--right">
          <span class="toggle xIcon-keyboard-up-room" @click="chat = !chat" />
        </div>
        <span class="fed van-hairline--right" @click="$router.push(`/games/lhc/${getChatInfo.game}`)">彩票投注</span>
        <span class="assistant van-hairline--right" @click="$router.push('/chat/changLongAssistant')">
          长龙助手
        </span>
        <span class="more" @click.stop="more = !more">
          <van-icon name="wap-nav" />
          <span>更多</span>
          <transition enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster">
            <div class="moreList" v-show="more">
              <div class="item" @touchstart.stop @click.stop="$router.push('/user/integral')">
                充值
              </div>
              <div class="item" @touchstart.stop @click.stop="$router.push('/games/betrecord')">
                投注记录
              </div>
              <div class="item" @touchstart.stop @click.stop="$router.push('/awardInfo')">
                开奖结果
              </div>
              <div class="item" @touchstart.stop @click.stop="$router.push('/games/howplay')">
                玩法介绍
              </div>
              <div class="item" @touchstart.stop @click.stop="$router.push('/user/bill')">
                账户清单
              </div>
            </div>
          </transition>
        </span>
      </div>
    </transition-group>
    <div class="emojiBar" @click.stop.prevent @touchmove.stop.prevent @touchstart.stop.prevent @touchend.stop.prevent :class="{ active: emoji }">
      <x-panel-emoji @setemoji="onSetEmoji" />
    </div>
    <div class="fold" @click.stop="onClickFold" @touchmove.stop.prevent @touchstart.stop @touchend.stop :class="{ active: fold }">
      <van-swipe>
        <van-swipe-item class="foldsBar">
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import xRoomInput from 'cpt/x-room/x-room-input.vue'
import xPanelEmoji from 'cpt/x-room/x-panel-emoji.vue'

export default {
  components: {
    xRoomInput,
    xPanelEmoji
  },
  name: 'x-lottery-footer',
  props: {
    msg: ''
  },
  model: {
    prop: 'msg',
    event: 'sync'
  },
  data() {
    return {
      chat: false,
      focus: false,
      more: false,
      fold: false,
      release: false,
      mode: 'input', // voice , input, bet
      emoji: false, // 展开emoji
      talk: { talk: '', height: 0 },
      last_edit_range: 0,
      room_type: 'bet' // bet , red
    }
  },
  computed: {
    ...mapGetters(['getChatInfo']),
    send_ctr() {
      if (this.talk.talk !== '') {
        return true
      }
      return false
    },
    add_btn_ctr() {
      if (this.talk.talk !== '') {
        return false
      }
      return true
    },
    room_input_ctr() {
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
      if (this.mode === 'input') {
        return false
      }
      return true
    }
  },
  methods: {
    onClickFold() {
      this.fold = false
    },
    // 把数字转化成指定位数的字串
    _pad(num, n) {
      let y = '000000' + num
      return y.substr(y.length - n)
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
      if (this.mode === 'voice') return
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

    onKeyBoardClick() {
      this.chat = false
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
      this.$emit('blur')
      G.delay(() => {
        this.focus = false
      }, 100)
    },
    onFocus() {
      this.focus = true
      this.$emit('focus')
      this.$refs.myinput.exitEmojiMode()
      // let footer = $('.x-lottery-footer')
      // if (footer[0]) {
      //   footer.css('bottom', '-30px')
      // }
    },
    emitFold() {
      if (this.fold || this.emoji) {
        this.$emit('fold')
      } else {
        this.$emit('unfold')
      }
    }
  },
  created() {
    this.closeFold = () => {
      this.more = false
      this.fold = false
      this.emoji = false
      this.redgame = false
    }

    document.body.addEventListener('click', this.closeFold)
    document.body.addEventListener('touchstart', this.closeFold)
  },
  watch: {
    fold(news) {
      this.emitFold()
    },
    emoji(news) {
      this.emitFold()
    }
  },
  destroyed() {
    document.body.removeEventListener('click', this.closeFold)
    document.body.removeEventListener('touchstart', this.closeFold)
  }
}
</script>

<style lang="scss">
.x-lottery-footer {
  min-height: 50px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 50px;
  z-index: 10;
  box-sizing: border-box;
  background-color: $gray-f78a;
  &::before {
    position: absolute;
    content: '购彩聊天室';
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    padding-top: 5px;
    box-sizing: border-box;
    color: $gray-d7;
    font-size: 12px;
  }
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
      .xIcon-keyboard-room {
        transform: translateY(3.5px);
      }
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
        pointer-events: none;
        &::before {
          display: none;
        }
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
        width: 84px;
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
            left: 7px;
            right: 7px;
            border-bottom: 1px solid $gray-99;
            transform: rotateX(45deg);
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
        height: 115px;
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
    .emoji {
      pointer-events: unset;
    }
  }
  .redgame {
    .foldItemBar {
      max-height: 115px;
    }
  }
  .van-hairline--right::after {
    border-color: #d6d6d6;
  }
}
</style>
