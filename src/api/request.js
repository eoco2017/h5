import Axios from 'axios';
import Vue from "vue";
import { Toast } from "vant";
import { showError } from '@/utils/index';

const service = Axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 200000
})

//刷新token
const refreshTokenReq = Axios.create({
    baseURL: process.env.VUE_APP_BASE_API
})

service.interceptors.request.use(
    config => {
        let accessToken = localStorage.getItem('accessToken')
        config.headers['accessToken'] = accessToken
        return config
    },
    error => {
        Promise.reject(error)
    }
)
let isRefreshing = false
let requests = []
service.interceptors.response.use(
    response => {
        if (response.data.code == 200) {
            return response.data
        } else {
            showError(response.data.message || response.data.msg)
            return Promise.reject(response.data.message || response.data.msg)
        }
    },
    async error => {
        const { status } = error.response
        //403 token失效
        if (status === 403) {
            const config = error.config
            if (!isRefreshing) {
                isRefreshing = true
                const { data } = await refreshTokenReq({
                    method: 'post',
                    url: '/api/auth/token/refreshToken?refreshToken=' + localStorage.getItem('refreshToken'),
                })
                if (data) {
                    localStorage.setItem('accessToken', data.access_token)
                    localStorage.setItem('refreshToken', data.refresh_token)
                    config.headers['accessToken'] = data.access_token
                    Promise.resolve().then(() => {
                        requests.forEach(cb => cb(data.access_token))
                        requests = []
                    })
                    isRefreshing = false
                    return service(config)
                } else {
                    Toast('请稍后再试')
                }

                // return refreshTokenReq({
                //     method: 'post',
                //     url: '/api/auth/token/refreshToken?refreshToken=' + localStorage.getItem('refreshToken'),
                // }).then((data)=>{
                //     localStorage.setItem('accessToken', data.data.access_token)
                //     localStorage.setItem('refreshToken', data.data.refresh_token)
                //     config.headers['accessToken'] = data.data.access_token
                //     requests.forEach(cb => cb(data.data.access_token))
                //     requests = []
                //     return service(config)
                // }).finally(()=>{
                //     isRefreshing = false
                // })
            } else {
                return new Promise((resolve) => {
                    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                    requests.push((token) => {
                        config.headers['accessToken'] = token
                        resolve(service(config))
                    })
                })
            }
        }
        showError(error.message)
        return Promise.reject(error)
    }
)

export default service