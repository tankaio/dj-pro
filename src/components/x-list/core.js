export let init = (selector, diff = 250, positionList) => {

    let event_pool = Object.create(null)
    let $xList
    let xList
    let $app
    let app_height
    let xlist_offset_top
    let y = 0;
    let min_height
    let offset

    $app = $('#app')
    let $positionList = $(positionList)
    if (positionList) {
        $app = $positionList.find('.xl-content')
    }
    app_height = 0
    let identity = ''
    $xList = $(selector)

    function delayGetOffsetY() {
        $xList = $(selector)
        xList = $xList[0]
        if (!xList) return
        offset = xList.getBoundingClientRect();
        y = offset.y || offset.top;
        if (y == 0) {
            G.delay(() => {
                delayGetOffsetY()
            }, 100)
        } else {
            // console.log('y', y);
        }
    }

    if (!positionList) delayGetOffsetY()

    function scroll() {
        xList = $xList[0]
        if (!xList) return
        xlist_offset_top = $xList.offset().top
        app_height = $app.height();
        offset = xList.getBoundingClientRect();
        min_height = $('body').height()
        y = offset.y || offset.top;
        if (y == 0) delayGetOffsetY()
        // console.log(app_height, xlist_offset_top, min_height, y, diff);
        // 移动端可能会有问题，因为移动端浏览器会上移地址栏形成全面屏效果,可能需要使用 window.innerHeight
        // full_screen_heigth = window.innerHeight
        // 所以最终判定高度不得小于50 + 5  
        // console.log(y, app_height, xlist_offset_top, min_height, diff);
        if (y < 0 && app_height - xlist_offset_top - min_height - Math.abs(y) <= diff + 50) {
            if (event_pool[identity] && event_pool[identity].active) {
                // console.log(event_pool[identity]);
                // console.log(event_pool);
                event_pool[identity]()
            }
        }
    }

    function positionScroll() {
        let viewPortHeight = $(positionList).height()
        let contentHeight = $app.height()
        let scrollTop = positionList.scrollTop
        // console.log(viewPortHeight, contentHeight, scrollTop, $positionList, $app);
        if (contentHeight - (scrollTop + viewPortHeight) < 300) {
            if (event_pool[identity] && event_pool[identity].active) {
                event_pool[identity]()
            }
        }
    }


    function listen(cb) {
        identity = Math.random().toString()
        cb.identity = identity
        event_pool[identity] = cb
        this.identity = identity
        return identity
    }
    let debounce_scroll = G.debounce(() => {
        if (positionList) {
            positionScroll()
        } else {
            scroll()
        }
    }, 50)

    if (positionList) {
        positionList.addEventListener('scroll', debounce_scroll)
    } else {
        window.addEventListener('scroll', debounce_scroll)
    }


    function destroyed() {
        delete event_pool[this.identity]
        if (positionList) {
            positionList.removeEventListener('scroll', debounce_scroll)
        } else {
            window.removeEventListener('scroll', debounce_scroll)
        }
    }

    function inactive() {
        let fn = event_pool[this.identity]
        if (fn) fn.active = true
    }

    function unactive() {
        let fn = event_pool[this.identity]
        if (fn) fn.active = false
    }
    return {
        identity: '',
        listen,
        destroyed,
        inactive,
        unactive
    }
}