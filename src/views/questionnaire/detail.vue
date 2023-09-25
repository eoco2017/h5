<template>
    <div class="answer">
        <van-nav-bar
            fixed
            left-arrow
            right-text="暂存"
            @click-left="jumpToPage('questionnaire')"
            @click-right="saveAnswers"
        >
            <template #title>
                <div class="answer-title">{{baseInfo.name}}</div>
            </template>
        </van-nav-bar>
        <!-- 考试倒计时 -->
        <van-notice-bar v-if="baseInfo.consumeTime && baseInfo.type == 2">
            <van-icon name="clock-o" class="mr-10"/>作答限时：{{baseInfo.consumeTime/60}}分钟
        </van-notice-bar>
        <!-- <van-notice-bar v-if="baseInfo.consumeTime && baseInfo.type == 2">
            <van-icon name="clock-o" class="mr-10"/>{{baseInfo.consumeTime | formatSeconds}}
        </van-notice-bar> -->
        <swiper ref="mySwiper" @slideChange="slideChange">
            <swiper-slide v-for="(item,index) in questionList" :key="item.id" v-show="showAssociatedQuestion(item)" :id="'question-'+ index"> 
                <Question type="detail" :index="index" :baseInfo="baseInfo" :questionList="questionList" @aaa="aaa"></Question>
            </swiper-slide>
		</swiper>
        <div class="footer">
            <van-row gutter="20">
                <van-col :span="4">
                    <div class="option" @click="showPopup = true">
                        <van-icon name="notes-o" size="0.6rem" />
                    </div>
                </van-col>
                <van-col :span="10">
                    <!-- curIndex<1 || !questionList[curIndex-1].answer || !questionList[curIndex-1].answer.length -->
                    <van-button round plain type="info" :disabled="curIndex<1" @click="handlePrev">{{curIndex}}上一题</van-button>
                </van-col>
                <van-col :span="10">
                    <!-- :disabled="!questionList[curIndex].answer || !questionList[curIndex].answer.length" -->
                    <van-button round type="info"  v-if="curIndex<activeList.length-1" @click="handleNext">下一题</van-button>
                    <van-button round type="info" @click="beforeSubmitAnswers" v-else>提交</van-button>
                </van-col>
            </van-row>
        </div>
        <!-- 答题卡 -->
        <AnswerCard type="detail" :showPopup.sync="showPopup" :questionList="questionList" :handleSwipe="handleSwipe"></AnswerCard>
    </div>
</template>

<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Question from './components/Question'
import AnswerCard from './components/AnswerCard'
import detail from './components/mixins/detail';

export default {
    components: {
        Question,
        AnswerCard,
        swiper,
        swiperSlide
    },
    mixins: [detail],
    data() {
        return {
            
        }
    },
    created() {
        
    },
    watch: {
        questionList:{
            handler(val) {
                val.forEach((item,index)=>{
                    if (item.isAssociated && item.answer) {
                        //隐藏题并且已勾选
                        let hasItemId = this.questionList.some(question=>{
                            if (question.answer && question.options) {
                                if(question.options.find(op=>op.index == question.answer) && question.options.find(op=>op.index == question.answer).associationId && question.options.find(op=>op.index == question.answer).associationId.indexOf(item.id)!== -1) {
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                return false
                            }
                        })
                        if (!hasItemId) {
                            this.$set(item,'answer',null)
                        }
                    }
                })
            },
            deep:true,
            immediate:true
        }
    },
    methods: {
        showAssociatedQuestion(item) {
            if (!item.isAssociated) {
                return !item.isAssociated
            } else {
                let hasItemId = this.questionList.some(question=>{
                    if (question.answer && question.options) {
                        if (question.options.find(op=>op.index == question.answer) && question.options.find(op=>op.index == question.answer).associationId && question.options.find(op=>op.index == question.answer).associationId.indexOf(item.id)!== -1) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                })
                return hasItemId
            }
        },
        aaa() {
            this.$nextTick(()=>{
                this.activeList = this.$refs.mySwiper.swiper.snapGrid
            })
            
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../../styles/questionnaire";
::v-deep .swiper-slide {
    padding: 0 25px;
    min-height: calc(100vh - 300px - constant(safe-area-inset-bottom));
    min-height: calc(100vh - 300px - env(safe-area-inset-bottom));
}
</style>