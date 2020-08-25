<template>
  <!-- <div class="page-room-root"></div> -->
  <x-layout ref="layout" modifier="room" is-bottom main-top-color="#F7F8FA" main-bottom-color="#F7F8FA" main-center-color="#F7F8FA">
    <x-header slot="header" :centerText="getChatInfo.name" @click-right="false /* $router.push(`/chat/roomInfo/${rid}`) */">
      <van-icon name="ellipsis" />
    </x-header>
    <!-- 聊天消息 -->
    <x-room-msg
      v-for="(item, index) in msg_list"
      :key="item.ordid"
      :idx="index"
      v-bind="item"
      @load="onMsgLoad"
      @click-img="onClickImg"
      @audio-play="onAudPlay"
    />
    <!-- 假消息,当前消息会有一段压缩上传时间,需要展示消息加载动画 -->
    <x-room-msg
      v-if="msg_loading"
      v-bind="{
        avatar: getAvatar,
        type: 'false',
        self: true
      }"
    />
    <!-- Copyspace -->
    <div id="copySpace">
      <!-- 底部留白 -->
    </div>
    <!-- 底部footer -->
    <transition slot="bottom" enter-active-class="fadeInUp animated faster">
      <x-lottery-footer
        v-if="animated"
        v-model="msg"
        @send="onSend"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
        @fold="fold = true"
        @unfold="fold = false"
        @focus="onFooterPutFocus"
      >
        <template slot="fold">
          <!-- 相册 -->
          <x-fold-album @upload="onUploadImg" />
          <!-- 相机 -->
          <x-fold-camera @upload="onUploadImg" />
          <!-- 红包 -->
          <x-fold-redbag />
        </template>
      </x-lottery-footer>
    </transition>

    <!-- 录语音弹窗 -->
    <van-overlay :show="voice_popup_ctr" @click="voice_popup_ctr = false">
      <div class="wrapper" @click.stop>
        <div class="top">
          <span class="xIcon-voice-pop" />
          <div class="voiceAnimate">
            <x-voice-animate :volums="micdata"></x-voice-animate>
          </div>
        </div>
        <div class="bottom">
          <x-timing v-if="voice_popup_ctr" @end="onTimingEnd" />
          <div class="tip">上滑取消</div>
        </div>
      </div>
    </van-overlay>

    <!-- 查看大图 -->
    <x-img-view ref="xiv" :is-footer="false" :picture="album" :idx="1" />

    <!-- 蒙版 -->
    <transition leave-active-class="chat-mask-leave">
      <div class="chat-mask" v-if="!rendered" />
    </transition>
  </x-layout>
</template>

<script>
import Rec from '@/utils/http/recorder.js'
import { GetOldChats, SetChats, PlayerSendChatAud } from '@/api/chat'
import { mapGetters, mapMutations } from 'vuex'
import strg from '@/utils/storage.util.js'
import { formatDuration } from '@/utils/formant.util'
import { countDownWorker } from '@/utils/worker.util.js'
import WebWorker from '@/utils/worker.util.js'

import xHeader from 'cpt/x-header.vue'
import xPullrefresh from 'cpt/x-pullrefresh.vue'
import xRoomMsg from 'cpt/x-room/x-room-msg.vue'
import xLotteryFooter from 'cpt/x-room/x-lottery-footer.vue'
import xFoldAlbum from 'cpt/x-room/x-fold-album.vue'
import xFoldCamera from 'cpt/x-room/x-fold-camera.vue'
import xFoldRedbag from 'cpt/x-room/x-fold-redbag.vue'
import xVoiceAnimate from 'cpt/x-voice-animate.vue'
import xTiming from 'cpt/x-timing.vue'
import xImgView from 'cpt/x-img-view.vue'

let time_worker
let $old_aud
let fade_gap = 50
let rate = 0.7
export default {
  components: {
    xHeader,
    xPullrefresh,
    xRoomMsg,
    xLotteryFooter,
    xFoldAlbum,
    xFoldCamera,
    xFoldRedbag,
    xVoiceAnimate,
    xTiming,
    xImgView
  },
  data() {
    return {
      notice: true,
      msg: '',
      rid: '',
      type: 'txt',
      focus: false,
      more: false,
      fold: false,
      release: false,
      emoji: false, // 展开emoji
      isPullRefreshLoading: false,
      voice_animate_list: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      voice_animate_ctr: false,
      voice_popup_ctr: false,
      micdata: 0,
      msg_list: [],
      album: [],
      msg_loading: false,
      rendered: false,
      animated: false,
      is_pull: false,
      init: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getAvatar', 'getChatInfo'])
  },
  methods: {
    ...mapMutations(['setRid', 'setGameing']),
    pullRefresh() {
      this.is_pull = true
      this.GetOldChats()
    },
    // 输出框焦点
    onFooterPutFocus() {},
    // 语音播放
    onAudPlay($aud) {
      if ($old_aud) {
        if (!$old_aud.paused && $($old_aud).attr('class') !== $($aud).attr('class')) {
          $old_aud.pause()
          $old_aud.currentTime = 0
          $old_aud.end()
        }
      }
      $old_aud = $aud
    },
    onClickImg(src) {
      this.album = [src]
      this.$refs.xiv.onClickImg(0)
    },
    // 语音按钮
    onTouchStart() {
      this.voice_popup_ctr = true
      this.micdata = 0
      this.rec = new Rec()
      this.rec.start(volum => {
        volum = Math.floor(Number(volum) * 60)
        volum = volum > 6 ? 6 : volum
        this.micdata = volum
      })

      // 最长允许录制30妙的录音
      this.set_timeout_timer = setTimeout(() => {
        if (this.voice_popup_ctr) {
          this.onTouchEnd()
        }
      }, 30000)
    },
    // 录音结束
    onTouchEnd() {
      clearTimeout(this.set_timeout_timer)
      this.voice_popup_ctr = false

      this.scrollToBottom()
      this.micdata = 0
      let millisecond = this.rec.stop()
      if (!millisecond) {
        this.$toast('录音失败')
        return
      }
      this.msg_loading = true
      this.rec.getBase64(e => {
        if (!e) {
          return (this.msg_loading = false)
        }
        PlayerSendChatAud(e, {
          rid: this.rid,
          time: (Number(millisecond) / 1000).toString()
        }).then(() => {
          this.msg_loading = false
        })
      })
    },
    // 发送消息
    async onSend() {
      if (!this.msg) return
      this.msg_loading = true
      let { ok, msg } = await SetChats({
        rid: this.rid,
        chat: this.msg,
        type: this.type
      })
      if (ok) {
        this.msg = ''
        // this.scrollToBottom();
      }
    },
    // 录音计时结束
    onTimingEnd(time) {
      console.log(time)
    },
    // 滚动至底部
    scrollToBottom(ease, delay = 500) {
      G.delay(() => {
        this.$nextTick(() => {
          // TAG moveTo 方法已经移除
          // this.$refs.layout.moveTo(ease)
        })
      }, delay)
    },

    // 失去焦点
    onBlur() {
      G.delay(() => {
        this.focus = false
      }, 100)
    },
    // 获取历史聊天记录,用于下拉加载
    async GetOldChats() {
      let { ok, msg } = await GetOldChats({
        rid: this.rid,
        idb: this.msg_list[0].ordid
      })
      if (ok) {
        this.msg_list.unshift.apply(
          this.msg_list,
          strg.msgDispose(
            {
              rid: this.rid,
              chats: G.differenceBy(msg, this.msg_list, 'ordid')
            },
            true
          )
        )
      }
      this.isPullRefreshLoading = false
    },
    async getChats() {
      let { ok, msg } = await GetOldChats({
        rid: this.rid,
        idb: 0
      })
      if (ok) {
        this.msg_list = strg.msgDispose(
          {
            rid: this.rid,
            chats: msg
          },
          true
        )
        // this.scrollToBottom();
      }
    },
    // 相册发送图片
    onUploadImg(res) {
      // this.scrollToBottom();
    },
    // 获取本地缓存
    getLocalCache() {
      // 获取本地缓存数据
      strg.getListCache(this.rid, 'lottery').then(cache_list => {
        if (cache_list) {
          this.msg_list = cache_list
          this.scrollToBottom()
        }
        this.getChats()
      })
    },

    listenNewMsg() {
      // 监听新消息,来自ws推送
      strg.listen(data => {
        if (!data.length || data[0].rid.toString() !== this.rid) return
        this.msg_list.push.apply(this.msg_list, data)
        this.msg_loading = false
        this.scrollToBottom('linearTween')
      })
    },
    onMsgLoad() {
      // if (this.init) {
      //   G.delay(() => {
      //     this.scrollToBottom();
      //   }, 200);
      // }
    }
  },
  created() {
    this.rid = this.$route.params.id
    this.setRid(this.rid)
    this.$root.animateDelay(() => {
      this.getLocalCache()
      this.listenNewMsg()
      G.delay(() => {
        this.rendered = true
      }, 400)
    }, 500)
  },
  destroyed() {
    // 缓存当前聊天室聊天数据
    strg.setListCache(this.rid, this.msg_list, 'lottery')
  },
  mounted() {
    G.delay(() => {
      this.animated = true
      this.init = false
    }, 800)
  },
  updated() {
    // strg.setListCache(this.rid, this.msg_list);
  }
}
</script>

<style lang="scss">
.page-room-root {
  background-color: $roomBg;
  flex: 1;
  display: flex;
  flex-direction: column;
  .x-pullrefresh {
    flex: 1;
    transition-duration: 300ms;
    &.fold {
      transform: translateY(-230px);
    }
  }
  #copySpace {
    height: 65px;
  }
  .msg-container {
    padding-bottom: 10px;
  }
  .van-notice-bar {
    background-color: $baseBgColor;
    color: $txt;
  }
  .van-nav-bar .van-icon {
    color: $white;
    font-size: 20px;
  }
  .contxt {
    .van-loading {
      width: 22px;
      height: 22px;
    }
  }

  // 录音弹窗
  .van-overlay {
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
        // .voiceAnimate {
        //   width: 39px;
        //   display: flex;
        //   flex-direction: column;
        //   justify-content: space-between;
        //   .item {
        //     animation: whites linear infinite;
        //     animation-direction: reverse;
        //     background-color: #888888;
        //     height: 4px;
        //   }
        //   @for $v from 1 through 9 {
        //     .item-#{$v} {
        //       width: #{(11 - $v) * 5% + 50%};
        //       &.act {
        //         background-color: #fff;
        //       }
        //     }
        //   }
        // }
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
  .chat-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: $roomBg;
    width: 150vw;
    transform: translateX(-25vw);
  }
  .chat-mask-leave {
    transition-property: all;
    transition-delay: 200ms;
    opacity: 0;
  }
}
</style>
