// 结果页面公用方法
import { DEGREE_TYPE, OPTION_NAME, QUESTION_STATUS, } from "@/api/constant";
import { getHistoryCompletedQuestion } from "@/api/questionnaire";

export default {
    data() {
        return {
            baseInfo: {},
            questionList: [],
            optionName: OPTION_NAME,
            degreeType: DEGREE_TYPE,
            questionStatus: QUESTION_STATUS,
            showPopup: false
        }
    },
    created() {
        if (this.$route.query.info) {
            this.baseInfo = JSON.parse(decodeURIComponent(this.$route.query.info))
            this.getHistoryCompletedQuestion()
        }
    },
    methods: {
        //获取问卷/考试答案
        async getHistoryCompletedQuestion() {
            const { data } = await getHistoryCompletedQuestion(this.baseInfo.id)
            this.questionList = data || []
            this.questionList.forEach(item=>{
                if (item.options) {
                    item.options = JSON.parse(item.options)
                    item.options.forEach(op=>op.index = op.index.toString())
                }
                if (item.correctOptions) {
                    item.correctOptions = JSON.parse(item.correctOptions).sort((a, b)=> {
                        return a - b
                    })
                }
                // 单选、简答题数组转字符串
                if (item.type == 1 || item.type == 3) {
                    item.answer = item.answer.join('')
                    item.correctOptions = item.correctOptions.join('')
                }
            })
            // 单选、多选、简答排序
            this.questionList = this.questionList.sort((a, b)=> {
                return a.type - b.type
            })
        },
        goAnchor(selector) {
            this.$el.querySelector(selector).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
        },
    }
}
