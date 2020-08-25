<template>
  <div class="bodyItem">
    <div class="itemLeft">
      <div class="headpic">
        <img src alt />
      </div>
      <div class="info">
        <div class="infoTop">
          <div class="topLeft">
            <span class="name">一分六合</span>
            <span class="number">000001期</span>
          </div>
          <div class="topRight">
            <span>距离封盘</span>
            <span>00:10:00</span>
          </div>
        </div>
        <div class="infoBottom">
          <span>特码:</span>
          <span class="code">小</span>
          <span class="issue">10期</span>
        </div>
      </div>
    </div>
    <div class="itemRight">
      <div class="rightLeft">
        <span class="size">大</span>
        <span class="num">1.98</span>
      </div>
      <div class="rightRight">
        <span class="size">小</span>
        <span class="num">1.98</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "x-plan-item"
};
</script>

<style lang="scss">
.bodyItem {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 8px solid $baseBgColor;
  font-size: 14px;
  .itemLeft {
    width: 60%;
    display: flex;
    .headpic {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: $avatarFill;
    }
    .info {
      flex: 1;
      .infoTop {
        display: flex;
        flex-wrap: nowrap;
        .topLeft,
        .topRight {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          margin-left: 10px;
          span {
            margin-bottom: 5px;
          }
        }
        .topLeft {
          color: $txt;
          .name {
            font-weight: bold;
          }
          .number {
            font-size: 12px;
            margin-top: 2px;
          }
        }
        .topRight {
          color: $rootColor;
        }
      }
      .infoBottom {
        padding: 5px 10px;
        .code,
        .issue {
          display: inline-block;
          width: 40px;
          height: 19px;
          line-height: 19px;
          text-align: center;
          color: $white;
          border-radius: 10%;
          margin-left: 7px;
        }
        .code {
          background-color: $fail;
        }
        .issue {
          background-color: $rootColor;
        }
      }
    }
  }
  .itemRight {
    width: 40%;
    display: flex;
    justify-content: space-between;
    .rightLeft,
    .rightRight {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid $middleGray;
      width: 50px;
      height: 50px;
      border-radius: 8%;
      .size {
        color: $rootColor;
        font-size: 15px;
        margin-bottom: 6px;
      }
      .num {
        color: $txt;
        font-size: 14px;
      }
    }
  }
}
</style>