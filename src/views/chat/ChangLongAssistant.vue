<template>
  <x-layout modifier="changLongAssistant">
    <template #header>
      <x-header @click-right="integral_balance_ctr = false">
        <template slot="title">
          <span @click="$router.push('/chat/changLongDesc')">长龙助手</span>
          <span class="xIcon-fun-white-cm"></span>
        </template>
        <span>{{ integral_balance_ctr ? '积分余额' : integral_balance }}</span>
        <span class="xIcon-unlock-white-cm" v-if="integral_balance_ctr"></span>
        <van-icon name="replay" v-else />
      </x-header>
    </template>
    <x-changlong-item
      v-for="(item, index) in 20"
      :key="index"
      v-bind="{
        src: 'i.png',
        lotteryName: '一分六合',
        issue: '0000001',
        time: '00:10:00'
      }"
    />
    <template #bottom>
      <div class="footer">
        <div class="top">
          <span class="label">每注金额</span>
          <input type="number" v-model="money" class="betMoney" />
          <span class="label">积分</span>
          <van-button type="danger" size="small">立即投注</van-button>
        </div>
        <div class="bottom">
          <van-button size="small" plain>清空</van-button>
          共
          <i class="special">
            {{ orders }}
          </i>
          注，
          <i class="special">
            {{ integral }}
          </i>
          积分
        </div>
      </div>
    </template>
  </x-layout>
  <!-- <div class="page-changLongAssistant-root"></div> -->
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xChanglongItem from 'cpt/x-changlong-item.vue'
export default {
  components: {
    xHeader,
    xChanglongItem
  },
  data() {
    return {
      money: 0,
      orders: 0,
      integral: 0,
      integral_balance_ctr: true,
      integral_balance: 0
    }
  }
}
</script>

<style lang="scss">
.page-changLongAssistant-root {
  padding-bottom: 90px;
  .van-nav-bar .van-icon {
    color: $white;
  }
  .van-icon-replay {
    margin-left: 5px;
  }
  .x-header {
    .van-nav-bar__title {
      width: 40%;
    }
    .xh-right {
      display: flex;
      align-items: center;
      .xIcon-unlock-white-cm {
        margin-left: 7.5px;
      }
    }
    .van-nav-bar__title {
      display: flex;
      align-items: center;
      justify-content: center;
      .xIcon-fun-white-cm {
        margin-left: 4.5px;
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 90px;
    background-color: $gray-e6;
    .top {
      display: flex;
      background-color: $baseBgColor;
      height: 45px;
      align-items: center;
      padding: 0 25px;
      justify-content: space-between;
      font-size: 12px;
      .betMoney {
        height: 29px;
        width: 120px;
        border: 0.5px solid $gray-e6;
        border-radius: 2.5px;
        padding: 0 5px;
        box-sizing: border-box;
      }
      .label {
        color: $txt;
      }
    }
    .bottom {
      height: 45px;
      padding: 0 25px;
      display: flex;
      align-items: center;
      font-size: 14px;
      .van-button--plain {
        background-color: $roomBetBtnBg;
        margin-right: 10px;
      }
      .special {
        color: $roomBetMask;
      }
    }
  }
}
</style>
