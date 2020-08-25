let red_circle = [
    1,
    2,
    7,
    8,
    12,
    13,
    18,
    19,
    23,
    24,
    29,
    30,
    34,
    35,
    40,
    45,
    46
];
let blue_circle = [
    3,
    4,
    9,
    10,
    14,
    15,
    20,
    25,
    26,
    31,
    36,
    37,
    41,
    42,
    47,
    48
];
let green_circle = [
    5,
    6,
    11,
    16,
    17,
    21,
    22,
    27,
    28,
    32,
    33,
    38,
    39,
    43,
    44,
    49
];

let _padding_x = 60;
let _padding_y = 70;
let _hd_height = 30; // 表头高度
let _chart_type = 'polyline' // table 

let canvasConfig = {
    font_size: 20,
    font_style: '20px serif',
    coordinate_txt_color: '#333',
    benchmark_color: '#F5F5F5',
    polyline_color: "#999", // 折线颜色
    container_txt_color: '#333', // 折线文字颜色
    coordinate_color: '#F5F5F5', // 坐标线颜色
    pointer_size: 7,
    is_coordinate_x: true, // 绘制 x 轴坐标 ?
    is_coordinate_y: false, // 绘制 y 轴坐标 ?
    is_benchmark_x: false, // 绘制 x 轴基准线 ?
    is_benchmark_y: true, // 绘制 y 轴基准线 ?
    is_txt_x: false, // 绘制 x 轴 文字 ?
    is_txt_y: true, // 绘制 y 轴文字 ?
    fix_hd_x: true, // x 轴文字绝对定位 ? 
    is_header_txt: false, // 绘制表头文字 ?
    header_txt: '期号', // 表头文字
    is_polyline_pointer_txt: true, // 折线点文字
    coom: {
        pointer_color(num) {
            if (red_circle.some(color => color === num)) {
                return "#EC293C";
            } else if (blue_circle.some(color => color === num)) {
                return "#2993EC";
            } else if (green_circle.some(color => color === num)) {
                return "#20BF55";
            }
        },
        coordinatexData: [{
            coordinate_val: 1,
            coordinate_txt: '1',
        }, {
            coordinate_val: 10,
            coordinate_txt: '10',
        }, {
            coordinate_val: 20,
            coordinate_txt: '20',
        }, {
            coordinate_val: 30,
            coordinate_txt: '30',
        }, {
            coordinate_val: 40,
            coordinate_txt: '40',
        }, {
            coordinate_val: 49,
            coordinate_txt: '49',
        }],
        coordinatex_size: 50
    },
    zodiac: {
        pointer_color() {
            return '#EC293C'
        },
        coordinatexData: [{
            coordinate_val: 0,
            coordinate_txt: '鼠'
        }, {
            coordinate_val: 1,
            coordinate_txt: '牛'
        }, {
            coordinate_val: 2,
            coordinate_txt: '虎'
        }, {
            coordinate_val: 3,
            coordinate_txt: '兔'
        }, {
            coordinate_val: 4,
            coordinate_txt: '龙'
        }, {
            coordinate_val: 5,
            coordinate_txt: '蛇'
        }, {
            coordinate_val: 6,
            coordinate_txt: '马'
        }, {
            coordinate_val: 7,
            coordinate_txt: '羊'
        }, {
            coordinate_val: 8,
            coordinate_txt: '猴'
        }, {
            coordinate_val: 9,
            coordinate_txt: '鸡'
        }, {
            coordinate_val: 10,
            coordinate_txt: '狗'
        }, {
            coordinate_val: 11,
            coordinate_txt: '猪'
        }, ],
        coordinatex_size: 11
    },
    oddeven: {
        // is_benchmark_x: true,
        coordinatex_size: 7,
        coordinatexData: ['码一', '码二', '码三', '码四', '码五', '码六', '特码'],
        text_color(val) {
            if (val === '单') {
                return '#20BF55'
            } else if (val === '双') {
                return '#EC293C'
            } else {
                return '#333333'
            }
        }
    },
    size: {
        coordinatex_size: 7,
        coordinatexData: ['码一', '码二', '码三', '码四', '码五', '码六', '特码'],
        text_color(val) {
            if (val === '大') {
                return '#EC293C'
            } else if (val === '小') {
                return '#20BF55'
            } else {
                return '#333333'
            }
        }
    },
    hunhe: {
        coordinatex_size: 3,
        coordinatexData: ['大小', '单双', '总和'],
        text_color(val) {
            if (val === '总大' || val === '总双') {
                return '#EC293C'
            } else if (val === '总小' || val === '总单') {
                return '#20BF55'
            } else {
                return '#333333'
            }
        }
    }
}

export function init(selector, coordinateyData, type = 'coom', ops = {}) {

    if (ops.padding_x) _padding_x = ops.padding_x
    if (ops.padding_y) _padding_y = ops.padding_y
    _chart_type = ops.chart_type ? ops.chart_type : 'polyline'

    if (!gtV('is_txt_x')) _padding_x = 0

    let $can = $(selector);
    // y 轴的刻度间距 为 20
    let can_h = _padding_x + coordinateyData.length * 30

    let can_w = $can.width();
    // canvas 的高度是动态的根据数据的多少
    $can.height(can_h);

    let can = $can[0];
    let ctx = can.getContext("2d");

    // canvas 画布的高宽,以当前canvas大小的两倍去绘制
    let canvas_width = can_w * 2;
    let canvas_height = can_h * 2;

    if (window.devicePixelRatio && false) {

        can.width = canvas_width * window.devicePixelRatio;
        can.height = canvas_height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    } else {
        can.width = canvas_width;
        can.height = canvas_height;
    }

    // 允许单个类型的值覆盖全局的配置
    function gtV(key) {
        let global = canvasConfig[key]
        let single = canvasConfig[type][key]
        return single === undefined ? global : single
    }

    let x_txt_average_spacing =
        (canvas_width - 2 * _padding_y) / gtV('coordinatex_size');

    let y_txt_average_spacing =
        (canvas_height - 2 * _padding_x) / coordinateyData.length;

    // 绘制 绝对定位表头
    function drawFixTextHd() {

        let $hd = $('#chart-hd')
        let hd = $hd[0]

        let $x_chart = $('.x-chart')

        $x_chart
            .css('paddingTop', `${_hd_height}px`)

        $hd
            .css('height', `${_hd_height}px`)
            .css('position', 'fixed')
        if (type == 'coom' || type == 'zodiac') {
            $hd.css('top', '1.68rem')
        } else {
            $hd.css('top', '.88rem')
        }



        let hd_w = $hd.width()

        let hd_ctx = hd.getContext('2d');

        let hd_ctx_h = _hd_height * 2
        let hd_ctx_w = hd_w * 2
        hd.height = hd_ctx_h
        hd.width = hd_ctx_w



        // 绘制期号文字
        hd_ctx.font = gtV('font_style');
        hd_ctx.fillStyle = gtV('coordinate_txt_color');
        // x 轴文字顶部距离
        let x_txt_top = hd_ctx_h / 2 + gtV('font_size') / 2

        hd_ctx.fillText(gtV('header_txt'), _padding_y / 2 - hd_ctx.measureText(gtV('header_txt')).width / 2, x_txt_top);

        if (_chart_type === 'polyline') {

            // x 轴文字间距
            let x_txt_spacing = 0
            gtV('coordinatexData').forEach((ele, idx) => {
                x_txt_spacing = _padding_y + ele.coordinate_val * x_txt_average_spacing - hd_ctx.measureText(ele.coordinate_txt).width / 2
                hd_ctx.fillText(
                    ele.coordinate_txt,
                    x_txt_spacing,
                    x_txt_top
                );
            });

        } else if (_chart_type === 'table') {
            // x 轴文字间距
            let x_txt_spacing = 0
            gtV('coordinatexData').forEach((ele, idx) => {
                x_txt_spacing = _padding_y + idx * x_txt_average_spacing + x_txt_average_spacing / 2 - hd_ctx.measureText(ele).width / 2
                hd_ctx.fillText(
                    ele,
                    x_txt_spacing,
                    x_txt_top
                );
            })

        }

    }

    init.refresh = function () {
        // console.log($('.x-chart').offset().top)
        drawFixTextHd()
    }

    // 绘制 x y 轴
    function drawCoordinate() {
        // 要绘制小于 1px 的线需要 -0.5 绘制中线
        _padding_x = _padding_x - 0.5;
        _padding_y = _padding_y - 0.5;
        // 绘制x轴
        if (gtV('is_coordinate_x')) {
            ctx.strokeStyle = gtV('coordinate_color');
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(_padding_y, _padding_x);
            ctx.lineTo(canvas_width - _padding_y, _padding_x);
            ctx.closePath();
            ctx.stroke();
        }

        // 绘制y轴
        if (gtV('is_coordinate_y')) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(_padding_y, _padding_x);
            ctx.lineTo(_padding_y, canvas_height - _padding_x);
            ctx.closePath();
            ctx.stroke();
        }

    }

    // 绘制坐标系数据
    function drawCoordinateData() {
        // 绘制期号文字
        ctx.font = gtV('font_style');
        ctx.fillStyle = gtV('coordinate_txt_color');
        // x 轴文字顶部距离
        let x_txt_top = _padding_x / 2 + gtV('font_size') / 2

        if (gtV('is_header_txt')) {
            ctx.fillText(gtV('header_txt'), _padding_y / 2 - ctx.measureText(gtV('header_txt')).width / 2, x_txt_top);
        }

        //  // 绘制 x轴文字
        if (gtV('is_txt_x')) {

            if (_chart_type === 'polyline') {

                // x 轴文字间距
                let x_txt_spacing = 0
                gtV('coordinatexData').forEach((ele, idx) => {
                    x_txt_spacing = _padding_y + ele.coordinate_val * x_txt_average_spacing - ctx.measureText(ele.coordinate_txt).width / 2
                    ctx.fillText(
                        ele.coordinate_txt,
                        x_txt_spacing,
                        x_txt_top
                    );
                });

            } else if (_chart_type === 'table') {
                // x 轴文字间距
                let x_txt_spacing = 0
                gtV('coordinatexData').forEach((ele, idx) => {
                    x_txt_spacing = _padding_y + idx * x_txt_average_spacing + x_txt_average_spacing / 2 - ctx.measureText(ele).width / 2
                    ctx.fillText(
                        ele,
                        x_txt_spacing,
                        x_txt_top
                    );
                })

            }



        }


        // 绘制 y轴文字
        if (gtV('is_txt_y')) {

            if (_chart_type === 'polyline' || _chart_type === 'table') {

                let len = coordinateyData.length - 1;
                // y 轴文字左边距离
                let y_txt_left = 0
                let y_txt_spacing = 0
                coordinateyData.forEach((ele, idx) => {
                    let txt_width = ctx.measureText(ele.issue).width
                    y_txt_left = _padding_y / 2 - txt_width / 2
                    y_txt_spacing = (len - idx) * y_txt_average_spacing + _padding_x + gtV('font_size') / 2 + y_txt_average_spacing / 2
                    ctx.fillText(
                        ele.issue,
                        y_txt_left,
                        y_txt_spacing
                    );
                });

            }

        }

    }

    // 绘制基准线
    function drawBenchmark() {
        // y 轴基准线
        if (gtV('is_benchmark_y')) {
            let len = coordinateyData.length;
            coordinateyData.forEach((ele, idx) => {
                ctx.fillStyle = gtV('benchmark_color');
                ctx.strokeStyle = gtV('benchmark_color');
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(_padding_y, (len - idx) * y_txt_average_spacing + _padding_x);
                ctx.lineTo(
                    canvas_width - _padding_y,
                    (len - idx) * y_txt_average_spacing + _padding_x
                );
                ctx.closePath();
                ctx.stroke();
            });
        }

        // x 轴基准线
        if (gtV('is_benchmark_x')) {

            if (_chart_type === 'polyline') {

                let x_benchmark_height = canvas_height - 2 * _padding_x
                let x_txt_spacing = 0
                gtV('coordinatexData').forEach((ele, idx) => {
                    x_txt_spacing = x_txt_average_spacing * ele.coordinate_val + _padding_y
                    ctx.fillStyle = gtV('benchmark_color');
                    ctx.strokeStyle = gtV('benchmark_color');
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.moveTo(x_txt_spacing, _padding_x)
                    ctx.lineTo(x_txt_spacing, _padding_x + x_benchmark_height)
                    ctx.closePath();
                    ctx.stroke();
                })

            } else if (_chart_type === 'table') {

                let x_benchmark_height = canvas_height - 2 * _padding_x
                let x_txt_spacing = 0
                gtV('coordinatexData').forEach((ele, idx) => {
                    x_txt_spacing = x_txt_average_spacing * (idx + 1) + _padding_y
                    ctx.fillStyle = gtV('benchmark_color');
                    ctx.strokeStyle = gtV('benchmark_color');
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.moveTo(x_txt_spacing, _padding_x)
                    ctx.lineTo(x_txt_spacing, _padding_x + x_benchmark_height)
                    ctx.closePath();
                    ctx.stroke();
                })

            }

        }

    }

    // 绘制折线点文字
    function drawPointerText(item) {
        if (!gtV('is_polyline_pointer_txt')) return;
        let {
            x,
            y,
            val,
            txt,
            last_val,
            next_val
        } = item;
        ctx.font = gtV('font_style');
        ctx.fillStyle = gtV('container_txt_color');
        let txt_width = ctx.measureText(txt).width
        val = Number(val)
        if (last_val !== undefined) last_val = Number(last_val)
        if (next_val !== undefined) next_val = Number(next_val)

        let x_txt_left = 0
        let x_txt_right = 0

        if (txt_width > 10) {
            x_txt_right = x + txt_width - txt_width / 2
        } else {
            x_txt_right = x + txt_width
        }
        x_txt_left = x - (txt_width + gtV('pointer_size') * 2)

        // debugger
        if (last_val === undefined && next_val === undefined) {
            // 当前只有一个值
            ctx.fillText(txt, x_txt_left, y + 10);

        } else if (last_val === undefined) {
            // 当前为第一个
            if (next_val > val) {
                ctx.fillText(txt, x_txt_left, y + 10);
            } else {
                ctx.fillText(txt, x_txt_right, y + 10);
            }
        } else if (next_val === undefined) {
            // 当前为最后一个
            if (last_val > val) {
                ctx.fillText(txt, x_txt_left, y + 10);
            } else {
                ctx.fillText(txt, x_txt_right, y + 10);
            }
        } else {
            if (next_val > val && last_val > val) {
                // 当前曲线为小于号 < 文字在左侧
                ctx.fillText(txt, x_txt_left, y + 10);

            } else if (next_val < val && last_val < val) {
                // 当前曲线为 大于号 > 文字在右侧
                ctx.fillText(txt, x_txt_right, y + 10);

            } else if (Math.abs(next_val - val) === Math.abs(last_val - val)) {
                // 当前折线角度一致且 非 90 度折线,且节点距离 大于 3
                if (Math.abs(last_val - val) > 3) {
                    ctx.fillText(txt, x, y - 20);
                } else if (last_val > next_val) {
                    // 左下
                    ctx.fillText(txt, x_txt_left, y + 20);
                } else {
                    // 右下
                    ctx.fillText(txt, x_txt_right, y + 20);
                }

            } else {
                // 直角判断
                if (Math.abs(next_val - val) === 0) {

                    if (last_val - val < 0) {
                        // 右下
                        ctx.fillText(txt, x_txt_right, y + 20);
                    } else {
                        // 左下
                        ctx.fillText(txt, x_txt_left, y + 20);
                    }

                } else if (Math.abs(last_val - val) === 0) {

                    if (next_val - val < 0) {
                        // 右上
                        ctx.fillText(txt, x_txt_right, y);
                    } else {
                        // 左上
                        ctx.fillText(txt, x_txt_left, y);
                    }

                } else if (next_val > val && val > last_val) {

                    if (Math.abs(next_val - val) > Math.abs(last_val - val)) {
                        // 右夹角大于左夹角 文字在左上
                        ctx.fillText(txt, x_txt_left, y - 5);

                    } else {
                        // 否则 文字在右下
                        ctx.fillText(txt, x_txt_right, y + 30);

                    }
                } else if (next_val < val && val < last_val) {

                    if (Math.abs(next_val - val) > Math.abs(last_val - val)) {
                        // 左夹角大于右夹角 文字在右上
                        ctx.fillText(txt, x_txt_right, y - 5);

                    } else {
                        // 否则 文字在左下
                        ctx.fillText(txt, x_txt_left, y + 30);

                    }
                }

            }
        }
    }

    // 绘制折线点
    function drawPointer(pointerData) {
        pointerData.forEach(ele => {
            ctx.fillStyle = ele.color;
            ctx.beginPath();
            ctx.arc(ele.x, ele.y, canvasConfig.pointer_size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            drawPointerText(ele);
        });
    }

    // 绘制折线
    function drawPolyLine() {
        let last_point;
        let point_specing = (canvas_width - 2 * _padding_y) / gtV('coordinatex_size');
        let len = coordinateyData.length;
        let pointer_data = [];

        coordinateyData.forEach((ele, idx) => {
            let x = point_specing * (ele.val) + _padding_y;
            let y = y_txt_average_spacing * (len - idx) - y_txt_average_spacing / 2 + _padding_x;
            let color = gtV('pointer_color')(ele.val);

            pointer_data.push({
                x,
                y,
                color,
                val: ele.val,
                txt: ele.pointer_txt === undefined ? ele.val : ele.pointer_txt,
                last_val: coordinateyData[idx - 1] === undefined ? undefined : coordinateyData[idx - 1].val,
                next_val: coordinateyData[idx + 1] === undefined ? undefined : coordinateyData[idx + 1].val
            });
            // 绘制折线
            if (last_point) {

                let {
                    old_x,
                    old_y
                } = last_point;

                ctx.strokeStyle = gtV('polyline_color');
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(old_x, old_y);
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.stroke();

            }

            last_point = {
                old_x: x,
                old_y: y
            };
        });
        // 绘制点
        drawPointer(pointer_data);
    }

    // 绘制表格类填充文字
    function drawTableContainerData() {
        // 绘制期号文字
        ctx.font = gtV('font_style');
        ctx.fillStyle = gtV('container_txt_color');
        // 文字距离上边框
        let y_txt_spacing = 0 // y_txt_average_spacing / 2 + gtV('font_size') / 2
        let x_txt_spacing = 0
        let len = coordinateyData.length
        coordinateyData.forEach((ele, idx) => {
            ele.val.forEach((item, _idx) => {
                ctx.fillStyle = gtV('text_color')(item)
                x_txt_spacing = _padding_y + _idx * x_txt_average_spacing + x_txt_average_spacing / 2 - ctx.measureText(item).width / 2
                y_txt_spacing = _padding_x + (len - idx - 1) * y_txt_average_spacing + y_txt_average_spacing / 2 + gtV('font_size') / 2
                ctx.fillText(item, x_txt_spacing, y_txt_spacing)
            })
        })
    }

    if (gtV('fix_hd_x')) {
        G.delay(() => {
            drawFixTextHd()
        }, 100)
    }

    drawCoordinate();
    drawCoordinateData()
    drawBenchmark();
    switch (_chart_type) {
        case 'polyline':
            drawPolyLine();
            break;
        case 'table':
            drawTableContainerData();
            break;
        default:
            break;
    }

}