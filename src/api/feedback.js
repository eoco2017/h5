import request from './request'

//获取热门问题列表
export function getQuestionList(params){
    return request({
        url:'/api/cms/questions',
        method: 'get',
        params
    })
}
//获取热门问题详情
export function getQuestionDetail(id){
    return request({
        url:'/api/cms/questions/' + id,
        method: 'get'
    })
}
//获取我的反馈列表
export function getFeedbackList(params){
    return request({
        url:'/api/cms/user/feedback/page/user',
        method: 'get',
        params
    })
}
//获取我的反馈详情
export function getFeedbackDetail(id){
    return request({
        url:'/api/cms/user/feedback/get?id=' + id,
        method: 'get'
    })
}