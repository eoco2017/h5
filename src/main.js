import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible'
import '@/styles/index.css'
import 'vant/es/image-preview/style';
import '@/utils/vant'
import '@/utils/element'
import '@/permission'
import { parseTime,formatSeconds,timeFormat,formatUtcString } from '@/utils/index'

Vue.config.productionTip = false

//根据value获取name 
Vue.filter('dataFilter', function (msg, list) {
    let formatStr = ''
    let str = msg.toString()
    if (!str) {
        return ''
    }
    list.forEach(function (val, index, arr) {
        let msgArray = str.split(",");
        msgArray.forEach((item, i) => {
            if (val.value == item) {
                formatStr = val.name + "," + formatStr
            }
        })
        if (formatStr.endsWith(",")) {
            formatStr = formatStr.substring(0, formatStr.length - 1);
        }
    })
    return formatStr
})
//时间过滤器,UTC时间格式化
Vue.filter('timeFilter', formatUtcString)
//秒数转化为分钟
Vue.filter('timeFormat', timeFormat)
//秒数转化为时分秒
Vue.filter('formatSeconds', formatSeconds)

//路由跳转
Vue.prototype.jumpToPage = function (toRouteName, params) {
    this.$router.push({ name: toRouteName, params: params }).catch(err => (console.log(err)))
}
//路由替换
Vue.prototype.jumpToPageByQuery = function (toRouteName, query) {
    this.$router.push({ path: toRouteName, query: query }).catch(err => (console.log(err)))
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
