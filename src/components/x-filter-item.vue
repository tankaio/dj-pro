<template>
  <div class="x-filter-item" :class="type">
    <div class="tit">{{ tit }}</div>
    <div class="bar" :class="bar">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "x-filter-item",
  props: {
    tit: String,
    type: String,
    bar: String
  }
};
</script>

<style lang="scss">
.x-filter-item {
  font-size: initial;
  padding: 0 19px;
  .tit {
    font-size: 15px;
    color: $txt;
    margin-top: 34px;
    margin-bottom: 13px;
  }
  &.gender {
    .van-button:not(:last-child) {
      margin-right: 15px;
    }
    .icon {
      margin-left: 40px;
    }
    .van-button {
      &.active {
        &.female {
          color: $rootColor;
          border-color: $rootColor;
        }
        &.male {
          color: $male;
          border-color: $male;
          &::before {
            border-color: $male;
          }
        }
      }
    }
  }
  &.interval {
    .bar {
      display: flex;
      align-items: center;
    }
    .itv {
      margin: 0 5px;
    }
    .van-field {
      background-color: $baseBgColor;
      height: 34px;
      padding-top: 5px;
      padding-bottom: 5px;
      box-shadow: 0 0 1px 1px $gray-d7;
    }
  }
  &.playMathod {
    .bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &.bill_type {
        justify-content: flex-start;
        .van-button {
          margin-right: 5px;
        }
      }
    }

    .van-button {
      width: 83px;
      margin-bottom: 5px;
      &.active {
        color: $white;
        background-color: $rootColor;
      }
    }
  }
  &.quick {
    .bar {
      display: flex;
    }
    .x-active-audio {
      position: relative;
      height: 34px;
      min-width: 160px;
      border-radius: 2.5px;
      overflow: hidden;
      line-height: 34px;
      text-align: center;
      font-size: 14px;
      color: $txt;
      border: 1px solid #ebedf0;
      &.active {
        background-color: $rootColor;
        color: $white;
      }
      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background-color: #000;
        border: inherit;
        border-color: #000;
        border-radius: inherit;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        opacity: 0;
        content: " ";
      }
    }
  }
}
</style>
