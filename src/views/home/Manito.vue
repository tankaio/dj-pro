<template>
  <x-filter-page
    v-model="show_popup"
    @search="onSearch"
    place="搜索用户名"
    class="xf-manito"
    @confirm="onFilterConfirm"
    @reset="onReset"
    @focus="onFocus"
    :recommend_list="recommend_list"
    :history_list="history_list"
    @recommend="onRecommend"
    @history="onHistory"
    @clearHistory="clearHistory"
    @close="onFilterPopClose"
    @cancel="onCancel"
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
              type: 'manito',
              crown: item.ranking,
              avatar: item.ico,
              username: item.nick,
              gender: item.sex,
              fans: item.fans,
              follow: item.follow,
              all: item.sum,
              s: item.win,
              combo: item.wintimes
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
              type: 'manito',
              crown: item.ranking,
              avatar: item.ico,
              username: item.nick,
              gender: item.sex,
              fans: item.fans,
              follow: item.follow,
              all: item.sum,
              s: item.win,
              combo: item.wintimes
            }"
          />
        </x-list>
      </x-tab>
    </x-tabs>
    <template slot="popup">
      <x-filter-item tit="快捷筛选" type="quick">
        <x-active-audio cls="active" v-model="quick_active"> {{ getOpenIssue }}期有发布用户 </x-active-audio>
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
    </template>
  </x-filter-page>
</template>

<script>
import { getRankingSearch_dashen, getRankingRecommend_dashen } from '@/api/home'
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
  name: 'manito',
  data() {
    return {
      show_popup: false,

      active: 0,

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
      cache: {}
    }
  },
  computed: {
    ...mapGetters(['getOpenIssue']),
    filter_active() {
      if (this.gender_active === '' && this.quick_active === false) {
        return false
      }
      return true
    }
  },
  methods: {
    onFilterPopClose() {
      if (G.isEmpty(this.cache)) {
        this.quick_active = false
        this.gender_active = ''
      } else {
        G.objClone(this.cache, this)
      }
    },
    // 搜索函数被debounce 函数包装过
    onSearch(val) {
      historySearchRecord(val, 'manito').then(history_list => {
        this.search = val
        this.history_list = history_list
        this.reset = true
        this.updateState(true)
        this.requestStateManagement(this.active)
      })
    },
    clearHistory() {
      ls.set('manito_search_history', [])
    },
    onFocus() {
      this.history_list = ls('manito_search_history') || []
      this.getRankingRecommend_dashen()
    },
    onReset() {
      this.reset = true
      this.quick_active = false
      this.gender_active = ''
      this.updateState(true)
      this.cache = {}
      this.show_popup = false
      this.requestStateManagement(this.active)
    },
    onFilterConfirm() {
      if (this.quick_active !== false || this.gender_active !== '') {
        this.cache = G.objClone({
          quick_active: this.quick_active,
          gender_active: this.gender_active
        })
        this.updateState(true)
        // 每次确定筛选规则后需要重置列表
        this.reset = true
        this.requestStateManagement(this.active)
      } else if (this.quick_active === false && this.gender_active === '') {
        this.onReset()
      }
    },
    onHistory(nick) {
      this.search = nick
    },
    onRecommend(nick) {
      this.search = nick
    },
    onCancel() {
      if (this.search !== '') {
        this.search = ''
        this.updateState(true)
        this.requestStateManagement(this.active)
      }
    },
    async requestStateManagement(idx, scroll) {
      let { list, idx: list_idx, load, finish, error, state, type } = map[idx]

      if (this.reset) this[list] = []

      let params = {
        type,
        startind: this[list].length
      }

      if (this.quick_active) params.haspub = true
      if (this.gender_active !== '') params.sex = this.gender_active
      if (this.search) params.nick = this.search

      let ok, msg
      if (state || scroll) {
        if (this.search && scroll) {
          this[finish] = true
          return
        }
        ;({ ok, msg } = await getRankingSearch_dashen(params))
        if (ok) {
          if (state) {
            this[list] = msg
            this[finish] = false
            map[idx].state = '' // 关闭状态
          } else if (scroll) {
            this[list].push(...G.differenceBy(this[list], msg, 'ranking'))
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
    this.getRankingRecommend_dashen = G.once(async () => {
      let { ok, msg } = await getRankingRecommend_dashen()
      if (ok) {
        this.recommend_list = msg
      }
    })
  },
  watch: {
    active(news, old) {
      this.requestStateManagement(news)
    }
  }
}
</script>

<style lang="scss">
.xf-manito {
  .xt-tabbar {
    height: 40px;
  }
  .x-tabs .xt-tab {
    position: fixed;
    // top: 98px;
    background-color: $white;
    width: 100vw;
  }
}
</style>
