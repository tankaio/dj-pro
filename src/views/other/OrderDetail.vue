<template>
  <div class="page-order-root">
    <x-header isRight :center-text="orderType + '计划详情'"></x-header>
    <van-cell> 订单号：{{ id }} </van-cell>
    <van-cell> {{ orderType }}金额：{{ order_data.a }}元 </van-cell>
    <van-cell>
      <template v-if="type === 'charge'">
        获得积分：{{ order_data.a }}
        <i class="fail">
          {{ order_data.sa }}
        </i>
      </template>
      <template v-else> 消耗金币：{{ order_data.b }} </template>
    </van-cell>
    <van-cell> {{ orderType }}时间：{{ order_data.t }} </van-cell>
    <van-cell>
      {{ orderType }}状态：
      <template v-if="type === 'charge'">
        <i class="done" v-if="order_data.s == 1">
          充值成功
        </i>
        <i class="fail" v-else>
          充值失败
        </i>
      </template>
      <template v-else>
        <i class="wait" v-if="order_data.s == 1">
          待审核
        </i>
        <i class="underway" v-if="order_data.s == 2">
          审核中
        </i>
        <i class="done" v-if="order_data.s == 3">
          提款成功
        </i>
        <i class="fail" v-if="order_data.s == 4">
          提款失败
        </i>
      </template>
    </van-cell>
    <van-cell v-if="order_data.r">
      备注：
      <i class="desc">
        {{ order_data.r }}
      </i>
    </van-cell>
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
      type: '',
      id: '',
      order_data: {
        t: '',
        s: '',
        a: '',
        b: '',
        r: ''
      }
    }
  },
  computed: {
    orderType() {
      if (this.type === 'charge') {
        return '充值'
      } else {
        return '提款'
      }
    }
  },
  created() {
    this.type = this.$route.params.type
    this.id = this.$route.params.id
    this.order_data = this.$route.query
    console.log(this.$route)
  }
}
</script>

<style lang="scss">
.page-order-root {
  //padding-top: 44px;
  .fail {
    color: $rootColor;
  }
  .done {
    color: $green;
  }
  .desc {
    color: $gray-66;
  }
  .wait,
  .underway {
    color: $male;
  }
}
</style>
