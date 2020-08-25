<!--
    小表情总面板
-->

<template>
  <div class="cont">
    <div
      id="panel"
      class="cont panel"
      @animationend="onAnimEnd"
      @touchstart="ontouchstart"
      @touchmove.passive="ontouchmove"
      @touchend="ontouchend"
    >
      <x-emoji-wx-sub
        v-for="item in pagedata"
        :key="item.id"
        :style="{ left: item.left }"
        :initid="item.sid"
        :pmoved="moved"
        @emoji="onemoji"
      />
    </div>
    <div class="slide">
      <div v-for="item in slideList" :key="item.id" class="dot dotbk" :style="{ left: item.left }" @click="onslidetouch(item.id)"></div>
      <div id="slide" class="dot dotsel" style="left: -40px"></div>
    </div>
  </div>
</template>

<script>
import xEmojiWxSub from 'cpt/x-room/x-emoji-wx-sub.vue'
export default {
  components: {
    xEmojiWxSub
  },
  data() {
    return {
      moved: false,
      pagedata: [
        { id: 0, sid: 81, left: 0, left2: 0 },
        { id: 1, sid: 1, left: '14.3%', left2: '-100%' },
        { id: 2, sid: 21, left: '28.6%', left2: '-200%' },
        { id: 3, sid: 41, left: '42.9%', left2: '-300%' },
        { id: 4, sid: 61, left: '57.1%', left2: '-400%' },
        { id: 5, sid: 81, left: '71.4%', left2: '-500%' },
        { id: 6, sid: 1, left: '85.7%', left2: '-600%' }
      ],

      startX: 0, // 触控开始时的x
      curPageLeft: 0, // 当前页的左坐标（触控开始时保存本页左侧坐标）
      curPageInd: 1, // 当前页的页码
      dstPageInd: 1, // 目标页的页码
      dstSlideInd: 0, // 目标滑块的页码
      inAnimation: false, // 是否处在动画状态
      pageAnimList: ['pleft', 'p1', 'p2', 'p3', 'p4', 'p5', 'pright'], // 页面动画

      // 滑块
      slideList: [
        { id: 0, left: '-40px' },
        { id: 1, left: '-20px' },
        { id: 2, left: '0' },
        { id: 3, left: '20px' },
        { id: 4, left: '40px' }
      ],
      // 滑块动画
      slideAnimList: [
        { name: 's1', left: '-40px' },
        { name: 's2', left: '-20px' },
        { name: 's3', left: '0' },
        { name: 's4', left: '20px' },
        { name: 's5', left: '40px' }
      ]
    }
  },
  methods: {
    onemoji(id) {
      this.$emit('setemoji', id)
    },
    // 触控开始
    ontouchstart(e) {
      if (this.inAnimation) return
      this.startX = e.touches[0].clientX
      this.curPageLeft = document.getElementById('panel').offsetLeft // 记录当前left值
    },
    // 触控滑动
    ontouchmove(e) {
      if (this.inAnimation) return

      // 5像素以上的移动禁止触动表情
      let delta = e.touches[0].clientX - this.startX
      if (delta > 5 || delta < -5) this.moved = true
      else this.moved = false

      // 页面随手移动
      let panel = document.getElementById('panel')
      panel.style.left = (this.curPageLeft + delta).toString() + 'px'
    },
    // 触控结束
    ontouchend(e) {
      if (this.inAnimation) return
      // 此移动幅度未达到翻页标准，可以点击输入表情
      let panel = document.getElementById('panel')
      if (false == this.moved) {
        panel.style.left = this.curPageLeft.toString() + 'px'
        return
      }

      // 未达到翻页幅度
      let delta = e.changedTouches[0].clientX - this.startX
      if (delta >= -20 && delta <= 20) {
        this.dstPageInd = this.curPageInd
        let classVal = panel.getAttribute('class')
        classVal += ' ' + this.pageAnimList[this.dstPageInd]
        panel.setAttribute('class', classVal)
      }
      // 达到翻页幅度
      else {
        if (delta < -20) {
          this.dstPageInd++
        } else {
          this.dstPageInd--
        }
        let classVal = panel.getAttribute('class')
        classVal += ' ' + this.pageAnimList[this.dstPageInd]
        panel.setAttribute('class', classVal)

        // 滑块动画
        if (6 == this.dstPageInd) this.dstSlideInd = 0
        // 表情目标页为第7页，换快目标页回到第1页
        else if (0 == this.dstPageInd) this.dstSlideInd = 4
        // 表情目标页为第1页，换快目标页回到第5页
        else this.dstSlideInd = this.dstPageInd - 1 // 表情目标页为第2-6页，换快目标页对应第1-5页

        if (this.dstPageInd > 0 && this.dstPageInd < 6) {
          let slide = document.getElementById('slide')
          classVal = slide.getAttribute('class')
          classVal += ' ' + this.slideAnimList[this.dstSlideInd].name
          slide.setAttribute('class', classVal)
        }
      }

      // 标记动画开始
      this.inAnimation = true
    },
    // 动画结束
    onAnimEnd() {
      let dstind = this.dstPageInd
      // 表情页动画结束 *******************************
      if (6 == this.dstPageInd) this.dstPageInd = 1
      // 目标页为最后一页，回到第1页
      else if (0 == this.dstPageInd) this.dstPageInd = 5 // 目标页为最前页，回到第5页

      // 记录最后的left坐标
      let panel = document.getElementById('panel')
      panel.style.left = this.pagedata[this.dstPageInd].left2
      // 保存本页信息
      this.curPageInd = this.dstPageInd
      // 删除动画样式
      let classVal = panel.getAttribute('class')
      classVal = classVal.replace(' ' + this.pageAnimList[dstind], '')
      panel.setAttribute('class', classVal)
      // 清除移动状态，以便点击表情
      this.moved = false

      // 滑块动画结束 *********************************
      let slide = document.getElementById('slide')
      slide.style.left = this.slideAnimList[this.dstSlideInd].left
      classVal = slide.getAttribute('class')
      classVal = classVal.replace(' ' + this.slideAnimList[this.dstSlideInd].name, '')
      slide.setAttribute('class', classVal)

      // 标记动画结束
      this.inAnimation = false
    },
    // 直接点击某滑块
    onslidetouch(id) {
      if (this.inAnimation) return
      // 翻页动画
      let panel = document.getElementById('panel')
      this.dstPageInd = id + 1
      let classVal = panel.getAttribute('class')
      classVal += ' ' + this.pageAnimList[this.dstPageInd]
      panel.setAttribute('class', classVal)

      // 滑块动画
      let slide = document.getElementById('slide')
      this.dstSlideInd = id
      classVal = slide.getAttribute('class')
      classVal += ' ' + this.slideAnimList[id].name
      slide.setAttribute('class', classVal)

      // 标记动画开始
      this.inAnimation = true
    }
  }
}
</script>

<style scoped>
.cont {
  position: absolute;
  height: 188px;
  width: 100vw;
  overflow: hidden;
}
.panel {
  left: -100%;
  width: 700%;
  display: flex;
}
.slide {
  position: absolute;
  height: 16px;
  line-height: 16px;
  top: 152px;
  left: 50%;
  transform: translateX(-50%); /* 50%为自身尺寸的一半 */
}
.dot {
  position: absolute;
  border-radius: 50%;
  display: inline-block;
  transform: translateX(-50%); /* 50%为自身尺寸的一半 */
}
.dotbk {
  top: 1px;
  background: rgb(204, 204, 204);
  width: 6px;
  height: 6px;
}
.dotsel {
  background: gray;
  width: 8px;
  height: 8px;
}

/************* 页动画 *************/
.pleft {
  animation: pleftkey 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: pleftkey 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: pleftkey 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes pleftkey {
  100% {
    left: 0;
  }
}
@-moz-keyframes pleftkey {
  100% {
    left: 0;
  }
}
@-webkit-keyframes pleftkey {
  100% {
    left: 0;
  }
}

.p1 {
  animation: p1key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: p1key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: p1key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes p1key {
  100% {
    left: -100%;
  }
}
@-moz-keyframes p1key {
  100% {
    left: -100%;
  }
}
@-webkit-keyframes p1key {
  100% {
    left: -100%;
  }
}

.p2 {
  animation: p2key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: p2key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: p2key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes p2key {
  100% {
    left: -200%;
  }
}
@-moz-keyframes p2key {
  100% {
    left: -200%;
  }
}
@-webkit-keyframes p2key {
  100% {
    left: -200%;
  }
}

.p3 {
  animation: p3key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: p3key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: p3key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes p3key {
  100% {
    left: -300%;
  }
}
@-moz-keyframes p3key {
  100% {
    left: -300%;
  }
}
@-webkit-keyframes p3key {
  100% {
    left: -300%;
  }
}

.p4 {
  animation: p4key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: p4key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: p4key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes p4key {
  100% {
    left: -400%;
  }
}
@-moz-keyframes p4key {
  100% {
    left: -400%;
  }
}
@-webkit-keyframes p4key {
  100% {
    left: -400%;
  }
}

.p5 {
  animation: p5key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: p5key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: p5key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes p5key {
  100% {
    left: -500%;
  }
}
@-moz-keyframes p5key {
  100% {
    left: -500%;
  }
}
@-webkit-keyframes p5key {
  100% {
    left: -500%;
  }
}

.pright {
  animation: prightkey 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: prightkey 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: prightkey 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes prightkey {
  100% {
    left: -600%;
  }
}
@-moz-keyframes prightkey {
  100% {
    left: -600%;
  }
}
@-webkit-keyframes prightkey {
  100% {
    left: -600%;
  }
}

/************* 滑块动画 *************/
.s1 {
  animation: s1key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: s1key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: s1key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes s1key {
  100% {
    left: -40px;
  }
}
@-moz-keyframes s1key {
  100% {
    left: -40px;
  }
}
@-webkit-keyframes s1key {
  100% {
    left: -40px;
  }
}

.s2 {
  animation: s2key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: s2key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: s2key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes s2key {
  100% {
    left: -20px;
  }
}
@-moz-keyframes s2key {
  100% {
    left: -20px;
  }
}
@-webkit-keyframes s2key {
  100% {
    left: -20px;
  }
}

.s3 {
  animation: s3key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: s3key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: s3key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes s3key {
  100% {
    left: 0;
  }
}
@-moz-keyframes s3key {
  100% {
    left: 0;
  }
}
@-webkit-keyframes s3key {
  100% {
    left: 0;
  }
}

.s4 {
  animation: s4key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: s4key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: s4key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes s4key {
  100% {
    left: 20px;
  }
}
@-moz-keyframes s4key {
  100% {
    left: 20px;
  }
}
@-webkit-keyframes s4key {
  100% {
    left: 20px;
  }
}

.s5 {
  animation: s5key 0.3s;
  animation-fill-mode: forwards;
  -moz-animation: s5key 0.3s;
  -moz-animation-fill-mode: forwards;
  -webkit-animation: s5key 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes s5key {
  100% {
    left: 40px;
  }
}
@-moz-keyframes s5key {
  100% {
    left: 40px;
  }
}
@-webkit-keyframes s5key {
  100% {
    left: 40px;
  }
}
</style>
