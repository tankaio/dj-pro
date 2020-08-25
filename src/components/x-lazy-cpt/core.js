// 注册事件, touchmove scroll 

const remove = (arr, item) => {
    let _findIndex = arr.findIndex(ele => {
        if (ele && item && ele.uid === item.uid) {
            return true
        }
        return false
    })
    if (_findIndex != -1) delete arr[_findIndex]
}

class _Lazy {
    constructor() {
        this.ListenerQueue = []
        this._initEvent()
        this.computedLoad = G.throttle(this._computedLoad.bind(this), 100)
        this.debounceComputedLoad = G.debounce(this._computedLoad.bind(this), 250)
        this.debounceAddListenner = G.debounce(this._addListenerTarget.bind(this), 300)
    }

    addLazyBox(vm) {
        this.ListenerQueue.push(vm)
        this.debounceAddListenner()
    }

    _computedLoad() {
        const freeList = []
        this.ListenerQueue.forEach((listener, index) => {
            if (!listener.el || !listener.el.parentNode) {
                freeList.push(listener)
            }
            const catIn = listener.checkInView()
            if (!catIn) return;
            listener.load()
        })
        freeList.forEach(item => {
            remove(this.ListenerQueue, item)
            item.$destroy()
        })
    }

    removeComponent(vm) {
        if (!vm) return
        remove(this.ListenerQueue, vm)
        // console.log(this.ListenerQueue,this.TargetQueue);
    }

    _addListenerTarget() {
        $('.lazyTarget').on('scroll', () => {
            this.computedLoad()
            this.debounceComputedLoad()
        })
    }

    // _removeTarget(vm) {
    //     let index = this.TargetQueue.findIndex(target => {
    //         if (target && target.el) return target.el === vm.el
    //         return false
    //     })
    //     if (index != -1) delete this.TargetQueue[index]
    // }

    _initEvent() {
        document.body.addEventListener('touchmove', () => this.computedLoad())
        document.body.addEventListener('touchend', () => G.delay(() => this._computedLoad(), 500))
    }

}

let lazy = new _Lazy()

export default lazy