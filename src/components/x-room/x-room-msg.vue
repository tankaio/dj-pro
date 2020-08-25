<template>
  <div class="x-room-msg" :class="{ self }">
    <transition @enter="$emit('msg-center')" :enter-active-class="self ? 'fadeIn animated faster' : 'fadeIn animated faster'" :duration="5000">
      <div class="xrm-context" v-if="animated">
        <!-- FIXME 存在问题,未解决,个人中心查询参数一部分使用nick一部分使用 id -->
        <x-img :src="avatar" @click="!self ? $router.push(`/userInfo/userInfoPlan/?nick=${username}`) : ''" class="avatar" dft />
        <div class="xrm-container">
          <div class="xrm-info" v-if="!self">
            <span class="auth">{{ auth }}</span>
            <span class="username">{{ username }}</span>
          </div>
          <div class="contxt-bar" :class="[type, open ? 'open' : '']">
            <template v-if="type === 'false'">
              <div class="contxt">
                <van-loading />
              </div>
            </template>
            <template v-if="type === 'txt'">
              <div class="contxt" v-html="toEmoji"></div>
            </template>
            <template v-if="type === 'img'">
              <div class="contxt" @click="onClickImage(`msg-${ordid}`)">
                <x-img :src="filename" :cache="ordid" :class="`msg-${ordid}`" :lazy="false" @load="onImgLoad" style="max-width:1.2rem" />
              </div>
            </template>
            <template v-if="type === 'voice'">
              <div class="contxt voice" @click="playerVoice(filename)">
                <span class="audio-player-bar">
                  <span class="audio-player" :class="{ animate: is_player && !aud_load_fail }" />
                </span>
                <van-loading v-if="aud_load && !aud_load_fail" />
                <van-icon name="fail" v-if="aud_load_fail" />
                <span class="voice-time" v-if="!aud_load && !aud_load_fail" :style="voiceWidthClass">{{ Number(voice_time).toFixed() }}"</span>

                <audio preload="auto" :class="`aud-${filename}`" hidden="true">
                  <source :src="voiceSrc" :class="`source-${ordid}`" ref="voice" type="audio/mpeg" />
                </audio>
              </div>
            </template>
            <template v-if="type === 'redbag'">
              <div class="redbag-contxt" @click="onClick">
                <div class="redbag-top" :class="`redbag-${open ? 'o-' : ''}bg`">
                  <span :class="`xIcon-redbag${open ? '-o' : ''}`"></span>
                  <div class="redbag-state">
                    <div class="wish">恭喜发财 牛气冲天</div>
                    <div class="end" v-if="end">已被领完</div>
                  </div>
                  <div class="game-type" :class="redbagPlay | redbagPlayClass"></div>
                </div>
                <div class="redbag-bottom">
                  <div class="left">
                    {{ redbagType === 1 ? '普通红包' : '游戏红包' }}
                  </div>
                  <div class="center"></div>
                  <div class="right">{{ redbagPlay | redbagPlay }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </transition>
    
    <div class="timestamp">{{ timestamp }}</div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'

const ANCHOR_REG = /\[(wx[0-9]{3})\]/g
import strg from '@/utils/storage.util.js'
import { formatDuration } from '@/utils/formant.util.js'
import Http from '@/utils/http/index.ws.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    xImg
  },
  name: 'x-room-msg',
  props: [
    'avatar',
    'auth',
    'username',
    'message',
    'timestamp',
    'self',
    'ordid',
    'filename',
    'type',
    'voice_time',
    'open',
    'end',
    'redbagType',
    'redbagPlay',
    'text'
  ],
  data() {
    return {
      is_player: false,
      aud_load: true,
      aud_load_fail: false,
      base64Data: '',
      animated: false // 动画 初始为false即为开启动画
    }
  },
  computed: {
    ...mapGetters(['getBaseUrl', 'getIsFF', 'getIsIos']),
    toEmoji() {
      return this.text.replace(ANCHOR_REG, (match, p1) => {
        return `<img src="http://dtapi-aj.xy50test.com/img/${p1}.png"></img>`
      })
    },
    // imgSrc() {
    //   return strg.getCache("img", this.ordid, this.filename, data => {
    //     $(`.msg-${this.ordid}`).attr("src", data);
    //   });
    // },
    voiceWidthClass() {
      let voice_time = this.voice_time
      if (voice_time) {
        voice_time = voice_time > 10 ? 10 : voice_time
        return `display:inline-block;width:${0.22 + Number(voice_time).toFixed() * 0.03}rem`
      }
    },
    voiceSrc() {
      // 如果本地有缓存读取本地缓存
      // if (strg.number_map[this.ordid]) {
      //   strg.getCache("voice", this.ordid, this.filename, data => {
      //     let srcData = "data:audio/x-mpeg;base64," + data;
      //     // srcData =
      //     //   "data:audio/mpeg;base64,/+MYxAAEaAIEeUAQAgBgNgP/////KQQ/////Lvrg+lcWYHgtjadzsbTq+yREu495tq9c6v/7vt/of7mna9v6/btUnU17Jun9/+MYxCkT26KW+YGBAj9v6vUh+zab//v/96C3/pu6H+pv//r/ycIIP4pcWWTRBBBAMXgNdbRaABQAAABRWKwgjQVX0ECmrb///+MYxBQSM0sWWYI4A++Z/////////////0rOZ3MP//7H44QEgxgdvRVMXHZseL//540B4JAvMPEgaA4/0nHjxLhRgAoAYAgA/+MYxAYIAAJfGYEQAMAJAIAQMAwX936/q/tWtv/2f/+v//6v/+7qTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
      //     this.base64Data = srcData;
      //     this.listenCanplaythrough("本地缓存");
      //     this.aud_load = false;
      //   });
      //   return this.base64Data;
      // } else
      if (this.filename && /[0-9]$/.test(this.filename)) {
        let ext = this.getIsFF ? 'ogg' : 'mp3'
        this.listenCanplaythrough('网络路径')
        return `${this.getBaseUrl}/download/media/${this.filename}.${ext}`
      }
    }
  },
  methods: {
    onClickImage(cls_name) {
      this.$emit('click-img', $(`.${cls_name}`).attr('src'))
    },
    onClick() {
      this.$emit('click', this.type)
      if (this.type === 'redbag') {
        this.$emit('openred', this.$attrs.idx)
      }
    },
    onImgLoad() {
      this.$emit('load')
    },
    listenCanplaythrough(type) {
      let audio = $(`.aud-${this.filename}`)[0]
      if (audio) {
        this.aud_load = true
        // audio.load();
        if (this.getIsIos || true) {
          this.aud_load = false
          this.aud_load_fail = false
          return
        }
        G.delay(() => {
          if (this.aud_load) {
            this.aud_load_fail = true
          }
        }, 40 * 1000)
        audio.addEventListener('canplaythrough', e => {
          // console.log("canplaythrough");
          this.aud_load_fail = false
          this.aud_load = false
        })
        audio.oncanplay = e => {
          // console.log("oncanplay");
          this.aud_load_fail = false
          this.aud_load = false
        }
      } else {
        G.delay(() => {
          if (this.filename && this.type === 'voice') {
            this.listenCanplaythrough(`dom查询${this.filename}`)
          }
        }, 100)
      }
    },
    playerVoice(key) {
      let audio = $(`.aud-${key}`)[0]
      if (audio) {
        if (this.aud_load_fail) {
          this.aud_load_fail = false
          this.aud_load = true
          this.listenCanplaythrough('加载失败')
          return
        }
        if (audio.paused && !this.aud_load) {
          audio.currentTime = 0
          // console.log(audio,key);
          this.playerPromise = audio.play()

          audio.onended = e => {
            this.is_player = false
          }

          this.is_player = true

          audio.end = () => {
            this.is_player = false
          }

          this.$emit('audio-play', audio)
        } else {
          audio.pause()
          audio.currentTime = 0
          this.is_player = false
        }
      } else {
        this.$toast('语音加载中')
      }
    }
  },
  filters: {
    redbagPlay(val) {
      switch (val) {
        case 1:
          return '牛牛'
        default:
          break
      }
    },
    redbagPlayClass(val) {
      switch (val) {
        case 1:
          return 'niuniu-bg'
        default:
          break
      }
    }
  },
  created() {
    G.delay(() => {
      this.animated = true
    }, 200)
  }
}
</script>

<style lang="scss">
.x-room-msg {
  .xrm-context {
    padding: 12px;
    padding-right: 64px;
    display: flex;
  }
  .avatar {
    height: 45px;
    width: 45px;
    border-radius: 2.5px;
    overflow: hidden;
    flex: none;
    pointer-events: unset;
    box-shadow: 0 0 2px 0 rgba($color: #888, $alpha: 0.2);
  }
  .xrm-container {
    // flex: 1;
    line-height: 30px;
    padding: 0 7px;
    font-size: 14px;
  }
  .auth {
    margin-right: 7px;
    color: $rootColor;
    font-size: 14px;
  }
  .username {
    margin-right: 7px;
    font-size: 14px;
  }

  .xrm-info {
    display: flex;
    line-height: 1;
  }
  .contxt-bar {
    padding: 6px;
    position: relative;
    display: flex;
    overflow: hidden;
    margin-top: 3.5px;

    &::after {
      display: block;
      position: absolute;
      content: '';
      border-width: 6px;
      border-style: solid;
      border-color: transparent;
      border-right-color: $white;
      left: 0;
      transform: translateX(-50%);
      z-index: 1;
      top: 15px;
    }
    &.redbag::after {
      border-right-color: #fdc239;
    }
    &.open {
      opacity: 0.8;
      &::after {
        opacity: 0.8;
      }
    }
  }
  .contxt {
    flex: 1;
    height: 100%;
    padding: 12px;
    background-color: $white;
    border-radius: 5px;
    font-size: 15px;
    color: $txt;
    z-index: 1;
    line-height: 1.5;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    position: relative;
    word-break: break-word;
    min-height: 22px;
    box-shadow: 0 0 3px 0 rgba($color: #000000, $alpha: 0.2);
    .van-loading__spinner {
      width: 25px;
      height: 25px;
    }
  }
  .timestamp {
    text-align: center;
    font-size: 12px;
    color: $gray-99;
  }
  // 红包样式
  .redbag-contxt {
    width: 194px;
    height: 66.5px;
    border-radius: 5.18px;
    overflow: hidden;
  }
  .redbag-top {
    height: 48.5px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    position: relative;
  }
  .redbag-state {
    color: $white;
    padding-left: 10px;
    z-index: 10;
  }
  .end {
    font-size: 7.9px;
    line-height: 1;
    margin-top: 11px;
  }
  .wish {
    font-size: 11.92px;
    line-height: 1;
  }
  .game-type {
    position: absolute;
    &.niuniu-bg {
      top: 0;
      right: 0;
    }
  }
  .redbag-bottom {
    height: 17.5px;
    background-color: $white;
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-size: 7.9px;
    color: #777777;
    line-height: 1;
    .center {
      flex: 1;
    }
  }
  &.self {
    .xrm-context {
      flex-direction: row-reverse;
      padding-left: 64px;
      padding-right: 12px;
      .xrm-info {
        flex-direction: row-reverse;
      }
      .contxt-bar {
        margin-top: 0;
        &::after {
          right: 0;
          left: unset;
          transform: rotate(180deg) translateX(-48%);
          border-right-color: $roomMsgBg;
        }
        &.redbag::after {
          border-right-color: #ff9100;
        }
        .contxt {
          background-color: $roomMsgBg;
          &.voice {
            display: flex;
            flex-direction: row-reverse;
            .voice-time {
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>
