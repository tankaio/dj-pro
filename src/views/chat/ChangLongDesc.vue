<template>
  <x-layout modifier="changLongDesc">
    <x-header :is-right="false" />
    <div class="main" v-pre>
      <p>
        长龙助手是对「快3」、「时时彩」、「六合彩」、「北京 赛车」、「幸运28」、「11选5」的”大小单双”、”龙虎斗”
        玩法开奖结果进行统计监测，每期出现”大”、”小”、”单”、 双” 、”龙”、”虎”的概率为1/2，如果连续出现相同的开奖
        结果，称之为「长龙」，通常会采用倍投的方式进行”斩龙” 或”顺龙”。
      </p>
      <h2>什么叫斩龙？</h2>
      <p>
        如连续开”单”，可以选择”双”进行投注，这样的投注方案称 之为”斩龙”。
      </p>
      <h2>
        什么叫顺龙？
      </h2>
      <p>
        如连续开”单”，继续选择”单”进行投注，这样的投注方案称 之为”顺龙”。
      </p>
      <h2>
        什么是倍投？
      </h2>
      <p>
        倍投是一种翻倍的投注方式，是为了保障能够在”斩龙”或” 顺龙”的过程中持续盈利的一种投注方式。
      </p>
    </div>
  </x-layout>
  <!-- <div class="page-changLongDesc-root"></div> -->
</template>

<script>
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  }
}
</script>

<style lang="scss">
.page-changLongDesc-root {
  .main {
    padding: 11px 15px 0;
    color: $txt;
    p {
      font-size: 13px;
      line-height: 1.2;
    }
    h2 {
      font-size: 16px;
      font-weight: 600;
      padding: 19px 0 10px;
    }
  }
}
</style>
