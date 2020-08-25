<template>
  <div class="x-bet-pop">
    <van-overlay class="xb-overlay" z-index="10" :show="betPopCtr">
      <div class="xb-main">
        <div class="xb-panel bounceInDown animated faster">
          <div class="xb-panel-middle">
            <div class="xb-tit">
              投注
            </div>
            <div class="xb-label">投注金额：</div>
            <div class="xb-put-bar">
              <slot></slot>
              <span>元</span>
            </div>
          </div>
          <div class="xb-btn-bar">
            <span class="xb-btn cancel" @click="onCancel">取消</span>
            <span
              class="xb-btn confirm"
              :class="{ disable: disable }"
              @click="onConfirm"
              >投注</span
            >
          </div>
        </div>
        <div class="xb-countdown bounceInUp animated faster">
          {{ countdown }}
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "x-bet-pop",
  props: {
    countdown: {
      type: Number,
      default: 0
    },
    betPopCtr: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onCancel() {
      this.$emit("cancel");
    },
    onConfirm() {
      this.$emit("confirm");
    }
  }
};
</script>

<style lang="scss">
.x-bet-pop {
  .xb-overlay {
    background-color: rgba($color: #000000, $alpha: 0.6);
  }
  .xb-panel {
    max-width: 275px;
    background-color: $white;
    border-radius: 5px;
    overflow: hidden;
  }
  .xb-panel-middle {
    padding: 24px 20px 0;
  }
  .xb-tit {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
  .xb-label {
    font-size: 12px;
    color: $txt;
    margin-top: 19px;
  }
  .xb-put-bar {
    display: flex;
    align-items: center;
    margin-top: 6px;
    font-size: 12px;
    .van-field {
      border: 1px solid #dcdfe6;
      border-radius: 2.5px;
      overflow: hidden;
      height: 34px;
      padding-top: 5px;
      padding-bottom: 5px;
      margin-right: 12px;
    }
  }
  .xb-btn-bar {
    margin-top: 25px;
    display: flex;
    font-size: 14px;
    line-height: 42px;
    .xb-btn {
      flex: 1;
      text-align: center;
      &.cancel {
        background-color: #eaeaea;
      }
      &.confirm {
        background-color: $rootColor;
        color: $white;
        &.disable {
          pointer-events: none;
          opacity: 0.8;
        }
      }
    }
  }
  .xb-countdown {
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    margin: 59.5px auto 0;
    // background: linear-gradient(to bottom, #f97500, #fcac10);
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    color: #fcac10;
    position: relative;
  }
}
</style>
