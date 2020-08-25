export const appendZero = (obj) => {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
}
export const ymd = (t) => {
    let year = t.getFullYear()
    let month = t.getMonth() + 1
    let day = t.getDate()
    return `${year}-${month}-${day}`;
};
export const hms = (date) => {
    return date.toTimeString().slice(0, 8);
}

export const ymd8 = (t) => {
    let year = t.getFullYear()
    let month = t.getMonth() + 1
    let day = t.getDate()
    return `${year}-${appendZero(month)}-${appendZero(day)}`;
};
// 获得当前时间
export const getTime = () => {
    let date = new Date()
    return [ymd(date), hms(date)]
}

export const op = (map) => {
    let res = []
    Object.keys(map).forEach(key => {
        map[key].forEach(val => {
            res.push(`${key} ${val}`)
        })
    })
    return res
}

// 时间戳转时间
export const formatDuration = ms => {
    if (ms < 0) ms = -ms;
    return {
        day: Math.floor(ms / 86400000),
        hour: Math.floor(ms / 3600000) % 24,
        minute: Math.floor(ms / 60000) % 60,
        second: Math.floor(ms / 1000) % 60,
        millisecond: Math.floor(ms) % 1000
    };
};

// 根据目标时间获得
export const getWithTime = date => {
    return [ymd(date), hms(date)]
}

export const getWithTimeYMD = date => {
    return ymd8(date)
}

export const timestampdispose = (value, now = new Date()) => {
    let date = new Date(value);
    let {
        day,
        hour,
        minute,
    } = formatDuration(now - date)
    if (day) {
        switch (day) {
            case 1:
                return "昨天";
            case 2:
                return "前天";
            default:
                let [ymdStr, hmsStr] = getWithTime(date);
                let hmsArray = hmsStr.split(':')
                hmsArray.pop()
                return `${ymdStr} ${hmsArray.join(':')}`;
        }
    } else if (hour) {
        return `${hour}小时前`;
    } else if (minute !== undefined) {
        if (minute <= 1) {
            return "刚刚";
        } else if (minute < 30) {
            return `${minute}分钟前`;
        } else if (minute >= 30) {
            return "半小时前";
        }
    }
    return 'error'
}

// 判断是否是昨天
export const isYesterday = (time) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${year}/${month}/${day}`;
    const todayTime = new Date(today).getTime(); // 当天凌晨的时间
    const yesterdayTime = new Date(todayTime - 24 * 60 * 60 * 1000).getTime(); // 昨天凌晨的时间
    return time < todayTime && yesterdayTime <= time;
}

// 获取时间差
export const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / (1000 * 3600 * 24);

//  图片转base64
export const getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}

// export const base64ToBlob = (base64, fileType) => {
//     let typeHeader = 'data:application/' + fileType + ';base64,'; // 定义base64 头部文件类型
//     let audioSrc = typeHeader + base64; // 拼接最终的base64
//     let arr = audioSrc.split(',');
//     let array = arr[0].match(/:(.*?);/);
//     let mime = (array && array.length > 1 ? array[1] : type) || type;
//     // 去掉url的头，并转化为byte
//     let bytes = window.atob(arr[1]);
//     // 处理异常,将ascii码小于0的转换为大于0
//     let ab = new ArrayBuffer(bytes.length);
//     // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
//     let ia = new Uint8Array(ab);
//     for (let i = 0; i < bytes.length; i++) {
//         ia[i] = bytes.charCodeAt(i);
//     }
//     return new Blob([ab], {
//         type: mime
//     });
// }