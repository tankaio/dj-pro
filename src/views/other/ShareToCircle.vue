<template>
  <!-- <div class="page-ShareToCircle-root"></div> -->
  <x-layout modifier="ShareToCircle" main-center-color="#fff">
    <x-header left-text="取消" :left-arrow="false" @click-right="onClickHeaderRight" slot="header">
      <span>
        发表
      </span>
    </x-header>

    <van-field v-model="text" type="textarea" placeholder="分享你的心得..." />
    <x-issue-item
      v-bind="{
        state: true,
        ad: planInfo.bettype,
        planname: planInfo.title,
        type: 'grade',
        tag: planInfo.betrgn,
        integral: Number(planInfo.cost),
        looks: Number(planInfo.viewtimes),
        sum: Number(planInfo.sum),
        s: Number(planInfo.win),
        f: Number(planInfo.sum) - Number(planInfo.win),
        wintimes: Number(planInfo.wintimes)
      }"
    >
      <span class="red">
        {{ Number(planInfo.sum) ? parseFloat((planInfo.win / planInfo.sum) * 100).toFixed(2) + '%' : '0%' }}
      </span>
    </x-issue-item>

    <!-- <van-cell
      class="van-hairline--top-bottom"
      title="谁可以看"
      value="公开"
      is-link
      :to="{
        path: '/setShareToCircleAuth',
        query: {
          t: planInfo.title
        }
      }"
    /> -->
  </x-layout>
</template>

<script>
import { PublishMoment } from '@/api/circle.js'
import xHeader from 'cpt/x-header.vue'
import xIssueItem from 'cpt/x-issue-item.vue'
export default {
  components: {
    xHeader,
    xIssueItem
  },
  name: 'ShareToCircle',
  data() {
    return {
      planInfo: {},
      text: ''
    }
  },
  methods: {
    async onClickHeaderRight() {
      let { ok, msg } = await PublishMoment({
        text: this.text,
        plan: this.planInfo.title,
        picture: ''
      })
      if (ok) {
        this.$notify({
          type: 'success',
          message: '发布成功'
        })
        this.$router.replace('/circle')
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      vm.planInfo = to.query
    })
  }
}
</script>

<style lang="scss">
.page-ShareToCircle-root {
  .x-issue-item {
    padding: 0 15px;
    background-color: #fff;
    border-radius: 2.5px;
    margin-top: 10px;
    .bar,
    .grade-plan .tag-bar .tag::after {
      background-color: #eeeeee;
    }
    .cont {
      padding: 5px 0;
    }
  }
  .red {
    color: $rootColor;
  }
  .grade {
    position: relative;
    &::after {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid #d7d7d7;
      transform: rotateX(45deg);
    }
    > span:last-child {
      display: none;
    }
  }
  .van-cell__value {
    color: $txt;
  }
  .van-cell {
    margin-top: 10px;
  }
}
</style>
