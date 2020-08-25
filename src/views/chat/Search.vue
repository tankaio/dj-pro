<template>
  <!-- <div class="page-search-root"></div> -->
  <x-layout modifier="search" main-center-color="#fff">
    <van-nav-bar right-text="取消" @click-right="roomname = ''" @click-left="$router.go(-1)" left-arrow fixed slot="header">
      <van-search slot="title" shape="round" background="#EC293C" placeholder="搜索群名" v-model="roomname" @input="preDeal(-1)"></van-search>
    </van-nav-bar>
    <template v-if="roomname">
      <div class="roomList" v-if="lt_list.length">
        <van-panel title="购彩交流群">
          <template v-for="(item, index) in lt_list">
            <van-cell @click="inRoom(item, 'lottery')" v-if="index < 3" :key="index" :label="item.notice">
              <span slot="title">{{ item.roomname }}</span>
              <x-img :src="item.ico" class="avatar" slot="icon" dft />
            </van-cell>
          </template>

          <van-cell class="more" title="更多购彩交流群" is-link :to="`/chat/searchMore/lottery/${roomname}`" />
        </van-panel>
      </div>
      <div class="roomList" v-if="fl_list.length">
        <van-panel title="红包游戏群">
          <template v-for="(item, index) in fl_list">
            <van-cell @click="inRoom(item, 'red')" v-if="index < 3" :key="index" :label="item.notice">
              <span slot="title">{{ item.roomname }}</span>
              <x-img :src="item.ico" class="avatar" slot="icon" dft />
            </van-cell>
          </template>

          <van-cell class="more" title="更多红包游戏群" is-link :to="`/chat/searchMore/red/${roomname}`" />
        </van-panel>
      </div>
      <x-nodata v-if="noSearchData" bg tip="未找到房间" :data-s="[]" />
    </template>
    <template v-else>
      <div class="quickSelect">
        <div class="qsCard">
          <div class="tit">按彩种搜索</div>
          <div class="container">
            <span class="item" @click="preDeal(0, item)" v-for="(item, index) in lt_type" :key="index">
              {{ item }}
            </span>
          </div>
        </div>
        <div class="qsCard">
          <div class="tit">按红包游戏搜索</div>
          <div class="container">
            <span class="item" @click="preDeal(1, item)" v-for="(item, index) in fl_type" :key="index">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </x-layout>
</template>

<script>
import { GetChatRooms, EnterRoom } from '@/api/chat'
import { mapMutations } from 'vuex'
import xImg from 'cpt/x-img.vue'
import xNodata from 'cpt/x-nodata.vue'
export default {
  components: { xImg, xNodata },
  data() {
    return {
      more: true,
      lt_type: [],
      fl_type: [],
      lt_list: [],
      fl_list: [],
      startind: 0,
      type: -1,
      roomname: ''
    }
  },
  computed: {
    noSearchData() {
      if (this.lt_list.length === 0 && this.fl_list.length === 0) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapMutations(['setChatInfo']),
    async GetChatRooms() {
      let params = {
        startind: 0,
        roomname: this.roomname,
        roomtype: this.type
      }
      let { ok, msg } = await GetChatRooms(params)
      if (ok) {
        this.lt_list = G.get(msg, 'list1', [])
        this.fl_list = G.get(msg, 'list2', [])
      }
    },
    async inRoom(item, type) {
      let { ok, msg } = await EnterRoom({
        rid: item.id
      })
      if (ok) {
        this.setChatInfo(item)
        this.$router.push(`/chat/room/${type}/${item.id}`)
      }
    },
    preDeal(type, name) {
      if (name) {
        this.type = type
        this.roomname = name
        this.GetChatRooms()
      } else if (this.roomname !== '') {
        this.type = type
        this.debounce_search()
      }
    }
  },
  created() {
    this.lt_type = ls('search_lotto')
    this.fl_type = ls('search_fuli')
    this.debounce_search = G.debounce(() => {
      this.GetChatRooms()
    }, 500)
  }
}
</script>

<style lang="scss">
.page-search-root {
  .van-search {
    padding: 5px 12px;
    .van-icon {
      color: $gray-d7;
    }
  }
  .van-nav-bar {
    height: 44px;
    background-color: $rootColor;
    .van-nav-bar__title {
      max-width: 280px;
      .van-search {
        padding-left: 5px;
        padding-right: 5px;
      }
    }
    .van-nav-bar__arrow,
    .van-nav-bar__text {
      color: $white;
    }
    .van-nav-bar__text:active {
      background-color: unset;
    }
  }
  .quickSelect {
    .qsCard {
      padding: 18px 15px;
      .tit {
        font-size: 15px;
        color: $txt;
      }
      .container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        > * {
          //   margin-right: 15px;
          min-width: 75px;
          height: 24px;
          line-height: 24px;
          background-color: $baseBgColor;
          font-size: 13px;
          text-align: center;
          margin-bottom: 10px;
          margin-right: 10px;
        }
      }
    }
  }
  .roomList {
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 5px;
      margin-right: 10px;
    }
    .more {
      .van-cell__title {
        color: $rootColor;
      }
    }
  }
}
</style>
