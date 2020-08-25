<template>
  <div class="x-timing">
    <span class="xt-porint"></span>
    <span class="xt-time"
      >{{ hour | fillIn }}:{{ minute | fillIn }}:{{ second | fillIn }}</span
    >
  </div>
</template>

<script>
import WebWorker from "@/utils/worker.util.js";
import { timeWorker } from "@/utils/worker.util.js";
import { formatDuration } from "@/utils/formant.util.js";
let timer_worker;
export default {
  props: {
    mode: String // timing 计时器
  },
  data() {
    return {
      hour: "00",
      minute: "00",
      second: "00",
      time_str: ""
    };
  },
  created() {
    timer_worker = WebWorker(timeWorker);
    timer_worker.postMessage({
      state: "start",
      start_time: new Date().getTime()
    });
    timer_worker.onmessage = e => {
      let { day, hour, minute, second } = formatDuration(e.data);
      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.time_str = `${hour}:${minute}:${second}`;
    };
  },
  destroyed() {
    timer_worker.postMessage({});
    this.$emit("end", this.time_str);
    timer_worker = null;
  },
  filters: {
    fillIn(val) {
      let num = Number(val);
      if (num < 10) {
        return `0${num}`;
      } else {
        return num;
      }
    }
  }
};
</script>

<style lang="scss">
.x-timing {
  display: flex;
  align-items: center;

  .xt-porint {
    display: block;
    height: 10px;
    width: 10px;
    background-color: $rootColor;
    border-radius: 50%;
    margin-right: 5px;
  }
  .xt-time {
    color: $white;
    font-size: 13px;
  }
}
</style>
