<template>
  <img v-if="lazy" ref="xi" class="x-img" @click="onClick" v-lazy="imgPath" @load="$emit('load')" />
  <img v-else ref="xi" class="x-img noLazy" @click="onClick" :src="imgPath" />
</template>

<script>
import Http from '@/utils/http/index.ws.js'
const URL_PREFIX = /^ *(http|https).*/
const URL_BEGIN = /^\/.*/
const RELATIVELY = /^\.{1,2}\/.*/
const IMG_SUFFIX = /\.(jpg|jpeg|png|gif)$/
const DATA_PREFIX = /^data:/
const IMG_KEY = /^([-0-9]+)-/
import { ymd, getBase64Image } from '@/utils/formant.util.js'
import lf from '../utils/http/localforage.min'
import strg from '@/utils/storage.util.js'
export default {
  props: {
    src: String,
    cache: {
      // 开启缓存获取
      type: [Boolean, String],
      default: false
    },
    dft: {
      // 默认图片
      type: [Boolean, String],
      default: false
    },
    lazy: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      random: '',
      loaded: false
    }
  },
  computed: {
    imgPath() {
      let path
      if (this.dft && !this.src) {
        if (this.dft === true) {
          return Http.url_base + '/download/media/0-0-0-ico.png'
        } else {
          return Http.url_base + '/download/media/' + this.dft
        }
      }
      if (URL_PREFIX.test(this.src)) {
        path = this.src
      } else {
        if (RELATIVELY.test(this.src)) {
          // ./
          path = this.src
        } else if (URL_BEGIN.test(this.src)) {
          // /
          path = Http.url_base + '/download/media' + this.src
        } else if (DATA_PREFIX.test(this.src)) {
          path = this.src
        } else {
          path = Http.url_base + '/download/media/' + this.src
        }
      }

      if (!this.cache) return path
      if (this.src) {
        let key = this.src.replace(IMG_SUFFIX, '').replace(IMG_KEY, '')
        // 从本地取图片的数据
        let time = ymd(new Date())
        // console.log(this.cache, this.src, key, strg.number_map);
        // 查询缓存数据
        if (strg.number_map[this.cache]) {
          // 获取本地资源或返回地址
          path = strg.getCache('img', this.cache, this.src, file_data => {
            $(`.msg-${this.cache}`).attr('src', file_data)
            this.$emit('load')
          })

          if (path) {
            return path
          }
        } else {
          // 本地没有数据
          try {
            // 跨域问题需要服务器支持
            // let image = new Image();
            // image.src = path;
            // image.setAttribute("crossOrigin", "Anonymous");
            // image.onload = function() {
            //   let base64 = getBase64Image(image);
            //   lf.setItem(`${key}{${time}}@img`, base64);
            //   strg.update(key, "img");
            // };
          } catch (error) {
          } finally {
            return path
          }
        }
      }
    }
  },
  mounted() {
    let xi = this.$refs.xi
    if (xi) {
      xi.onload = () => {
        this.$emit('load')
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>
