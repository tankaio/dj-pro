<template>
  <x-layout modifier="fans" @load="GetFans(true)" v-model="mvvm" is-bottom main-center-color="#fff" :main-top="88">
    <template #header>
      <x-header :is-right="false" :center-text="title" />
      <div class="searchBar">
        <van-search placeholder="搜索用户名" v-model="search" clearable background="#f7f8fa" />
        <!-- <van-field></van-field> -->
        <van-button size="small" type="danger" :disabled="search === ''" @click="SearchMyFans">搜索</van-button>
      </div>
    </template>
    <transition :enter-active-class="'bounceInUp animated faster'" :leave-active-class="'bounceOutDown animated faster'">
      <div v-if="search !== ''" class="searchList">
        <x-manito-item
          v-for="(item, index) in search_list"
          :key="item.id"
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
    </transition>
    <x-list v-model="loading" :finished="finished" :error.sync="error" @load="GetFans(true)">
      <x-nodata :data-s="list" desc="" bg bg-color="transparent">
        <div class="desc">您还没有粉丝哦！快去邀请好友提升自己的曝光率！</div>
        <div class="selectBar">
          <van-button plain round type="danger" @click="$router.push('/manito')">大神榜</van-button>
          <van-button plain round type="danger" @click="$router.push('/circle')">晒单圈</van-button>
          <van-button plain round type="danger" @click="$router.push('/toutiao')">六合图库</van-button>
          <van-button plain round type="danger" @click="$router.push('/toutiao')">六合头条</van-button>
        </div>
      </x-nodata>
      <x-manito-item
        v-for="(item, index) in list"
        :key="index"
        @follow="onFollowBtnClick(item, index)"
        :url="`/userInfo/userInfoPlan/?nick=${item.nick}&id=${item.id}`"
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
          followRelation: item.isfollowhim ? 2 : 1
        }"
      />
    </x-list>
  </x-layout>
</template>

<script>
import { GetFans, FollowSomebody, SearchMyFans } from '@/api/user'

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
      title: '我的粉丝',
      nick: ''
    }
  },
  methods: {
    async GetFans(scroll) {
      let { ok, msg } = await GetFans({
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
    async onFollowBtnClick(item, idx) {
      let { ok, msg } = await FollowSomebody({
        nick: item.nick,
        follow: !item.isfollowhim
      })
      if (ok) {
        let isfollowhim = !item.isfollowhim // isfollowhim == 0 未关注 == 1 已关注
        this.$set(this.list[idx], 'isfollowhim', isfollowhim)
      }
    },
    async SearchMyFans() {
      let { ok, msg } = await SearchMyFans({
        nick: this.search
      })
      if (ok) {
        this.search_list = msg || []
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      let nick = to.params.nick
      if (nick) {
        vm.nick = nick
        vm.title = '他的粉丝'
      }
      vm.GetFans()
    })
  }
}
</script>

<style lang="scss">
.page-fans-root {
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
