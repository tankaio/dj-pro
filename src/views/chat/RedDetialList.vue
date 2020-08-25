<template>
  <div class="page-RedDetialList-root">
    <x-header @click-right="onClickRight">
      <template #title>
        <van-dropdown-menu @change="onDropMenuChange">
          <van-dropdown-item v-model="value" :options="option" />
        </van-dropdown-menu>
      </template>
      <span>今天</span>
      <van-icon name="arrow-down" />
    </x-header>

    <div class="redPlayPanel">
      <div class="container">
        <div class="tits van-hairline--bottom">
          <div class="name">
            红包扫雷
          </div>
          <div class="time">
            2019-10-16 12:12:12
          </div>
        </div>
        <div class="infos">
          <div class="top">
            <div class="grab">
              发包:200(9包/1.2倍/雷1）
            </div>
            <div class="status">
              中雷:240元*2
            </div>
          </div>
          <div class="bottom">
            <div class="earnings">
              <!-- 盈亏 -->
              盈亏:-229.78元
            </div>
            <div class="backAmount">
              退款:20元
            </div>
            <div class="issue">
              游戏期号:03
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet v-model="time_select_ctr" :actions="actions" @select="onSelect" close-on-click-action />

    <van-popup get-container="#box"  v-model="time_picker_ctr" position="bottom">
      <van-datetime-picker @confirm="onConfimTimePicker" v-model="currentDate" type="date" :min-date="minDate" />
    </van-popup>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  },
  data() {
    return {
      value: 0,
      time_select_ctr: false,
      time_picker_ctr: false,
      currentDate: new Date(),
      minDate: new Date(),
      actions: [{ name: '今天' }, { name: '近三天' }, { name: '近七天' }, { name: '自定义' }],
      option: [
        { text: '所有游戏', value: 0 },
        { text: '红包牛牛', value: 1 },
        { text: '红包扫雷', value: 2 },
        { text: '红包接龙', value: 3 }
      ]
    }
  },
  methods: {
    onClickRight() {
      this.time_select_ctr = true
    },
    onSelect(item, idx) {
      if (idx === 3) {
        this.time_select_ctr = false
        this.time_picker_ctr = true
      }
    },
    onConfimTimePicker(value) {
      this.time_picker_ctr = false
      console.log(value) // type Date
    },
    onDropMenuChange(value) {}
  }
}
</script>

<style lang="scss">
.page-RedDetialList-root {
  .van-dropdown-menu {
    height: 44px;
    background-color: $rootColor;
    .van-dropdown-menu__title {
      color: $white;
    }
  }
  .van-nav-bar .van-icon {
    color: $white;
  }
  .redPlayPanel {
    padding-bottom: 2px;
    background-color: $baseBgColor;
    .container {
      background-color: $white;
      padding: 15px;
      .tits {
        display: flex;
        padding-bottom: 10px;
        align-items: center;
        > * {
          flex: 1;
        }
        .name {
          color: $rootColor;
          font-size: 15px;
          font-weight: 600;
        }
        .time {
          text-align: left;
          font-size: 11px;
          color: $txt;
          width: 120px;
          flex: none;
        }
      }
      .infos {
        padding-top: 10px;
        font-size: 11px;
        color: $txt;
        .top {
          display: flex;
          .grab {
            flex: 1;
          }
          .status {
            width: 120px;
            flex: none;
          }
        }
        .bottom {
          display: flex;
          margin-top: 10px;
          > * {
            flex: 1;
          }
          .issue {
            width: 120px;
            flex: none;
          }
        }
      }
    }
  }
}
</style>
