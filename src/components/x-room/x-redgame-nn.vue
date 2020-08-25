<template>
  <div class="x-redgame-nn">
    <div class="xr-main" v-if="message.type === 'launch'">
      <div class="xr-tit">{{ message.launchuser }}发起了游戏</div>
      <div class="xr-launch-data">
        <div class="xr-launch-item">最低投注额:{{ message.lower_bet }}</div>
        <div class="xr-launch-item">红包个数:{{ message.red_num }}</div>
        <div class="xr-launch-item">最高投注额:{{ message.upper_bet }}</div>
      </div>
    </div>

    <div class="xr-main" v-if="message.type === 'bet'">
      <div class="xr-tit">该轮有{{ message.member }}人参与了投注</div>
      <div class="xr-bet-data">
        <div
          class="xr-bet-item"
          v-for="(item, index) in message.list"
          :key="index"
        >
          <span>{{ item.name }}</span>
          <span>投注:{{ item.bet }}</span>
        </div>
      </div>
    </div>

    <div class="xr-main" v-if="message.type === 'end'">
      <div class="xr-tit">本轮已结束</div>
      <div class="xr-end-data">
        <div
          class="xr-end-item van-hairline--bottom"
          v-for="(item, index) in message.list"
          :key="index"
        >
          <div>
            <span>{{ item.name }}</span>
            <span v-if="item.identity">{{ item.identity }}</span>
            <span v-if="item.win">赢:{{ item.win }}</span>
            <span v-if="item.fail">输:{{ item.fail }}</span>
          </div>
          <div>
            <span>抢到红包:{{ item.grab }}元</span>
            <span>{{ item.nn }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="xr-main" v-if="message.type === 'failend'">
      <div class="xr-end-data">
        该轮抢包人数不足，已结束
      </div>
    </div>

    <div class="xr-timestamp">
      {{ timestamp }}
    </div>
  </div>
</template>

<script>
export default {
  name: "x-redgame-nn",
  props: ["timestamp", "message"],
  mounted() {},
  watch: {}
};
</script>

<style lang="scss">
.x-redgame-nn {
  padding: 11px 50px 0;
  .xr-main {
    border-radius: 5px;
    overflow: hidden;
    background-color: $white;
    padding: 9.5px 0;
    .xr-tit {
      text-align: center;
      font-size: 11px;
      color: $txt;
      font-weight: 700;
    }
    .xr-launch-data {
      font-size: 10px;
      text-align: center;
      .xr-launch-item {
        margin-top: 10px;
      }
    }
    .xr-bet-data {
      font-size: 10px;
      padding: 0 30px;
      .xr-bet-item {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
      }
    }
    .xr-end-data {
      padding: 0 30px;
      font-size: 10px;
      .xr-end-item {
        padding-bottom: 1px;
        padding-top: 5px;
        > div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
      }
    }
  }
  .xr-timestamp {
    font-size: 10px;
    text-align: center;
    margin-top: 5px;
  }
}
</style>
