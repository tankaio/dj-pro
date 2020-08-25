<template>
  <div class="x-circle-main" @click="$emit('click')">
    <div class="xc__main-text" :class="{ active: isFold }" ref="xcmt">
      {{ text }}
    </div>
    <div class="xc__fold-text" @click.stop="isFold = !isFold" v-if="isBtn">
      {{ isFold ? '收起' : '展开' }}
    </div>
    <div class="xc__plan" @click="$emit('click-plan', plan)" v-if="plan">
      <x-issue-item
        v-bind="{
          state: true,
          ad: plan.rgn0,
          planname: plan.title,
          type: 'grade',
          tag: plan.rgn1,
          integral: plan.cost,
          looks: plan.viewer,
          sum: plan.totalround,
          s: plan.totalwin,
          f: Number(plan.totalround) - Number(plan.totalwin),
          wintimes: plan.streak
        }"
      >
        <div class="xi__winrate">
          {{ Number(plan.totalround) ? parseFloat((Number(plan.totalwin) / Number(plan.totalround)) * 100).toFixed(2) + '%' : '0%' }}
        </div>
      </x-issue-item>
    </div>
  </div>
</template>

<script>
import xIssueItem from 'cpt/x-issue-item.vue'
export default {
  components: {
    xIssueItem
  },
  props: {
    text: String,
    noFold: {
      type: Boolean,
      default: false
    },
    plan: {
      type: Object
    }
  },
  data() {
    return {
      isFold: false,
      isBtn: false
    }
  },
  methods: {
    init() {
      if (this.noFold) {
        this.isFold = true
        return
      }
      let xcmt = this.$refs.xcmt
      if (xcmt) {
        if (xcmt.scrollHeight > xcmt.clientHeight) {
          this.isBtn = true
        }
      } else {
        G.delay(() => {
          this.init()
        }, 300)
      }
    }
  },
  mounted() {
    this.init()
  },
  updated() {
    this.$nextTick(() => {
      this.init()
    })
  },
  watch: {
    text() {
      this.$nextTick(() => {
        this.init()
      })
    }
  }
}
</script>

<style lang="scss">
.x-circle-main {
  .xc__main-text {
    font-size: 15px;
    color: $txt;
    word-break: break-all;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px 0;
    &.active {
      display: block;
    }
  }
  .xc__fold-text {
    color: #3074b3;
  }
  .xc__plan {
    border-radius: 2.5px;
    overflow: hidden;
    .bar,
    .x-issue-item .grade-plan .tag-bar .tag::after {
      background-color: #f5f5f5;
    }
    .x-issue-item .cont {
      padding: 5px 0;
    }
  }
}
</style>
