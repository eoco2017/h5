import router from '../router'
import { Toast } from "vant";
import { Message } from "element-ui";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

/**
 * 获取url上参数
 */
export function getUrlKey(name) {
	return (
		decodeURIComponent(
			(new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
				location.href
			) || [, ""])[1].replace(/\+/g, "%20")
		) || null
	);
}
/**
 * 时间格式化
 */
export function parseTime(time, cFormat) {
	if (time === undefined) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
			time = parseInt(time)
		}
		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		return value.toString().padStart(2, '0')
	})
	return timeStr
}
/**
 * 秒数转时分秒
 */
export function formatSeconds(time) {
	let time1 = 0
	let time2 = 0
	if (time > 60) {
	  time1 = parseInt(time / 60)
	  time = parseInt(time % 60)
	  if (time1 > 60) {
		time2 = parseInt(time1 / 60)
		time1 = parseInt(time1 % 60)
	  }
	}
	let result = '' + parseInt(time) + '秒'
	if (time1 > 0) {
	  result = '' + parseInt(time1) + '分' + result
	}
	if (time2 > 0) {
	  result = '' + parseInt(time2) + '小时' + result
	}
	return result
}
/**
 * 秒数转时分
 */
export function timeFormat(time) {
    //分钟
    var minute = time / 60;
    var minutes = parseInt(minute);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    //秒
    var second = time % 60;
    var seconds = Math.round(second);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
}
/**
 * UTC时间格式化
 */
export function formatUtcString(utcStirng) {
	return dayjs.utc(utcStirng).format('YYYY-MM-DD HH:mm:ss')
}
/**
 * 展示提示信息
 */
export function showInfo(message) {
	if (router.currentRoute.name.includes('pc')) {
		Message(message)
	} else {
		Toast(message)
	}
}
/**
 * 展示错误提示信息
 */
export function showError(message) {
	if (router.currentRoute.name.includes('pc')) {
		Message.error(message)
	} else {
		Toast(message)
	}
}
/**
 * 展示成功提示信息
 */
export function showSuccess(message) {
	if (router.currentRoute.name.includes('pc')) {
		Message.success(message)
	} else {
		Toast(message)
	}
}
