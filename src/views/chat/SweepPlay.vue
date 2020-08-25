<template>
  <div class="page-sweepplay-root">
    <x-header :isRight="false"></x-header>
    <x-intro-play introTitle="红包扫雷" :rules="rules">
      <template #h6>在您开始游戏前，请花上几分钟阅读我们的玩法介绍</template>
      <template #textWrap>
        每个玩家都可发扫雷红包，设置红包金额、个数以及雷号并发出，然后等待其他玩家抢红包。
        当有玩家抢到的红包金额尾数与雷号相同时视为中雷，中雷需要按照红包总金额*倍率赔付给
        埋雷玩家；没有中雷的玩家则可以直接收取本次抢到的红包金额。
      </template>
    </x-intro-play>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xIntroPlay from 'cpt/x-intro-play.vue'
export default {
  components: {
    xHeader,
    xIntroPlay
  },
  data() {
    return {
      rules: [
        '平台默认抽取第一个红包作为抽水，且不会受到中雷惩罚。',
        '未被领取的红包将于3分钟后进行退款。',
        '红包发出者不能抢自己发出的包',
        '红包个数不同赔率也不一样，红包个数为5，赔率为2；红包 个数为6，赔率为1.8；红包个数为7，赔率为1.6；红包个数为8，赔率为1.4；红包个数为9，赔率为1.2'
      ]
    }
  }
}
</script>

<style lang="scss">
.page-sweepplay-root {
  font-size: 12px;
  color: $txt;
  padding: 15px;
}
</style>
