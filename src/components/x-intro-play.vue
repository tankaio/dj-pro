<template>
  <div class="introPlay">
    <div class="beginIntro">
      <h6>
        <slot name="h6"></slot>
      </h6>
    </div>
    <div class="introWarp">
      <h4 v-text="introTitle"></h4>
      <div class="txtWrap">
        <slot name="textWrap"></slot>
        <ul class="rulesWarp">
          <li v-for="(item,index) in rules" :key="index">
            <i>·</i>
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "x-intro-play",
  props: ["introTitle", "rules"]
};
</script>

<style lang="scss">
.introPlay {
  .beginIntro {
    margin-top: 15px;
  }
  .introWarp {
    margin-top: 20px;
    h4 {
      color: #d22018;
      font-size: 14px;
      font-weight: 600;
      &::before {
        content: "";
        display: inline-block;
        border: 6.5px solid;
        border-color: transparent transparent transparent #f24c28;
        transform: scaley(0.6);
      }
    }
    .txtWrap {
      margin-top: 10px;
      line-height: 23px;
      ul.rulesWarp li {
        display: flex;
      }
      ul.rulesWarp li i {
        font-weight: 600;
        color: $gray-66;
        padding-right: 2px;
      }
    }
  }
}
</style>