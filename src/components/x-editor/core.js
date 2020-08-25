const cursorAdaptor = (element) => {
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    var range
    var preCaretRange
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
        range = win.getSelection().getRangeAt(0);
        preCaretRange = range.cloneRange();
        return [sel, range, preCaretRange]
    }
    return []
}
//获取当前光标位置
const getCursortPosition = function (element) {
    let caretOffset = 0;
    let [sel, range, preCaretRange] = cursorAdaptor(element)
    if (sel) { //选中的区域
        preCaretRange.selectNodeContents(element); //设置选中区域的节点内容为当前节点
        preCaretRange.setEnd(range.endContainer, range.endOffset); //重置选中区域的结束位置
        caretOffset = preCaretRange.toString().length;
    }
    return {
        anchor: caretOffset,
        range
    };
}

//设置光标位置
const setCaretPosition = function (element, pos) {
    var range, selection;
    range = document.createRange(); //创建一个选中区域
    range.selectNodeContents(element); //选中节点的内容
    if (element.innerHTML.length > 0) {
        range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
    }
    range.collapse(true); //设置选中区域为一个点
    selection = window.getSelection(); //获取当前选中区域
    selection.removeAllRanges(); //移出所有的选中范围
    selection.addRange(range); //添加新建的范围
}

// 更新属性
const updateAttr = function (element) {
    let [sel, range, preCaretRange] = cursorAdaptor(element)
    if (sel) {
        return [sel, range, preCaretRange]
    }
    return []
}

export default {
    getCursortPosition,
    setCaretPosition,
    updateAttr
}