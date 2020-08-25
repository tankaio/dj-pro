<template>
  <div class="page-UserInfoPlan-root">
    <x-tabs position v-model="active" fixed :offset-top="168">
      <x-tab title="本期推荐" class="lazyTarget">
        <x-nodata :data-s="cur_list" desc="" tip="本期暂无发布计划" />
        <x-lazy-cpt height="144" v-for="(item, index) in cur_list" :key="index">
          <x-issue-item
            @click="onLookNow(item)"
            v-bind="{
              state: true,
              issue: `${cur_date}第${cur_round}期`,
              ad: item.bettype,
              planname: item.title,
              btn: '查看',
              type: 'grade',
              tag: item.betrgn,
              integral: item.cost,
              looks: item.viewtimes,
              sum: item.sum,
              s: item.win,
              f: item.sum - item.win,
              wintimes: item.wintimes,
              probability: parseFloat((item.win / item.sum) * 100).toFixed(2) + '%'
            }"
          >
            <van-button v-if="item.cost && self" type="danger" size="small" @click="onSharePlan(item)">
              分享
            </van-button>
          </x-issue-item>
        </x-lazy-cpt>
      </x-tab>
      <x-tab title="历史推荐">
        <x-list
          v-model="old_loading"
          :finished="old_finished"
          :error.sync="old_error"
          @load="self ? GetMyOldPlans() : getUserRecommend_old()"
          :active="active === 1"
        >
          <x-nodata :data-s="old_list" desc="" tip="暂无历史推荐" />
          <x-lazy-cpt height="144" v-for="(item, index) in old_list" :key="index">
            <x-issue-item
              v-for="(item, index) in old_list"
              :key="index"
              @click="$router.push(`/planDetail/${item.id}`)"
              v-bind="{
                state: item.bingo,
                issue: `${item.date}第${item.round}期`,
                ad: item.bettype,
                btn: '查看',
                planname: item.title
              }"
            />
          </x-lazy-cpt>
        </x-list>
      </x-tab>
      <template #nav-right>
        <span class="xf-filter-btn" :class="{ active: filter_active }" @click="onFilter">
          筛选
          <span class="xIcon-filter-cm" :class="{ active: filter_active }" />
        </span>
      </template>
      <template slot="tab-bottom">
        <div v-if="active === 1 && playfun_active" class="grade">
          <span>单双（最近连胜{{ desc.wintimes }})</span>
          <span>总:{{ desc.sum }}</span>
          <span>
            胜/负:
            <i class="fail">{{ desc.win }}</i>
            /
            <i class="done">{{ desc.sum - desc.win }}</i>
          </span>
          <span>
            胜率：
            <i class="done">
              {{ Math.floor((desc.win / desc.sum) * 100) + '%' }}
            </i>
          </span>
        </div>
        <div v-if="active === 0" class="issueBar">
          <span class="xIcon-period-cm"></span>
          <span class="issue">{{ cur_date }}第{{ cur_round }}期</span>
        </div>
      </template>
    </x-tabs>
    <x-filter-rpop v-model="show_popup" @reset="onReset" @confirm="onConfirm">
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
    </x-filter-rpop>
    <!-- 选择分享路径 -->
    <van-action-sheet cancel-text="取消" v-model="shareSelectShow" :actions="shareOption" @select="onShareSelect" />
  </div>
</template>

<script>
import {
  getGetUserDetail,
  //   followUser,
  getUserRecommend_cur,
  getUserRecommend_old
} from '@/api/home'
import { GetMyPlans, GetMyOldPlans, BuyPlan } from '@/api/user'
import { mapGetters, mapMutations } from 'vuex'
import { judgeBuyPlan } from '@/utils/Auth'

import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'
import xIssueItem from 'cpt/x-issue-item.vue'
import xList from 'cpt/x-list/x-list.vue'
import xFilterRpop from 'cpt/x-filter-rpop.vue'
import xFilterItem from 'cpt/x-filter-item.vue'
import xActButton from 'cpt/x-act-button.vue'
import xNodata from 'cpt/x-nodata.vue'

export default {
  components: {
    xTabs,
    xTab,
    xIssueItem,
    xList,
    xFilterRpop,
    xFilterItem,
    xActButton,
    xNodata
  },
  data() {
    return {
      active: 0,
      show_popup: false,
      playfun_active: '',
      shareSelectShow: false,

      self: '',

      filter_active: false,

      cur_list: [],
      cur_date: '',
      cur_round: '',

      old_list: [],
      old_startind: 0,

      reset: false,
      desc: {},

      old_loading: false,
      old_finished: false,
      old_error: false,

      planInfo: {},

      shareOption: [
        {
          name: '聊天室',
          identity: 0
        },
        {
          name: '晒单圈',
          identity: 1
        }
        // {
        //   name: "六合头条",
        //   identity: 2
        // }
      ]
    }
  },
  methods: {
    ...mapMutations(['setNowIssue']),
    onShareSelect(val) {
      switch (val.identity) {
        case 0:
          break
        case 1:
          this.$router.push({
            path: '/shareToCircle',
            query: this.planInfo
          })
          break
        case 2:
          break
        default:
          break
      }
      this.planInfo = {}
    },
    // 分享计划
    onSharePlan(plan) {
      this.planInfo = plan
      this.shareSelectShow = true
    },
    // 搜索函数被debounce 函数包装过
    onSearch(val) {
      console.log(val)
    },
    onFilter() {
      this.show_popup = true
    },
    onReset() {
      this.reset = true
      this.playfun_active = ''
      this.filter_active = false
      this.show_popup = false
      this.desc = {}
      if (this.self) {
        this.GetMyPlans()
        this.GetMyOldPlans()
      } else {
        this.getUserRecommend_cur()
        this.getUserRecommend_old()
      }
    },
    onConfirm() {
      if (this.playfun_active !== '') {
        this.filter_active = true
        this.reset = true

        if (this.self) {
          this.GetMyPlans()
          this.GetMyOldPlans()
        } else {
          this.getUserRecommend_cur()
          this.getUserRecommend_old()
        }
      }
    },
    onLookNow(item) {
      if (this.self || item.cost === 0) {
        this.$router.push(`/planDetail/${item.id}`)
      } else {
        judgeBuyPlan(item.id, this.userInfo.balan_m, item.cost, {
          access() {
            /* 已经购买允许查看准入 */
            that.$router.push(`/planDetail/${item.id}`)
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
      }
    },
    async getUserRecommend_cur() {
      let params = {
        nick: this.username,
        startind: 0
      }
      if (this.playfun_active) params.bettype = this.playfun_active

      let { ok, msg } = await getUserRecommend_cur(params)
      if (ok) {
        let getCurList = G.curry(G.get)(msg)
        this.cur_list = getCurList('plans', [])
        this.cur_date = getCurList('date', '')
        this.cur_round = getCurList('round', '')
      }
    },
    async getUserRecommend_old() {
      if (this.reset) this.old_list = []
      let params = {
        nick: this.username,
        startind: this.old_list.length
      }
      if (this.playfun_active) params.bettype = this.playfun_active
      let { ok, msg } = await getUserRecommend_old(params)
      if (ok) {
        if (this.reset) {
          this.old_list = msg
        } else {
          this.old_list.push.apply(this.old_list, msg)
        }
        // this.old_startind++;
        if (this.playfun_active) {
          this.desc = msg.desc || {}
        }
        this.old_loading = false
      }
    },
    preInspectSelf(nick) {
      if (nick) {
        this.username = nick
        this.self = false
      }
    },
    async GetMyPlans() {
      let params = {
        startind: 0
      }
      if (this.playfun_active) params.bettype = this.playfun_active
      let { ok, msg } = await GetMyPlans(params)
      if (ok) {
        let getData = G.curry(G.get)(msg)
        this.cur_list = getData('plans', [])
        this.cur_date = getData('date', '')
        this.cur_round = getData('round', '')
        this.setNowIssue({
          date: this.cur_date,
          round: this.cur_round
        })
      }
    },
    async GetMyOldPlans() {
      let params = {
        startind: this.old_list.length
      }
      if (this.playfun_active) params.bettype = this.playfun_active
      let { ok, msg } = await GetMyOldPlans(params)
      if (ok) {
        if (this.reset) {
          this.old_list = msg
        } else {
          this.old_list.push.apply(this.old_list, msg)
        }
        // this.old_startind++;
        if (this.playfun_active) {
          this.desc = msg.desc || {}
        }
        this.old_loading = false
      }
    },
    init(nick) {
      if (nick) {
        this.self = false
        this.getUserRecommend_cur()
        this.getUserRecommend_old()
      } else {
        this.self = true
        this.GetMyPlans()
        this.GetMyOldPlans()
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getAvatar'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let { id, nick } = to.query
      vm.preInspectSelf(nick)
      vm.$root.animateDelay(() => vm.init(nick))
    })
  },
  beforeRouteUpdate(to, from, next) {
    let { id, nick } = to.query
    this.preInspectSelf(nick)
    this.$root.animateDelay(() => this.init(nick))
  }
}
</script>

<style lang="scss">
.page-UserInfoPlan-root {
  .xt-middle {
    background-color: $white;
  }
  .xf-filter-btn {
    position: relative;
    line-height: 40px;
    padding: 0 15px;
    font-size: 15px;
    &.active {
      color: $rootColor;
    }
    &::after {
      display: block;
      content: '';
      position: absolute;
      border-left: 1px solid $gray-d7;
      top: 10%;
      bottom: 10%;
      left: 0;
      transform: rotateY(45deg);
    }
  }
  .grade {
    font-size: 13px;
    color: $txt;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    .fail {
      color: $green;
    }
    .done {
      color: $rootColor;
    }
  }
  .issueBar {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    font-size: 13px;
    color: $txt;
    .issue {
      margin-left: 10px;
    }
  }
  .grade,
  .issueBar {
    position: relative;
    &::after {
      display: block;
      position: absolute;
      content: '';
      left: 0;
      top: 0;
      right: 0;
      border-top: 1px solid $gray-f5;
      transform: rotateX(45deg);
    }
  }
  .xi__btn-bar {
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .van-button:nth-child(2) {
      margin-top: 10px;
    }
  }
}
</style>
