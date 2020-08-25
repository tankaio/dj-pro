<template>
  <x-layout modifier="chat">
    <x-header :is-right="false" :left-arrow="false" slot="header" />
    <div class="swipper-bar">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in banner" @click="onJumpClick(item.jump_url, item.jump)" :key="index">
          <x-img :lazy="false" class="swipe-img" :src="item.pic" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-tabs v-model="active" animated>
      <van-tab title="购彩交流群">
        <x-nodata :data-s="lottoroom" desc="" tip="暂无购彩聊天群" bg />
        <van-cell v-for="(item, index) in lottoroom" :key="index" :title="item.title" :label="item.announce" @click="inRoom(item, 'lottery')">
          <x-img :src="item.ico" class="avatar" slot="icon" dft />
        </van-cell>
      </van-tab>
      <van-tab title="红包交流群">
        <x-nodata :data-s="fuliroom" desc="" tip="暂无红包交流群" bg />
        <van-cell v-for="(item, index) in fuliroom" :key="index" :title="item.title" :label="item.announce" @click="inRoom(item, 'red')">
          <x-img :src="item.ico" class="avatar" slot="icon" dft />
        </van-cell>
      </van-tab>
      <template #nav-right>
        <div class="searchBar" @click="$router.push('/chat/search')">
          <van-icon name="search" />
        </div>
      </template>
    </van-tabs>
  </x-layout>
  <!-- <x-page isFooter active="2" rootClass="chat" closeBack>
   
  </x-page> -->
</template>

<script>
import { GetChatLobbyInfo, EnterRoom } from '@/api/chat'
import { mapGetters, mapMutations } from 'vuex'
import { inRoom } from '@/utils/Auth'

import xPage from 'cpt/x-page.vue'
import xImg from 'cpt/x-img.vue'
import xHeader from 'cpt/x-header.vue'
import xNodata from 'cpt/x-nodata.vue'

export default {
  components: {
    xPage,
    xImg,
    xHeader,
    xNodata
  },
  name: 'chat-page',
  data() {
    return {
      active: 0,
      banner: [],
      lottoroom: [],
      fuliroom: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getRid'])
  },
  methods: {
    ...mapMutations(['setChatInfo']),
    onJumpClick(url, type) {
      switch (type) {
        case 0:
          break
        case 1:
          window.location.href = url
          break
        case 2:
          this.$router.push('/manito')
          break
        case 3:
          this.$router.push('/combo')
          break
        case 4:
          this.$router.push('/winRate')
          break
        case 5:
          this.$router.push('/champion')
          break
        case 6:
          this.$router.push('/activity')
          break
        default:
          break
      }
    },
    // 获取聊天室总大厅信息
    async GetChatLobbyInfo() {
      let { ok, msg } = await GetChatLobbyInfo()
      if (ok) {
        let getData = G.curry(G.get)(msg)
        this.banner = getData('banner', [])
        this.lottoroom = getData('lottoroom', [])
        this.fuliroom = getData('fuliroom', [])
        ls('search_lotto', getData('search_lotto', []))
        ls('search_fuli', getData('search_fuli', []))
      }
    },
    async inRoom(item, type) {
      if (this.userInfo.guest) {
        G.$dialog
          .alert({
            title: '请登录',
            message: '需要登录后才可以查看'
          })
          .then(() => {
            this.$router.push('/sign')
          })
          .catch(G.zero)
        return
      } else {
        let inRoomApi = async () => {
          let { ok, msg } = await EnterRoom({
            rid: item.rid
          })
          if (ok) {
            this.setChatInfo(item)
            this.$router.push(`/chat/room/${type}/${item.rid}`)
          }
        }
        inRoom({
          type,
          rid: item.rid
        }).then(res => {
          if (res) {
            inRoomApi()
          } else {
            this.$router.push(`/chat/room/${type}/${item.rid}`)
          }
        })
      }
    }
  },
  created() {
    this.GetChatLobbyInfo()
  }
}
</script>

<style lang="scss">
.page-chat-root {
  .swipper-bar {
    max-width: 99.9999vw;
  }
  .swipe-img {
    max-width: 99.9999vw;
    min-width: 99.9999vw;
    display: block;
    height: 150px;
    font-size: 0;
    pointer-events: unset;
    object-fit: cover;
  }
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    margin-right: 10px;
  }
  .xt-tab {
    background-color: $white;
    font-size: 15px;
    color: $txt;
    .active {
      color: $rootColor;
    }
  }
  .van-swipe-item {
    min-height: 140px;
    max-width: 99.9999vw;
    min-width: 99.9999vw;
  }
  .searchBar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    &::after {
      display: block;
      position: absolute;
      content: '';
      border-left: 1px solid $gray-d7;
      top: 20%;
      bottom: 20%;
      left: 0;
    }
  }
}
</style>
