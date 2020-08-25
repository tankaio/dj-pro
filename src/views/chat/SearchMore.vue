<template>
  <div class="page-SearchMore-root">
    <van-nav-bar right-text="取消" @click-right="search = ''" @click-left="$router.go(-1)" left-arrow fixed>
      <van-search slot="title" shape="round" background="#EC293C" placeholder="搜索群名" v-model="search"></van-search>
    </van-nav-bar>
    <div class="roomList">
      <van-panel :title="title">
        <template v-for="(item, index) in 10">
          <van-cell :key="index" title="我是房间名称" label="我是群公告内容，显示20个字xxxxxxxxxxx...">
            <x-img src="" class="avatar" slot="icon" dft />
          </van-cell>
        </template>
      </van-panel>
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  data() {
    return {
      search: '',
      title: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let { type, search } = to.params
      vm.search = search
      if (type === 'red') {
        vm.title = '红包交流群'
      } else {
        vm.title = '购彩交流群'
      }
    })
  }
}
</script>

<style lang="scss">
.page-SearchMore-root {
  // //padding-top: 44px;
  .van-search {
    padding: 5px 12px;
    .van-icon {
      color: $gray-d7;
    }
  }
  .van-nav-bar {
    height: 44px;
    background-color: $rootColor;
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
        justify-content: space-around;
        > * {
          //   margin-right: 15px;
          min-width: 75px;
          height: 24px;
          line-height: 24px;
          background-color: $baseBgColor;
          font-size: 13px;
          text-align: center;
          margin-bottom: 10px;
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
