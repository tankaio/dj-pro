<template>
  <x-filter-page
    v-model="show_popup"
    @search="onSearch"
    place="搜索用户名"
    @confirm="onFilterConfirm"
    @reset="onReset"
    @focus="onFocus"
    :recommend_list="recommend_list"
    :history_list="history_list"
    @recommend="onRecommend"
    @history="onHistory"
    @clearHistory="clearHistory"
    @close="onFilterPopClose"
    class="xf-winrate"
  >
    <x-tabs v-model="active" position>
      <template #nav-right>
        <x-filter-btn :filter-active="filter_active" @click="show_popup = true"></x-filter-btn>
      </template>
      <x-tab title="周榜">
        <x-list
          position
          v-model="week_loading"
          :finished="week_finished"
          :error.sync="week_error"
          @load="requestStateManagement(active, true)"
          :active="active === 0"
        >
          <x-manito-item
            v-for="(item, index) in week_list"
            :key="index"
            :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
            v-bind="{
              type: 'winrate',
              avatar: item.ico,
              username: item.nick,
              gender: item.sex,
              all: item.sum,
              s: item.win,
              combo: item.wintimes,
              modeType: item.bettype
            }"
          />
        </x-list>
      </x-tab>
      <x-tab title="月榜">
        <x-list
          position
          v-model="month_loading"
          :finished="month_finished"
          :error.sync="month_error"
          @load="requestStateManagement(active, true)"
          :active="active === 1"
        >
          <x-manito-item
            v-for="(item, index) in month_list"
            :key="index"
            :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
            v-bind="{
              type: 'winrate',
              avatar: item.ico,
              username: item.nick,
              gender: item.sex,
              all: item.sum,
              s: item.win,
              combo: item.wintimes,
              modeType: item.bettype
            }"
          />
        </x-list>
      </x-tab>
    </x-tabs>

    <template slot="popup">
      <x-filter-item tit="快捷筛选" type="quick">
        <x-active-audio cls="active" v-model="quick_active"> {{ getOpenIssue }}期有发布用户 </x-active-audio>
      </x-filter-item>
      <x-filter-item tit="胜率区间(%)" type="interval">
        <van-field type="number" v-model="start_integral"></van-field>
        <div class="itv">-</div>
        <van-field type="number" v-model="end_integral"></van-field>
      </x-filter-item>
      <x-filter-item tit="筛选用户性别" type="gender">
        <x-act-button v-model="gender_active" :idx="1" cls="active male">
          男
          <span class="icon " :class="gender_active === 1 ? 'xIcon-male-gender' : 'xIcon-male-gray-gender'"></span>
        </x-act-button>
        <x-act-button v-model="gender_active" :idx="0" cls="active female">
          女
          <span class="icon" :class="gender_active === 0 ? 'xIcon-female-gender' : 'xIcon-female-gray-gender'"></span>
        </x-act-button>
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
    <van-tabbar v-model="playfun_active" slot="filter-bottom" class="ios-tb">
      <van-tabbar-item name="正特码" @click="onFilterConfirm">正特码</van-tabbar-item>
      <van-tabbar-item name="生肖" @click="onFilterConfirm">生肖</van-tabbar-item>
      <van-tabbar-item name="单双" @click="onFilterConfirm">单双</van-tabbar-item>
      <van-tabbar-item name="合肖" @click="onFilterConfirm">合肖</van-tabbar-item>
      <van-tabbar-item name="0" @click="onFilterConfirm(true)">更多</van-tabbar-item>
    </van-tabbar>
  </x-filter-page>
</template>

<script>
import { getRankingSearch_shenglv, getRankingRecommend_shenglv } from '@/api/home'
import { integralVal, integralInterval } from '@/utils/verify.util.js'
import { historySearchRecord } from '@/utils/storage.util.js'
import { mapGetters } from 'vuex'
let map = [
  {
    state: '',
    type: 'week',
    list: 'week_list',
    idx: 'week_start_idx',
    load: 'week_loading',
    finish: 'week_finished',
    error: 'week_error'
  },
  {
    state: '',
    type: 'month',
    list: 'month_list',
    idx: 'month_start_idx',
    load: 'month_loading',
    finish: 'month_finished',
    error: 'month_error'
  }
]

import xFilterPage from 'cpt/x-filter-page.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xFilterBtn from 'cpt/x-filter-btn.vue'
import xList from 'cpt/x-list/x-list.vue'
import xManitoItem from 'cpt/x-manito-item.vue'
import xFilterItem from 'cpt/x-filter-item.vue'
import xActiveAudio from 'cpt/x-active-audio.vue'
import xActButton from 'cpt/x-act-button.vue'
import xNodata from 'cpt/x-nodata.vue'

export default {
  components: {
    xFilterPage,
    xTabs,
    xTab,
    xFilterBtn,
    xList,
    xManitoItem,
    xFilterItem,
    xActiveAudio,
    xActButton,
    xNodata
  },
  name: 'winrate',
  data() {
    return {
      show_popup: false,

      active: 0,

      filter_active: false,
      quick_active: false,
      gender_active: '',

      week_start_idx: 0,
      week_list: [],

      week_loading: false,
      week_finished: false,
      week_error: false,

      month_start_idx: 0,
      month_list: [],

      month_loading: false,
      month_finished: false,
      month_error: false,

      recommend_list: [],
      history_list: [],

      search: '',

      playfun_active: '正特码',

      end_integral: '',
      start_integral: '',

      // 积分区间是否正确
      integral_verify_isok: true,
      cache: {}
    }
  },
  computed: {
    ...mapGetters(['getOpenIssue'])
  },
  methods: {
    onFilterPopClose() {
      if (G.isEmpty(this.cache)) {
        this.quick_active = false
        this.gender_active = ''
        this.filter_active = false
        this.start_integral = ''
        this.end_integral = ''
      } else {
        G.objClone(this.cache, this)
      }
    },
    // 搜索函数被debounce 函数包装过
    onSearch(val) {
      historySearchRecord(val, 'winrate').then(history_list => {
        this.search = val
        this.history_list = history_list
        this.reset = true
        this.updateState(true)
        this.requestStateManagement(this.active, true)
      })
    },
    clearHistory() {
      ls.set('winrate_search_history', [])
    },
    onFocus() {
      this.history_list = ls('winrate_search_history') || []
      this.getRankingRecommend_shenglv()
    },
    onReset() {
      this.reset = true
      this.quick_active = false
      this.gender_active = ''
      this.filter_active = false
      this.start_integral = ''
      this.end_integral = ''
      this.cache = {
        playfun_active: this.playfun_active
      }
      this.show_popup = false
      this.updateState(true)
      this.requestStateManagement(this.active)
    },
    onFilterConfirm(more) {
      if (more === true) {
        this.show_popup = true
        this.playfun_active = '0'
      }
      if (
        this.quick_active !== false ||
        this.gender_active !== '' ||
        this.playfun_active !== '0' ||
        (this.start_integral && this.end_integral && this.integral_verify_isok)
      ) {
        if (this.integral_verify_isok === false) {
          this.start_integral = ''
          this.end_integral = ''
        }
        this.cache = G.objClone({
          quick_active: this.quick_active,
          gender_active: this.gender_active,
          playfun_active: this.playfun_active,
          start_integral: this.start_integral,
          end_integral: this.end_integral
        })
        this.filter_active = true
        this.updateState(true)
        this.requestStateManagement(this.active)
        // 每次确定筛选规则后需要重置列表
        this.reset = true
      }
    },
    onHistory(nick) {
      this.search = nick
    },
    onRecommend(nick) {
      this.search = nick
    },
    integralIntervalVerify(news) {
      if (!integralInterval(this.start_integral, this.end_integral) || !integralVal(news)) {
        this.integral_verify_isok = false
      } else {
        this.integral_verify_isok = true
      }
    },
    async requestStateManagement(idx, scroll) {
      let { list, idx: list_idx, load, finish, error, state, type } = map[idx]
      if (this.reset) this[list] = []

      let params = {
        type,
        startind: this[list].length,
        bettype: this.playfun_active
      }

      if (!this.integral_verify_isok) return
      if (this.quick_active) params.haspub = true
      if (this.start_integral) params.rate1 = this.start_integral
      if (this.end_integral) params.rate2 = this.end_integral
      if (this.gender_active !== '') params.sex = this.gender_active
      if (this.search) params.nick = this.search

      let ok, msg
      if (state || scroll) {
        ;({ ok, msg } = await getRankingSearch_shenglv(params))
        if (ok) {
          if (state) {
            this[list] = msg
            this[finish] = false
            map[idx].state = '' // 关闭状态
          } else if (scroll) {
            this[list].push.apply(this[list], G.differenceBy(this[list], msg, 'nick'))
            if (msg.length === 0) this[finish] = true
          }
          this[list_idx]++
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
    this.getRankingRecommend_shenglv = G.once(async () => {
      let { ok, msg } = await getRankingRecommend_shenglv()
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
    start_integral(news, old) {
      this.debounceIntegralIntervalVerify(news)
    },
    end_integral(news, old) {
      this.debounceIntegralIntervalVerify(news)
    }
  }
}
</script>

<style lang="scss">
.xf-winrate {
  padding-bottom: 50px;
  .van-tabbar {
    height: 44px;
  }
  .van-tabbar-item--active {
    color: $white;
    background-color: $rootColor;
  }
  .xt-tabbar {
    height: 40px;
  }
  .x-tabs .xt-tab {
    position: fixed;
    top: 88px;
    background-color: $white;
    width: 100vw;
  }
}
</style>
