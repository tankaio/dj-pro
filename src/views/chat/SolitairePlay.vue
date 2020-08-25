<template>
  <div class="page-solitaireplay-root">
    <x-header :isRight="false"></x-header>
    <x-intro-play introTitle="红包接龙" :rules="rules">
      <template #h6>在您开始游戏前，请花上几分钟阅读我们的玩法介绍</template>
      <template #textWrap>
        点击【发起游戏】，设置红包金额、个数以及接龙规则（设定抢红包金额最大还是最小的玩家负责接龙）
        并发出红包，等待其他玩家抢完红包后，抢到金额最大或者最小的玩家需要以该红包总金额x该次倍率，
        自动发出一个红包进行接龙。当接龙到达一定长度后该轮结束。
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
        '平台默认抽取第一个红包作为抽水，且无需接龙',
        '如果在三分钟内红包没被抢完，就会在已抢红包的金额中选择接龙者',
        '每轮结束时负责接龙的玩家直接扣除发包金额并自动发出红包',
        '玩家剩余金额小于发包金额时将无法抢该红包'
      ]
    }
  }
}
</script>

<style lang="scss">
.page-solitaireplay-root {
  font-size: 12px;
  color: $txt;
  padding: 15px;
}
</style>
