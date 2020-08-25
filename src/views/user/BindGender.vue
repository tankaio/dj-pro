<template>
  <!-- <x-bind-page rootClass="gender">
    <van-cell is-link @click="audio = 0" :class="audio | audioFilter(0)">
      <span class="custom-title">女</span>
      <span class="xIcon-female-gender"></span>
    </van-cell>
    <van-cell is-link @click="audio = 1" :class="audio | audioFilter(1)">
      <template slot="title">
        <span class="custom-title">男</span>
        <span class="xIcon-male-gender"></span>
      </template>
    </van-cell>
    <template slot="btns">
      <van-button type="danger" @click="SetSex">
        确认
      </van-button>
    </template>
  </x-bind-page>-->
  <x-layout modifier="gender">
    <template #header>
      <x-header :left-arrow="false">
        <template slot="left">取消</template>
      </x-header>
    </template>
    <van-cell is-link @click="audio = 0" :class="audio | audioFilter(0)">
      <span class="custom-title">女</span>
      <span class="xIcon-female-gender"></span>
    </van-cell>
    <van-cell is-link @click="audio = 1" :class="audio | audioFilter(1)">
      <template slot="title">
        <span class="custom-title">男</span>
        <span class="xIcon-male-gender"></span>
      </template>
    </van-cell>
    <div class="btn">
      <van-button type="danger" @click="SetSex">确认</van-button>
    </div>
  </x-layout>
</template>

<script>
import { SetSex } from "@/api/user";
import { mapGetters, mapMutations } from "vuex";

import xBindPage from "cpt/x-bind-page.vue";

export default {
  components: {
    xBindPage
  },
  data() {
    return {
      phone: "",
      audio: ""
    };
  },
  methods: {
    ...mapMutations(["setGander"]),
    async SetSex() {
      let { ok, msg } = await SetSex({ sex: this.audio });
      if (ok) {
        this.setGander(this.audio);
        this.$notify({
          type: "success",
          message: "性别修改成功"
        });
        this.go(-1);
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    userSex() {
      switch (this.userInfo.sex) {
        case 0:
          return 0;
        case 1:
          return 1;
        default:
          return "";
      }
    }
  },
  filters: {
    audioFilter(old, v) {
      return old === v ? "audio" : "";
    }
  },
  created() {
    this.audio = this.userSex;
  }
};
</script>

<style lang="scss">
.page-gender-root {
  background-color: $white;
  .custom-title {
    margin-right: 14px;
  }
  .van-icon-arrow:before {
    display: none;
  }
  .audio .van-icon-arrow:before {
    display: inline-block;
    content: "";
    color: $rootColor;
    border-right: 2px solid $rootColor;
    border-bottom: 2px solid $rootColor;
    width: 8px;
    height: 15px;
    transform: translateY(-30%) rotateZ(45deg);
  }
  .btn {
    text-align: center;
    .van-button {
      width: 290px;
      margin-top: 40px;
      border-radius: 5px;
    }
  }
}
</style>
