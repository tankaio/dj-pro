<template>
  <div class="x-hotrecommended gray-8">
    <div class="xh-main">
      <div class="xh-tit">
        热门推荐
      </div>
      <div class="xh-container">
        <div class="xh-item" v-for="(item, index) in list" :key="index" @click="onClick(item)">
          <span class="xh-icon" :class="item | xhIcon" />
          <div class="xh-item-tit">{{ item.title }}</div>
          <div class="xh-item-desc">{{ item.remark }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EnterRoom } from '@/api/chat'
import { mapGetters, mapMutations } from 'vuex'
import { inRoom } from '@/utils/Auth'
export default {
  props: ['list'],
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations(['setChatInfo']),
    async onClick(item) {
      let url = ''

      switch (item.type) {
        case 'game': // 彩票
          this.$router.push(`/games/lhc/${item.gnick}`)
          break
        case 'chat-c': // 购彩交流群
          inRoom({
            type: 'lottery',
            rid: item.id
          }).then(async res => {
            if (res) {
              let { ok, msg } = await EnterRoom({ rid: item.id })
              this.setChatInfo({
                game: item.gnick
              })
              if (ok) {
                this.$router.push(`/chat/room/lottery/${item.id}`)
              }
            } else {
              this.$router.push(`/chat/room/lottery/${item.id}`)
            }
          })

          break
        case 'chat-f': // 红包房
          this.$router.push(`/chat/room/red/${item.id}`)
          break
        case 'news': // 头条
          this.$router.push('/toutiao')
          break
        case 'mome': // 晒单圈
          this.$router.push(`/userInfo/userInfoCircle/?id=${this.userInfo.id}&nick=${this.userInfo.nick}`)
          break
        default:
          break
      }
    }
  },
  filters: {
    xhIcon(item) {
      let icon_map = {
        香港六合彩: 'liuhe-xg'
      }
      if (item.type !== 'game') {
        return `xIcon-${item.type}-hotrecommended`
      } else {
        return `xIcon-${icon_map[item.title]}-hotrecommended`
      }
    }
  }
}
</script>

<style lang="scss">
.x-hotrecommended {
  .xh-main {
    padding: 10px 15px;
    background-color: $white;
  }
  .xh-tit {
    padding-bottom: 10px;
    font-size: 17px;
    font-weight: 600;
  }
  .xh-container {
    display: flex;
    flex-wrap: wrap;
  }
  .xh-item {
    width: 25%;
    text-align: center;
    margin-top: 5px;
  }
  .xh-icon {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
  .xh-item-tit {
    text-align: center;
    font-size: 13px;
    color: $txt;
    margin-top: 5px;
  }
  .xh-item-desc {
    font-size: 11px;
    color: $gray-99;
    text-align: center;
    margin-top: 3.5px;
  }
}
</style>
