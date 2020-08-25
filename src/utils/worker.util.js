export let timeWorker = function () {
    let timer = null
    this.onmessage = e => {
        const {
            start_time,
            state
        } = e.data;
        switch (state) {
            case 'stop':
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                return;
            case 'start':
                let interval = 250;
                if (!timer) {
                    timer = setInterval(() => {
                        this.postMessage(new Date().getTime() - start_time);
                    }, interval);
                }
                break
            default:
                clearInterval(timer);
                this.close()
                break;
        }

    };

    this.onerror = e => {
        console.error(e);
    }
}

export const countDownWorker = function () {
    let target, timer
    this.onmessage = e => {
        let state = e.data
        switch (state) {
            case 'start':
                if (timer) {
                    clearInterval(timer)
                }
                target = new Date()
                timer = setInterval(() => {
                    this.postMessage(new Date().getTime() - target)
                }, 200);
                break;
            case 'stop':
                clearInterval(timer)
            default:
                clearInterval(timer)
                this.close()
                break;
        }
    }
}

export default function WebWorker(woker) {
    if (!(this instanceof WebWorker)) {
        return new WebWorker(woker)
    }
    const code = woker.toString()
    const blob = new Blob([`(${code})()`])
    return new Worker(URL.createObjectURL(blob))
}