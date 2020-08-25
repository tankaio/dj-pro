<template>
  <!-- <x-page rootClass="myFriends" :class="{ footer: friends }" isRight></x-page> -->
  <x-layout modifier="myFriends" :main-top="102">
    <template #header>
      <x-header>
        <van-icon name="question-o" />
      </x-header>
      <div class="searchBar">
        <van-search clearable v-model="search_name" placeholder="搜索用户名" />
        <van-button type="danger" :disabled="search_name === ''" @click="GetMyChildByNick">搜索</van-button>
      </div>
    </template>
    <div class="searchList" v-if="search_name !== ''">
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
          search: search_name
        }"
      />
    </div>
    <div class="main">
      <template v-if="friends">
        <x-list :loading="loading" :finished="finished" :error.sync="error" @load="GetAllMyChild">
          <x-userpanel
            v-for="(item, index) in friend_list"
            :key="index"
            v-bind="{
              avatar: item.ico,
              username: item.nick,
              gender: item.sex,
              expert: item.level === 1,
              fans: item.fans,
              follow: item.follow,
              newplan: item.newplan
            }"
          >
            <template #btm>
              <span>绑定时间：{{ item.birth }}</span>
            </template>
          </x-userpanel>
        </x-list>
      </template>
      <template v-else>
        <div class="noFriend">
          <div class="tit">您还没有助力伙伴</div>
          <van-button type="danger" @click="onWelcomeFriendClick">邀请伙伴</van-button>
        </div>
      </template>
    </div>
    <div slot="bottom" class="footer">我的助力伙伴：{{ num }} 人</div>
  </x-layout>
</template>

<script>
import { GetAllMyChild } from '@/api/user'
import { mapGetters } from 'vuex'

import xPage from 'cpt/x-page.vue'
import xFixed from 'cpt/x-fixed.vue'
import xManitoItem from 'cpt/x-manito-item.vue'
import xList from 'cpt/x-list/x-list.vue'
import xUserpanel from 'cpt/x-userpanel.vue'

export default {
  components: {
    xPage,
    xFixed,
    xManitoItem,
    xList,
    xUserpanel
  },
  data() {
    return {
      friends: false,
      startind: 0,

      loading: false,
      finished: false,
      error: false,
      friend_list: [],
      search_list: [],

      search_name: '',

      num: 0
    }
  },
  methods: {
    async GetMyChildByNick() {
      let { ok, msg } = await GetAllMyChild({
        startind: this.search_list.length,
        nick: this.search_name
      })
      if (ok) {
        this.search_list = msg.list || []
      }
    },
    async GetAllMyChild() {
      let { ok, msg } = await GetAllMyChild({
        startind: this.friend_list.length,
        keystr: this.search_name
      })
      if (ok) {
        let list = G.get(msg, 'list', [])
        this.friend_list.push.apply(this.friend_list, list)
        this.num = G.get(msg, 'sum', 0)
        if (list.length === 0) this.finished = true
      } else {
        this.error = true
      }
      if (this.friend_list.length) {
        this.friends = true
      }
      this.loading = false
    },
    onWelcomeFriendClick() {
      G.$dialog
        .confirm({
          title: '提醒',
          message: '复制并分享邀请码',
          confirmButtonText: '复制邀请码'
        })
        .then(() => {
          $clip('.van-dialog__confirm', this.getAg.agid)
            .then(() => {
              this.$notify({
                type: 'success',
                message: '邀请码已复制'
              })
            })
            .catch(() => {
              this.$notify('复制失败')
            })
        })
        .catch(() => {})
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getAg'])
  },
  created() {
    this.GetAllMyChild()
  }
}
</script>

<style lang="scss">
.page-myFriends-root {
  display: flex;
  flex-direction: column;
  background-color: $white;
  .van-icon-question-o {
    font-size: 20px;
    color: $white;
  }
  .searchBar {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0 0 10px 20px;
    background-color: $rootColor;
    .van-search {
      padding: 0 12px;
      height: 34px;
      width: 300px;
      border-radius: 2.5px;
      border: 1px solid $rootColor;
      .van-cell {
        display: flex;
        align-items: center;
        padding: 0;
        height: 34px;
        overflow: hidden;
        .van-field__left-icon {
          overflow: hidden;
        }
      }
      .van-search__content {
        height: 34px;
        background-color: transparent;
      }
    }
    .van-button {
      height: 34px;
      line-height: 34px;
      .van-button__text {
        white-space: nowrap;
      }
    }
  }
  .searchList {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 102px;
    background-color: #fff;
    padding: 0 10px;
  }
  .main {
    flex: 1;
    position: relative;
    height: 100%;
    &::after {
      content: '';
      display: block;
      clear: both;
    }
    .noFriend {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      text-align: center;
      .tit {
        text-align: center;
        font-size: 14px;
        color: $txt;
      }
      .van-button {
        height: 34px;
        width: 138px;
        line-height: 34px;
        margin-top: 12px;
        border-radius: 2.5px;
      }
    }
  }
  .xp-bottom {
    font-size: 12px;
    color: $txt;
  }
  &.footer {
    padding-bottom: 44px;
  }
  .footer {
    font-size: 15px;
    color: $rootColor;
    text-align: center;
    height: 44px;
    text-align: center;
    line-height: 44px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $white;
    box-shadow: 0 -1px 4px 0 rgba($color: #000000, $alpha: 0.2);
  }
}
</style>
