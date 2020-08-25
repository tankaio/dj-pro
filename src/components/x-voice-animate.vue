<template>
  <div class="x-voice-animate">
    <div
      v-for="(item, index) in volumdata"
      :key="item.id"
      class="volum"
      :style="{ width: 0.11 + index * 0.05 + 'rem' }"
      :class="{ active: !!item.active }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "x-voice-animate",
  props: {
    volums: Number
  },
  data() {
    return {
      // volumdata: [
      //   { id: 0, width: ".11rem" },
      //   { id: 1, width: ".15rem" },
      //   { id: 2, width: ".19rem" },
      //   { id: 3, width: ".23rem" },
      //   { id: 4, width: ".27rem" },
      //   { id: 5, width: ".31rem" },
      //   { id: 6, width: ".35rem" }
      // ]
    };
  },
  computed: {
    volumdata() {
      let volumdata = [];
      for (let i = 0; i < 6; i++) {
        let data = {
          id: i,
          active: false
        };
        if (i <= this.volums) {
          data.active = true;
        }
        volumdata.push(data);
      }
      return volumdata;
    }
  },
  watch: {
    volum() {}
  }
};
</script>

<style lang="scss">
.x-voice-animate {
  position: relative;
  height: 65px;
  display: flex;
  justify-content: space-between;
  flex-direction: column-reverse;
  width: 37px;
  .volum {
    left: 7rem;
    height: 0;
    border-top: 5px solid gray;
    border-right: 2px solid transparent;
    &.active {
      border-top: 5px solid white;
    }
  }
}
</style>
