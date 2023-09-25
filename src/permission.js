import router from './router'
import { getUrlKey } from '@/utils/index'

// 获取url参数
if (getUrlKey('userEmail')) {
    localStorage.setItem('userEmail', getUrlKey('userEmail'))
}
if (getUrlKey('accessToken')) {
    localStorage.setItem('accessToken', getUrlKey('accessToken'))
}
if (getUrlKey('refreshToken')) {
    localStorage.setItem('refreshToken', getUrlKey('refreshToken'))
}
// localStorage.setItem('accessToken','eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE2OTUzNjkyNDksImV4cCI6MTY5NTM3Mjg0OSwiaXNzIjoiaHR0cHM6Ly9pZHMuY2ljaWMuY24iLCJhdWQiOlsiZWNvc3lzIiwiZWNvc3lzcmMiLCJzZW5kY29kZSIsInN2YyJdLCJjbGllbnRfaWQiOiJlY29zeXMiLCJzdWIiOiJodW9kb25nQGNoaW5hLWludi5jbiIsImF1dGhfdGltZSI6MTY5NTM2OTI0OSwiaWRwIjoibG9jYWwiLCJuYW1lIjoi6ZyN5qCLIiwiZW1haWwiOiJodW9kb25nQGNoaW5hLWludi5jbiIsImRlcGFydG1lbnQiOiLkv6Hmga_mioDmnK_pg6giLCJjb21wYW55Ijoi5Lit5Zu95oqV6LWE5pyJ6ZmQ6LSj5Lu75YWs5Y-4IiwiZGl2aXNpb24iOiIiLCJlbXBsb3llZWlkIjoiMzI1OTAwIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwianRpIjoiMjc0NjVCQjZFMTQ5QkRDRjc5MkVGRThCM0MyMzVEQjYiLCJpYXQiOjE2OTUzNjkyNDksInNjb3BlIjpbImVjb3N5cyIsImVjb3N5c3JjIiwib3BlbmlkIiwic2VuZGNvZGUiLCJzdmMiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsiRW1haWxQYXNzd29yZCJdfQ.GRtaJ7wOWl2o5kmZymV3H4htB8csg7ZtSrIRMmbM3lTSMtyFxJztC2BebEC6KjkuQKgixfQv8xN90CFhGSym9xn8PNF6gWE4G0F7ULR9FGHhnhiveDl0tLVvVvyjXsIF8GwvukqqV4C4_D_UsiCTyLmxuFI82iB6AIrwx5n-5ga_Qccoq-Ye5FMiTZRxIMlE0JFjA6Gm40qtt5G5IIuUWlUaU6EwB-d3bIQrnVgvx_BkI_CXUZrG8nqDzA2o-1dQ23vdHdnk_boS5ic4Awyyes63yx29B1t_trvejhKJtOltwPee-HcIu9-YORLiGJ0UMwCWl8W5ColUHV87spFQuA')
// localStorage.setItem('refreshToken', 'EE00EE408D49B5C14EA12A3BB3F0886560DE6DF3FBA9F0F4ABC2BB60FC29BB3A')
router.beforeEach((to, from, next) => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
        if (to.path === '/questionnaire') {
            if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                next()
            } else {
                next({path: '/questionnaire/pc',query:to.query})
            }
        } else {
            next()
        }
    } else {
        if (to.path === '/error') {
            next()
        } else {
            next('/error')
        }
    }
})
