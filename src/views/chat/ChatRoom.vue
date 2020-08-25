<template>
  <div class="page-ChatRoom-root" id="room" :class="{ open: $root.open }">
    <van-nav-bar class="roomHeader" fixed @click-left="clickLeft" :title="getChatInfo.title" left-arrow :z-index="2020" />
    <!-- <x-header :click-left="clickLeft" :center-text="getChatInfo.title" :is-right="false" /> -->
    <div class="Overlay" :class="{ act: openOffset }" :style="{ transitionDuration }">
      <chat-context @click="clickChatContext" @load-pulldown="GetOldChats">
        <template v-for="(item, index) in chatList">
          <div class="timeStamp" :key="`timestamp_${index}`" v-if="item.timestamp">{{ item.timestamp }}</div>
          <chat-msg
            :key="index"
            v-bind="{
              nick: item.username,
              left: item.self,
              avatar: item.avatar
            }"
          >
            <template v-if="item.type === 'txt'">
              <div class="container txt" v-html="toEmoji(item.text)" />
            </template>
            <template v-if="item.type === 'img'">
              <div class="container img" @click="onClickImage(`msg-${item.ordid}`)">
                <x-img
                  :src="item.filename"
                  :lazy="false"
                  :cache="item.ordid"
                  :class="`msg-${item.ordid}`"
                  @load="onImgLoad"
                  style="max-width:1.2rem"
                />
              </div>
            </template>
            <template v-if="item.type === 'voice'">
              <chat-voice @audio-play="onAudPlay" v-bind="item" :self="item.self" />
            </template>
          </chat-msg>
        </template>
        <chat-msg
          v-bind="{
            nick: userInfo.nick,
            left: true,
            avatar: getAvatar
          }"
          v-if="messageLoading"
        >
          <van-loading />
        </chat-msg>
      </chat-context>
      <chat-footer
        @emoji="onEmoji"
        @more="onMore"
        @send="onSend"
        @focus="onFocus"
        @blur="onBlur"
        @to="leaveChatRoom"
        @toggle-mode="closeFold"
        @toggle-footer="closeFold"
        @voice-touch="onVoiceTouch"
        @voice-touchend="voiceTouchend"
        @click="closeFold"
      />
    </div>

    <!-- 底部footer栏 -->
    <div class="foldBar">
      <div
        class="emojiBar"
        @click.stop.prevent
        @touchmove.stop.prevent
        @touchstart.stop.prevent
        @touchend.stop.prevent
        :style="{ transitionDuration }"
        :class="{ active: openOffset && !isShowFoldOptions }"
      >
        <x-panel-emoji @setemoji="onSetEmoji" />
      </div>

      <div
        class="fold"
        @click.stop="onClickFold"
        @touchmove.stop.prevent
        @touchstart.stop
        @touchend.stop
        :style="{ transitionDuration }"
        :class="{ active: openOffset && !isShowFoldEmojis }"
      >
        <van-swipe>
          <van-swipe-item class="foldsBar">
            <x-fold-album @upload-before="onUploadBefore" @upload="onUploadImg" />
            <x-fold-camera @upload-before="onUploadBefore" @upload="onUploadImg" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <!-- 录语音弹窗 -->
    <van-overlay class="voiceOverlay" z-index="2050" :show="isVoicePopupShow" @click="isVoicePopupShow = false">
      <div class="wrapper" @click.stop>
        <div class="top">
          <span class="xIcon-voice-pop" />
          <div class="voiceAnimate">
            <x-voice-animate :volums="micdata"></x-voice-animate>
          </div>
        </div>
        <div class="bottom">
          <x-timing v-if="isVoicePopupShow" @end="onTimingEnd" />
          <div class="tip">上滑取消</div>
        </div>
      </div>
    </van-overlay>
    <!-- 查看大图 -->
    <x-img-view ref="xiv" :is-footer="false" :picture="picture" @close="picture = []" :idx="1" />
  </div>
</template>

<script>
import chatContext from 'cpt/chat/chat-context.vue'
import chatMsg from 'cpt/chat/chat-msg.vue'
import chatVoice from 'cpt/chat/chat-voice.vue'
import chatFooter from 'cpt/chat/chat-footer.vue'
import xImgView from 'cpt/x-img-view.vue'
import xTiming from 'cpt/x-timing.vue'
import xVoiceAnimate from 'cpt/x-voice-animate.vue'
import xPanelEmoji from 'cpt/x-room/x-panel-emoji.vue'
import xFoldAlbum from 'cpt/x-room/x-fold-album.vue'
import xFoldCamera from 'cpt/x-room/x-fold-camera.vue'
import xImg from 'cpt/x-img.vue'

import Rec from '@/utils/http/recorder.js'
import strg from '@/utils/storage.util.js'

import { GetOldChats, SetChats, PlayerSendChatAud } from '@/api/chat'

import { mapGetters, mapMutations } from 'vuex'

const ANCHOR_REG = /\[(wx[0-9]{3})\]/g

export default {
  components: { chatVoice, xImg, chatContext, chatMsg, chatFooter, xImgView, xTiming, xVoiceAnimate, xPanelEmoji, xFoldAlbum, xFoldCamera },
  data() {
    return {
      isVoicePopupShow: false,
      picture: [],
      micdata: 0,
      rid: 0,
      isShowFoldEmojis: false,
      isShowFoldOptions: false,
      isScroll: false, // 当表情选择栏展开后需要判断是否遮盖当前聊天信息如果遮盖将聊天窗口上移,
      chatList: [],
      messageLoading: false,
      oldVoiceDom: '',
      msgIsImg: false,
      initJudgeImageLoading: true,
      openOffset: false
    }
  },
  computed: {
    ...mapGetters(['getChatList', 'getRid', 'userInfo', 'getChatInfo', 'getAvatar']),
    isShowFooterBottomOption() {
      if (!this.isShowFoldEmojis && !this.isShowFoldOptions) {
        return true
      }
      return false
    },
    transitionDuration() {
      return `${this.openOffset ? 300 : 0}ms`
    }
  },
  methods: {
    ...mapMutations(['setChatList', 'setRid']),
    onUploadBefore() {
      this.messageLoading = true
    },
    onUploadImg() {},
    onAudPlay(voiceDom) {
      if (this.oldVoiceDom) {
        if (!this.oldVoiceDom.paused && $(this.oldVoiceDom).attr('class') !== $(voiceDom).attr('class')) {
          this.oldVoiceDom.pause()
          this.oldVoiceDom.currentTime = 0
          this.oldVoiceDom.end()
        }
      }
      this.oldVoiceDom = voiceDom
    },
    onClickImage(cls_name) {
      this.picture = [$(`.${cls_name}`).attr('src')]
      this.$refs.xiv.onClickImg(0)
    },
    onImgLoad() {
      this.$eventBus.$emit('chat:refresh')
      if (this.msgIsImg || this.initJudgeImageLoading) {
        this.msgIsImg = false
        this.$nextTick(() => {
          this.$eventBus.$emit('chat:scroll', 'down')
        })
      }
    },
    toEmoji(text) {
      return text.replace(ANCHOR_REG, (match, p1) => `<img src="http://dtapi-aj.xy50test.com/img/${p1}.png"></img>`)
    },
    clickLeft() {
      // 关闭语音播放
      if (this.oldVoiceDom && !this.oldVoiceDom.paused) {
        this.oldVoiceDom.pause()
        this.oldVoiceDom.currentTime = 0
        this.oldVoiceDom.end()
      }

      this.$root.open = false
      this.$eventBus.$emit('bridge:back')
    },
    leaveChatRoom(path) {
      // FIXME 可能存在跳转中断,这里需要加判断
      // this.$root.open = false
      this.$eventBus.$emit('bridge:push', path)
    },
    onTimingEnd(time) {},
    onVoiceTouch() {
      let timer = setTimeout(() => {
        if (this.isVoicePopupShow) {
          clearTimeout(timer)
          this.voiceTouchend()
        }
      }, 30000)

      let rec = new Rec()
      this.micdata = 0
      this.isVoicePopupShow = true
      rec.start(volum => {
        volum = Math.floor(Number(volum) * 60)
        volum = volum > 6 ? 6 : volum
        this.micdata = volum
      })

      this.$on('chat:voice-end', () => {
        let millisecond = rec.stop()

        if (!millisecond) {
          this.$toast('录音失败')
          return
        }

        this.messageLoading = true

        rec.getBase64(e => {
          if (!e) {
            return (this.messageLoading = false)
          }

          PlayerSendChatAud(e, {
            rid: this.rid,
            time: (Number(millisecond) / 1000).toString()
          }).then(() => {
            this.messageLoading = false
          })
        })
      })
    },
    voiceTouchend() {
      this.isVoicePopupShow = false
      this.micdata = 0
      this.$emit('chat:voice-end')
    },
    onSetEmoji(id) {
      if (id > 0) {
        let y = '000000' + id
        let url = 'http://dtapi-aj.xy50test.com/img/' + 'wx' + y.substr(y.length - 3) + '.png'
        this.$eventBus.$emit('chat:add-emoji', url)
      } else {
        this.$eventBus.$emit('chat:del-emoji')
      }
    },
    onEmoji() {
      if (Ua.versions.android) {
        G.delay(() => {
          this.openOffset = true
          this.isShowFoldEmojis = true
          this.isShowFoldOptions = false
        }, 160)
      }
      if (Ua.versions.ios) {
        this.openOffset = true
        this.isShowFoldEmojis = true
        this.isShowFoldOptions = false
      }

      this.$eventBus.$emit('chat:enter-emoji')
      G.delay(() => {
        // 需要重新刷新高度,当前有可能是从输入框聚焦状态立即切换为表情选择状态,软键盘和选择栏高度不一致
        this.$eventBus.$emit('chat:refresh')
      }, 200)
    },
    onMore() {
      if (Ua.versions.android) {
        G.delay(() => {
          this.openOffset = true
          this.isShowFoldOptions = true
          this.isShowFoldEmojis = false
        }, 160)
      }
      if (Ua.versions.ios) {
        this.openOffset = true
        this.isShowFoldOptions = true
        this.isShowFoldEmojis = false
      }

      G.delay(() => {
        this.$eventBus.$emit('chat:refresh')
      }, 200)
    },
    onFocus() {
      this.openOffset = false
      this.closeFold()
      this.$eventBus.$emit('chat:exit-emoji')
      // G.delay(() => this.$eventBus.$emit('chat:movedown'), 200)
      // G.delay(() => this.$eventBus.$emit('chat:movedown'), 250)
      G.delay(() => this.$eventBus.$emit('chat:movedown'), 300)
      G.delay(() => this.$eventBus.$emit('chat:movedown'), 330)
      G.delay(() => this.$eventBus.$emit('chat:movedown'), 360)
    },
    onBlur() {
      // 软键盘回落需要一定的时间
      G.delay(() => this.$eventBus.$emit('chat:refresh'), 100)
      G.delay(() => this.$eventBus.$emit('chat:refresh'), 200)
    },
    onClickFold() {
      this.closeFold()
    },
    clickChatContext() {
      this.openOffset = false
      this.closeFold()
      this.initJudgeImageLoading = false
      this.$eventBus.$emit('chat:blur')
      this.closeFold()
    },
    closeFold() {
      this.isShowFoldOptions = false
      this.isShowFoldEmojis = false
      this.openOffset && (this.openOffset = false)
    },
    listenMessage() {
      // 监听新消息,来自ws推送
      strg.listen(data => {
        if (!data.length || data[0].rid.toString() !== this.rid) return
        this.chatList.push(...data)
        this.messageLoading = false
        this.$nextTick(() => {
          this.$eventBus.$emit('chat:refresh')
          this.$eventBus.$emit('chat:scroll', 'down')
        })
        if (data[0].type === 'img') this.msgIsImg = true
      })
    },
    getLocalMessageData() {
      // 获取本地缓存数据
      strg.getListCache(this.rid, 'lottery').then(cache_list => {
        if (cache_list) {
          this.chatList = cache_list
          this.$nextTick(() => {
            this.$eventBus.$emit('chat:refresh')
            this.$eventBus.$emit('chat:scroll', 'down')
          })
        }
        this.getNetMessageData()
      })
    },
    async onSend(val) {
      if (val) {
        this.messageLoading = true
        let { ok, msg } = await SetChats({
          rid: this.rid,
          chat: val,
          type: 'txt'
        })
        G.delay(() => this.$eventBus.$emit('chat:scroll', 'down'), 200)
      }
      this.closeFold()
      this.$eventBus.$emit('chat:send-emoji')
    },
    // 获取历史聊天记录,用于下拉加载
    async GetOldChats() {
      let { ok, msg } = await GetOldChats({
        rid: this.rid,
        idb: this.chatList[0].ordid
      })
      if (ok) {
        this.$eventBus.$emit('chat:pulldown-finish')
        this.chatList.unshift(
          ...strg.msgDispose(
            {
              rid: this.rid,
              chats: G.differenceBy(msg, this.chatList, 'ordid')
            },
            true
          )
        )
      }
    },
    async getNetMessageData() {
      let { ok, msg } = await GetOldChats({
        rid: this.rid,
        idb: 0
      })
      if (ok) {
        this.chatList = strg.msgDispose(
          {
            rid: this.rid,
            chats: msg
          },
          true
        )
      }
    }
  },
  created() {
    let initRoom = () => {
      this.rid = this.getRid
      this.listenMessage()
      this.getLocalMessageData()
    }
    initRoom()
    this.$eventBus.$on('bridge:toggle-room', () => initRoom())
  },
  mounted() {
    if (Ua.versions.android) {
      $('#room').css('position', 'fixed')
    }
  },
  destroyed() {}
}
</script>

<style lang="scss">
#room {
  @include abs;
  // android 需要加上这一行, ios 则不要这一行
  // position: fixed;
  z-index: -1;
  &.open {
    z-index: 1000;
  }
  .roomHeader {
    background-color: $rootColor;
    height: 44px;
    overflow: hidden;
    > * {
      font-size: 17px;
      color: $white;
      height: 44px;
      line-height: 44px;
    }
    .van-icon-arrow-left:before {
      color: $white;
      transform: scale(1.3);
    }
  }
  .Overlay {
    @include abs;
    background-color: #f7f8fa;
    z-index: 100;
    transition-timing-function: linear;
    transition-property: all;
    transition-duration: 300ms;
    &.act {
      transform: translateY(-230px);
    }
  }
  .voiceOverlay {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    .wrapper {
      height: 184px;
      width: 184px;
      border-radius: 15px;
      background-color: $roomVoicePopupBg;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .top {
        display: flex;
      }
      .bottom {
        text-align: center;
        .x-timing {
          margin-top: 16px;
        }
        .tip {
          color: #cdcdcd;
          font-size: 12px;
          margin-top: 16px;
        }
      }
    }
  }
  .chat-context.act {
    transform: translateY(-230px);
  }
  .chat-msg-content {
    .container {
      &.txt {
        line-height: 20px;
        img {
          width: 20px;
          height: 20px;
          display: inline-block;
          vertical-align: top;
        }
      }
    }
  }
  .timeStamp {
    padding: 25px 0;
    font-size: 12px;
    color: $txt;
    text-align: center;
  }
  .foldBar {
    @include abs;
    top: unset;
    height: 230px;
    max-width: 100vw;
    min-width: 100vw;
    min-height: 230px;
    max-height: 230px;
    overflow: hidden;
    .emojiBar {
      box-sizing: border-box;
      transition-duration: 200ms;
      display: flex;
      flex-wrap: wrap;
      background-color: #ededed;
      position: relative;
      height: 230px;
      .emoji {
        pointer-events: unset;
      }
    }
    .fold {
      height: 230px;
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
    .emojiBar,
    .fold {
      @include abs;
      height: 230px;
      width: 100vw;
      background-color: #f7f8fa;
      transform: translateY(100%);
      transition-property: all;
      transition-timing-function: linear;
      transition-duration: 300ms;
      &.active {
        transform: translateY(0);
      }
    }
  }
}
</style>
