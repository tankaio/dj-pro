<template>
  <div class="x-carousal">
    <div class="xc-header">
      <van-button :class="{ active: state === 0 }" @click="state = 0">
        <!-- $router.push('/user/makeMoney') -->
        分享赚钱
        <span :class="[state === 0 ? 'xIcon-home-money-white' : 'xIcon-home-money']"></span>
      </van-button>
      <van-button :class="{ active: state === 1 }" @click="state = 1">
        <!-- $router.push('/publish') -->
        计划赚钱
        <span :class="[state === 1 ? 'xIcon-home-money-white' : 'xIcon-home-money']"></span>
      </van-button>
    </div>
    <div class="xc-body">
      <div
        class="xc-container"
        :style="{
          transitionDuration: `${duration}ms`,
          minHeight: `500px`,
          transform: `translateY(-${middle_index * 40}px)`
        }"
      >
        <div
          class="xc-item van-hairline--bottom"
          v-for="item in items"
          :key="item.key"
          :style="`transform: translateY(${item.key * 40}px)`"
        >
          展现 通过
          {{ state ? '计划' : '分享' }}
          赚得
          <i class="red">{{ item.val }}</i>
        </div>
      </div>
    </div>
    <div class="xc-footer" @click="onClickFooter" v-if="!userInfo.guest">
      {{ state ? '发布计划赚钱' : 'APP分享赚钱' }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
let idx = 0
export default {
  name: 'x-carousal',
  data() {
    return {
      middle_index: 0,
      share_list: [],
      plan_list: [],
      state: 0,
      duration: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    items() {
      return this.state ? this.plan_list : this.share_list
    }
  },
  methods: {
    onClickFooter() {
      if (this.state) {
        if (this.userInfo.level === 1) {
          this.$router.push('/publish')
        } else {
          this.$router.push('/user/special')
        }
      } else {
        this.$router.push('/user/makeMoney')
      }
    },
    initItems(data) {
      let container = []
      data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      data.forEach((ele, index) => {
        container.push({
          key: index,
          val: Math.floor(Math.random() * 100).toFixed(2)
        })
        idx = index
      })
      this.share_list = container
      this.animateRun()
    },
    animateRun() {
      clearInterval(this.timer)

      this.timer = setInterval(() => {
        idx += 1
        this.duration = 500
        this.share_list.push({
          key: idx,
          val: Math.floor(Math.random() * 100).toFixed(2)
        })

        this.middle_index++

        G.delay(() => {
          this.share_list.shift()
        }, 8000)
      }, 2000)
    }
  },
  mounted() {
    this.initItems()
    G.$on('page-hidden', () => {
      idx = 0
      this.middle_index = 2
      clearInterval(this.timer)
    })
    G.$on('page-visible', () => {
      idx = 0
      this.middle_index = 2
      this.initItems()
    })
  },
  destroyed() {
    clearInterval(this.timer)
  },
  created() {
    idx = 0
    this.middle_index = 0
  },
  watch: {
    state() {
      this.duration = 0
      clearInterval(this.timer)
      idx = 0
      this.middle_index = 2
      this.initItems()
    }
  }
}
</script>

<style lang="scss">
.x-carousal {
  border-radius: 5px;
  overflow: hidden;
  .xc-header {
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: $white;
    font-size: 15px;
    display: flex;
    .van-button {
      background-color: #ffe5e7;
      color: $rootColor;
      flex: 1;
      font-size: 15px;
      border: none;
      height: 40px;
      .van-button__text{
        display: flex;
        align-items: center;
        justify-content: center;
        span{
          margin-left: 5px;
        }
      }
      &.active {
        background-color: $rootColor;
        color: $white;
      }
    }
  }
  .xc-body {
    overflow: hidden;
    /* prettier-ignore */
    height: 200PX;
  }
  .xc-container {
    position: relative;
    .xc-item {
      width: 100%;
      /* prettier-ignore */
      height: 40PX;
      /* prettier-ignore */
      line-height: 40PX;
      transform: translateY(-9999px);
      position: absolute;
      background-color: #f5f5f5;
      font-size: 15px;
      text-align: center;
      .red {
        color: $rootColor;
      }
    }
  }
  .xc-footer {
    overflow: hidden;
    height: 40px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    line-height: 40px;
    background-color: $rootColor;
    color: $white;
  }
}
</style>
