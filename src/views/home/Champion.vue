<template>
  <x-filter-page
    @search="onSearch"
    @confirm="onFilterConfirm"
    @reset="onReset"
    class="xf-champion"
    v-model="show_popup"
    place="搜索用户名"
    @focus="onFocus"
    :recommend_list="recommend_list"
    :history_list="history_list"
    @recommend="onRecommend"
    @history="onHistory"
    @clearHistory="clearHistory"
    @close="onFilterPopClose"
    :main-top="128"
  >
    <template #header-bottom>
      <div class="menu van-hairline--bottom">
        <van-dropdown-menu get-container="#box">
          <van-dropdown-item @change="onMenuChange" v-model="value" :options="rounds" :title="menu_title" />
        </van-dropdown-menu>
        <x-filter-btn :filter-active="filter_active" @click="show_popup = true"></x-filter-btn>
      </div>
    </template>
    <!-- <x-fixed :offset-top="98" bar-height="40" class="menu"> </x-fixed> -->
    <x-nodata bg :data-s="champion_list" />
    <x-manito-item
      v-for="(item, index) in champion_list"
      :key="index"
      :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
      v-bind="{
        type: 'champion',
        avatar: item.ico,
        username: item.nick,
        gender: item.sex,
        all: item.sum,
        s: item.win,
        combo: item.wintimes,
        fans: item.fans,
        follow: item.follow,
        modeType: item.bettype
      }"
    />
    <template slot="popup">
      <x-filter-item tit="快捷筛选" type="quick">
        <x-active-audio cls="active" v-model="quick_active"> {{ getOpenIssue }}期有发布用户 </x-active-audio>
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
import { getRankingRecommend_champion, getRankingSearch_champion } from '@/api/home'

import { historySearchRecord } from '@/utils/storage.util.js'

import { mapGetters } from 'vuex'

import xFilterPage from 'cpt/x-filter-page.vue'
import xFixed from 'cpt/x-fixed.vue'
import xFilterBtn from 'cpt/x-filter-btn.vue'
import xManitoItem from 'cpt/x-manito-item.vue'
import xFilterItem from 'cpt/x-filter-item.vue'
import xActiveAudio from 'cpt/x-active-audio.vue'
import xActButton from 'cpt/x-act-button.vue'
import xList from 'cpt/x-list/x-list.vue'
import xNodata from 'cpt/x-nodata.vue'

export default {
  components: {
    xFilterPage,
    xFixed,
    xFilterBtn,
    xManitoItem,
    xFilterItem,
    xActiveAudio,
    xActButton,
    xList,
    xNodata
  },
  name: 'champion',
  data() {
    return {
      value: 0,
      round: '',
      menu_title: '',
      show_popup: false,

      quick_active: false,
      playfun_active: '',

      reset: false,

      champion_start_idx: 0,
      champion_list: [],

      champion_loading: false,
      champion_finished: false,
      champion_error: false,

      recommend_list: [],
      history_list: [],

      search: '',
      cache: {}
    }
  },
  computed: {
    ...mapGetters(['getRounds', 'getOpenIssue']),
    filter_active() {
      if (this.quick_active !== false || this.playfun_active !== '') {
        return true
      }
      return false
    },
    rounds() {
      if (this.getRounds[0]) {
        this.value = 0
        this.menu_title = this.getRounds[0].text
      }
      return this.getRounds
    }
  },
  methods: {
    onFilterPopClose() {
      if (G.isEmpty(this.cache)) {
        this.quick_active = false
        this.playfun_active = ''
      } else {
        G.objClone(this.cache, this)
      }
    },
    // 搜索函数被debounce 函数包装过
    onSearch(val) {
      historySearchRecord(val, 'champion').then(history_list => {
        this.search = val
        this.history_list = history_list
        this.reset = true
        this.onLoadChampion()
      })
    },
    clearHistory() {
      ls.set('champion_search_history', [])
    },
    onFocus() {
      this.history_list = ls('champion_search_history') || []
      this.getRankingRecommend_champion()
    },
    onReset() {
      this.reset = true
      this.quick_active = false
      this.playfun_active = ''
      this.cache = {}
      this.show_popup = false
      this.onLoadChampion()
    },
    onMenuChange(val) {
      this.menu_title = `第${val}期冠军榜`
      this.round = val
      this.reset = true
      this.onLoadChampion()
    },
    onFilterConfirm() {
      if (this.quick_active !== false || this.playfun_active !== '') {
        this.cache = G.objClone({
          quick_active: this.quick_active,
          playfun_active: this.playfun_active
        })
        // 每次确定筛选规则后需要重置列表
        this.reset = true
        this.onLoadChampion()
      } else if (this.quick_active === false && this.playfun_active === '') {
        this.onReset()
      }
    },
    onHistory(nick) {
      this.search = nick
    },
    onRecommend(nick) {
      this.search = nick
    },
    async onLoadChampion() {
      if (this.reset) this.champion_list = []

      let params = {
        round: this.round,
        startind: this.champion_list.length
      }
      if (this.quick_active) params.haspub = true
      if (this.search) params.nick = this.search
      if (this.playfun_active) params.bettype = this.playfun_active

      let { ok, msg } = await getRankingSearch_champion(params)

      if (ok) {
        if (this.reset) {
          this.champion_list = msg
          this.reset = false
          this.champion_finished = false
          // this.champion_start_idx = 0;
        } else {
          this.champion_list.push.apply(this.champion_list, msg)
          if (msg.length === 0) this.champion_finished = true
        }
        this.champion_start_idx++
        this.champion_loading = false
      } else {
        this.champion_error = true
      }
    }
  },
  created() {
    this.onLoadChampion()
    this.getRankingRecommend_champion = G.once(async () => {
      let { ok, msg } = await getRankingRecommend_champion()
      if (ok) {
        this.recommend_list = msg
      }
    })
  }
}
</script>

<style lang="scss">
.xf-champion {
  .van-dropdown-menu {
    flex: 1;
    height: 40px;
  }
  .xf-filter-bar {
    height: 40px;
    .xf-filter {
      width: 100%;
      position: fixed;
      top: 98px;
      background-color: $white;
      z-index: 1;
      box-shadow: 0 2px 4px 0 rgba($color: #000000, $alpha: 0.2);
    }
  }
  .xt-middle {
    .xt-tab {
      display: none;
    }
  }
  .menu {
    display: flex;
    background-color: $white;
  }
}
</style>
