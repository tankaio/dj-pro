import Vue from 'vue'


//获取当前光标位置
// const getCursortPosition = function (element) {
//     var caretOffset = 0;
//     var doc = element.ownerDocument || element.document;
//     var win = doc.defaultView || doc.parentWindow;
//     var sel;
//     if (typeof win.getSelection != "undefined") {
//         //谷歌、火狐
//         sel = win.getSelection();
//         if (sel.rangeCount > 0) {
//             //选中的区域
//             var range = win.getSelection().getRangeAt(0);
//             var preCaretRange = range.cloneRange(); //克隆一个选中区域
//             preCaretRange.selectNodeContents(element); //设置选中区域的节点内容为当前节点
//             preCaretRange.setEnd(range.endContainer, range.endOffset); //重置选中区域的结束位置
//             caretOffset = preCaretRange.toString().length;
//         }
//     } else if ((sel = doc.selection) && sel.type != "Control") {
//         //IE
//         var textRange = sel.createRange();
//         var preCaretTextRange = doc.body.createTextRange();
//         preCaretTextRange.moveToElementText(element);
//         preCaretTextRange.setEndPoint("EndToEnd", textRange);
//         caretOffset = preCaretTextRange.text.length;
//     }
//     return caretOffset;
// };

const setCaretPosition = function (ctrl, pos) {
    if (ctrl.setSelectionRange) {

        ctrl.focus();

        ctrl.setSelectionRange(pos, pos);

    } else if (ctrl.createTextRange) {

        var range = ctrl.createTextRange();

        range.collapse(true);

        range.moveEnd('character', pos);

        range.moveStart('character', pos);

        range.select();

    }

};

// cursor 当input 文本右对齐时会出现问题,通常你只能点击到文本的左侧,这样光标会出现在文本的左侧
Vue.directive('cursor', {
    bind(el, /* binding, vnode, oldVnode */ ) {
        // let {
        //     name,
        //     value,
        //     oldValue,
        //     expression,
        //     arg,
        //     modifiers
        // } = binding
        var $put = $(el).find('input')
        $put.on('focus', e => {
            G.delay(() => {
                setCaretPosition($put[0], $put.val().length)
            }, 0)
        })
    },
    // inserted() {

    // },
    // update() {

    // }
})