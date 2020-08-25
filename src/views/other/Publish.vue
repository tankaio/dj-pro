<template>
  <!-- <x-page rootClass="publish" isRight :class="{ select: play_confirm }"> </x-page> -->
  <x-layout modifier="publish" :class="{ select: play_confirm }" :main-top="194" main-center-color="#fff">
    <template #header>
      <x-header />
      <x-periods-tit :tit="`${getNowIssue.date}第${getNowIssue.round}期`" />
      <div class="gray-8">
        <div class="selectPlay" @click="show = true">
          <div class="txt">
            {{ select_txt }}
            <div class="funDescBtn" v-if="play_confirm" @click.stop="onDescClick">
              <span class="xIcon-fun-cm"></span>
            </div>
          </div>
          <van-icon name="wap-nav" />
        </div>
      </div>

      <template v-if="!play_confirm">
        <van-cell-group>
          <van-cell>可开放购买玩法</van-cell>
        </van-cell-group>
      </template>
      <template v-else>
        <div class="paly-fun-select-bar">
          <div class="xpp-hd">
            <span
              >已经连胜 <i class="s">{{ winagain }}</i></span
            >
            <span
              >胜/负
              <i class="s">{{ wintimes }}</i>
              /
              <i class="f">{{ publishcount - wintimes }}</i>
            </span>
            <span class="xpp-winrate">{{ wintimes | percentage(publishcount) }}</span>
          </div>
        </div>
      </template>
    </template>
    <div class="container">
      <x-tabs v-model="active">
        <x-tab>
          <router-view></router-view>
        </x-tab>
        <x-tab class="minClassBtnBar">
          <van-button size="small" v-for="(item, index) in play_list" :key="index" @click="onPlayClick(item)">
            {{ item.txt }}
          </van-button>
        </x-tab>
      </x-tabs>
    </div>

    <!--  -->
    <div class="footer ios-bt" slot="bottom" v-if="play_confirm">
      <!-- 仅允许输入大于0的数值且不允许小数。 -->
      <van-field v-model="price" type="number" placeholder="请输入查看所需积分" @click="onClickPut" :disabled="!cansell" />
      <div class="right-btn" @click="onConfirmPublish">确认发布</div>
    </div>

    <van-popup get-container="#box" v-model="show" position="top" class="select-play-popup">
      <van-cell title="选择玩法类别">
        <van-icon name="cross" slot="right-icon" @click="show = false" />
      </van-cell>
      <div class="bigClassBtnBar">
        <van-button size="small" v-for="(item, index) in grand_class" :key="index" @click="onGrandClassClick(item)">
          {{ item.txt }}
        </van-button>
      </div>
    </van-popup>

    <!-- dialog -->
    <van-dialog
      class="setPlanNamePop"
      v-model="plan_name_show"
      title="设置计划名称"
      get-container="#box"
      show-cancel-button
      @confirm="onPlanNameConfirm"
      @cancel="onPlanNameCancel"
    >
      <van-field v-model="plan_name"></van-field>
    </van-dialog>
  </x-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { GetAvailableBettype, SetMyPlan, GetPlansInfoByType, CanPublishPlan } from '@/api/other'
import { op } from '@/utils/formant.util.js'
import { getPlay, getPlayDesc, verifyPlayNum } from '@/utils/plan.util.js'
import { verifyPlanName, exchangeIntegral } from '@/utils/verify.util.js'

import xPage from 'cpt/x-page.vue'
import xFixed from 'cpt/x-fixed.vue'
import xPeriodsTit from 'cpt/x-periods-tit.vue'
import xTabs from 'cpt/x-tabs/x-tabs.vue'
import xTab from 'cpt/x-tabs/x-tab.vue'

export default {
  components: {
    xPage,
    xFixed,
    xPeriodsTit,
    xTabs,
    xTab
  },
  data() {
    return {
      date: '',
      round: '',
      // 上次选择的玩法路由
      value: '/publish',
      // 选取状态
      play_confirm: false,
      select_txt: '请选择玩法类别',

      plan_name_show: false,
      plan_name: '',

      price: '',
      can: true,

      show: false,
      active: 0,
      // 当前选择的拼接值
      min_class: '', // 玩法小类 英文
      big_class: '', // 玩法大类 英文
      grand_class_path: '/publish', // 当前玩法路径
      grand_class_txt: '', // 玩法大类 玩法小类组合文字
      min_class_txt: '', // 玩法小类
      big_class_txt: '', // 玩法大类展示文字
      grand_class: [
        // 玩法大类
        {
          txt: '单双',
          path: '/oneDouble'
        },
        {
          txt: '色波',
          path: '/colorBo'
        },
        {
          txt: '大小',
          path: '/size'
        },
        {
          txt: '生肖',
          path: '/zodiac'
        },

        {
          txt: '合肖',
          path: '/hezodiac'
        },
        {
          txt: '正特码',
          path: '/positiveSpecialCode'
        },
        {
          txt: '自选不中',
          path: '/selfSelection'
        },
        {
          txt: '连码',
          path: '/jointMark'
        },
        {
          txt: '尾数',
          path: '/mantissa'
        }
      ],
      play_list: [], // 玩法小类和

      winagain: 0, // 连胜
      wintimes: 0, //胜数
      publishcount: 0, // 总场次
      cansell: 0 //是否达到售卖条件
    }
  },
  watch: {
    value(news) {
      // console.log(news);
    }
  },
  computed: {
    ...mapGetters(['getNumberList', 'getNowIssue', 'getNowIssue'])
  },
  methods: {
    ...mapMutations(['clearNumberList']),
    onGrandClassClick(item) {
      this.grand_class_path = `/publish${item.path}`
      this.big_class = item.path.replace('/', '')
      this.grand_class_txt = item.txt
      this.big_class_txt = item.txt
      this.show = false
      this.active = 1
      this.filterPlayList(getPlay(item.txt, this.select_txt))
      this.select_txt = '请选择玩法类别'
      this.play_confirm = false
    },
    filterPlayList(list) {
      this.play_list = list.filter(ele => {
        return this.grand_class_filter_rule[this.grand_class_txt].some(gc_ele => {
          return ele.txt === gc_ele
        })
      })
    },
    onPlayClick(item) {
      this.$eventBus.$emit('reset_btn')
      this.clearNumberList()
      this.select_txt = this.grand_class_txt += ` ${item.txt}`
      this.value = this.grand_class_path += `/${item.path}`
      this.min_class = item.path
      this.min_class_txt = item.txt
      this.$router.replace(this.grand_class_path)
      this.GetPlansInfoByType()
      this.active = 0
      this.play_confirm = true
    },
    onDescClick() {
      G.$dialog.alert({
        title: '玩法介绍',
        message: getPlayDesc(this.min_class, this.big_class)
      })
    },
    onClickPut() {
      if (!this.cansell) {
        this.$notify('该玩法未达到售卖条件，提高连胜即可开放')
      }
    },
    onPlanNameConfirm() {
      CanPublishPlan({
        type: this.big_class_txt,
        rgn: this.min_class_txt
      }).then(async ({ ok, msg }) => {
        if (ok) {
          if (!verifyPlanName(this.plan_name)) return
          if (!exchangeIntegral(this.price)) return
          let { ok, msg } = await SetMyPlan({
            bettype: this.big_class_txt,
            betrgn: this.min_class_txt,
            bet: this.getNumberList.join(','),
            cost: this.price || 0,
            planname: this.plan_name
          })
          if (ok) {
            this.$notify({
              type: 'success',
              message: '计划发布成功'
            })
            this.price = ''
            this.$eventBus.$emit('reset_btn')
            this.clearNumberList()
            this.$router.replace('/publish')
            this.select_txt = '请选择玩法类别'
            this.play_confirm = false
          } else {
            this.$notify({
              type: 'danger',
              message: '发布失败'
            })
          }
        }
      })
    },
    onPlanNameCancel() {
      this.plan_name_show = false
    },
    // 玩法由后台配置开放的为哪些
    async GetAvailableBettype() {
      let { ok, msg } = await GetAvailableBettype()
      if (ok) {
        this.grand_class = this.grand_class.filter(ele => !!msg[ele.txt])
        this.grand_class_filter_rule = msg
      }
    },
    // 当前玩法的胜率与可否售卖
    async GetPlansInfoByType() {
      let { ok, msg } = await GetPlansInfoByType({
        bettype: this.big_class_txt,
        betrgn: this.min_class_txt
      })
      if (ok) {
        let getData = G.curry(G.get)(msg)
        this.winagain = getData('winagain', 0)
        this.wintimes = getData('wintimes', 0)
        this.publishcount = getData('publishcount', 0)
        this.cansell = getData('cansell', 0)
      }
    },
    onConfirmPublish() {
      this.$eventBus.$emit('pull:numberlist')
      if (!verifyPlayNum(this.getNumberList, this.min_class, this.big_class)) {
        // console.log(
        //   "参数不符合要求:",
        //   this.getNumberList,
        //   this.min_class,
        //   this.big_class
        // );
        return
      }
      if (this.cansell && !this.price) {
        G.$dialog.alert({
          title: '温馨提示',
          message: '您是该玩法大神，其他用户必须要花费一定积分才能查看您的计划哦！请填写查看所需积分。'
        })
        return
      }
      // 当期已经发布过此玩法计划时toast提示（3秒）：当期已经发布过此玩法计划；
      // 若该玩法达到可以售卖条件未输入查看所需积分，弹出确认提示框
      this.plan_name = `(${this.select_txt.replace(' ', '')})计划推荐`
      this.plan_name_show = true
    }
  },
  created() {
    this.date = this.getNowIssue.date
    this.round = this.getNowIssue.round
    this.GetAvailableBettype()
    if (this.$route.path !== '/publish') {
      this.$router.replace('/publish')
    }
  },
  destroyed() {
    this.$eventBus.$emit('reset_btn')
    this.clearNumberList()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.value = to.path
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$eventBus.$emit('reset_btn')
    this.clearNumberList()
    next()
  },
  beforeRouteUpdate(to, from, next) {
    let { bettype, betrgn } = to.query
    if (bettype) {
      this.select_txt = `${bettype} ${betrgn}`
      this.play_confirm = true
    }
    next()
  },
  watch: {
    $route(news) {
      console.log(news)
    }
  }
}
</script>

<style lang="scss">
.page-publish-root {
  .x-periods-tit {
    padding-top: 0;
  }
  .selectPlay {
    height: 50px;
    background-color: $white;
    display: flex;
  }
  .txt {
    flex: 1;
    font-size: 15px;
    color: $txt;
    line-height: 50px;
    text-align: center;
  }
  .van-icon-wap-nav {
    padding: 0 15px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }
  &.select {
    padding-bottom: 44px;
    .selectPlay .txt {
      padding-left: 10px;
      text-align: left;
      display: flex;
      align-items: center;
      .funDescBtn {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  // .gameFuncSlecte {
  //   background-color: $baseBgColor;
  //   padding-top: 8px;
  //   .gfsBar {
  //     background-color: $white;
  //   }
  // }
  .minClassBtnBar {
    padding: 0 10px 10px;
    .van-button--small {
      margin-top: 10px;
      margin-right: 10px;
    }
  }
  .paly-fun-select-bar {
    background-color: $baseBgColor;
    padding-top: 8px;
  }
  .xpp-hd {
    background-color: $white;
    padding: 0 10px;
    display: flex;
    align-items: center;
    height: 44px;
    font-size: 14px;
    color: $txt;
    > span {
      margin-right: 10px;
    }
    .s {
      color: $rootColor;
    }
    .f {
      color: $green;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
    text-align: center;
    font-size: 15px;
    line-height: 40px;
    color: $gray-99;
    box-shadow: 0 -1px 4px 0 rgba($color: #000000, $alpha: 0.2);
    overflow: hidden;
    .van-cell {
      width: 187px;
      background-color: $gray-f5;
    }
    .right-btn {
      flex: 1;
      background-color: $rootColor;
      color: $white;
    }
  }
}

.select-play-popup {
  .bigClassBtnBar {
    font-size: initial;
    padding: 0 10px 10px;
    .van-button--small {
      margin-top: 10px;
      margin-right: 10px;
    }
  }
  .van-icon {
    line-height: 24px;
  }
}
.setPlanNamePop {
  &.van-dialog .van-field__control {
    text-align: center;
    border: 1px solid $gray-f5;
  }
}
</style>
