<template>
  <div class="emoji">
    <div class="emoji-content">
      <div v-for="(item,index) of 3" :key="index">
        <div style="height:40px;backgroundColor:#ccc;"></div>
        <div style="height:40px;backgroundColor:#ddd;"></div>
        <div style="height:40px;backgroundColor:#eee;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "x-emoji"
};
</script>

<style lang="scss">
.emoji {
  height: 210px;
  background-color: $avatarFill2;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>