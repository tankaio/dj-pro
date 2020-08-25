<template>
  <div class="page-HowPlay-root">
    <x-header :is-right="false" />
    <div>
      <van-dropdown-menu class="select">
        <van-dropdown-item v-model="value1" :options="option1" />
      </van-dropdown-menu>
      <div class="HowPlay-content">
        <h1>简介</h1>
        <p>{{ title }}</p>
        <h1>游戏玩法</h1>
        <div v-for="(item, index) in items" :key="index">
          <h2>{{ item.name }}</h2>
          <p v-for="(e, n) in item.tit" :key="n">
            <span>{{ item.tit[n] }}</span>
            <span>{{ item.span[n] }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  },
  name: 'HowPlay',
  data() {
    return {
      value1: 0,
      option1: [{ text: '香港六合彩', value: 0 }],
      title: '六合彩(英文Mark Six)是香港合法彩票，通常一周开3期，每期开奖球数共7位，前6位是正码，最后1位是特码。',
      items: [
        {
          name: '正特码',
          tit: ['特码直选', '正码任选'],
          span: [
            '从1~49中任选1个或多个号码，所选号码与特码的开奖号码一致，即为中奖。',
            '从1-49中任选1个或多个号码，所选号码在开奖号码前六位中存在，即为中奖。'
          ]
        },
        {
          name: '两面',
          tit: ['特码直选', '正码任选'],
          span: [
            '从1~49中任选1个或多个号码，所选号码与特码的开奖号码一致，即为中奖。',
            '从1-49中任选1个或多个号码，所选号码在开奖号码前六位中存在，即为中奖。'
          ]
        }
      ]
    }
  },
  watch: {
    value1() {
      if (this.value1 == 0) {
      }
    }
  }
}
</script>
<style lang="scss">
.page-HowPlay-root {
  .select {
    background: #dedede;
    width: 90%;
    margin: 5px auto;
    border-radius: 5px;
    border: none;
    overflow: hidden;
  }
  .HowPlay-content {
    padding: 10px;
    line-height: 28px;
    h1 {
      font-size: 16px;
    }
    h2 {
      font-size: 14px;
    }
    p {
      font-size: 13px;
      color: #333;
    }
  }
}
</style>
