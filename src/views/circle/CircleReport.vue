<template>
  <x-layout modifier="circleReport">
    <x-header :is-right="false" slot="header" />
    <van-cell>举报类型</van-cell>
    <van-cell>
      <van-row type="flex" justify="center">
        <!-- <van-col span="6" offset="1" @click="hanldeRewardClick('2')" :class="rewardScore == '2' ? 'active': ''">2积分</van-col> -->
        <van-col @click="hanldeSelectClick(1)" :class="getSelectClass(1)" span="6" offset="1">低俗色情</van-col>
        <van-col @click="hanldeSelectClick(2)" :class="getSelectClass(2)" span="6" offset="2">垃圾广告</van-col>
        <van-col @click="hanldeSelectClick(3)" :class="getSelectClass(3)" span="6" offset="2">辱骂攻击</van-col>
      </van-row>
      <van-row type="flex" justify="center">
        <van-col @click="hanldeSelectClick(4)" :class="getSelectClass(4)" span="6" offset="1">不实信息</van-col>
        <van-col @click="hanldeSelectClick(5)" :class="getSelectClass(5)" span="6" offset="2">内容抄袭</van-col>
        <van-col @click="hanldeSelectClick(6)" :class="getSelectClass(6)" span="6" offset="2">诈骗信息</van-col>
      </van-row>
      <van-row type="flex" justify="center">
        <van-col @click="hanldeSelectClick(7)" :class="getSelectClass(7)" span="'6'" offset="1">违法信息</van-col>
      </van-row>
      填写举报缘由(选填)
      <van-row type="flex" justify="center">
        <van-field
          v-model="messageContent"
          class="vanFieldTextarea"
          type="textarea"
          placeholder="请不要超过200个字"
          rows="4"
          autosize
          maxlength="200"
          show-word-limit
        />
      </van-row>
      <van-row>
        <div class="btn">
          <van-button type="danger" @click="submitReport" :disabled="getDisabled">提交</van-button>
        </div>
      </van-row>
    </van-cell>
  </x-layout>
  <!-- <x-page isFooter active="1" closeBack rootClass="circleReport"> </x-page> -->
</template>

<script>
import { momentReport } from '@/api/circle'
import { mapGetters, mapMutations } from 'vuex'

import xPage from 'cpt/x-page.vue'

export default {
  components: {
    xPage
  },
  filters: {},
  data() {
    return {
      messageContent: '',
      selectContent: []
    }
  },
  created() {
    this.selectContent = []
  },
  computed: {
    ...mapGetters(['userInfo', 'userIdentity', 'getReportParam']),
    getDisabled() {
      if (this.selectContent.length === 0) {
        return true
      }
      return false
    }
  },
  methods: {
    // 获取勾选的class样式
    getSelectClass(value) {
      return this.selectContent.includes(value) ? 'active' : ''
    },
    // 点击选择
    hanldeSelectClick(value) {
      // 如果已经勾选，再次点击删除
      if (this.selectContent.includes(value)) {
        this.selectContent = this.selectContent.filter(item => item !== value)
      } else {
        if (this.selectContent.length < 2) {
          this.selectContent.push(value)
        } else {
          G.$dialog.alert({
            message: '最多选择两个'
          })
        }
      }
    },
    // 提交
    async submitReport() {
      if (this.selectContent.length === 0) {
        G.$dialog.alert({
          message: '举报类型最少选择一个'
        })
        return
      }
      let [type1, type2 = 0] = this.selectContent
      const _temp = {
        id: this.getReportParam.id,
        illegalid: this.getReportParam.illegalid,
        type1: type1,
        type2: type2,
        text: this.messageContent
      }
      let { ok, msg } = await momentReport(_temp)
      G.$dialog.alert({
        message: msg
      })
    }
  }
}
</script>

<style lang="scss">
.page-circleReport-root {
  .van-row {
    margin-bottom: 20px;
  }
  .van-col {
    border: 1px solid #d9d9d9;
    text-align: center;
    padding: 4px 12px;
  }
  .active {
    border: 1px solid red;
  }
  .vanFieldTextarea {
    padding: 2px 8px;
    border: 1px solid #ebedf0;
    margin: 0px 4px;
  }
  .btn {
    text-align: center;
    .van-button {
      width: 95%;
    }
  }
}
</style>
