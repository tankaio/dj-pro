<template>
  <x-layout modifier="follow" v-model="mvvm" @load="GetFollows(true)" is-bottom main-center-color="#fff" :main-top="88">
    <template #header>
      <x-header :is-right="false" :center-text="title" />
      <div class="searchBar">
        <van-search v-model="search" placeholder="搜索用户名" clearable background="#f7f8fa" />
        <van-button size="small" type="danger" :disabled="search === ''" @click="SearchMyFollows">搜索</van-button>
      </div>
    </template>
    <div v-if="search !== ''" class="searchList">
      <x-manito-item
        v-for="(item, index) in search_list"
        :key="index"
        :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
        @follow="FollowSomebody(item, index)"
        v-bind="{
          type: 'search',
          avatar: item.ico,
          username: item.nick,
          gender: item.sex === 1 ? 'male' : 'female',
          professor: item.level,
          fans: item.fans,
          follow: item.follow,
          search: search
        }"
      />
    </div>
    <x-nodata :data-s="list" desc="" bg bg-color="transparent">
      <div class="desc">您还没有关注任何人！汲人所长才能常胜连赢！</div>
      <div class="selectBar">
        <van-button plain round type="danger" @click="$router.push('/publish')">发布计划</van-button>
        <van-button plain round type="danger" @click="$router.push('/toutiao/toutiaoEdit')">发布头条</van-button>
        <van-button plain round type="danger" @click="$router.push('/toutiao')">发布图解</van-button>
        <van-button plain round type="danger" @click="$router.push('/circle/dryingrelease')">发布晒单</van-button>
      </div>
    </x-nodata>
    <x-manito-item
      v-for="(item, index) in list"
      :key="index"
      :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
      @follow="FollowSomebody(item, index)"
      v-bind="{
        type,
        avatar: item.ico,
        username: item.nick,
        gender: item.sex === 1 ? 'male' : 'female',
        professor: item.level,
        all: item.sum,
        s: item.win,
        fans: item.fans,
        follow: item.follow,
        followRelation: 3
      }"
    />
    <!-- <x-list v-model="loading" :finished="finished" :error.sync="error" @load="GetFollows(true)"> </x-list> -->
  </x-layout>
  <!-- <div class="page-follow-root">
    
  </div>-->
</template>

<script>
import { GetFollows, FollowSomebody, SearchMyFollows } from '@/api/user'

import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'
import xManitoItem from 'cpt/x-manito-item.vue'
import xList from 'cpt/x-list/x-list.vue'
import xNodata from 'cpt/x-nodata.vue'

export default {
  components: {
    xHeader,
    xFixed,
    xManitoItem,
    xList,
    xNodata
  },
  data() {
    return {
      mvvm: '',
      search: '',
      type: 'professor',
      loading: false,
      finished: false,
      error: false,
      startind: 0,
      list: [],
      search_list: [],
      title: '我的关注',
      nick: ''
    }
  },
  methods: {
    async GetFollows(scroll) {
      let { ok, msg } = await GetFollows({
        startind: this.list.length,
        nick: this.nick
      })
      if (ok) {
        this.list.push.apply(this.list, msg)
        this.loading = false
        if (!msg.length && scroll) this.mvvm = 'finish'
      } else {
        this.error = true
      }
    },
    async FollowSomebody(item, idx) {
      let { ok, msg } = await FollowSomebody({
        nick: item.nick,
        follow: false
      })
      if (ok) {
        this.list.splice(idx, 1)
      }
    },
    async SearchMyFollows() {
      let { ok, msg } = await SearchMyFollows({
        nick: this.search
      })
      if (ok) {
        this.search_list = msg || []
      }
    }
  },
  watch: {
    search() {
      if (this.search !== '') {
        this.type = 'search'
      } else {
        this.type = 'professor'
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      let nick = to.params.nick
      if (nick) {
        vm.nick = nick
        vm.title = '他的关注'
      }
      vm.GetFollows()
    })
  }
}
</script>

<style lang="scss">
.page-follow-root {
  background-color: $white;
  .searchBar {
    display: flex;
    padding: 0 0 10px 15px;
    align-items: center;
    background-color: $rootColor;
    .van-search {
      flex: 1;
      height: 34px;
      background-color: #f7f8fa;
    }
    .van-button {
      width: 65px;
    }
    .van-button__text {
      font-size: 15px;
    }
  }
  .searchList {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 88px;
    background-color: #fff;
    padding: 0 10px;
    z-index: 10;
  }
  .x-nodata {
    .desc {
      margin: 22px 0 60px;
      text-align: center;
    }
    .selectBar {
      display: flex;
      flex-wrap: wrap;
      padding: 0 44px;
      justify-content: space-between;
      > * {
        width: 110px;
        height: 34px;
        line-height: 34px;
        margin-bottom: 40px;
        &:nth-child(2n-1) {
          margin-right: 66px;
        }
      }
    }
  }
}
</style>
