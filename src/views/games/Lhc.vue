<template>
  <div class="page-games-root">
    <div class="menu-box">
    <x-games-menu ref="gamesmenu" :tw="todayWin" :tm="balanM" :menubol="changinfo" @changeright="changeright(changinfo)" />
    </div>
    <div style="top:44px;">
      <van-popup v-model="zoushibol" position="top" :overlay="false" :style="{ height: '100%' }" class="games-head-vant">
        <x-header ref="header" :is-right="true" @games-right="changeright(changinfo)" :centerText="getChatInfo.game" />
        <x-games-header
          :val="tablists[num]"
          :bol="zoushibol"
          @showCentent="hiddcentent"
          @nowround="nowroundShow"
          @showWanfa="wanfaShow"
          @countDowmEnd="countBol"
          ref="gamesheader"
        />
      </van-popup>
    </div>
    <van-popup v-model="zoushibol" position="bottom" :overlay="false" :style="{ height: '100%' }" class="bet-box-vant">
      <div class="bet-box" ref="betbox">
        <!-- 一级玩法组 -->
        <van-row gutter="1" style="height:100%">
          
        <van-col span="5" style="height:100%">
        <ul>
          <li
            v-for="(item, index) in tablists"
            :key="index"
            @click="btntabs(tablists[index], index)"
            :class="{ active: num == index }"
            :style="tablists.length - 1 == index ? 'margin-bottom:50px' : ''"
          >
            <span>{{ tablists[index] }}</span>
          </li>
        </ul>
        </van-col>
        <van-col span="19" style="height:100%">
        <div class="bet-content" ref="betcontent">
          <div class="boxs">
            <!--渲染二级玩法组-->
            <div style="width:100%;" v-show="tab2bol" :v-model="gamesmini">
              <van-row gutter="1">
                <van-col :span="tablistson[num].length>2&&tablistson[num].length!=4?8:12"
                v-for="(item, index) in tablistson[num]"
                :key="index"
                :class="{ active: num2 == index }"
                class="locbtn"
                @click="sontabs(index, item)"
                >
                  {{ item }}{{tablistson[num].length}}
                </van-col>
              </van-row>
            </div>
            <!--渲染投注区-->
            <div class="types" ref="types" v-if="listshow" v-for="(v, k) in listshow" :key="k">
              <!-- 只有一个玩法 或者二级玩法组大于1个 显示玩法名称 -->
              <div class="title" v-if="sonlistv[num][num2].length > 1 || tablistson[num].length == 1">
                {{ Object.keys(v)[0] }}
              </div>
              <van-row class="content-0">
                <!-- 渲染号码球 -->
                <van-col
                  :span="Object.keys(item)[0] | ballstyles"
                  v-for="(item, t) in Object.values(v)[0]"
                  :key="t"
                  class="x-style"
                  :class="paymentChecked(item) ? 'checked ' : ''"
                  @click="bindPaymentOffer(item, Object.keys(v)[0])"
                >
                  <div
                    class="ball"
                    :class="
                      Object.keys(item)[0] > 0
                        ? `cl-${Object.keys(item)[0]}`
                        : 'tit' +
                          (Object.keys(item)[0].includes('红') ? ' red' : '') +
                          (Object.keys(item)[0].includes('绿') ? ' green' : '') +
                          (Object.keys(item)[0].includes('蓝') ? ' blue' : '')
                    "
                  >
                    <i :class="paymentChecked(item) ? 'xIcon-games-checked' : ''"></i>
                    {{ Object.keys(item)[0] }}
                  </div>
                  <div class="txt">
                    {{ Object.values(item)[0] }}
                  </div>
                  <!-- 玩法-尾所对号码显示 -->
                  <div v-if="weishuShow && k != weishuNum" style="float:right">
                    <div v-for="(e, i) in weishu[t]" :key="i" class="sx-ball" :class="`cl-${weishu[t][i]}`">
                      {{ weishu[t][i] }}
                    </div>
                  </div>
                  <!-- 显示生肖所对号码 -->
                  <div v-if="!(shengxiaos.indexOf(Object.keys(item)[0]) == -1)" style="float:right">
                    <div
                      v-for="(e, s) in zodiacSign[(nowyear - t) % 12]"
                      :key="s"
                      class="sx-ball"
                      :class="`cl-${zodiacSign[(nowyear - t) % 12][s]}`"
                    >
                      {{ zodiacSign[(nowyear - t) % 12][s] }}
                    </div>
                  </div>
                </van-col>
              </van-row>
            </div>
          </div>
        </div>
        </van-col>
        </van-row>
      </div>
      <div class="footer ios-bt" ref="footer">
        <div v-if="ballOptions" class="footer-title">
          已选<span>{{ ballOptions }}</span
          >注
        </div>
        <div class="amuntbox">
          <input type="tel" class="inputamunt" v-model.number="amount" placeholder="请输入金额" />
          <div class="btnamunt" @click="btnamunt">重置</div>
        </div>
        <div class="btn send" @click="onBet">投注</div>
      </div>
      <div v-show="showBol" class="fengpanbg">封盘中...</div>
    </van-popup>
    <!--投注详情列表-->
    <van-popup v-model="betListsbol" position="bottom" class="betLists" :style="{ height: '30%' }">
      <div v-for="(item, index) in betLists" :key="index" class="list">
        <div v-for="(e, i) in betLists[index]" :key="i">
          <div v-if="i < 2"></div>
          <div v-if="i == 2" class="listname">{{ e }}-</div>
          <div v-if="i == 3" class="listhaoma">{{ e }}</div>
          <div v-if="i == 4" class="listpeilv">赔率：{{ e }}</div>
          <input v-if="i == 5" type="tel" v-model.number="amounts[index]" class="listinput" />
        </div>
      </div>
      <div v-if="betListsbol" class="betlistbottom">
        <div class="listleft" @click="lottoback">取消</div>
        <div class="list-btn" @click="lottobet">投注</div>
      </div>
    </van-popup>

    <x-games-zoushi class="zoushi" :gamesname="getChatInfo.game" :roadArrs="zoushiroad" @showCentent="hiddcentent" />

    <!-- 玩法介绍 -->
    <van-dialog ref="dialog" class="dialog" v-model="show" title="玩法介绍">
      <div v-for="(item, index) in wanfas" :key="index" class="wanfas">
        <div class="wanfatitle">{{ item.title }}</div>
        <div class="wanfacentent">{{ item.remark }}</div>
      </div>
    </van-dialog>
    <!-- loading -->
    <div class="load_cover" v-if="showLoading">
      <van-loading type="spinner" color="white" />
    </div>
  </div>
</template>
<script>
// import { enterGame } from "@/api/games";
import { getLottoOdds } from '@/api/games'
import { lottobet } from '@/api/games'
import { getOddsTobeConfirmed } from '@/api/games'
import { mapGetters } from 'vuex'
import { watch } from 'fs'

import xGamesMenu from 'cpt/x-games/x-games-menu.vue'
import xHeader from 'cpt/x-header.vue'
import xGamesHeader from 'cpt/x-games/x-games-header.vue'
import xGamesZoushi from 'cpt/x-games/x-games-zoushi.vue'

export default {
  components: {
    xGamesMenu,
    xHeader,
    xGamesHeader,
    xGamesZoushi
  },
  name: 'lhc',
  data() {
    return {
      showBol: true, //封盘
      show: false,
      showLoading: false, //loading
      weishuNum: '',
      zoushibol: true,
      zoushiroad: [], //走势数据
      changinfo: false, //head menu 默认隐藏
      name: 'games', //header
      //生肖对应号码
      shengxiaos: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
      weishu: [
        [10, 20, 30, 40],
        [1, 11, 21, 31, 41],
        [2, 12, 22, 32, 42],
        [3, 13, 23, 33, 43],
        [4, 14, 24, 34, 44],
        [5, 15, 25, 35, 45],
        [6, 16, 26, 36, 46],
        [7, 17, 27, 37, 47],
        [8, 18, 28, 38, 48],
        [9, 19, 29, 39, 49]
      ],
      zodiacSign: [
        [1, 13, 25, 37, 49],
        [2, 14, 26, 38],
        [3, 15, 27, 39],
        [4, 16, 28, 40],
        [5, 17, 29, 41],
        [6, 18, 30, 42],
        [7, 19, 31, 43],
        [8, 20, 32, 44],
        [9, 21, 33, 45],
        [10, 22, 34, 46],
        [11, 23, 35, 47],
        [12, 24, 36, 48]
      ],
      //生肖对应号码显示
      zodiacSignShow: false,
      //号码球样式
      // ballstyle: "",
      checkedOffer: [], //号码选中数组
      ballOptions: 0, //注数
      amount: 2, //金额
      amounts: [],
      /**--------------------------- */
      msg: [],
      num: 0, //默认玩法
      num2: 0,

      listshow: null, //默认玩法组
      tablists: [], //一级玩法组名称
      tablistson: [], //二级玩法组名称
      tab2bol: false, //是否显示二级玩法组
      sonlistv: [], //titile-玩法
      //投注
      //玩法大组
      gamesgroup: null,
      //玩法小组
      gamesmini: null,
      //玩法
      gamesbets: [],
      //投注列表
      betLists: null,
      betListsbol: false,
      round: null, //当前投注场次
      wanfas: null, //玩法介绍
      balanM: null, //余额
      todayWin: null, //中奖
      ballswidth: ''
    }
  },
  created() {
    this.getlottoStorage()
    // this.getLottoOdds();v
  },
  filters: {
    ballfilter(el) {
      let css = ''
      if (el < 50) {
        // css= `cl-${el}`
      }
      switch (el) {
        case '蓝':
          css = 'txt blue'
          break
        case '绿':
          css = 'txt green'
          break
        case '红':
          css = 'txt red'
          break
      }

      return css
    },
    ballstyles(v) {
      switch (v) {
        case '0尾':
        case '1尾':
        case '2尾':
        case '3尾':
        case '4尾':
        case '5尾':
        case '6尾':
        case '7尾':
        case '8尾':
        case '9尾':

        case '鼠':
        case '牛':
        case '虎':
        case '兔':
        case '龙':
        case '蛇':
        case '马':
        case '羊':
        case '猴':
        case '鸡':
        case '狗':
        case '猪':
          v = 24
          break
        default:
          v = 12
          break
      }

      return v
    }
  },
  watch: {
    amounts() {
      this.betLists.map((item, index) => {
        item.pop()
        item.push(this.amounts[index]) //金额
      })
    },
    num() {
      // console.log(this.num);
      // console.log(this.ballstyle);
      this.gamesgroup = this.tablists[this.num] //玩法大组选中名称
      this.gamesmini = this.tablistson[this.num][0]
      //清空选中玩法
      this.gamesbets = []
      // console.log(this.tablistson[num]);
      this.ballOptions = 0
      this.tab2bol = this.sonlistv[this.num].length > 1
    },
    num2() {
      //this.gamesgroup=tablists[num];//玩法大组选中名称
      this.gamesmini = this.tablistson[this.num]
      //清空选中玩法
      this.gamesbets = []
      // console.log(this.gamesmini, this.gamesgroup);
      //清空选中号码
      //清空注数
      this.ballOptions = 0
    },
    checkedOffer() {
      //计算注数
      let len = this.checkedOffer.length
      switch (this.gamesbets[0]) {
        case '二全中':
        case '二中特':
        case '二连肖':
        case '二连尾':
        case '特串':

        case '二不中':
          this.ballOptions = (len * (len - 1)) / 2
          break
        case '三中二':
        case '三全中':
        case '三连肖':
        case '三连尾':

        case '三不中':
          this.ballOptions = (len * (len - 1) * (len - 2)) / 2 / 3
          break
        case '四连肖':
        case '四连尾':

        case '四不中':
          this.ballOptions = (len * (len - 1) * (len - 2) * (len - 3)) / 2 / 3 / 4
          break
        case '五连肖':
          this.ballOptions = (len * (len - 1) * (len - 2) * (len - 3) * (len - 4)) / 2 / 3 / 4 / 5
          break
        case '五不中':
          this.ballOptions = (len * (len - 1) * (len - 2) * (len - 3) * (len - 4)) / 2 / 3 / 4 / 5
          break
        case '六不中':
          this.ballOptions = (len * (len - 1) * (len - 2) * (len - 3) * (len - 4) * (len - 5)) / 2 / 3 / 4 / 5 / 6
          break
        case '七不中':
          this.ballOptions = (len * (len - 1) * (len - 2) * (len - 3) * (len - 4) * (len - 5) * (len - 6)) / 2 / 3 / 4 / 5 / 6 / 7
          break
        case '八不中':
          this.ballOptions =
            (len * (len - 1) * (len - 2) * (len - 3) * (len - 4) * (len - 5) * (len - 6) * (len - 7)) / 2 / 3 / 4 / 5 / 6 / 7 / 8
          break
        case '九不中':
          this.ballOptions =
            (len * (len - 1) * (len - 2) * (len - 3) * (len - 4) * (len - 5) * (len - 6) * (len - 7) * (len - 8)) /
            2 /
            3 /
            4 /
            5 /
            6 /
            7 /
            8 /
            9
          break
        case '十不中':
          this.ballOptions =
            (len * (len - 1) * (len - 2) * (len - 3) * (len - 4) * (len - 5) * (len - 6) * (len - 7) * (len - 8) * (len - 9)) /
            2 /
            3 /
            4 /
            5 /
            6 /
            7 /
            8 /
            9 /
            10
          break
        case '十一不中':
          this.ballOptions =
            (len * (len - 1) * (len - 2) * (len - 3) * (len - 4) * (len - 5) * (len - 6) * (len - 7) * (len - 8) * (len - 9) * (len - 10)) /
            2 /
            3 /
            4 /
            5 /
            6 /
            7 /
            8 /
            9 /
            10 /
            11
          break
        case '十二不中':
          this.ballOptions =
            (len *
              (len - 1) *
              (len - 2) *
              (len - 3) *
              (len - 4) *
              (len - 5) *
              (len - 6) *
              (len - 7) *
              (len - 8) *
              (len - 9) *
              (len - 10) *
              (len - 11)) /
            2 /
            3 /
            4 /
            5 /
            6 /
            7 /
            8 /
            9 /
            10 /
            11 /
            12
          break
        default:
          this.ballOptions = len
          break
      }
    }
  },
  computed: {
    ...mapGetters(['getChatInfo', 'getCuryear']),
    nowyear() {
      // 今年生肖计算
      return this.shengxiaos.indexOf(this.getCuryear)
    },
    weishuShow() {
      //头尾显示号码区分
      let arn = this.listshow.flatMap(e => {
        e = Object.keys(e)
        return e
      })
      this.$nextTick(() => {
        this.weishuNum = arn.indexOf('特码头')
      })
      return this.tablistson[this.num][0].includes('尾')
    }
  },

  methods: {
    countBol(bol) {
      this.showBol = !bol
    },
    //显示玩法
    wanfaShow(e) {
      console.log(e)
      this.show = true
      this.wanfas = e
    },
    //当期游戏场次
    nowroundShow(e, r, w, m) {
      this.round = e
      this.zoushiroad = r
      this.balanM = m
      this.todayWin = w
    },
    getlottoStorage() {
      if (sessionStorage.getItem('lotto' + this.$route.params.name) != null) {
        let { arrs, time } = JSON.parse(sessionStorage.getItem('lotto' + this.$route.params.name))
        let nowTime = new Date().getTime() - 600000 //过期时间十分钟
        if (time > nowTime) {
          this.getEnd(arrs)
        } else {
          sessionStorage.removeItem('lotto' + this.$route.params.name)
          this.getLottoOdds()
        }
      } else {
        this.getLottoOdds()
      }
    },
    // pasd.game="香港六合彩"
    async getLottoOdds() {
      let game = { game: this.$route.params.name }
      let { ok, msg } = await getLottoOdds(game)
      if (ok) {
        console.log(msg)

        let arrs = msg
        let data = JSON.stringify({ arrs, time: new Date().getTime() })
        sessionStorage.setItem('lotto' + this.$route.params.name, data)
        this.getEnd(arrs)
      } else {
      }
    },
    //获取数据后渲染
    getEnd(arrs) {
      let ks = []
      let vs = []
      arrs.map(e => {
        //console.log(Object.keys(e));
        ks.push(Object.keys(e)[0])
        vs.push(Object.values(e)[0])
      })

      this.tablists = ks
      let sonlist = []
      let sonlistv = []

      for (let i in vs) {
        sonlist.push(Object.keys(vs[i])) //属性
        sonlistv.push(Object.values(vs[i]))
      }
      this.sonlistv = sonlistv
      this.listshow = this.sonlistv[0][0] //默认玩法组
      this.tablistson = sonlist
      this.tab2bol = this.sonlistv[this.num].length > 1 //默认是否显示二级玩法组菜单
    },
    //header right menus
    changeright(bol) {
      
      this.$refs.gamesmenu.$el.style.display='block'
      let e = parseInt(this.$refs.gamesmenu.$el.offsetHeight)
      
      // console.log(this.$refs.gamesmenu.$el.offsetWidth);

      if (bol) {
        let i = 0
        let menutime = setInterval(() => {
          i = i - 4
          if (i >= -e) {
            this.$refs.gamesmenu.$el.style.top = i + 'px'
          } else {
            this.$refs.gamesmenu.$el.style.top = -e + 'px'
            this.$refs.gamesmenu.$el.style.display='none'
            clearInterval(menutime)
          }
        }, 10)
      } else {
        console.log('220');
        let i = -e
        let menutime = setInterval(() => {
          i = i + 4
          if (i <= 0) {
            this.$refs.gamesmenu.$el.style.top = i+ 'px'
          } else {
            this.$refs.gamesmenu.$el.style.top = 0 + 'px'
            clearInterval(menutime)
          }
        }, 10)
      }
      this.changinfo = !this.changinfo
      // console.log(this.$refs.gamesmenu.$el);
    },
    /************************************************** */
    hiddcentent(res) {
      this.zoushibol = !this.zoushibol
    },
    //玩法切换
    btntabs(e, k) {
      this.num = k
      this.num2 = 0 //玩法二组 默认值0
      this.gamesgroup = this.tablists[k] //选中玩法组名称

      //清空选中号码
      this.checkedOffer = []
      this.gamesbets = []
      this.ballOptions = 0
      this.listshow = this.sonlistv[this.num][this.num2]
    },
    /**------------------------------------- */
    sontabs(index, e) {
      // console.log(this.$refs(val));
      //玩法二组切换
      this.num2 = index
      this.gamesmini = e
      //清空选中号码
      this.checkedOffer = []
      this.ballOptions = 0
      console.log(index, e)

      this.listshow = this.sonlistv[this.num][this.num2]
    },
    /**---------------------------号码球*选号---------------------------- */
    bindPaymentOffer(item, val) {
      //玩法
      console.log(this.gamesbets)
      //玩法限制选中号码 个数/7-10-6-5
      let ballchecks = null
      switch (this.gamesbets[0]) {
        case '二全中':
        case '三中二':
        case '二中特':
        case '特串':
        case '五连肖':
          ballchecks = 7
          break
        case '三全中':
          ballchecks = 10
          break
        case '二连肖':
        case '三连肖':
        case '四连肖':
        case '四连尾':
          ballchecks = 6
          break
        case '二连尾':
        case '三连尾':
          ballchecks = 5
          break
        case '二不中':
          ballchecks = 2
          break
        case '三不中':
          ballchecks = 3
          break
        case '四不中':
          ballchecks = 4
          break
        case '五不中':
          ballchecks = 5
          break
        case '六不中':
          ballchecks = 6
          break
        case '七不中':
          ballchecks = 7
          break
        case '八不中':
          ballchecks = 8
          break
        case '九不中':
          ballchecks = 9
          break
        case '十不中':
          ballchecks = 10
          break
        case '十一不中':
          ballchecks = 11
          break
        case '十二不中':
          ballchecks = 12
          break
      }
      for (var i = 0; i < this.checkedOffer.length; i++) {
        if (this.checkedOffer[i] == item) {
          this.checkedOffer.splice(i, 1)
          this.gamesbets.splice(i, 1)
          console.log(this.checkedOffer)
          return true
        }
      }
      //选中特码
      if (!ballchecks || this.checkedOffer.length < ballchecks) {
        this.checkedOffer.push(item)
        this.gamesbets.push(val)
      } else {
        G.$dialog.alert({
          title: '此玩法最多选中' + ballchecks + '个号码'
        })

        return
      }
      console.log(this.checkedOffer)
      return false
    },
    //选中号码球样式
    paymentChecked(index) {
      for (var i = 0; i < this.checkedOffer.length; i++) {
        if (this.checkedOffer[i] == index) {
          return true
        }
      }
      return false
    },
    /**-------------------------------------------------- */
    scrollToBottom() {
      this.$nextTick(() => {
        let scrollHeight = document.body.scrollHeight
        let clientHeight = document.body.clientHeight
        if (scrollHeight > clientHeight) {
          window.scrollTo(0, scrollHeight - clientHeight)
        }
      })
    },
    /**------------------------------------------------- */
    //投注01
    onBet(e) {
      //注数大于0 可以判断
      if (this.ballOptions === 0) {
        G.$dialog.alert({
          title: '请选中正确号码'
        })
        return
      }
      // console.log(e);
      //默认选中 大组0/小组0
      this.gamesgroup = this.tablists[this.num]
      this.gamesmini = this.tablistson[this.num][this.num2]
      console.log(this.gamesgroup) //玩法组1
      console.log(this.gamesmini) //玩法组2
      console.log(this.gamesbets) //玩法name
      let arr = []
      for (let i in this.checkedOffer) {
        arr.push(Object.keys(this.checkedOffer[i])) //属性
        // s.push(Object.values(this.checkedOffer[i]));
      }
      // console.log(JSON.stringify(s));
      function flatten(arr) {
        var res = []
        for (var i = 0; i < arr.length; i++) {
          if (Array.isArray(arr[i])) {
            res = res.concat(flatten(arr[i]))
          } else {
            res.push(arr[i])
          }
        }
        return res
      }
      //生成注单
      let numarrs = flatten(arr)
      console.log(numarrs)
      //三中二-三全中-二全中-二中特-特串-二连肖-三连肖-四连肖-五连肖-二连尾-三连尾-四连尾
      /**判断多少号码为一注-*/
      let gameOptions = null
      switch (this.gamesbets[0]) {
        case '二全中':
        case '二中特':
        case '二连肖':
        case '二连尾':
        case '特串':
          gameOptions = 2
          break
        case '三中二':
        case '三全中':
        case '三连肖':
        case '三连尾':
          gameOptions = 3
          break
        case '四连肖':
        case '四连尾':
          gameOptions = 4
          break
        case '五连肖':
          gameOptions = 5
          break
        case '五不中':
          gameOptions = 5
          break
        case '六不中':
          gameOptions = 6
          break
        case '七不中':
          gameOptions = 7
          break
        case '八不中':
          gameOptions = 8
          break
        case '九不中':
          gameOptions = 9
          break
        case '十不中':
          gameOptions = 10
          break
        case '十一不中':
          gameOptions = 11
          break
        case '十二不中':
          gameOptions = 12
          break
      }
      if (gameOptions) {
        var list = numarrs
        var ret = []
        function fullPerm(list, k, m) {
          if (k == m) {
            ret.push(
              list
                .slice(0, gameOptions)
                .sort()
                .join()
            )
          } else {
            for (var i = k; i <= m; i++) {
              //swap k and i
              var t = list[k]
              list[k] = list[i]
              list[i] = t
              //recursion
              fullPerm(list, k + 1, m)
              list[i] = list[k]
              list[k] = t
            }
          }
        }
        fullPerm(list, 0, list.length - 1)
        // console.log(ret);
        function unique(ret) {
          return Array.from(new Set(ret))
        }
        numarrs = unique(ret)
      }

      let newbets = []
      let zhushu = numarrs.length
      for (let j = 0; j < zhushu; j++) {
        let newbetj = []
        newbetj.push(this.gamesgroup) //玩法大组
        newbetj.push(this.gamesmini) //玩法小组
        //如果注数>玩法数-为一种玩法
        if (zhushu > this.gamesbets.length) {
          newbetj.push(this.gamesbets[0])
        } else {
          newbetj.push(this.gamesbets[j])
        }
        newbetj.push(numarrs[j]) //号码
        console.log(newbetj)
        newbets[j] = newbetj
      }

      console.log(newbets)
      this.showLoading = true
      this.getOddsTobeConfirmed(newbets)
      // this.lottobet(newbets)
      // console.log(JSON.stringify(newbets));
    },
    async getOddsTobeConfirmed(newbets) {
      let par = {
        game: this.$route.params.name,
        // round:,
        bets: JSON.stringify(newbets)
      }
      let { ok, msg } = await getOddsTobeConfirmed(par)
      if (ok) {
        this.showLoading = false //隐藏loading
        console.log(msg)
        let arrlen = msg.length
        this.betLists = newbets
        this.amounts = []
        for (let i = 0; i < arrlen; i++) {
          this.betLists[i].push(msg[i])
          this.amounts.push(this.amount)
          this.betLists[i].push(this.amounts[i]) //金额
        }
        console.log(ok, msg)
        this.betListsbol = true
      } else {
        this.showLoading = false //隐藏loading
        console.log(ok, msg)
        G.$dialog.alert({
          title: '投注失败',
          message: msg
        })
      }
    },
    /*********** 投注 **************** */
    async lottobet() {
      this.showLoading = true //loading
      console.log(this.nowroundShow)

      let pars = {
        game: this.$route.params.name,
        round: this.round,
        bets: JSON.stringify(this.betLists)
      }
      console.log(pars)

      let { ok, msg } = await lottobet(pars)
      if (ok) {
        // console.log("投注成功");
        this.showLoading = false //隐藏loading
        this.balanM = msg.balan_m
        G.$dialog.alert({
          title: '投注成功',
          message: `点击确定继续投注`
        })
        this.betListsbol = false //隐藏投注栏
        this.btnamunt() //投注成功重置
      } else {
        this.showLoading = false //隐藏loading
        // console.log("投注失败");
        G.$dialog.alert({
          title: '投注失败',
          message: msg
        })

        console.log(msg)
      }
    },
    //取消投注
    lottoback() {
      this.betListsbol = false
    },
    /*********************投注 end *************** */
    btnamunt() {
      //重置选中号码球
      this.checkedOffer = []
      this.gamesbets = []
      this.ballOptions = 0
    }
  }
}
</script>

<style lang="scss">
.page-games-root {
  padding-bottom: 50px;
  background-color: $roomBg;
  flex: 1;
  .menu-box{
    top: 44px;
    display: block;
    position: absolute;
    overflow: hidden;
    height: 100%;
    width: 100%;
    left: 0px;
  }
  .wanfas {
    padding: 5px;
    line-height: 28px;
    .wanfatitle {
      font-size: 16px;
      color: #666;
    }
    .wanfacentent {
      font-size: 14px;
      color: #999;
    }
  }
  .locbtn {
    background: #ededed;
    display: inline-block;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-bottom: 1px solid #d7d7d7;
    border-right: 1px solid #d7d7d7;
  }
  // .changeloc100 {
  //   width: 100%;
  // }
  // .changeloc50 {
  //   width: 49.6%;
  // }
  // .changeloc30 {
  //   width: 33%;
  // }
  .zoushi {
    width: 100%;
    // background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .active {
    background: $rootColor;
    color: #fff;
    span {
      color: $white;
    }
  }
  .games-header {
    z-index: 1;
    color: $txt;
  }
  .bet-box {
    width: 100%;
    margin-top: 1px;
    position: fixed;
    background: #fff;
    // height: 100%;
    height: calc(100% - 223px);
    z-index: 1;
    border-top: 8px solid #f5f5f5;
    top: 164px;
    ul {
      width: 100%;
      float: left;
      border-right: 1px solid #d7d7d7;
      overflow: auto;
      height: 100%;
      background-color: #fff;
      li {
        border-bottom: 1px solid #d7d7d7;
        text-align: center;
      }
      span {
        line-height: 44px;
      }
    }
    .bet-content {
      width: 100%;
      height: 100%;
      float: right;
      overflow-y: auto;
      overflow-x: hidden;
      .boxs {
        width: 100%;
        // height: 100%;
        padding-bottom: 50px;
        background: $baseBgColor;
        .types {
          width: 100%;
        }
        .title {
          width: 100%;
          text-align: center;
          line-height: 45px;
          height: 45px;
          border-bottom: 1px solid $gray-d7;
          background: #ffffff;
        }
        .content-0 {
          width: 100%;
          background: $baseBgColor;
          border-bottom: 1px solid rgba(203, 203, 203, 0.88);
          // border-top: 1px solid rgba(203, 203, 203, 0.88);
          margin-bottom: -1px;
          .x-style {
            // width: 32.9%;
            // width: 49.6%;
            height: 44px;
            display: inline-block;
            background: $white;
            color: rgba(0, 0, 0, 0.8);
            border: 1px solid hsla(0, 0%, 79.6%, 0.88);
            border-top: none;
            border-left: none;
            align-items: center;
            justify-content: center;
            position: relative;

            .ball {
              // background: #fff;
              margin: 8px 5px 0;
              min-width: 28px;
              height: 28px;
              border-radius: 50%;
              text-align: center;
              line-height: 28px;
              // float: left;
              display: inline-block;
              @each $k, $v in $plan-49 {
                &.cl-#{$k} {
                  // background: $v;
                  border: 1px solid $v;
                }
              }
            }

            .sx-ball {
              margin: 8px 5px 0;
              min-width: 28px;
              height: 28px;
              border-radius: 50%;
              text-align: center;
              line-height: 28px;
              float: left;
              @each $k, $v in $plan-49 {
                &.cl-#{$k} {
                  // background: $v;
                  border: 1px solid $v;
                }
              }
            }
            .txt {
              line-height: 44px;
              font-size: 14px;
              display: contents;
            }
          }
          .van-col--12 {
            text-align: center;
          }
          .checked {
            background: $baseBgColor;
            box-shadow: inset 0px 0px 3px 0px $gray-d7;
            .xIcon-games-checked {
              width: 16px;
              height: 16px;
              position: absolute;
              bottom: 0;
              right: 0;
              background-size: contain;
              background-repeat: no-repeat;
            }

            .ball {
              color: $white;
              @each $k, $v in $plan-49 {
                &.cl-#{$k} {
                  background: $v;
                  // border: 1px solid $v;
                }
              }
            }

            .sx-ball {
              color: $white;
              @each $k, $v in $plan-49 {
                &.cl-#{$k} {
                  background: $v;
                  color: #fff;
                  // border: 1px solid $v;
                }
              }
            }
            .txt {
              color: $rootColor;
            }
          }
          .x-50 {
            width: 49.6%;
          }
          .checked.x-50 .ball {
            color: #fff;
          }
          .checked .tit {
            color: #000;
          }
          .red {
            color: #ec293c !important;
          }
          .green {
            color: #20bf55 !important;
          }
          .blue {
            color: #2993ec !important;
          }
        }
      }
    }
  }
  .betLists {
    position: fixed;
    background-attachment: fixed;
    background: #fff;
    border-top: 1px solid #ec2d40;
    width: 100%;
    bottom: 0;
    z-index: 10;
    // max-height: 220px;
    overflow-y: auto;
    padding-bottom: 47px;
    .betlistbottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      background: #fff;
      border-top: 1px solid #d7d7d7;
      height: 46px;
      div {
        width: 40%;
        display: inline-table;
        margin: 5px 5%;
        border-radius: 5px;
        text-align: center;
        color: #fff;
        line-height: 36px;
      }
      .listleft {
        background: #dedede;
      }
      .list-btn {
        background: #ec2d40;
      }
    }
    .list {
      padding: 5px;
      border-bottom: 1px solid #f5f5f5;
      line-height: 30px;
      display: flow-root;
      .listname {
        float: left;
      }
      .listhaoma {
        float: left;
      }
      .listpeilv {
        margin: 0 5px;
        color: $rootColor;
        float: left;
      }
      .listinput {
        float: right;
        line-height: 30px;
        width: 80px;
        text-align: center;
      }
    }
  }
  .footer {
    height: 50px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    border-top: 1px solid $gray-d7;
    z-index: 2;
    background-color: $baseBgColor;
    .footer-title {
      width: 100%;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      padding: 0 15px;
      position: absolute;
      background: #d7d7d7;
      top: -28px;
    }
    .amuntbox {
      height: 34px;
      margin: 0 10px;

      .inputamunt {
        width: 165px;
        height: 34px;
        float: left;
        border: none;
        padding: 0 5px;
      }
      .btnamunt {
        background: #d7d7d7;
        height: 34px;
        float: left;
        width: 50px;
        line-height: 34px;
        text-align: center;
      }
    }

    .btn {
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 34px;
      background: #ec2d40;
      color: #fff;
      border-radius: 5px;
      margin-right: 10px;
      &:active {
        border-radius: 3px;
        background-color: rgba($color: #000000, $alpha: 0.1);
      }
      &.send {
        padding: 0 10px;
      }
    }
    .van-field {
      padding: 5px 0;
      border-radius: 17px;
      background-color: $baseBgColor;
      .van-field__control {
        padding: 0 10px;
      }
    }
  }

  .van-loading__circular circle {
    stroke-width: 5px;
  }
  .van-loading {
    width: 40px;
    height: 40px;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
  }
  .load_cover {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
  }
  .fengpanbg {
    position: fixed;
    height: 50px;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    bottom: 0;
    width: 100%;
    line-height: 50px;
    color: #fff;
    text-align: center;
  }
  .menu-vant {
    top: 44px;
  }
  .games-head-vant {
    height: 204px;
  }
  .bet-box-vant {
    top: 164px;
    z-index: 1;
  }
}
</style>
