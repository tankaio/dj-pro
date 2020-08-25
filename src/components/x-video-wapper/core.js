let beginX = 0
let beginY = 0
let nowX = 0
let nowY = 0
let touchs = {}
let $swipe
let $item
let item_width = 0
let item_even = 0
let vw
let children_len = 0
let now_distance = 0
let old_distance = 0
let diff = 0
let index = 0

let scroll = true

let onceDirection

let analysis = function (e) {
    touchs = e.targetTouches[0]
    if (G.isEmpty(touchs)) {
        nowX = touchs.pageX
        nowY = touchs.pageY
    }
}

let animate = (distance, duration = 0) => {
    if (G.isEle($swipe)) {
        $swipe.setAttribute('style', `transition-duration: ${duration}ms; transform: translateX(${distance}px);`)
    } else {
        console.warn(`${$swipe}对象不存在`);
    }
}

export let init = function ($swipeBar, viewportWidth) {
    function dom_init() {
        $swipe = $swipeBar
        $item = $swipeBar.children[0]

        if (G.isEmpty($item)) {
            return G.delay(dom_init,300)
        }

        vw = viewportWidth

        item_width = $item.clientWidth
        item_even = (vw - item_width) / 2

        children_len = $swipe.children.length
    }

    dom_init()

    let swipeLeft = e => {
        if (G.isEmpty($item)) return;

        index++
        if (index > children_len - 1) {
            index = children_len - 1
            now_distance = old_distance
        } else if (index === children_len - 1) {
            index = children_len - 1
            now_distance = old_distance - (item_width - item_even)
        } else if (index === 1) {
            now_distance = -(item_width - item_even) * index
        } else {
            now_distance = old_distance - item_width
        }
        animate(now_distance, 500)
    }

    let swipeRight = e => {
        if (G.isEmpty($item)) return;

        index--
        if (index < 0) {
            index = 0
            old_distance = 0
            now_distance = 0
        } else if (index === 0) {
            index = 0
            now_distance = old_distance + (item_width - item_even)
        } else if (index === children_len - 2) {
            now_distance = old_distance + (item_width - item_even)
        } else {
            now_distance = old_distance + item_width

        }
        animate(now_distance, 500)
    }

    let start = e => {
        if (G.isEmpty($item)) return;

        analysis(e)
        beginX = nowX
        beginY = nowY
        onceDirection = G.once(() => {
            if (Math.abs(nowY - beginY) > Math.abs(diff)) {
                // 判定为 用户意图上下滑动
                scroll = true
            } else {
                scroll = false
            }
        })
    }

    let flushMove = e => {
        if (G.isEmpty($item)) return;

        analysis(e)
        diff = nowX - beginX
        onceDirection()
        if (!scroll) {
            animate(now_distance + diff)
            e.preventDefault();
        }
    }

    let end = e => {
        if (G.isEmpty($item)) return;

        if (scroll) {
            return scroll = false
        }
        if (nowX < beginX) {
            swipeLeft()
        } else {
            swipeRight()
        }
        old_distance = now_distance
        diff = 0

    }

    return {
        start,
        flushMove,
        end
    }
}