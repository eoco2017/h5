// 答题页面公共方法
import dayjs from 'dayjs'
import { OPTION_NAME } from "@/api/constant";
import { parseTime, showInfo, showSuccess, showError } from '@/utils/index';
import { getQuestionList, submitAnswers, saveAnswers } from "@/api/questionnaire";

export default {
    data() {
        return {
            baseInfo:{},
            questionList: [],
            userAnswer: [],
            optionName: OPTION_NAME,
            startTime: "",
            endTime: "",
            timer: null,
            curIndex: 0,
            showPopup: false,
            activeList:[]
        }
    },
    created() {
        if (this.$route.query.info) {
            this.baseInfo = JSON.parse(decodeURIComponent(this.$route.query.info))
            setTimeout(()=>{
                this.startTime = parseTime(new Date())
            },1000)
            this.getQuestionList()
            //考试显示倒计时
            if (this.baseInfo.consumeTime && this.baseInfo.type == 2) {
                //获取第一次打开页面时间
                // if (!localStorage.getItem('fill_in_page_time')) {
                //     localStorage.setItem('fill_in_page_time', dayjs().valueOf())
                // }
                // let differ = 0
                // if (sessionStorage.getItem('leftTime')) {
                //     let preTime = Number(localStorage.getItem('fill_in_page_time'))
                //     let date1 = dayjs().format('YYYY-MM-DD HH:mm:ss')
                //     let date2 = dayjs(preTime).format('YYYY-MM-DD HH:mm:ss')
                //     differ = dayjs(date1).diff(date2,'second')
                //     console.log(differ)
                // }
                //存储当前时间
                // sessionStorage.setItem('leftTime',dayjs().valueOf())
                // this.baseInfo.consumeTime = this.baseInfo.consumeTime - differ


                // this.timeReduce()
            }
        }
    },
    methods: {
        //倒计时
        timeReduce() {
            this.timer = setInterval(()=>{
                if (this.baseInfo.consumeTime<=0) {
                    clearInterval(this.timer)
                    showInfo('答题结束')
                    this.getUserAnswer()
                    this.submitAnswers()
                } else {
                    --this.baseInfo.consumeTime
                }
            },1000)
        },
        //获取问卷/考试题目并排序
        async getQuestionList() {
            const { data } = await getQuestionList(this.baseInfo.id)
            this.questionList = data.questionList || []
            this.questionList.forEach(item=>{
                if (item.options) {
                    item.options = JSON.parse(item.options)
                    item.options.forEach(op=>op.index = op.index.toString())
                }
                if (item.answer) {
                    // 简单题数组转字符串
                    if (item.type == 1 || item.type == 3) {
                        item.answer = item.answer.join('')
                    }
                } else {
                    if (item.type == 2) {
                        item.answer = []
                    }
                }
            })
            //单选-多选-简答题排序
            this.questionList = this.questionList.sort((a, b)=> {
                return a.type - b.type
            })
            this.activeList = this.questionList.filter(item=>!item.isAssociated)
        },
        //获取用户答案
        getUserAnswer() {
            this.userAnswer = this.questionList.map(item=>{
                return {
                    questionId: item.id,
                    answer: (item.type == 1 || item.type == 3)?(item.answer?[item.answer]:[]):item.answer.sort((a, b)=> {
                        return a - b
                    })
                }
            })
        },
        // 暂存
        async saveAnswers() {
            this.getUserAnswer()
            let obj = {
                questionnaireId: this.baseInfo.id,
                answers: this.userAnswer,
                startTime: this.startTime,
                endTime: parseTime(new Date())
            }
            const res = await saveAnswers(obj)
            if (res.code == 200) {
                // window.clearInterval(this.timer)
                showSuccess('保存成功')
                this.jumpToPageByQuery('/questionnaire')
            }
        },
        // 提交前校验
        beforeSubmitAnswers() {
            this.getUserAnswer()
            // let isFinish = true
            //检测用户是否题目全部做完
            // if (this.userAnswer.length < this.questionList.length) {
            //     isFinish = false
            // }
            // for (let i = 0; i < this.userAnswer.length; i++) {
            //     if (!this.userAnswer[i].answer.join('') || this.userAnswer[i].answer.length == 0) {
            //         isFinish = false  
            //     }
            // }
            // if (!isFinish) {
                    // this.$toast('当前题目未做完, 无法提交')
            //     this.$message('当前题目未做完, 无法提交')
            // } else {
            //     this.$confirm('是否确认提交？','提示',{
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     })
            //     .then(() => {
            //         this.submitAnswers()
            //     })
            //     .catch(()=>{

            //     })
            // }
            if (this.$route.name.includes('pc')) {
                this.$confirm('是否确认提交？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.submitAnswers()
                })
                .catch(()=>{
    
                })
            } else {
                this.$dialog.confirm({
                    title: '提示',
                    message: '是否确认提交？',
                })
                .then(async () => {
                    this.submitAnswers()
                })
                .catch(()=>{
    
                })
            }
        },
        //提交
        async submitAnswers() {
            let obj = {
                questionnaireId: this.baseInfo.id,
                answers: this.userAnswer,
                startTime: this.startTime,
                endTime: parseTime(new Date())
            }
            const res = await submitAnswers(obj)
            if (res.code == 200) {
                // window.clearInterval(this.timer)
                sessionStorage.setItem('activeName', 'second')
                showSuccess('提交成功')
                this.jumpToPage('questionnaire')
            }
        },
        //答题卡跳转
        goAnchor(selector) {
            this.$el.querySelector(selector).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
        },
        //swipe上一页
        handlePrev() {
            this.$refs.mySwiper.swiper.slidePrev();
        },
        //swipe下一页
        handleNext() {
            this.$refs.mySwiper.swiper.slideNext();
        },
        //swipe跳转到自定项
        handleSwipe(index) {
            console.log(this.$refs.mySwiper.swiper.slides[index])
            this.$refs.mySwiper.swiper.slideTo(index);
        },
        //swipe切换事件
        slideChange() {
            console.log(this.$refs.mySwiper.swiper)
            // console.log(this.$refs.mySwiper.swiper.snapGrid)
            this.activeList = this.$refs.mySwiper.swiper.snapGrid
            this.curIndex = this.$refs.mySwiper.swiper.activeIndex
        },
    },
    beforeDestroy () {
        // window.clearInterval(this.timer)
    },
}
