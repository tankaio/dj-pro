<template>
  <div class="page-RedRoom-root">
    <x-header :title="'聊天室名称(99)'" @click-right="false /* $router.push(`/chat/roomInfo/${rid}`) */">
      <van-icon name="ellipsis" />
    </x-header>
    <!-- 聊天消息 -->
    <x-pullrefresh ref="refresh" v-model="isPullRefreshLoading" @loading="GetOldChats">
      <component v-for="(item, index) in msg_list" :key="index" :idx="index" v-bind="item" @openred="onOpenRed" :is="item.component" />
    </x-pullrefresh>

    <!-- 底部footer -->
    <x-red-footer
      v-model="msg"
      :countdown="countdown"
      @send="onSend"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @bet="onBet"
      @grab="onGrab"
      :bet-btn-state.sync="betBtnState"
      :bet-amount="betNum"
      @count-click="onCountDownClick"
    >
      <template slot="fold">
        <!-- 相册 -->
        <x-fold-album @upload="onUploadImg" />
        <!-- 相机 -->
        <x-fold-camera @upload="onUploadImg" />
        <!-- 红包 -->
        <x-fold-redbag />
      </template>
      <template #countdown>
        {{ countdown }}
      </template>
    </x-red-footer>

    <!-- 录语音弹窗 -->
    <van-overlay :show="voice_popup_ctr" @click="voice_popup_ctr = false">
      <div class="wrapper" @click.stop>
        <div class="top">
          <span class="xIcon-voice-pop" />
          <div class="voiceAnimate">
            <!-- <x-voice-animate :msg="micdata"></x-voice-animate> -->
          </div>
        </div>
        <div class="bottom">
          <x-timing v-if="voice_popup_ctr" @end="onTimingEnd" />
          <div class="tip">上滑取消</div>
        </div>
      </div>
    </van-overlay>

    <!-- 红包开奖判定 -->
    <van-overlay z-index="10" class="redbagOpen" :show="redbag_open_ctr">
      <x-redbag-open v-bind="redInfo" @close="redbag_open_ctr = false" />
    </van-overlay>

    <!-- 红包相关快捷入口 -->
    <div class="redbagQuick">
      <span class="xIcon-wallet-entrance" @click="$router.push('/chat/gameWallet')"></span>
      <span class="xIcon-group-entrance" @click="onRedGameRuleClick"></span>
      <span class="xIcon-detail-entrance" @click="$router.push('/chat/redDetialList')"></span>
    </div>

    <!-- 倒计时投注弹窗 ,抢红包倒计时弹窗-->
    <x-betcontdown-pop :time="countdown" :identity="identity" :bet-pop-ctr.sync="bet_countdown_pop_ctr" @bet="onBetContDownPop" />
    <!-- 投注弹窗 -->
    <x-bet-pop
      :countdown="countdown"
      :bet-pop-ctr="bet_pop_ctr"
      @cancel="onBetPopCancel"
      @confirm="onBetPopConfirm"
      :disable="bet_pop_disable"
    >
      <van-field v-model="betNum" :placeholder="bet_pop_placeholder" input-align="right" type="tel" v-cursor />
    </x-bet-pop>
  </div>
</template>

<script>
import Rec from '@/utils/http/recorder.js'
import emojis from '@/vendor/emojiMap.js'
import { GetOldChats, SetChats, PlayerSendChatPic, NiuNiuBet } from '@/api/chat'
import { mapGetters, mapMutations } from 'vuex'
import strg from '@/utils/storage.util.js'
import { formatDuration } from '@/utils/formant.util'
import { countDownWorker } from '@/utils/worker.util.js'
import WebWorker from '@/utils/worker.util.js'

import xHeader from 'cpt/x-header.vue'
import xPullrefresh from 'cpt/x-pullrefresh.vue'
import xRedFooter from 'cpt/x-room/x-red-footer.vue'
import xFoldAlbum from 'cpt/x-room/x-fold-album.vue'
import xFoldCamera from 'cpt/x-room/x-fold-camera.vue'
import xFoldRedbag from 'cpt/x-room/x-fold-redbag.vue'
import xTiming from 'cpt/x-timing.vue'
import xRedbagOpen from 'cpt/x-redbag/x-redbag-open.vue'
import xBetcontdownPop from 'cpt/x-redbag/x-betcontdown-pop.vue'
import xBetPop from 'cpt/x-redbag/x-bet-pop.vue'

let time_worker
export default {
  components: {
    xHeader,
    xPullrefresh,
    xRedFooter,
    xFoldAlbum,
    xFoldCamera,
    xFoldRedbag,
    xTiming,
    xRedbagOpen,
    xBetcontdownPop,
    xBetPop
  },
  data() {
    return {
      notice: true,
      msg: '',
      rid: '',
      type: 'txt',
      chat: false,
      focus: false,
      more: false,
      fold: false,
      release: false,
      mode: 'input',
      emoji: false, // 展开emoji
      isPullRefreshLoading: false,
      emojis: [],
      voice_animate_list: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      voice_animate_ctr: false,
      voice_popup_ctr: false,
      redbag_open_ctr: false, // 红包开奖弹窗控制
      micdata: { state: '未录音', volum: '2' },
      msg_list: [],
      countdown: 0, // 倒计时
      bet_pop_ctr: false, // 红包投注控制
      bet_countdown_pop_ctr: false, // 红包游戏倒计时弹窗
      betNum: '', // 投注金额
      lower_bet: 0,
      upper_bet: 0,
      bet_pop_placeholder: '', //
      bet_pop_disable: true,
      betBtnState: '',
      redInfo: {},
      game_type: 1
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getAvatar', 'getBookMarker', 'getAdmin', 'getGameing']),
    identity() {
      if (this.betBtnState === 2) {
        this.bet_countdown_pop_ctr = true
        return 'grab'
      }
      // grab 为抢红包样式, before 为闲/会员弹窗投注前, being 为管理员/会员庄投注中
      if (this.getBookMarker && this.getGameing) {
        // 庄
        return 'being'
      }
      if (!this.getBookMarker && !this.getAdmin && this.getGameing) {
        // 非庄非管理
        if (this.betBtnState === 1) {
          return 'before'
        }
        if (this.betBtnState === 4) {
          return 'being'
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setRid', 'setGameing']),
    onRedGameRuleClick() {
      let url = ''
      switch (this.game_type) {
        case 1:
          url = '/chat/introToPlay'
          break
        case 2:
          url = '/chat/solitairePlay'
          break
        case 3:
          url = '/chat/sweepPlay'
          break
        default:
          break
      }
      this.$router.push(url)
    },
    onOpenRed(idx) {
      // 获取红包状态
      let red_obj = this.msg_list[idx]
      let message = red_obj.message
      let { open, end, redbagPlay, redbagType } = message
      let { minute } = formatDuration(new Date() - new Date(red_obj.time))
      switch (redbagPlay) {
        case 1:
          this.redInfo.name = '牛牛红包'
          break
        default:
          break
      }
      this.redInfo.id = 12
      if (redbagType === 2) {
        // 游戏红包
        let bet_list = G.get(this.msg_list, `${idx - 1}.message.list`, [])
        let self_is_bet = bet_list.some(ele => ele.name === this.userInfo.nick)

        if (self_is_bet) {
          // 我投注了

          if (minute > 3) {
            // 间隔事件大于3分钟过期
            this.redInfo.state = 2
          } else if (end) {
            // 红包被抢完
            this.redInfo.state = 3
          } else {
            // 中奖
            this.redInfo.state = 0
          }
        } else {
          // 我没投注
          this.redInfo.state = 1
        }
      }
      this.redInfo = this.redInfo
      this.redbag_open_ctr = true
    },
    onCountDownClick() {
      // 倒计时按钮点击
      if (this.countdown > 0) {
        this.bet_countdown_pop_ctr = true
      }
    },
    // 语音按钮
    onTouchStart() {
      this.voice_popup_ctr = true
      this.micdata.state = '0'
      this.rec = new Rec()
      this.rec.start(volum => (this.micdata.volum = volum))
    },
    // 语音消息切换按钮
    onVoiceClick() {
      this.mode = this.mode === 'voice' ? 'input' : 'voice'
    },
    //
    onTouchEnd() {
      this.voice_popup_ctr = false
    },
    // 投注弹窗取消按钮
    onBetPopCancel() {
      this.bet_pop_ctr = false
    },
    // 投注弹窗确认按钮
    async onBetPopConfirm() {
      this.bet_pop_ctr = false
      this.$notify({
        type: 'success',
        message: '您已投注成功'
      })
      this.betBtnState = 4

      // 点击确认投注
      // this.bet_pop_ctr = false;
      // let { ok, msg } = await NiuNiuBet({
      //   id: 1, //红包id
      //   amount: this.betNum
      // });
      // if (ok) {
      //   this.$notify({
      //     type: "success",
      //     message: "您已投注成功"
      //   });
      //   this.betBtnState = 4;
      // }
    },
    // 发送消息
    async onSend() {
      if (!this.msg) return
      let { ok, msg } = await SetChats({
        rid: this.rid,
        chat: this.msg,
        type: this.type
      })
      if (ok) {
        this.msg = ''
        this.scrollToBottom()
      }
    },
    // 录音计时结束
    onTimingEnd(time) {
      console.log(time)
    },
    // 点击投注按钮
    onBet() {
      this.bet_pop_ctr = true
    },
    // 点击一键抢红包
    onGrab() {
      let len = this.msg_list.length
      this.onOpenRed(len - 1)
    },
    // 滚动至底部
    scrollToBottom() {
      this.$nextTick(() => {
        let scrollHeight = document.body.scrollHeight
        let clientHeight = document.body.clientHeight
        if (scrollHeight > clientHeight) {
          window.scrollTo(0, scrollHeight - clientHeight)
        }
      })
    },
    // 失去焦点
    onBlur() {
      G.delay(() => {
        this.focus = false
      }, 100)
    },
    // 获取历史聊天记录,用于下拉加载,和进房间的第一次消息获取
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
              chats: msg
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
        this.scrollToBottom()
      }
    },
    // 相册发送图片
    onUploadImg(res) {
      this.scrollToBottom()
    },
    // 投注倒计时
    countDown() {
      time_worker = WebWorker(countDownWorker)

      time_worker.postMessage('start')

      time_worker.onmessage = e => {
        let { second } = formatDuration(e.data)
        if (this.betBtnState === 1 || this.betBtnState === 4) {
          this.countdown = 59 - second
          if (second == 10) {
            this.bet_pop_disable = true
            this.betBtnState = 2
            time_worker.postMessage('start')

            // 达到59秒后完成投注,展示投注信息
            strg.msgDispose({
              rid: this.getRid,
              chats: [
                {
                  nick: this.userInfo.nick,
                  spkid: this.userInfo.id,
                  ordid: '1212121122',
                  time: new Date(),
                  type: 'bet'
                }
              ]
            })
            this.scrollToBottom()
          }
        } else if (this.betBtnState === 2) {
          this.countdown = 5 - second
          if (second == 5) {
            time_worker.postMessage('stop')
            if (this.betNum !== '') {
              this.betBtnState = 3
            } else {
              this.betBtnState = 0
            }
            this.bet_countdown_pop_ctr = false

            // 发出红包
            strg.msgDispose([
              {
                nick: this.userInfo.nick,
                spkid: this.userInfo.id,
                ordid: '1212121122',
                time: new Date(),
                type: 'redbag'
              }
            ])

            this.scrollToBottom()
          }
        }
      }
    },
    // 获取本地缓存
    getLocalCache() {
      // 获取本地缓存数据
      strg.getListCache(this.rid, 'red').then(cache_list => {
        if (cache_list) {
          this.msg_list = cache_list
          this.scrollToBottom()
        }
        this.getChats()
      })
    },
    onBetContDownPop() {
      // 缺少参数
      let balance = 20000
      let highest_odds = 10
      let isFreeze = true

      let lower_bet_n = G.toNumber(this.lower_bet)
      let target_balance = lower_bet_n * highest_odds
      if (balance < target_balance) {
        if (isFreeze) {
          // 有冻结余额
          G.$dialog.alert({
            title: '通知',
            message: '您还有游戏未结束，请等待游戏结束后再来'
          })
        } else {
          // 无冻结余额
          G.$dialog
            .confirm({
              title: '余额不足',
              message: `如果您想投注这局游戏，钱包内余额不能少于${target_balance}元`,
              confirmButtonText: '去充值',
              cancelButtonText: '下次再说'
            })
            .then(() => {
              this.$router.push('/chat/gameWallet')
            })
        }
      } else {
        // 余额大于目标值足够支付
        this.bet_countdown_pop_ctr = false
        this.bet_pop_ctr = true
      }
    },
    listenNewMsg() {
      // 监听新消息,来自ws推送
      strg.listen(data => {
        if (!data.length || data[0].rid !== this.rid) return
        let _data = data[0]
        if (!_data) return
        switch (_data.message.type) {
          case 'launch':
            this.setGameing(true)
            this.countDown()
            this.countdown = 60
            if (this.getBookMarker) {
              this.identity = 'before' // being 当前身份为管理员
            } else {
              this.identity = 'before'
            }
            this.bet_countdown_pop_ctr = true
            this.lower_bet = _data.message.lower_bet
            this.upper_bet = _data.message.upper_bet
            this.bet_pop_placeholder = `${this.lower_bet}-${this.upper_bet}`

            break
          default:
            break
        }

        this.msg_list.push.apply(this.msg_list, data)
      })
    }
  },
  created() {
    this.rid = this.$route.params.id
    this.setRid(this.rid)
    this.getLocalCache()
    this.listenNewMsg()

    G.delay(() => {
      this.setGameing(true)
      this.countDown()
      this.countdown = 60
      this.betBtnState = 1
    }, 1400)

    this.bet_num_debounce = G.debounce(bet_num => {
      if (bet_num) {
        let bet_num_n = G.toNumber(bet_num)
        let lower_bet_n = G.toNumber(this.lower_bet)
        let upper_bet_n = G.toNumber(this.upper_bet)

        if (bet_num_n < lower_bet_n) {
          this.$notify(`投注金额不能低于${lower_bet_n}元`)
        } else if (bet_num_n > upper_bet_n) {
          this.$notify(`投注金额不能高于${upper_bet_n}元`)
        } else {
          this.bet_pop_disable = false
          if (this.countdown === 0) {
          } else {
            //输入框只能输入数字，小数点后最多两位
          }
        }
      } else {
        this.bet_pop_disable = true
      }
    }, 300)
  },
  destroyed() {
    // 缓存当前聊天室聊天数据
    strg.setListCache(this.rid, this.msg_list, 'red')
    // 关闭当前worker
    if (time_worker) time_worker.terminate()
  },
  mounted() {
    // this.bet_countdown_pop_ctr = true;
    G.delay(() => {
      this.scrollToBottom()
    }, 800)
  },
  updated() {
    // strg.setListCache(this.rid, this.msg_list);
  },
  watch: {
    betNum(news) {
      this.bet_num_debounce(news)
    },
    getGameing(news) {
      if (news) {
        this.bet_countdown_pop_ctr = true
      }
    }
  }
}
</script>

<style lang="scss">
.page-RedRoom-root {
  padding-bottom: 50px;
  background-color: $roomBg;
  flex: 1;
  display: flex;
  flex-direction: column;
  .x-pullrefresh {
    flex: 1;
  }
  .van-notice-bar {
    background-color: $baseBgColor;
    color: $txt;
  }
  .van-nav-bar .van-icon {
    color: $white;
    font-size: 20px;
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
        .voiceAnimate {
          width: 39px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .item {
            animation: whites linear infinite;
            animation-direction: reverse;
            background-color: #888888;
            height: 4px;
          }
          @for $v from 1 through 9 {
            .item-#{$v} {
              width: #{(11 - $v) * 5% + 50%};
              &.act {
                background-color: #fff;
              }
            }
          }
        }
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

  .redbagOpen {
    background-color: rgba($color: #000000, $alpha: 0.6);
  }

  .redbagQuick {
    position: fixed;
    top: 100px;
    right: 12.5px;
    display: flex;
    flex-direction: column;
  }
}
</style>
