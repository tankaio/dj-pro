<template>
  <x-filter-page
    v-model="show_popup"
    @search="onSearch"
    place="搜索用户名"
    class="xf-combo"
    @confirm="onFilterConfirm"
    @reset="onReset"
    @focus="onFocus"
    :recommend_list="recommend_list"
    :history_list="history_list"
    @recommend="onRecommend"
    @history="onHistory"
    @clearHistory="clearHistory"
    @tabclick="onPublishClick"
    @close="onFilterPopClose"
  >
    <x-tabs v-model="active" position>
      <template #nav-right>
        <x-filter-btn :filter-active="filter_active" @click="show_popup = true"></x-filter-btn>
      </template>
      <x-tab title="连胜数">
        <x-list
          position
          :key="0"
          v-model="combo_loading"
          :finished="combo_finished"
          :error.sync="combo_error"
          @load="requestStateManagement(active, true)"
          :active="active === 0"
        >
          <x-combo-item
            v-for="(item, index) in combo_list"
            :key="index"
            @look="onClickLook(item)"
            :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
            v-bind="{
              ico: item.ico,
              username: item.nick,
              planname: item.planname,
              looknum: item.viewed,
              combo: item.winsum,
              itegral: item.cost,
              publish: item.cost >= 0,
              modeType: item.bettype
            }"
          />
        </x-list>
      </x-tab>
      <x-tab title="查看数">
        <x-list
          position
          :key="1"
          v-model="look_loading"
          :finished="look_finished"
          :error.sync="look_error"
          @load="requestStateManagement(active, true)"
          :active="active === 1"
        >
          <x-combo-item
            v-for="(item, index) in look_list"
            :key="index"
            @look="onClickLook(item)"
            :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
            v-bind="{
              ico: item.ico,
              username: item.nick,
              planname: item.planname,
              looknum: item.viewed,
              combo: item.winsum,
              itegral: item.cost,
              publish: item.cost >= 0,
              modeType: item.bettype
            }"
          />
        </x-list>
      </x-tab>
      <x-tab title="发布时间">
        <x-list
          position
          v-model="publish_loading"
          :finished="publish_finished"
          :error.sync="publish_error"
          @load="requestStateManagement(active, true)"
          :active="active === 2"
        >
          <x-combo-item
            v-for="(item, index) in publish_list"
            :key="index"
            @look="onClickLook(item)"
            :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
            v-bind="{
              ico: item.ico,
              username: item.nick,
              planname: item.planname,
              looknum: item.viewed,
              combo: item.winsum,
              itegral: item.cost,
              publish: item.cost >= 0,
              modeType: item.bettype
            }"
          />
        </x-list>
        <template #tab-icon>
          <van-icon name="ascending" v-if="sort_active" />
          <van-icon name="descending" v-else />
        </template>
      </x-tab>
    </x-tabs>

    <template slot="popup">
      <x-filter-item tit="快捷筛选" type="quick">
        <x-active-audio cls="active" v-model="quick_active"> {{ getOpenIssue }}期有发布用户 </x-active-audio>
      </x-filter-item>
      <x-filter-item tit="所需积分区间" type="interval">
        <van-field type="number" v-model="start_integral"></van-field>
        <div class="itv">-</div>
        <van-field type="number" v-model="end_integral"></van-field>
      </x-filter-item>
      <x-filter-item tit="玩法筛选" type="playMathod" bar="playfun">
        <x-act-button idx="单双" v-model="playfun_active" cls="active">单双</x-act-button>
        <x-act-button idx="大小" v-model="playfun_active" cls="active">大小</x-act-button>
        <x-act-button idx="色波" v-model="playfun_active" cls="active">色波</x-act-button>
        <x-act-button idx="生肖" v-model="playfun_active" cls="active">生肖</x-act-button>
        <x-act-button idx="合肖" v-model="playfun_active" cls="active">合肖</x-act-button>
        <x-act-button idx="正特码" v-model="playfun_active" cls="active">正特码</x-act-button>
        <x-act-button idx="自选不中" v-model="playfun_active" cls="active">自选不中</x-act-button>
        <x-act-button idx="连码" v-model="playfun_active" cls="active">连码</x-act-button>
        <x-act-button idx="尾数" v-model="playfun_active" cls="active">尾数</x-act-button>
      </x-filter-item>
    </template>
  </x-filter-page>
</template>

<script>
import { getRankingSearch_liansheng, getRankingRecommend_liansheng } from '@/api/home'
import { BuyPlan } from '@/api/user'
import { judgeBuyPlan } from '@/utils/Auth'
import { integralVal, integralInterval } from '@/utils/verify.util.js'
import { historySearchRecord } from '@/utils/storage.util.js'
import { mapGetters } from 'vuex'

let map = [
  {
    state: '',
    type: 'winsum',
    list: 'combo_list',
    idx: 'combo_start_idx',
    load: 'combo_loading',
    finish: 'combo_finished',
    error: 'combo_error'
  },
  {
    state: '',
    type: 'viewsum',
    list: 'look_list',
    idx: 'look_start_idx',
    load: 'look_loading',
    finish: 'look_finished',
    error: 'look_error'
  },
  {
    state: '',
    type: 'pubtime',
    list: 'publish_list',
    idx: 'publish_start_idx',
    load: 'publish_loading',
    finish: 'publish_finished',
    error: 'publish_error'
  }
]

import xFilterPage from 'cpt/x-filter-page.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xFilterBtn from 'cpt/x-filter-btn.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xList from 'cpt/x-list/x-list.vue'
import xComboItem from 'cpt/x-combo-item.vue'
import xFilterItem from 'cpt/x-filter-item.vue'
import xActiveAudio from 'cpt/x-active-audio.vue'
import xActButton from 'cpt/x-act-button.vue'
import xNodata from 'cpt/x-nodata.vue'

export default {
  components: {
    xFilterPage,
    xTabs,
    xFilterBtn,
    xTab,
    xList,
    xComboItem,
    xFilterItem,
    xActiveAudio,
    xActButton,
    xNodata
  },
  name: 'combo',
  data() {
    return {
      show_popup: false,

      active: 0,

      quick_active: false,
      playfun_active: '',

      reset: false,

      combo_start_idx: 0,
      combo_list: [],

      combo_loading: false,
      combo_finished: false,
      combo_error: false,

      look_start_idx: 0,
      look_list: [],

      look_loading: false,
      look_finished: false,
      look_error: false,

      publish_start_idx: 0,
      publish_list: [],

      publish_loading: false,
      publish_finished: false,
      publish_error: false,

      recommend_list: [],
      history_list: [],

      end_integral: '',
      start_integral: '',

      sort_active: false,
      tab_old: 0,

      cache: {} // 缓存查询参数
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getOpenIssue']),
    filter_active() {
      if (this.quick_active || this.playfun_active !== '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // 点击遮罩关闭筛选弹窗
    onFilterPopClose() {
      if (G.isEmpty(this.cache)) {
        this.quick_active = false
        this.playfun_active = ''
        this.start_integral = ''
        this.end_integral = ''
      } else {
        G.objClone(this.cache, this)
      }
    },
    // 搜索函数被debounce 函数包装过
    onSearch(val) {
      historySearchRecord(val, 'combo').then(history_list => {
        this.history_list = history_list
        this.reset = true
        this.updateState(true)
        this.requestStateManagement(this.active)
      })
    },
    clearHistory() {
      ls.set('combo_search_history', [])
    },
    onFocus() {
      this.history_list = ls('combo_search_history') || []
      this.getRankingRecommend_liansheng()
    },
    onReset() {
      this.reset = true
      this.quick_active = false
      this.playfun_active = ''
      this.start_integral = ''
      this.end_integral = ''
      this.cache = {}
      this.show_popup = false
      this.updateState(true)
      this.requestStateManagement(this.active)
    },
    onFilterConfirm() {
      if (this.quick_active !== false || this.playfun_active !== '' || (this.start_integral !== '' && this.end_integral !== '')) {
        let map = {
          start: Number(this.start_integral),
          end: Number(this.end_integral),
          endLimit: this.end_integral + 1,
          startLimit: this.start_integral - 1
        }
        let verify = {
          start: '@number |lt[endLimit] |!decimal len|lt[!6] len|gt[!0]',
          end: '@number |gt[startLimit] |!decimal len|lt[!6] len|gt[!0]'
        }

        if (!G.$v(map, verify)) {
          this.$notify('积分区间输入值错误')
          return
        }
        this.updateState(true)
        // 缓存当前选中值
        this.cache = G.objClone({
          quick_active: this.quick_active,
          search: this.search,
          start_integral: this.start_integral,
          end_integral: this.end_integral,
          bettype: this.bettype
        })

        this.requestStateManagement(this.active)
        // 每次确定筛选规则后需要重置列表
        this.reset = true
      } else if (this.quick_active === false && this.playfun_active === '' && this.start_integral === '' && this.end_integral === '') {
        this.onReset()
      }
    },
    onHistory(nick) {
      this.search = nick
    },
    onRecommend(nick) {
      this.search = nick
    },
    onClickLook(item) {
      let that = this
      judgeBuyPlan(item.planid, this.userInfo.balan_m, item.cost, {
        access() {
          /* 已经购买允许查看准入 */
          that.$router.push(`/planDetail/${item.planid}`)
        },
        faild() {
          /* 购买失败 */
          that.$router.back()
        },
        cancel() {
          /* 取消 */
          // that.$router.back();
        },
        charge() {
          /* 充值 */
          that.$router.push('/user/integral')
        }
      })

      return

      // if (!item.cost) {
      //   this.$router.push(`/awardInfo/awardDetail/${item.planid}`)
      //   return
      // }
      // G.$dialog
      //   .confirm({
      //     title: `消费${item.cost}积分？`,
      //     message: '温馨提示：此资料纯属专家个人观点，仅供参考。请自愿选择购买。祝您中奖!'
      //   })
      //   .then(async () => {
      //     if (this.userInfo.balan_m > item.cost) {
      //       let { ok, msg } = await BuyPlan({
      //         planid: item.id
      //       })
      //       if (ok) {
      //         this.$notify({
      //           type: 'success',
      //           message: '购买成功',
      //           duration: 2000,
      //           onClose: () => {
      //             this.$router.push(`/awardInfo/awardDetail/${item.id}`)
      //           }
      //         })
      //       }
      //     } else {
      //       G.$dialog
      //         .confirm({
      //           title: '提醒',
      //           message: '账户积分不足，请充值！'
      //         })
      //         .then(() => {
      //           this.$router.push('/user/integral')
      //         })
      //         .catch(() => {})
      //     }
      //   })
      //   .catch(() => {})
    },
    integralIntervalVerify(news) {
      return integralInterval(this.start_integral, this.end_integral) && integralVal(news)
    },
    onPublishClick(val) {
      // console.log(this.tab_old, val)
      if (this.tab_old === val && val === 2) {
        // 连续点击 2
        this.sort_active = !this.sort_active
        this.publish_list.reverse()
      }
      this.tab_old = val
    },
    async requestStateManagement(idx, scroll) {
      let { list, idx: list_idx, load, finish, error, state, type } = map[idx]

      if (this.reset) this[list] = []

      let params = {
        type,
        startind: this[list].length
      }

      if (this.quick_active) params.haspub = true
      if (this.search) params.nick = this.search
      if (this.start_integral && this.end_integral) {
        params.cost1 = this.start_integral
        params.cost2 = this.end_integral
      }
      if (this.playfun_active) params.bettype = this.playfun_active

      let ok, msg
      if (state || scroll) {
        ;({ ok, msg } = await getRankingSearch_liansheng(params))
        if (ok) {
          if (state) {
            this[list] = msg
            this[finish] = false
            map[idx].state = '' // 关闭状态
          } else if (scroll) {
            if (this.active === 2 && this.sort_active === true) {
              // 这一行很重要
              window.scrollTo(0, 0)
              this[list].shift(...G.differenceBy(this[list], msg.reverse, 'planid'))
            } else {
              this[list].push(...G.differenceBy(this[list], msg, 'planid'))
            }

            if (msg.length === 0) this[finish] = true
          }
          // this[list_idx]++;
          this[load] = false
        } else {
          this[error] = true
        }
        this.reset = false
      }
    },
    updateState(state) {
      map.forEach(item => (item.state = state))
    }
  },
  created() {
    this.updateState(true)
    this.requestStateManagement(0)
    this.getRankingRecommend_liansheng = G.once(async () => {
      let { ok, msg } = await getRankingRecommend_liansheng()
      if (ok) {
        this.recommend_list = msg
      }
    })
    this.debounceIntegralIntervalVerify = G.debounce(this.integralIntervalVerify, 300)
  },
  watch: {
    active(news, old) {
      this.requestStateManagement(news)
    },
    // start_integral(news, old) {
    //   this.debounceIntegralIntervalVerify(news)
    // },
    end_integral(news, old) {
      this.debounceIntegralIntervalVerify(news)
    }
  }
}
</script>

<style lang="scss">
.xf-combo {
  .xt-tabbar {
    height: 40px;
  }
  .x-tabs .xt-tab {
    position: fixed;
    // top: 98px;
    background-color: $white;
    width: 100vw;
  }
  .van-cell .van-cell__title {
    overflow: unset;
  }
  .xt-item.characteristic-2 {
    display: flex;
    justify-content: center;
    align-items: center;
    .tab-icon {
      padding-left: 5px;
      display: flex;
      // align-items: center;
    }
  }
}
</style>
