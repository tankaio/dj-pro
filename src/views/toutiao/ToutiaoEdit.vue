<template>
  <div class="page-ToutiaoEdit-root">
    <x-header :click-left="onClickLeft">
      <van-button size="small" plain round :disabled="canIPublish" @click="onPublish">发布</van-button>
    </x-header>
    <div class="setType">
      <div class="label">设置类型：</div>
      <van-dropdown-menu>
        <van-dropdown-item v-model="typeModel" :options="typeData" />
      </van-dropdown-menu>
      <div class="pricePut" v-if="typeModel === 1"><van-field label="收费:" type="number" v-model="price" />积分</div>
    </div>
    <!-- 标题 -->
    <div class="spacing-8" />
    <van-field v-model="title" placeholder="标题:最多可以输入40个字符" clearable />
    <!-- 正文编辑,以及正文图片上传 -->
    <div class="spacing-8" />
    <div class="body">
      <x-editor
        ref="xe1"
        @click="editor = 'xe1'"
        v-model="mainText"
        placeholder="内容:正文2000字以内，选中色块调整文字颜色。"
        class="editor"
        @update-color="updateColor"
      />
      <!-- <van-field
        type="textarea"
        :style="{ color: colorOptions[colorActive] }"
        v-model="mainText"
        placeholder="内容:正文2000字以内，选中色块调整文字颜色。"
      /> -->
      <x-uploader />
    </div>
    <!-- 打赏可见内容编辑区 -->
    <template v-if="typeModel">
      <div class="spacing-8" />
      <div class="hidden">
        <x-editor
          ref="xe2"
          @click="editor = 'xe2'"
          v-model="hiddenText"
          placeholder="请输入隐藏内容"
          class="editor"
          @update-color="updateColor"
        />
        <!-- <van-field
          label="编辑打赏可见内容"
          :style="{ color: colorOptions[colorActive] }"
          type="textarea"
          v-model="hiddenText"
          placeholder="请输入隐藏内容"
        /> -->
        <x-uploader />
      </div>
    </template>

    <!-- 编辑控制区 -->
    <div class="editFooter" @touchstart.prevent.stop @click.prevent.stop>
      <span class="xIcon-emoji-toutiao" @click="selectEmoji" />
      <span
        v-for="(item, index) in colorOptions"
        :key="index"
        :style="{ backgroundColor: item }"
        :class="{ active: index === colorActive }"
        @click="e => changeColor(e, index)"
        @touchstart.stop="e => changeColor(e, index)"
      ></span>
      <van-button>
        沿用上期文字
      </van-button>
    </div>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xUploader from 'cpt/x-uploader.vue'
import xEditor from 'cpt/x-editor/x-editor.vue'

export default {
  components: { xHeader, xUploader, xEditor },
  data() {
    return {
      typeData: [
        { text: '所有内容可见', value: 0 },
        { text: '部分打赏可见', value: 1 },
        { text: '部分回复可见', value: 2 }
      ],
      typeModel: 0,
      price: '',
      title: '',
      mainText: false,
      hiddenText: false,
      colorOptions: ['#333333', '#FF0000', '#FF6600', '#0033FF'],
      colorActive: 0,
      editor: 'ex1'
    }
  },
  computed: {
    canIPublish() {
      if (this.typeModel === 0) {
        if (this.title !== '' && this.mainText) {
          return false
        }
      }
      if (this.typeModel === 1) {
        if (this.title !== '' && this.mainText && this.hiddenText && this.price !== '') {
          return false
        }
      }
      if (this.typeModel === 2) {
        if (this.title !== '' && this.mainText && this.hiddenText) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    onClickLeft() {
      if (this.mainText || this.hiddenText || this.title !== '') {
        G.$dialog
          .confirm({
            message: '是否保留本次的编辑'
          })
          .then(() => {})
          .catch(() => {
            this.back()
          })
      } else {
        this.back()
      }
    },
    onPublish() {
      this.$notify({
        message: '头条发表成功！'
      })
      this.back()
      console.log(this.$refs[this.editor].getVal())
    },
    updateColor(color) {
      let idx = this.colorOptions.findIndex(ele => {
        return ele === color
      })
      this.colorActive = idx
    },
    selectEmoji() {},
    changeColor(e, index) {
      this.colorActive = index
      this.$refs[this.editor].setColor(this.colorOptions[this.colorActive])
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>

<style lang="scss">
.page-ToutiaoEdit-root {
  //   background-color: $gray-f5;
  padding-bottom: 48.5px;
  .editor {
    // height: 200px;
    // border: 1px solid #f69;
  }
  .xh-right {
    .van-button {
      background-color: transparent;
      color: $white;
      height: 24px;
      line-height: 24px;
    }
  }
  .setType {
    display: flex;
    height: 50px;
    padding: 0 15px;
    font-size: 15px;
    background-color: $white;
    .label {
      white-space: nowrap;
      line-height: 50px;
      color: $gray-66;
      font-size: inherit;
    }
    .van-dropdown-menu {
      flex: 1;
      &::after {
        display: none;
      }
      .van-dropdown-menu__item {
        justify-content: flex-start;
      }
    }

    .pricePut {
      display: flex;
      white-space: nowrap;
      align-items: center;
      color: $gray-66;
      .van-field {
        padding: 10px 0;
        font-size: 15px;
        .van-field__label {
          width: unset;
          color: $gray-66;
        }
        .van-cell__value {
          width: 50px;
          border: 1px solid $gray-d6;
          border-radius: 5px;
          margin: 0 3px;
          color: $txt;
          .van-field__control {
            text-align: center;
          }
        }
      }
    }
  }
  .spacing-8 {
    padding-top: 8px;
    background-color: $gray-f5;
  }
  .body,
  .hidden {
    background-color: $white;
    .x-uploader {
      margin-left: 15px;
      margin-top: 15px;
    }
  }
  .hidden .van-field {
    .van-cell__title {
      width: unset;
      font-size: 15px;
      color: $gray-66;
    }
    display: block;
  }
  .van-cell::after {
    display: none;
  }
  .editFooter {
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 48.5px;
    background-color: $gray-f5;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    > span {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      &.active {
        width: 30px;
        height: 30px;
        border: 4px solid $white;
        box-sizing: border-box;
      }
    }
    .van-button {
      font-size: 13px;
      color: $gray-66;
      height: 30px;
      line-height: 30px;
    }
  }
  .van-field__control,
  .van-cell__value--alone,
  .van-cell__value {
    color: inherit;
  }
}
</style>
