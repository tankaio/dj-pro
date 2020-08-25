<template>
  <x-layout class="x-filter-page" :main-top="mainTop" main-bottom-color="#F7F8FA">
    <template #header>
      <x-header :isRight="isRight">
        <slot name="hd-right"></slot>
      </x-header>
      <div class="searchBar">
        <van-search
          v-if="place"
          background="#EC293C"
          :placeholder="place"
          v-model="search"
          shape="round"
          :class="{ animate: search_btn }"
          @input="onSearchInput"
          @focus="onFocus"
          @blur="onBlur"
        />
        <van-button type="danger" size="small" :class="{ animate: search_btn }" @click="onClickCancel">
          取消
        </van-button>
      </div>
      <slot name="header-bottom"></slot>
    </template>
    <!-- <x-fixed :offset-top="44" :bar-height="54"> </x-fixed> -->
    <slot></slot>
    <transition :enter-active-class="'bounceInUp animated faster'" :leave-active-class="'bounceOutDown animated faster'">
      <div v-if="focus" class="xf-recommend">
        <div class="xf-history" v-if="history_list.length">
          <div class="xf-head">
            <div class="xf-tit">历史搜索</div>
            <span class="xIcon-delete" @click="$emit('clearHistory')"></span>
          </div>
          <div class="xf-contxt">
            <div class="item-bar" v-for="(item, index) in history_list" :key="index">
              <span class="item" @click="onHistory(item)">
                {{ item }}
              </span>
            </div>
          </div>
        </div>
        <div class="xf-recom" v-if="recommend_list.length">
          <div class="xf-tit">推荐搜索</div>
          <div class="xf-contxt">
            <div class="item" v-for="(item, index) in recommend_list" @click="onRecommend(item.nick)" :key="index">
              <x-img :src="item.ico" class="avatar" dft />
              <div class="name">{{ item.nick }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <template slot="bottom">
      <slot name="filter-bottom"></slot>
    </template>
    <van-popup get-container="#box" class="xf-right-pop" v-model="show" position="right" @closed="$emit('close')">
      <slot name="popup"></slot>
      <div class="xf-btn-bar">
        <span class="xf-reset-btn" @click="$emit('reset')">重置</span>
        <span class="xf-confirm-btn" @click="onConfirm">确认</span>
      </div>
    </van-popup>
  </x-layout>
  <!-- <div class="x-filter-page"></div> -->
</template>

<script>
// import xHeader from "./x-header";
// import xFixed from "./x-fixed.vue";
import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'
import xImg from 'cpt/x-img.vue'
export default {
  name: 'x-filter-page',
  components: {
    xHeader,
    xFixed,
    xImg
  },
  props: {
    place: String,
    filter_active: {
      type: Boolean,
      default: false
    },
    history_list: {
      type: Array,
      default() {
        return []
      }
    },
    recommend_list: {
      type: Array,
      default() {
        return []
      }
    },
    isRight: {
      type: Boolean,
      default: false
    },
    showPopup: Boolean,
    mainTop: {
      type: Number,
      default: 88
    }
  },
  model: {
    prop: 'showPopup',
    event: 'sync'
  },
  data() {
    return {
      search: '',
      show: false,
      focus: false,
      search_btn: false,
      select: false
    }
  },
  methods: {
    onHistory(nick) {
      this.$emit('hitory', nick)
      this.search = nick
      this.$emit('search', nick)
      this.select = true
    },
    onRecommend(nick) {
      this.$emit('recommend', nick)
      this.search = nick
      this.$emit('search', nick)
      this.select = true
    },
    onFocus() {
      if (this.search === '') {
        this.focus = true
      }
      this.search_btn = true
      this.$emit('focus')
    },
    onConfirm() {
      this.show = false
      this.$emit('confirm')
    },
    onClickCancel() {
      this.search = ''
      this.focus = false
      this.$emit('cancel')
    },
    onBlur() {
      if (this.search === '') {
        G.delay(() => {
          if (!this.select) {
            this.search_btn = false
          }
          this.focus = false
        })
      }
    },
    onSearchInput() {
      if (this.search === '') {
        this.focus = true
        this.debounceSearch(this.search)
      } else {
        this.focus = false
        this.debounceSearch(this.search)
      }
    }
  },
  created() {
    this.show = this.showPopup
    this.debounceSearch = G.debounce(val => {
      this.$emit('search', val)
    }, 800)
  },
  watch: {
    showPopup(news) {
      this.show = news
    },
    show(news) {
      this.$emit('sync', news)
    }
  }
}
</script>

<style lang="scss">
.x-filter-page {
  //padding-top: 44px;
  .xf-filter {
    display: flex;
    position: relative;
    background-color: $white;
    > * {
      text-align: center;
      font-size: 15px;
      color: $txt;
    }
  }
  // .searchBar {
  //   background-color: $rootColor;
  // }
  .searchBar {
    display: flex;
    background-color: $rootColor;
    align-items: center;
    padding: 0 10px;
    // position: relative;
    .van-search {
      flex: 1;
      padding: 5px;
      max-width: unset;
      width: 375px;
      .van-search__content {
        flex: none;
        width: 100%;
        box-sizing: border-box;
        transition-duration: 200ms;
      }
      &.animate {
        .van-search__content {
          width: 290px;
        }
      }
      .van-field__control {
        flex: 1;
      }
    }
    .van-button {
      position: absolute;
      font-size: 14px;
      right: 0;
      transition-property: all;
      transition-duration: 200ms;
      transform: translateX(100%);
      &.animate {
        transform: translateX(0%);
      }
    }
  }
  .xf-recommend {
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    top: 88px;
    z-index: 30;
    bottom: 0;
    background-color: $white;
    padding: 15px;
    box-sizing: border-box;
  }
  .xf-history {
    .xf-head {
      padding-bottom: 10px;
    }
    .xf-contxt {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .item-bar {
        padding: 10px 5px;
        .item {
          background-color: $baseBgColor;
          font-size: 13px;
          color: $txt;
          padding: 5px 10px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .xf-recom {
    .xf-tit {
      padding-bottom: 10px;
    }
    .xf-contxt {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 20%;
        margin-bottom: 10px;
        .avatar {
          width: 45px;
          height: 45px;
          display: block;
          margin: 0 auto;
          border-radius: 50%;
        }
        .name {
          text-align: center;
          font-size: 13px;
          color: $txt;
          margin-top: 5px;
        }
      }
    }
  }
  .xf-head {
    display: flex;
    align-items: center;
  }
  .xf-tit {
    font-size: 15px;
    color: $txt;
    flex: 1;
  }
}
.xf-select-bar {
  flex: 1;
}
.xf-right-pop {
  box-sizing: border-box;
  width: 310px;
  height: 100%;
  padding-bottom: 44px;
  .xf-btn-bar {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    bottom: 0;
    display: flex;
    font-size: 15px;
    .xf-reset-btn {
      background-color: $baseBgColor;
      color: $txt;
    }
    .xf-confirm-btn {
      background-color: $rootColor;
      color: $white;
    }
    > * {
      flex: 1;
      text-align: center;
      line-height: 44px;
    }
  }
}
</style>
