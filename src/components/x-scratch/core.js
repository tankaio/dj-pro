export function scratch(selector, openCallBack = () => {}, fullDraw = () => {}) {
    let $cvs = $(selector)
    let cvs = $cvs[0]
    let ctx = cvs.getContext('2d')
    let cvs_offset = $cvs.offset()
    let cvs_top = cvs_offset.top
    let cvs_left = cvs_offset.left
    let cvs_width = $cvs.width()
    let cvs_height = $cvs.height()
    let is_open = false
    let img = new Image();
    let img_load_lock = false
    cvs.height = 250
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, 450, 250);

    // img.src = "./images/scratch@2x.png";
    // img.onload = e => {

    //     ctx.drawImage(img, 0, 0, 450, 250);
    //     ctx.stroke();
    //     if (ctx.globalCompositeOperation != 'destination-out"') {
    //         ctx.globalCompositeOperation = "destination-out";
    //     }
    //     fullDraw()
    //     img_load_lock = true
    // };

    //  创建离岸 canvas 离岸canvas用户绘制缓冲,直接绘制页面canvas dom 会造成大量的性能消耗
    let canvasBuf = document.createElement('canvas');
    // let canvasBuf = document.getElementById('canvas2')
    canvasBuf.width = cvs_width
    canvasBuf.height = cvs_height
    let contextBuf = canvasBuf.getContext('2d')
    canvasBuf.height = 250
    canvasBuf.width = 450
    contextBuf.globalCompositeOperation = 'source-over'
    contextBuf.clearRect(0, 0, 450, 250);

    img.src = "./images/scratch@2x.png";
    img.onload = e => {
        contextBuf.drawImage(img, 0, 0, 450, 250);
        contextBuf.stroke();
        if (contextBuf.globalCompositeOperation != 'destination-out"') {
            contextBuf.globalCompositeOperation = "destination-out";
        }
        ctx.drawImage(canvasBuf, 0, 0);
        fullDraw()
        img_load_lock = true
    };

    $('.x-scratch').on('touchmove', e => e.preventDefault())
    $('.xs_container').on('touchmove', e => e.preventDefault())

    function getCoordinate(event) {
        let e = event.changedTouches[0]
        let x = e.pageX - cvs_left
        let y = e.pageY - cvs_top
        x = x < 0 ? 0 : x
        y = y < 0 ? 0 : y

        x = x > cvs_width ? cvs_width : x
        y = y > cvs_height ? cvs_height : y

        event.preventDefault();
        event.stopPropagation()

        return [x * 2, y * 2]
    }

    let throttleDrawBuf = G.throttle(() => {
        ctx.clearRect(0, 0, 450, 250);
        ctx.drawImage(canvasBuf, 0, 0);
        openJudge(getFilledPercentage())
    }, 30)


    let lastX;
    let lastY;
    const complementaryFrameDiff = 10
    // 求斜边长函数
    let getDistanceBetweenTwoPoints = (a, b, x, y) => {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }

    let coordinatePositionJudge = (oldX, oldY, x, y) => {
        // 以 oldX oldY 为坐标圆点 计算 x 轴 与 y 轴正负
        let xAxis = x - oldX
        let yAxis = y - oldY
        if (xAxis !== 0) {
            xAxis = xAxis / Math.abs(xAxis)
        }
        if (yAxis !== 0) {
            yAxis = yAxis / Math.abs(yAxis)
        }
        return [xAxis, yAxis]
    }

    //  插帧 ,touch 事件 返回的坐标在滑动快速时间隔较大,导致绘制无法衔接,需要分析坐标轴实现 坐标点 插帧
    let complementaryFrame = (x, y) => {
        if (lastX !== undefined && lastY !== undefined) {
            let fillPath = [
                [lastX, lastY]
            ]
            let a = Math.abs(x - lastX);
            let b = Math.abs(y - lastY);
            let hypotenuseDistance = getDistanceBetweenTwoPoints(a, b, x, y)
            let [axisX, axisY] = coordinatePositionJudge(lastX, lastY, x, y)
            let ratioX = a / hypotenuseDistance
            let ratioY = b / hypotenuseDistance
            let frameCount = 0
            if (hypotenuseDistance > complementaryFrameDiff) {
                frameCount = hypotenuseDistance / complementaryFrameDiff
            }
            for (let i = 1; i <= frameCount; i++) {
                fillPath.push([
                    lastX + axisX * ratioX * 10 * i,
                    lastY + axisY * ratioY * 10 * i
                ])
            }
            fillPath.push([
                x, y
            ])
            fillPath.forEach((item) => {
                let [x, y] = item
                contextBuf.beginPath();
                contextBuf.arc(x, y, 35, 0, Math.PI * 2);
                contextBuf.fill();
            })
            // console.log(fillPath, [axisX, axisY], lastX, lastY, x, y);
        }
        lastX = x
        lastY = y
    }


    $cvs.on('touchstart', e => {
        lastX = lastY = undefined
    })
    $cvs.on('touchmove', e => {
        if (is_open) return
        let [x, y] = getCoordinate(e)
        complementaryFrame(x, y);
        throttleDrawBuf()
    })

    function getFilledPercentage() {
        let imageData = contextBuf.getImageData(0, 0, cvs_width * 2, cvs_height * 2)
        let pixels = imageData.data
        let transPixels = []
        let len = pixels.length
        for (let i = 0; i < len; i += 4) {
            if (pixels[i + 3] < 128) {
                transPixels.push(pixels[i + 3])
            }
        }
        return (transPixels.length / (len / 4) * 100).toFixed(2)
    }

    function openJudge(percentage) {
        percentage = percentage || 0
        if (percentage > 60 && img_load_lock) {
            contextBuf.clearRect(0, 0, cvs_width * 2, cvs_height * 2)
            ctx.clearRect(0, 0, cvs_width * 2, cvs_height * 2)
            is_open = true
            openCallBack()
        }
    }

}