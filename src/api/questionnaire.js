import request from './request'

//获取用户需要参加的问卷列表
export function getQuestionnaireList(){
    return request({
        url:'/api/questionnaire/getQuestionnaireList',
        method: 'get',
    })
}

//获取问卷题目
export function getQuestionList(id){
    return request({
        url:'/api/questionnaire/getQuestionList?id='+id,
        method: 'get',
    })
}

//提交问卷
export function submitAnswers(data){
    return request({
        url:'/api/questionnaire/submit',
        method: 'post',
        data
    })
}

//暂存问卷
export function saveAnswers(data){
    return request({
        url:'/api/questionnaire/stageSave',
        method: 'post',
        data
    })
}

//获取历史问卷列表
export function getHistoryQuestionnaireList(params){
    return request({
        url:'/api/questionnaire/getHistoryQuestionnaireList',
        method: 'get',
        params
    })
}

//获取历史完成的问卷题目，答案回显
export function getHistoryCompletedQuestion(id){
    return request({
        url:'/api/questionnaire/getHistoryCompletedQuestion?id='+id,
        method: 'get',
    })
}


