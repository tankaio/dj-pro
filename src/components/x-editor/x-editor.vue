<template>
  <div
    class="x-editor"
    contenteditable="true"
    ref="editor"
    @focus="onFocus"
    @click="onClick"
    @touchstart="onTouchStart"
    @blur="onBlur"
    @input="onInput"
    @change="onChange"
    @keydown.enter="onKeydownEnter"
    @keydown.delete="onKeydownDelete"
    @keydown="keyDown"
    @keypress="keyPress"
    @keyup="keyUp"
    :data-pl="placeholder"
    :class="{ closePlace: isPut }"
  >
    <p class="xe_line">
      <span class="active-cursor block"></span>
    </p>
    <!-- <p class="xe_line">
      1212 <img class="emoji" src="https://avatar-static.segmentfault.com/425/294/4252947906-567bef663f266_big64" />
      <span class="block"></span>
    </p> -->
  </div>
</template>

<script>
import core from './core'
const PL = /^\ufeff$/
const HAS_PL = /\ufeff/g
// FIXME 需要重构
export default {
  name: 'x-editor',
  props: {
    placeholder: String,
    isPut: {
      type: Boolean,
      default: false
    }
  },
  model: {
    event: 'sync',
    prop: 'isPut'
  },
  data() {
    return {
      anchor: 0,
      range: undefined,
      preCaretRange: undefined,
      sel: undefined,
      color: '',
      activeNode: undefined,
      isFoucs: false,
      itemAnchor: 0
    }
  },
  methods: {
    onKeydownEnter(e) {
      // 拦截回车事件,定制回车动作
      e.preventDefault()
      //   移除已经标记的当前激活的块
      $(this.$editor)
        .find('.active-cursor')
        .removeClass('active-cursor')
      // 当前光标所在的元素,有可能是文字节点
      let $baseNode = this.sel.baseNode
      //   创建一个 p 元素
      let $p
      //   当前是否选中 color , 有则在 p 元素中添加 块元素,并将块元素设为激活
      if (this.color) {
        //   保存当前激活的元素
        this.activeNode = this.createNode(
          'span',
          {
            class: 'active-cursor block',
            style: `color:${this.color}`,
            dataC: this.color
          },
          '&#65279;'
        )
        $p = this.createNode(
          'p',
          {
            class: 'xe_line'
          },
          this.activeNode
        )
      } else {
        $p = this.createNode(
          'p',
          {
            class: 'xe_line'
          },
          this.createNode('br')
        )
      }

      //   元素节点 且 为 p 元素
      if ($baseNode.nodeType === 1 && $($baseNode).hasClass('xe_line')) {
        // 当前为段落 p 元素
        $($baseNode).after($p)
      } else {
        // console.log($baseNode.nodeType)
        if ($baseNode.nodeType !== 1) {
          // 其他节点
          $baseNode = $baseNode.parentNode || $baseNode.parentElement
        }
        if (!$($baseNode).hasClass('xe_line')) {
          $baseNode = $($baseNode).parent('.xe_line')
        }
        // 将新行插入当前行之后
        $($baseNode).after($p)
      }
      let $next = $($baseNode).next()
      //   获取新加行,将光标移至新加行
      if ($next.length) {
        this.sel.collapse($next[0], 0)
      }
      //   剔除空色块
      this.cullNullColorBlock()
    },
    // 剔除空的
    cullNullColorBlock() {
      // 剔除空color-block 元素
      $('.x-editor .block').each((idx, el) => {
        el = $(el)
        if (!el.hasClass('active-cursor')) {
          let html = el.html() || ''
          if (PL.test(html)) {
            el.remove()
          }
        }
      })
    },
    //软键盘删除键不会触发该事件
    onKeydownDelete(e) {
      this.cullNullColorBlock()
      //   console.log('delete')
    },
    keyDown(e) {
      if (e.keyCode === 8 && this.$editor.innerText.length == 0) {
        e.preventDefault()
        e.stopPropagation()
      }
      //   console.log(e, 'keydown')
    },
    keyPress(e) {
      //   console.log(e, 'keypress')
    },
    keyUp(e) {
      //   console.log(e, 'keyup')
    },
    onFocus(e) {
      this.isFoucs = true
      this.$emit('focus')
      this.saveRangeAt()
      this.updateAttr()
    },
    onClick(e) {
      this.$emit('click')
      this.saveRangeAt()
      this.updateAttr()
      this.updateColor()
    },
    onTouchStart(e) {
      this.saveRangeAt()
    },
    onBlur(e) {
      this.isFoucs = false
    },
    onInput(e) {
      this.updateAttr()
      this.saveRangeAt()
      //   this.isPut = true
      this.$emit('sync', true)
      G.delay(() => {
        this.updateColor()
        let html = $(this.$editor).html()
        // console.log(html)
        if (this.color && (!html || html === '<p class="xe_line"></p>' || html === '<p class="xe_line"><br></p>')) {
          this.activeNode = this.createNode(
            'span',
            {
              class: 'active-cursor block',
              style: `color:${this.color}`,
              dataC: this.color
            },
            '&#65279;'
          )
          let $p = this.createNode(
            'p',
            {
              class: 'xe_line'
            },
            this.activeNode
          )
          $(this.$editor).html($p)
          this.sel.collapse(this.activeNode, 0)
          //   this.isPut = false
          this.$emit('sync', false)
        }
      }, 150)
      //   剔除占位符
      //    &#65279;
      let $baseNode = this.sel.baseNode
      let data = $baseNode.data
      if (data && data.length >= 2 && HAS_PL.test(data)) {
        if ($baseNode.nodeType === 3) {
          $baseNode = $baseNode.parentNode || $baseNode.parentElement
        }

        $baseNode.innerHTML = data.replace(HAS_PL, '')
        // this.updateAttr()
        this.sel.collapse($baseNode, 1)
        // let { anchor } = core.getCursortPosition($baseNode)
        // core.setCaretPosition($baseNode, anchor)
      } else if (data === undefined) {
        $($baseNode).remove()
      }
      //  删除时剔除空
    },
    onChange() {
      //   console.log(e, 'change')
    },
    // 保存光标位置
    saveRangeAt() {
      let { anchor, range } = core.getCursortPosition(this.$editor)
      this.anchor = anchor
      this.range = range
    },
    saveItemRangeAt(element) {
      let { anchor, range } = core.getCursortPosition(element)
      this.itemAnchor = anchor
    },
    // 创建dom
    createNode(ele, attr, content) {
      let $ele = document.createElement(ele)
      _(attr).forEach((val, key) => {
        $ele.setAttribute(G.kebabCase(key), val)
      })
      if (content) {
        if (G.isStr(content)) {
          $ele.innerHTML = content
        } else {
          $ele.appendChild(content)
        }
      }
      return $ele
    },
    // 更新颜色
    updateColor() {
      let $baseNode = this.sel.baseNode
      if ($baseNode.nodeType !== 1) {
        // 其他节点
        $baseNode = $baseNode.parentNode || $baseNode.parentElement
      }
      let color = $($baseNode).attr('data-c')
      this.$emit('update-color', color || '#333333')
      this.color = color || '#333333'
    },
    // 更新属性
    updateAttr() {
      let [sel, range, preCaretRange] = core.updateAttr(this.$editor)
      //   console.log(sel, range, preCaretRange)
      this.sel = sel
      this.range = range
      this.preCaretRange = preCaretRange
    },
    // 改变颜色
    setColor(color) {
      //   console.log(this.isFoucs)
      if (!this.isFoucs) {
        return
      }
      this.color = color
      $(this.$editor)
        .find('.active-cursor')
        .removeClass('active-cursor')
      let $baseNode = this.sel.baseNode
      let $span = this.createNode(
        'span',
        {
          class: 'active-cursor block',
          style: `color:${color}`,
          dataC: color
        },
        '&#65279;'
        /* ,$cursor */
      )

      if ($baseNode.nodeType !== 1) {
        // 其他节点
        $baseNode = $baseNode.parentNode || $baseNode.parentElement
      }
      if ($($baseNode).hasClass('block')) {
        $baseNode = $($baseNode).parent()[0]
      }
      let $br = $($baseNode).find('br')
      if ($br) $br.remove()
      //   this.range.selectNode($baseNode)
      //   this.range.insertNode($span)
      $($baseNode).append($span)
      this.activeNode = $($baseNode).find('.active-cursor')[0]
      this.sel.collapse(this.activeNode, 1)
    },
    //
    getVal() {
      return $(this.$editor).html()
    }
  },
  created() {},
  mounted() {
    this.$editor = this.$refs.editor
  }
}
</script>

<style lang="scss">
.x-editor {
  position: relative;
  padding: 15px;
  border: none;
  outline: none;
  min-height: 50px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  .xe_line {
    min-width: 100%;
    min-height: 19px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    &::after {
      position: absolute;
      display: block;
      content: '';
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 1px;
      background-color: $gray-d5;
      transform: rotateX(80deg);
    }
    .block {
      display: inline-block;
      min-width: 1px;
      min-height: 19px;
      line-height: 19px;
    }
    .emoji {
      width: 19px;
      height: 19px;
      display: inline-block;
      margin: 0 2px;
    }
  }
  &.closePlace {
    &::before {
      display: none;
    }
  }
  &:before {
    content: attr(data-pl);
    display: block;
    position: absolute;
    color: $gray-99;
    font-size: 13px;
    height: 19px;
    line-height: 19px;
  }
}
</style>
