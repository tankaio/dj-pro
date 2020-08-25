<template>
  <div class="x-issue-item">
    <div class="bar">
      <div class="grade" v-if="type === 'grade' || type === 'public'">
        <span>
          <span class="play" :class="tag | playColor">{{ ad }}</span>
          <span>
            (最近连胜
            <i class="s">
              {{ wintimes }}
            </i>
            )
          </span>
        </span>
        <!-- 开放玩法 -->
        <template v-if="type !== 'public'">
          <span>总:{{ sum }}</span>
          <span
            >胜/负: <i class="fail">{{ s }}</i> /
            <i class="done">{{ sum - s }}</i>
          </span>
          <span
            >胜率：<i class="done">{{ s | percentage(sum) }}</i>
          </span>
        </template>
      </div>
      <div v-else class="tit">
        <span class="done" v-if="state">胜</span>
        <span class="fail" v-else>负</span>
        <span class="issue">{{ issue }}</span>
        <span class="ad">{{ ad }}</span>
      </div>
      <div class="cont van-hairline--top">
        <div class="grade-plan" v-if="type === 'grade' || type === 'public'">
          <div class="tag-bar">
            <div class="tag" :class="ad | playColor">
              <span class="container">{{ tag }}</span>
            </div>
          </div>
          <div class="plan-cont">
            <template v-if="type === 'public'">
              <div class="public">
                <div class="base-info">
                  <div>总发布:{{ sum }}</div>
                  <div>
                    胜/负: <span class="s">{{ s }}</span
                    >/<span class="f">{{ sum - s }}</span>
                  </div>
                </div>
                <div class="winrate">{{ s | percentage(sum) }}</div>
              </div>
            </template>
            <template v-else>
              <div class="plan-name">{{ planname }}</div>
              <div class="plan-info">
                <span class="itegral"> 积分:{{ integral }} </span>
                <span> 查看数:{{ looks }} </span>
              </div>
            </template>
          </div>
        </div>
        <div class="plan" v-else>{{ planname }}</div>
        <div class="xi__btn-bar">
          <van-button
            v-if="btn"
            size="small"
            type="danger"
            @click="$emit('click')"
          >
            {{ btn }}
          </van-button>
          <slot> </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "x-issue-item",
  props: {
    state: Boolean,
    issue: String,
    ad: String,
    // plan: String,
    type: String,
    btn: String,
    tag: String,
    planname: String,
    integral: Number,
    looks: Number,
    sum: Number,
    s: Number,
    wintimes: Number
  },
  filters: {
    tagDsFilter(old) {
      let map = ["danshaung", "zixuanbuzhong"];
      return map[old];
    }
  }
};
</script>

<style lang="scss">
.x-issue-item {
  padding-top: 8px;
  background-color: $baseBgColor;
  &:last-child {
    padding-bottom: 8px;
  }
  .bar {
    padding: 0 10px;
    background-color: $white;
  }
  .tit {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 6px 0;
    .done,
    .fail {
      width: 22px;
      height: 22px;
      text-align: center;
      line-height: 22px;
      border-radius: 2px;
      color: $white;
    }
    .done {
      background-color: $rootColor;
    }
    .fail {
      background-color: $green;
    }
  }

  .issue {
    flex: 1;
    margin-left: 10px;
  }
  .ad {
    color: $tagsOD;
  }
  .cont {
    padding: 13px 0;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .plan {
    flex: 1;
    font-size: 14px;
    color: $txt;
  }
  .van-button {
    border-radius: 5px;
    width: 120px;
  }
  .grade {
    font-size: 13px;
    color: $txt;
    display: flex;
    justify-content: space-between;
    // padding: 0 10px;
    height: 40px;
    line-height: 40px;
    .fail {
      color: $green;
    }
    .done {
      color: $rootColor;
    }
  }
  .grade-plan {
    flex: 1;
    display: flex;
    .tag-bar {
      padding-right: 10px;
      .tag {
        color: $white;
        width: 24px;
        height: 70px;
        border-radius: 3px;
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;
        &.winrate {
          background-color: $rootColor;
        }
        &.mayi {
          background-color: $male;
        }
        &.wubuzhong {
          background-color: $rootColor;
        }
        &::after {
          display: block;
          content: "";
          position: absolute;
          background-color: $white;
          height: 24px;
          width: 24px;
          bottom: 0;
          left: 0;
          right: 0;
          transform: translateY(80%) rotateZ(45deg);
        }
        .container {
          //   writing-mode: vertical-rl;
          transform: scale(0.8);
          margin-bottom: 10px;
          line-height: 1;
          font-size: 15px;
        }
      }
    }
    .plan-cont {
      display: flex;
      flex-direction: column;
      > div {
        color: $txt;
        flex: 1;
        display: flex;
        align-items: center;
      }
      .plan-name {
        font-size: 14px;
      }
      .plan-info {
        font-size: 12px;
      }
      .itegral {
        margin-right: 10px;
      }
      .public {
        flex: 1;
        display: flex;
        font-size: 13px;
        color: $txt;
        .winrate {
          color: $rootColor;
          font-size: 15px;
          padding-left: 30px;
        }
      }
    }
  }
  .s {
    color: $rootColor;
  }
  .f {
    color: $green;
  }
  .base-info {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-evenly;
  }
}
</style>
