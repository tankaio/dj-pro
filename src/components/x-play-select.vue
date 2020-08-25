<template>
  <div class="x-play-select">
    <div class="xps-bar">
      <div class="xps-left" :class="{ select: value === '/publish' }">
        <template v-if="value === '/publish'">
          请选择玩法类别
        </template>
        <template v-else>
          {{ textCpt }}
          <span class="xIcon-fun-cm"></span>
        </template>
      </div>
      <div class="xps-right">
        <span class="xIcon-select-cm"> </span>
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="value"
            @change="onChange"
            :options="option"
            ref="toggle"
          ></van-dropdown-item>
        </van-dropdown-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "x-play-select",
  props: ["v", "option"],
  data() {
    return {
      value: "/publish"
    };
  },
  model: {
    prop: "v",
    event: "change"
  },
  methods: {
    onChange(v) {
      this.$emit("change", this.value);
      if (this.value !== this.v) {
        this.$emit("select");
      }
    }
  },
  created() {
    this.value = this.v;
  },
  computed: {
    textCpt(old) {
      let res;
      this.option.forEach(item => {
        if (item.value === this.value) {
          res = item.text;
        }
      });
      return res;
    }
  },
  watch: {
    v(news) {
      this.value = news;
    }
  }
};
</script>

<style lang="scss">
.x-play-select {
  background-color: $baseBgColor;
  padding-top: 8px;
  .xps-bar {
    background-color: $white;
    height: 40px;
    display: flex;
  }
  .xps-left {
    flex: 1;
    line-height: 40px;
    background-color: $white;
    font-size: 14px;
    color: $txt;
    padding-left: 10px;
    &.select {
      text-align: center;
    }
  }
  .xIcon-fun-cm {
    margin-left: 10px;
  }
  .xps-right {
    padding: 0 15px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .xIcon-select-cm {
    position: relative;
  }
  .van-dropdown-menu {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: unset;
    background-color: unset;
    .van-ellipsis {
      display: none;
    }
    .van-dropdown-menu__title::after {
      display: none;
    }
  }
}
</style>
