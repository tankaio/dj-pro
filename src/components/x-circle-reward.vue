<template>
  <div class="x-circle-reward">
    <van-dialog class="rewardDialog" v-model="rewardPopup" title="打赏作者" get-container="#box"  :show-confirm-button="false">
      <div class="dialog-content">
        <van-cell>
          <van-row type="flex" justify="center">
            <van-col span="6" offset="1" @click="hanldeRewardClick('2')" :class="rewardScore == '2' ? 'active' : ''">2积分</van-col>
            <van-col span="6" offset="2" @click="hanldeRewardClick('5')" :class="rewardScore == '5' ? 'active' : ''">5积分</van-col>
            <van-col span="6" offset="2" @click="hanldeRewardClick('10')" :class="rewardScore == '10' ? 'active' : ''">10积分</van-col>
          </van-row>
        </van-cell>
        <van-cell>
          <van-row type="flex" justify="center">
            <van-col span="6" offset="1" @click="hanldeRewardClick('20')" :class="rewardScore == '20' ? 'active' : ''">20积分</van-col>
            <van-col span="6" offset="2" @click="hanldeRewardClick('50')" :class="rewardScore == '50' ? 'active' : ''">50积分</van-col>
            <van-col span="6" offset="2" @click="hanldeRewardClick('custom')" :class="rewardScore == 'custom' ? 'active' : ''"
              >自定义</van-col
            >
          </van-row>
        </van-cell>
        <van-cell v-if="rewardScore == 'custom'">
          <div class="xc_custom_put">
            <van-field type="number" v-model="score" placeholder="请输入整数" />
            <span>积分</span>
          </div>
        </van-cell>
        <div class="button-group">
          <van-button type="default" class="cancel" @click="rewardPopupClose">取消</van-button>
          <van-button type="danger" class="confirm" @click="rewardPopupConfirm">{{
            confirmButton ? '确认' : '积分不足,去充值'
          }}</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    openDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    confirmButton() {
      if (Number(this.userInfo.balan_m || 0) < Number(this.score)) {
        return false
      }
      return true
    }
  },
  data() {
    return {
      rewardPopup: false, // 点赞弹出框
      rewardScore: '2', // 选中积分
      score: ''
    }
  },
  watch: {
    openDialog() {
      this.rewardPopup = this.openDialog
    }
  },
  methods: {
    // 点击打赏积分
    hanldeRewardClick(type) {
      if (this.rewardScore === 'custom') {
        this.score = ''
      }
      this.rewardScore = type
    },
    // 确认打赏
    rewardPopupConfirm() {
      if (!this.confirmButton) {
        this.$router.push('/user/onlineCharge')
        return
      }
      if (this.rewardScore !== 'custom') {
        this.score = parseInt(this.rewardScore)
      }
      this.$emit('rewardPopupConfirm', this.score)
    },
    rewardPopupClose() {
      this.$emit('rewardPopupClose')
    }
  }
}
</script>

<style lang="scss">
.x-circle-reward ,.rewardDialog{
  .van-cell {
    &::after {
      display: none;
    }
  }
  .dialog-content {
    .van-col {
      border: 1px solid #d9d9d9;
      text-align: center;
    }
    .active {
      border: 1px solid red;
    }
    .customCol {
      border: 0;
      text-align: center;
      padding: 0.1rem 0.16rem;
    }
  }
  .xc_custom_put {
    width: 245px;
    height: 35px;
    border-radius: 5px;
    border: 1px solid $gray-66;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    .van-field {
      padding: 5.5px 5px;
      .van-field__control {
        color: $red-f0;
      }
    }
    span {
      white-space: nowrap;
      line-height: 35px;
      padding: 0 10px;
    }
  }
  .button-group {
    display: flex;
    justify-content: space-evenly;
    padding-bottom: 20px;
    margin-top: 10px;
    .cancel,
    .confirm {
      min-width: 120px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
    }
    .cancel {
      background-color: $gray-ed;
    }
  }
}
</style>
