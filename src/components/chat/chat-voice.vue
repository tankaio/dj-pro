<template>
  <div class="chat-voice" @click="playerVoice" :class="{ self }">
    <span class="audio-player-bar" v-if="!fial">
      <span class="audio-player" :class="{ animate: is_player && !fial }" />
    </span>
    <div class="container voice">
      <van-loading v-if="loading && !fial" />
    </div>
    <van-icon name="fail" v-if="fial" />
    <span class="voice-time" v-if="!loading && !fial" :style="voiceWidthClass"> {{ Number(voice_time).toFixed() }}" </span>
    <audio preload="auto" :class="`aud-${filename}`" hidden="true">
      <source :src="voiceSrc" :class="`source-${ordid}`" ref="voice" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
import strg from '@/utils/storage.util.js'
import { formatDuration } from '@/utils/formant.util.js'
import { mapGetters } from 'vuex'
export default {
  name: 'chat-voice',
  props: {
    filename: String,
    ordid: [String, Number],
    voice_time: [String, Number],
    self: Boolean
  },
  data() {
    return {
      loading: true,
      fial: false,
      is_player: false
      //   base64Data:''
    }
  },
  computed: {
    ...mapGetters(['getBaseUrl', 'getIsIos', 'getIsFF']),
    voiceSrc() {
      // 如果本地有缓存读取本地缓存
      // if (strg.number_map[this.ordid]) {
      //   strg.getCache("voice", this.ordid, this.filename, data => {
      //     let srcData = "data:audio/x-mpeg;base64," + data;
      //     // srcData =
      //     //   "data:audio/mpeg;base64,/+MYxAAEaAIEeUAQAgBgNgP/////KQQ/////Lvrg+lcWYHgtjadzsbTq+yREu495tq9c6v/7vt/of7mna9v6/btUnU17Jun9/+MYxCkT26KW+YGBAj9v6vUh+zab//v/96C3/pu6H+pv//r/ycIIP4pcWWTRBBBAMXgNdbRaABQAAABRWKwgjQVX0ECmrb///+MYxBQSM0sWWYI4A++Z/////////////0rOZ3MP//7H44QEgxgdvRVMXHZseL//540B4JAvMPEgaA4/0nHjxLhRgAoAYAgA/+MYxAYIAAJfGYEQAMAJAIAQMAwX936/q/tWtv/2f/+v//6v/+7qTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
      //     this.base64Data = srcData;
      //     this.listenCanplaythrough("本地缓存");
      //     this.loading = false;
      //   });
      //   return this.base64Data;
      // } else
      if (Number(this.voice_time) < 1) {
        this.fial = true
        return
      }
      if (this.filename && /[0-9]$/.test(this.filename)) {
        let ext = this.getIsFF ? 'ogg' : 'mp3'
        this.listenCanplaythrough('网络路径')
        return `${this.getBaseUrl}/download/media/${this.filename}.${ext}`
      }
    },
    voiceWidthClass() {
      let voice_time = this.voice_time
      if (voice_time) {
        voice_time = voice_time > 10 ? 10 : voice_time
        return `display:inline-block;width:${0.22 + Number(voice_time).toFixed() * 0.03}rem`
      }
    }
  },
  methods: {
    listenCanplaythrough(type) {
      let audio = $(`.aud-${this.filename}`)[0]
      if (audio) {
        this.loading = true
        if (this.getIsIos || true) {
          this.loading = false
          this.fial = false
          return
        }
        G.delay(() => {
          if (this.loading) {
            this.fial = true
          }
        }, 40 * 1000)
        audio.addEventListener('canplaythrough', e => {
          this.fial = false
          this.loading = false
        })
        audio.oncanplay = e => {
          this.fial = false
          this.loading = false
        }
      } else {
        G.delay(() => {
          if (this.filename) {
            this.listenCanplaythrough(`dom查询${this.filename}`)
          }
        }, 200)
      }
    },
    playerVoice() {
      if (this.fial) return
      this.$emit('click')
      let audio = $(`.aud-${this.filename}`)[0]
      if (audio) {
        if (this.fial) {
          this.fial = false
          this.loading = true
          this.listenCanplaythrough('加载失败')
          return
        }
        if (audio.paused && !this.loading) {
          audio.currentTime = 0
          // console.log(audio,this.filename);
          audio.play()
          this.is_player = true

          audio.onended = e => {
            this.is_player = false
          }

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
  }
}
</script>

<style lang="scss">
.chat-voice {
  display: flex;
  align-items: center;
  &.self {
    flex-direction: row-reverse;
    .voice-time {
      text-align: right;
    }
  }
}
</style>
