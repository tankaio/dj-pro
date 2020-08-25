<!--
    支持表情的输入框组件：支持微信的100个表情
-->

<template>
  <div class="roomPut" contenteditable="true" spellcheck="false" @focus="onFocus" @blur="onBlur" @click="onClick" @input="onInput"></div>
</template>

<script>
import emojis from '@/vendor/emojiMap.js'
export default {
  mounted() {
    this.$nextTick(() => {
      // 干掉IE http之类地址自动加链接
      try {
        document.execCommand('AutoUrlDetect', false, false)
      } catch (e) {}
    })
  },
  data() {
    return {
      lastEditRange: null, // 记录最后选区
      isfocus: false, // 是否获取了焦点

      modeChanging: false, // 是否正在进入表情模式，此值为true时，代表正在进行模式转换函数，focus 事件将不被提交到父组件
      emojiMode: false, // 是否进入了表情模式
      anchorInText: false, // 锚点是否在文本中央
      anchorOffset: 0, // 若锚点在文本中，在第几个字符之后
      anchorParent: null, // 锚点在文本之外，此为锚点定位元素
      lastEmoji: null, // 最后一次插入的表情元素
      isDelEmoji: false // 本次是否执行了删除操作（若执行了，退出表情模式时就把光标放到最后）
    }
  },
  methods: {
    // **************************************************************************
    // 事件响应
    // **************************************************************************

    // 记录当前选区
    _saveRange() {
      let sel = window.getSelection()
      if (sel.rangeCount > 0) this.lastEditRange = sel.getRangeAt(0)
    },

    // 按键点击
    onClick() {
      this._saveRange()
      this.isfocus = true
    },

    // 聚焦
    onFocus() {
      // 若此时处于模式转换过程中，不向父组件提交
      if (this.modeChanging) {
        return
      }
      this.$emit('focus')
      // 记录获取了焦点
      this.isfocus = true

      // 通知父组件已聚焦，若此时为表情模式，父组件将取消表情模式
      this.$emit('focus')

      // 如果ios不是原生键盘（可能不止ios）则会键盘挡住输入框，当bottom=0的情况，使用此属性就可滚动屏幕中央
      setTimeout(() => {
        this.$el.scrollIntoView(true)
      }, 300)

      // 保存当前选区
      this._saveRange()
    },
    // 失焦
    onBlur() {
      // 若此时处于模式转换过程中，不记录失焦信息
      if (this.modeChanging) {
        return
      }
      this.$emit('blur')
      // 保存当前选区
      this._saveRange()

      // 延迟记录失去焦点
      setTimeout(() => {
        this.isfocus = false
      }, 300)
    },
    // 用户输入，通知父组件v-model，提交文本内容和自身当前高度
    onInput() {
      this.$emit('input', {
        talk: this.getTalk(),
        height: this.$el.clientHeight
      })
      this._saveRange()
    },

    // **************************************************************************
    // 表情处理
    // **************************************************************************

    // 光标移动到最后
    _moveCursorToEnd() {
      try {
        this.$el.focus() //解决ff不获取焦点无法定位问题
        let sel = getSelection()
        sel.removeAllRanges()
        let range = document.createRange()
        if (null != this.$el.firstChild) {
          range.setStartBefore(this.$el.firstChild)
          range.setEndAfter(this.$el.lastChild, 0)
          sel.addRange(range)
          sel.collapseToEnd()
          this.lastEditRange = sel.getRangeAt(0)
        } else {
          this.lastEditRange = null
        }
      } catch (e) {}
    },

    // 在某元素后面插入元素
    _insertAfter(newElement, targetElement) {
      let parent = targetElement.parentNode
      if (parent.lastChild == targetElement) {
        parent.appendChild(newElement)
      } else {
        parent.insertBefore(newElement, targetElement.nextSibling)
      }
    },

    //** 进入表情模式，保存当前锚点，取消输入焦点（防止弹出软件盘）*********************************/
    /*** 在模式转换过程中需要获取焦点，此时置 modeChanging 为 true 以避免向父组件提交 focus 事件 ***/
    enterEmojiMode() {
      this.modeChanging = true // 标记模式转换中
      try {
        this.emojiMode = true
        this.lastEmoji = null
        this.isDelEmoji = false
        this.anchorParent = null
        this.anchorInText = false

        let sel = getSelection()

        // 恢复最后选区
        if (null != this.lastEditRange) {
          sel.removeAllRanges()
          sel.addRange(this.lastEditRange)
        }

        // 获取锚点元素
        let parent = sel.anchorNode

        // 锚点在父组件中
        if ('#text' != parent.nodeName) {
          this.anchorInText = false
          let len = parent.childNodes.length
          if (sel.anchorOffset < len) {
            this.anchorParent = parent.childNodes[sel.anchorOffset]
          } else {
            this.anchorParent = null
          }
        }
        // 锚点在子文本中
        else {
          this.anchorInText = true
          this.anchorParent = parent
          let range = sel.getRangeAt(0)
          this.anchorOffset = range.startOffset
        }
        // 放弃焦点
        this.$el.blur()
      } catch (e) {
        // 发生异常，默认把表情追加到最后
        this.lastEditRange = null
        this.lastEmoji = null
        this.anchorParent = null
        this.anchorInText = false
      }

      // *** 这里不要记录焦点已放弃，否则会导致表情面板在软键盘未消失前闪现
      // this.isfocus = false;  <--- 这行不要添加
      // **********************************************************

      // 模式转换完毕，等待避过此间发生的聚焦/失焦处理
      setTimeout(() => {
        this.modeChanging = false
      }, 300)
    },

    //** 退出表情模式，保存光标位置 ************************************************************/
    /*** 在模式转换过程中需要获取焦点，此时置 modeChanging 为 true 以避免向父组件提交 focus 事件 ***/
    exitEmojiMode() {
      this.modeChanging = true // 标记模式转换中

      try {
        this.emojiMode = false

        // 有执行了删除操作
        if (this.isDelEmoji) {
          this._moveCursorToEnd()
        }
        // 曾插入表情则返回
        else if (null != this.lastEmoji) {
          // 获取焦点
          this.$el.focus()

          // 获取选定对象
          let sel = getSelection()

          // 创建新的光标对象
          let range = document.createRange()
          let space = document.createTextNode(' ')
          this._insertAfter(space, this.lastEmoji)

          // 光标对象的范围界定为表情节点后的空格
          range.selectNodeContents(space)
          space.deleteData(0, 1)

          // 把光标位置定位表情节点后的空格里
          range.setStart(space, 0)
          range.setEnd(space, 0)

          // 使光标开始和光标结束重叠
          //range.collapse(true);

          // 清除选定对象的所有光标对象
          sel.removeAllRanges()

          // 插入新的光标对象
          sel.addRange(range)

          // 记录最后光标对象
          if (sel.type !== 'None') {
            this.lastEditRange = sel.getRangeAt(0)
          }

          // 放弃焦点
          this.$el.blur()
        }
      } catch (e) {
        this.lastEditRange = null
      }

      // 最后光标置空
      this.lastEmoji = null

      // *** 这里要记录焦点已放弃，这样下次启动表情模式才不用等待 300 毫秒
      this.isfocus = false // <-- 这行要添加

      // 模式转换完毕，等待避过此间发生的聚焦/失焦处理
      setTimeout(() => {
        this.modeChanging = false
      }, 300)
    },

    // 在当前光标处添加表情
    addEmoji(url) {
      if (false == this.emojiMode) return

      // 创建图片元素
      let emojiNode = document.createElement('img')
      emojiNode.setAttribute('src', url)
      emojiNode.setAttribute('style', 'vertical-align:middle;width:0.24rem;height:0.24rem;')

      // 已经插入了表情元素
      if (null != this.lastEmoji) {
        this._insertAfter(emojiNode, this.lastEmoji)
      }
      // 第一次执行插入操作
      else {
        // 锚点在文本中
        if (this.anchorInText) {
          // 截取文本，重新插入元素
          let textNode1 = document.createTextNode(this.anchorParent.data.substr(0, this.anchorOffset))
          let textNode2 = document.createTextNode(this.anchorParent.data.substr(this.anchorOffset))
          let parent = this.anchorParent.parentNode
          let nextNode = this.anchorParent.nextSibling
          this.anchorParent.remove()
          if (nextNode) {
            parent.insertBefore(textNode1, nextNode)
          } else {
            parent.appendChild(textNode1)
          }
          this._insertAfter(emojiNode, textNode1)
          this._insertAfter(textNode2, emojiNode)
        }
        // 锚点在父组件中
        else {
          if (null == this.anchorParent) {
            this.$el.appendChild(emojiNode)
          } else {
            this.anchorParent.parentNode.insertBefore(emojiNode, this.anchorParent)
          }
        }
      }

      // 记录最后一个插入的表情
      this.lastEmoji = emojiNode

      // 通知父组件v-model
      this.$emit('input', {
        talk: this.getTalk(),
        height: this.$el.clientHeight
      })
    },

    // 删除最后一个表情，若无表情则从最后一个字符开始删除
    delEmoji() {
      if (false == this.emojiMode) return
      // 先删表情
      let str = this.$el.innerHTML
      let count = str.length
      if (0 == count) return
      let indend = -1

      let del = false
      for (let i = count - 1; i >= 0; i--) {
        // 找到最后一个 >
        if (indend < 0) {
          if ('>' == str.charAt(i)) {
            indend = i
          }
        } else {
          if ('<' == str.charAt(i)) {
            str = str.substring(0, i) + str.substring(indend + 1)
            this.$el.innerHTML = str
            del = true
            break
          }
        }
      }

      // 删完表情删文字
      if (false == del && str.length > 0) {
        this.$el.innerHTML = str.substring(0, str.length - 1)
      }

      // 标记做过了删除操作
      this.isDelEmoji = true

      // 此后在表情模式未退出的情况继续插入表情，将插入到最后
      this.lastEmoji = null
      this.anchorParent = null
      this.anchorInText = false

      // 通知父组件v-model
      this.$emit('input', {
        talk: this.getTalk(),
        height: this.$el.clientHeight
      })
    },

    // 清除发言
    clearTalk() {
      this.$el.innerHTML = ''
      this.lastEditRange = null
      this.emojiMode = false
    },

    // 设置发言
    setTalk(txt) {
      this.$el.innerHTML = txt
      this._moveCursorToEnd()
      this.$emit('input', {
        talk: this.getTalk(),
        height: this.$el.clientHeight
      })
    },

    // 获取发言内容（表情转换成[wx001]格式）
    getTalk() {
      // 提取html，并把大写img标签转化为小写，把 &amp; 转化为 &；nbsp转为空格
      let str = this.$el.innerHTML
        .replace(/<IMG/g, '<x-img')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&nbsp/g, ' ')

      // 编历并追加到返回值
      let ret = ''
      let inimg = false // 是否位于img中
      let imgstr = '' // 图片元素
      for (let i = 0, count = str.length; i < count; i++) {
        let c = str.charAt(i)

        // 初次进入img区域
        if (false == inimg && '<' == c && i + 3 < count) {
          if ('img' == str.substring(i + 1, i + 4)) {
            inimg = true
            ret += '['
            imgstr = ''
            continue
          }
        }
        // 离开img区域
        else if (inimg && '>' == c) {
          imgstr = imgstr
            .replace('img', '')
            .replace('src', '')
            .replace('style', '')
            .replace('vertical-align:middle;width:0.24rem;height:0.24rem', '')
            .replace(/.png/g, '')
            .replace('margin-bottom:4px', '')
            .replace(/;/g, '')
            .replace(/=/g, '')
            .replace(/"/g, '')
            .replace(/'/g, '')
            .replace(/\s/g, '')
            .replace('http://dtapi-aj.xy50test.com/img/', '')
          ret += imgstr + ']'
          imgstr = ''
          inimg = false
          continue
        }

        // 已进入图片区域
        if (inimg) {
          imgstr += c
        }
        // 未进入图片区域
        else {
          ret += c
        }
      }

      // 替换微信表情映射
      let ret2 = ''
      let len = ret.length
      let inemoji = false
      let emojistr = ''
      for (let i = 0; i < len; i++) {
        let c = ret.charAt(i)
        if (inemoji) {
          if (']' == c) {
            inemoji = false
            if (null != emojis.wxMap[emojistr]) ret2 += 'wx' + emojis.wxMap[emojistr]
            else ret2 += emojistr
            ret2 += ']'
          } else {
            emojistr += c
          }
        } else {
          if ('[' == c) {
            inemoji = true
            emojistr = ''
          }
          ret2 += c
        }
      }
      if (inemoji) ret2 += emojistr

      return ret2
    }

    // 监听鼠标input事件
    // addInputEvent () {
    //     this.$el.addEventListener('input', () => {
    //         this.$emit('input', {talk:this.getTalk(), height: this.$el.clientHeight} );  // 通知父组件v-model
    //     })
    // },

    // 监听鼠标获取焦点事件
    // addFocusEvent () {
    //     this.$el.addEventListener('focus', () => {
    //         setTimeout(() => {
    //             // 解决：如果ios手机使用的不是原生键盘（也可能不止IOS手机有这个问题），则会出现键盘挡住输入框问题，当bottom=0的情况，使用这个属性就可以滚动屏幕中央
    //             this.$el.scrollIntoView(true);
    //         }, 300);
    //         this.$emit('focus');
    //     })
    // },

    // 监听复制事件，去除样式得到纯文本
    // addEventPaste: function (el) {
    //     // 干掉IE http之类地址自动加链接
    //     try { document.execCommand("AutoUrlDetect", false, false); } catch (e) {}

    //     // 监听复制paste事件，目的是为了让-webkit-user-modify属性兼容IE8，毕竟该属性在IE兼容性不好
    //     el.addEventListener('paste', function (e) {
    //         e.preventDefault();
    //         let text = null;
    //         if (window.clipboardData && clipboardData.setData) {
    //             // IE
    //             text = window.clipboardData.getData('text');
    //         }
    //         else {
    //             text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
    //         }
    //         // 这里的目的是为了将鼠标的光标移动到复制之后文本的末尾的末尾
    //         if (document.body.createTextRange) {
    //             if (document.selection) {
    //                 textRange = document.selection.createRange();
    //             }
    //             else if (window.getSelection) {
    //                 sel = window.getSelection();
    //                 let range = sel.getRangeAt(0);
    //                 // 创建临时元素，使得TextRange可以移动到正确的位置
    //                 let tempEl = document.createElement("span");
    //                 tempEl.innerHTML = "&#FEFF;";
    //                 range.deleteContents();
    //                 range.insertNode(tempEl);
    //                 textRange = document.body.createTextRange();
    //                 textRange.moveToElementText(tempEl);
    //                 tempEl.parentNode.removeChild(tempEl);
    //             }
    //             textRange.text = text;
    //             textRange.collapse(false);
    //             textRange.select();
    //         }
    //         else {
    //             // Chrome之类浏览器
    //             document.execCommand("insertText", false, text);
    //         }
    //     });

    //     this.$emit('input', {talk:this.getTalk(), height: this.$el.clientHeight} );  // 通知父组件v-model
    // },

    // 替换值
    // setValue (value) {
    //     this.$el.innerText = value;
    //     this.$emit('input', this.getValue());
    // },

    // 追加值
    // appendValue (value, bool) {
    //     this.$el.innerText += value;
    //     this.$emit('input', this.getValue());
    // },

    // 获取值
    // getValue () {
    //     return this.getHtmlToText();
    // },

    // 获取HTML转换之后的文本（去除div标签，替换<br/>为换行）
    // getHtmlToText () {
    //     return this.replaceToBreak(this.getHtml());
    // },

    // 获取HTML
    // getHtml () {
    //     return this.$el.innerHTML
    // },

    // 替换DIV到换行符
    // replaceToBreak (html) {
    //     html = String(html).replace(/<\/div>/gi, '');
    //     html = html.replace(/<div>(<br>)?(<br\/>)?/gi, '\n');
    //     html = html.replace(/<br>|<br\/>/gi, '\n');
    //     return html;
    // },

    // 获取纯text文本
    // getText () {
    //     if (window.navigator.appName.indexOf("Explorer") > -1)
    //         return this.$el.innerText;
    //     else
    //         return this.$el.textContent;
    // }

    // // 粘贴
    // onPaste (e) {
    //     // 提取文本
    //     e.preventDefault();
    //     let text = null;
    //     if (window.clipboardData && clipboardData.setData) {
    //         text = window.clipboardData.getData('text'); // IE
    //     }
    //     else {
    //         text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
    //     }
    //     // 这里的目的是为了将鼠标的光标移动到复制之后文本的末尾的末尾
    //     if (document.body.createTextRange) {
    //         if (document.selection) {
    //             textRange = document.selection.createRange();
    //         }
    //         else if (window.getSelection) {
    //             sel = window.getSelection();
    //             let range = sel.getRangeAt(0);
    //             // 创建临时元素，使得TextRange可以移动到正确的位置
    //             let tempEl = document.createElement("span");
    //             tempEl.innerHTML = "&#FEFF;";
    //             range.deleteContents();
    //             range.insertNode(tempEl);
    //             textRange = document.body.createTextRange();
    //             textRange.moveToElementText(tempEl);
    //             tempEl.parentNode.removeChild(tempEl);
    //         }
    //         textRange.text = text;
    //         textRange.collapse(false);
    //         textRange.select();
    //     }
    //     else {
    //         // Chrome之类浏览器
    //         document.execCommand("insertText", false, text);
    //     }
    // },
  },
  created() {
    this.$eventBus.$on('chat:add-emoji', url => this.addEmoji(url))
    this.$eventBus.$on('chat:del-emoji', () => this.delEmoji())
    this.$eventBus.$on('chat:enter-emoji', () => this.enterEmojiMode())
    this.$eventBus.$on('chat:exit-emoji', () => this.exitEmojiMode())
    this.$eventBus.$on('chat:blur', () => this.$el.blur())
    this.$eventBus.$on('chat:send-emoji', () => {
      this.clearTalk()
      this.$el.blur()
      this.isfocus = false
    })
    this.$on('hook:destroyed', () => {
      this.$eventBus.$off('chat:add-emoji')
      this.$eventBus.$off('chat:del-emoji')
      this.$eventBus.$off('chat:enter-emoji')
      this.$eventBus.$off('chat:exit-emoji')
      this.$eventBus.$off('chat:blur')
      this.$eventBus.$off('chat:send-emoji')
    })
  }
}
</script>

<style lang="scss">
.roomPut {
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto;
  _overflow-y: auto;
  -webkit-user-modify: read-write-plaintext-only; /* 只是编辑text文本，只能解决webkit内核里面问题，手机端适用 */
  -webkit-user-select: text; /* 解决IOS部分手机不支持contenteditable=true属性问题 */
  -webkit-overflow-scrolling: touch;
  position: relative;
  &.disable::after {
    content: '禁言中';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    text-align: center;
    line-height: 34px;
    pointer-events: unset;
  }
}
</style>
