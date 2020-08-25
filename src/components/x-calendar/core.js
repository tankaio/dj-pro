import {
    appendZero
} from '@/utils/formant.util.js'

function getDays(step = 0, type = 'days') {
    let date = new Date()
    date.setMonth(date.getMonth() + 1 + step)
    date.setDate(0)
    switch (type) {
        case 'days':
            return date.getDate()
        case 'week':
            return date.getDay()
        case 'month':
            return date.getMonth()
        default:
            break;
    }
}

export let frameDate = (step = 0, calendar) => {
    let date = new Date()
    date.setMonth(date.getMonth() + step)
    let month = date.getMonth() + 1
    let today = date.getDate()
    let year = date.getFullYear()
    let last_days = getDays(-1 + step)
    let days = getDays(step)
    let last_week = getDays(-1 + step, 'week')
    let res = []
    let last_begin = last_days - last_week - 1

    if (!calendar) {
        return {
            res: [],
            month,
            year
        }
    }
    // 上月剩余天数填充
    for (let i = 0; i < last_week + 1; i++) {
        last_begin++
        res.push({
            time: last_begin,
            someMonth: false,
        })
    }
    // 当前月
    let begin = 1
    for (let i = 0; i < days; i++) {
        let open = false
        if (calendar.find(item => {
                if (item && item.day) {
                    return item.day == `${year}-${appendZero(month)}-${appendZero(begin)}`;
                } else {
                    console.error('day 不存在', item, calendar);
                    return false
                }
            })) {
            open = true
        }

        res.push({
            time: begin,
            someMonth: true,
            today: today === begin && step === 0,
            open: open
        })
        begin++
    }
    // 下月剩余天数填充
    let next_begin = 0
    let surplus = 42 - days - last_week - 1
    for (let i = 0; i < surplus; i++) {
        next_begin++
        res.push({
            time: next_begin,
            someMonth: false
        })
    }
    return {
        res,
        month,
        year
    }
}