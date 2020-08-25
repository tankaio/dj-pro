<template>
  <transition-group
    :appear="false"
    mode="in-out"
    name="fade"
    tag="div"
    class="chat-footer"
    @click="$emit('click')"
    leave-active-class="animated fadeOutDown faster"
    enter-active-class="animated fadeInUp faster"
  >
    <div class="footer-group-1" :key="1" v-show="footerGroupActive === 1">
      <div class="btn van-hairline--right" @click="footerGroupActive = 2"><span class="toggle xIcon-keyboard-up-room" /></div>
      <div class="btn van-hairline--right" @click="emitPush(`/games/lhc/${getChatInfo.game}`)">彩票投注</div>
      <div class="btn van-hairline--right" @click="emitPush('/chat/changLongAssistant')">长龙助手</div>
      <div class="btn" @click="showMore = true">
        <van-icon name="wap-nav" />
        <span>更多</span>
        <van-popup class="moreListBar" v-model="showMore" :key="3" get-container="#box" :overlay-style="{ backgroundColor: 'transparent' }">
          <transition enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster">
            <div class="moreList" v-show="showMore">
              <div class="mask"></div>
              <div class="item" @touchstart.stop @click.stop="emitPush('/user/integral')">充值</div>
              <div class="item" @touchstart.stop @click.stop="emitPush('/games/betrecord')">投注记录</div>
              <div class="item" @touchstart.stop @click.stop="emitPush('/awardInfo')">开奖结果</div>
              <div class="item" @touchstart.stop @click.stop="emitPush('/games/howplay')">玩法介绍</div>
              <div class="item" @touchstart.stop @click.stop="emitPush('/user/bill')">账户清单</div>
            </div>
          </transition>
        </van-popup>
      </div>
    </div>
    <div class="footer-group-2" :key="2" v-show="footerGroupActive === 2">
      <!-- 键盘与投注切换 -->
      <div class="btn" @click="toggleFooter"><span class="xIcon-keyboard-room" /></div>
      <!-- 输入语音切换按钮 -->
      <div class="btn" @click="toggleModel"><span class="xIcon-voice-room" /></div>
      <transition-group
        :appear="false"
        mode="in-out"
        name="fade"
        tag="div"
        class="putOrVoice"
        leave-active-class="animated fadeOut faster"
        enter-active-class="animated fadeIn faster"
      >
        <!-- 输入框 -->
        <x-room-input key="input" ref="myinput" v-model="talk" @focus="onFocus" @blur="onBlur" @keyup.enter="onSend" v-if="!isVoice" />
        <!-- 录音 -->
        <div key="voice" class="voiceBtn" v-if="isVoice" :class="{ Act: voiceBtnIsTouched }" @touchstart="onTouchStart" @touchend="onTouchEnd">
          {{ voiceBtnIsTouched ? '松开  结束' : '按住  说话' }}
        </div>
      </transition-group>

      <!-- emoji 按钮 -->
      <div class="btn" @touchstart.stop.prevent="onEmojiBtn" @touchmove.stop.prevent @click.stop.prevent="onEmojiBtn">
        <span class="xIcon-emoji-room" />
      </div>
      <!-- 发送消息按钮 -->
      <div class="btn" v-if="isSendBtn" @click="onSend"><span class="xIcon-send-room" /></div>
      <!-- 更多功能按钮 -->
      <div class="btn" v-if="!isSendBtn" @click="$emit('more')"><span class="xIcon-add-room" /></div>
    </div>
  </transition-group>
</template>

<script>
import xRoomInput from 'cpt/x-room/x-room-input.vue'
import xPanelEmoji from 'cpt/x-room/x-panel-emoji.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    xRoomInput,
    xPanelEmoji
  },
  name: 'chat-footer',
  data() {
    return {
      footerGroupActive: 1, // 底部栏分组当前激活组
      showMore: false, // 是否展开更多功能
      isFocus: false, // 输入框是否为焦点状态
      isVoice: false, // 语音还是输入
      voiceBtnIsTouched: false, // 语音按钮是否为按压状态
      talk: {} // 输入框数据
    }
  },
  computed: {
    ...mapGetters(['getChatInfo']),
    isSendBtn() {
      if (this.talk.talk != '' && this.talk.talk != undefined) {
        return true
      }
      return false
    }
  },
  methods: {
    onFocus() {
      this.$emit('focus')
      this.isFocus = true
      this.$refs.myinput.exitEmojiMode()
    },
    onBlur() {
      this.$emit('blur')
      this.isFocus = false
    },
    onSend() {
      this.$emit('send', this.talk.talk)
      this.$refs.myinput.clearTalk()
      this.$refs.myinput.$el.blur()
      this.$refs.myinput.isfocus = false
      this.talk.talk = ''
    },
    onTouchStart() {
      this.$emit('voice-touch')
      this.voiceBtnIsTouched = true
    },
    onTouchEnd() {
      this.$emit('voice-touchend')
      this.voiceBtnIsTouched = false
    },
    emitPush(path) {
      this.showMore = false
      this.$emit('to', path)
    },
    toggleModel() {
      this.$emit('toggle-mode')
      this.isVoice = !this.isVoice
    },
    toggleFooter() {
      this.$emit('toggle-footer')
      this.footerGroupActive = 1
    },
    onEmojiBtn() {
      if (this.isVoice) return
      this.$emit('emoji')
    }
  }
}
</script>

<style lang="scss">
.chat-footer {
  @include abs;
  top: unset;
  height: 50px;
  z-index: 20;
  background-color: $gray-f5;

  @mixin animated {
    .fade-leave-to {
      position: absolute;
    }
    .fade-enter-to {
      position: absolute;
    }
  }

  .footer-group-1,
  .footer-group-2 {
    @include abs;
    height: 50px;
    width: 100vw;
    display: flex;
  }
  .footer-group-1 {
    font-size: 15px;
    color: $txt;
    .btn {
      text-align: center;
      line-height: 50px;
      flex: 1;
      @include active('before');
    }
    .btn:nth-child(1) {
      width: 50px;
      flex: none;
      @include center('');
    }
    .btn:nth-child(4) {
      @include center('');
      position: relative;
    }
  }
  .footer-group-2 {
    align-items: center;
    > * {
      flex: 1;
    }
    .btn {
      @include center('');
      @include active('');
      height: 100%;
    }
    .putOrVoice {
      position: relative;
      width: 194px;
      height: 34px;
      flex: none;
      overflow: hidden;
    }
    .roomPut,
    .voiceBtn {
      flex: none;
      width: 194px;
      height: 34px;
      border-radius: 2.5px;
      outline: none;
      background-color: $white;
      font-size: 15px;
      color: $txt;
      line-height: 34px;
      box-sizing: border-box;
      padding: 0 5px;
    }
    .roomPut {
      overflow: hidden;
    }
    .voiceBtn {
      text-align: center;
    }
    @include animated;
  }
  @include animated;
}
.moreListBar {
  padding-bottom: 10px;
  background-color: transparent;
  top: unset;
  left: unset;
  bottom: 0;
  right: 0;
  transform: translate3d(-25%, -50px, 0);
  .moreList {
    display: block;
    width: 84px;
    border-radius: 2.5px;
    background-color: $featureBg;
    z-index: 20;
    border: 0.5px solid $gray-d7;
    position: relative;
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
</style>
