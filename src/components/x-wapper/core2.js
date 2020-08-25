export default function () {
    // 3,4,1,2,3,4, 1,2,3
    // 0 1 2 3 4 5  6 7 8

    let $swiper = $('.x-wapper')

    let $bar = $('.xw-item-bar')
    let children = $bar.children()
    let last_index = 1
    let index = 2
    let next_index = 3



    if (children.length === 0) {
        return console.warn('子元素获取错误')
    }
    let children_len = children.length
    let item_width = $(children[0]).width()
    let port_width = $('body').width()
    let padding_2b = (port_width - item_width) / 2
    let indicator_num = children_len - 5
    let indicator_index = 0
    let touchLock = false
    let isTouchEnd = false

    let onFlushIndicator = e => {}

    // *************************
    function barInitPosition() {
        $bar.css('transition-duration', '500ms')
            .css('transform', `translateX(-${item_width * 2 - padding_2b}px)`)
    }

    function itemInitStyle() {
        $(children[index].children[0])
            .css('height', '100%')
            .css('width', '100%')
            .css('transition-duration', '500ms')
    }

    function flushIndex(diff) {
        if (diff > 0) {
            last_index = index
            next_index = index + 1
            index += 1
            swipperBar()
            flushIndicator()
            if (index === children_len - 2) {
                // 换位动画
                noAnimateSwipperBar(4, children_len - 2, () => {
                    last_index = 3
                    index = 4
                    next_index = 4
                })
            } else if (index === children_len - 3) {
                // 换位动画
                noAnimateSwipperBar(2, children_len - 3, () => {
                    last_index = 1
                    index = 2
                    next_index = 2
                })
            }

        } else {

            last_index = index
            next_index = index - 1
            index -= 1
            swipperBar()
            flushIndicator()
            if (index === 1) {
                // 换位动画
                noAnimateSwipperBar(children_len - 4, 1, () => {
                    last_index = children_len - 3
                    index = children_len - 4
                    next_index = children_len - 4
                })
            } else if (index === 2) {
                // 换位动画
                noAnimateSwipperBar(children_len - 3, 2, () => {
                    last_index = children_len - 2
                    index = children_len - 3
                    next_index = children_len - 3
                })
            }

        }

    }

    function leaveAnimate() {
        $(children[last_index].children[0])
            .css('transition-duration', '500ms')
            .css('height', '90%')
            .css('width', '96%')
    }

    function enterAnimate() {
        $(children[next_index].children[0])
            .css('transition-duration', '500ms')
            .css('height', '100%')
            .css('width', '100%')
    }

    // 向左滚动
    function swipperLeft() {
        flushIndex(1)
        leaveAnimate()
        enterAnimate()
        viewActive()
    }

    // 向右滚动
    function swipperRight() {
        flushIndex(-1)
        leaveAnimate()
        enterAnimate()
        viewActive()
    }

    // 动画
    function swipperBar() {
        $bar
            .css('transition-duration', '500ms')
            .css('transform', `translateX(-${item_width * index - padding_2b}px)`)
    }
    // 非动画置换 bar 的位置
    function noAnimateSwipperBar(idx, old, cb) {
        $(children[idx].children[0])
            .css('transition-duration', '0ms')
            .css('height', '100%')
            .css('width', '100%')

        G.delay(() => {

            cb()

            flushIndicator()

            $bar
                .css('transition-duration', '0ms')
                .css('transform', `translateX(-${item_width * index - padding_2b}px)`)

            $(children[old].children[0])
                .css('transition-duration', '0ms')
                .css('height', '90%')
                .css('width', '96%')

        }, 500)
    }

    //
    function viewActive() {
        // $(children[last_index]).removeClass('a------')
        // $(children[next_index]).addClass('a------')
    }

    function flushIndicator() {
        switch (index) {
            case 0:
                indicator_index = 3
                break;
            case 1:
                indicator_index = 4
                break;
            case children_len - 3:
                indicator_num = 1
                indicator_index = indicator_num
                break;
            case children_len - 2:
                indicator_num = 2
                indicator_index = indicator_num
                break;
            case children_len - 1:
                indicator_num = 3
                indicator_index = indicator_num
                break;
            default:
                indicator_index = index - 1
        }
        onFlushIndicator(indicator_index)
    }

    let nowX, nowY, oldX, oldY,
        touch_lock = false,
        is_touch = false,
        lock = false,
        timer = true,
        diff = 0

    function analysis(e) {
        let touchs = e.targetTouches[0]
        if (!G.isEmpty(touchs)) {
            nowX = touchs.pageX
            nowY = touchs.pageY
        }
    }

    let touchDirection = e => {}

    function touchWapperScroll() {
        $bar
            .css('transition-duration', '0ms')
            .css('transform', `translateX(-${item_width * index - padding_2b - (nowX - oldX)}px)`)
    }

    $swiper.on('touchstart', e => {
        G.$swiper(e)
        analysis(e)
        oldX = nowX
        oldY = nowY

        is_touch = true

    })

    $swiper.on('touchmove', e => {
        diff = nowX - oldX
        analysis(e)
        touchDirection()
        G.$swiper.direction(e, G.__, (x, y, e) => {
            touchWapperScroll()
        })
    })

    $swiper.on('touchend', e => {
        if (Math.abs(nowX - oldX) < item_width * 1 / 5) {
            swipperBar()
        } else {
            if (nowX > oldX) {
                swipperRight()
            } else {
                swipperLeft()
            }
        }
    })

    // 手指接触屏幕时暂停动画
    let touchstart = () => {
        touchLock = true
        isTouchEnd = false
    }

    document.body.addEventListener('touchstart', touchstart)

    let toucnend = () => {
        isTouchEnd = true
        touchLock = false
    }

    document.body.addEventListener('touchend', toucnend)

    barInitPosition()
    itemInitStyle()

    let start = (idt) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            if (touchLock || isTouchEnd) {
                if (isTouchEnd) {
                    //  如果touchend,
                    isTouchEnd = false
                }
                start(1)
                return
            }
            if (is_touch || lock) {
                if (is_touch) {
                    is_touch = false
                    start(1)
                }
                return
            }
            swipperLeft()
            start()
        }, 3000)
    }

    let setLock = v => {
        lock = v
        if (!lock) G.delay(() => start())
    }

    return {
        flush(cb) {
            onFlushIndicator = cb
        },
        start,
        setLock,
        destroy() {
            document.body.removeEventListener('touchstart', touchstart)
            document.body.removeEventListener('touchend', toucnend)
        }
    }

}