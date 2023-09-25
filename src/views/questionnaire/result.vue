<template>
    <div class="answer">
        <van-nav-bar fixed left-arrow @click-left="$router.go(-1);">
            <template #title>
                <div class="answer-title">{{baseInfo.name}}</div>
            </template>
        </van-nav-bar>
        <div class="p-25">
            <div v-for="(item,index) in questionList" :key="item.id">
                <!-- 问题列表 -->
                <div v-show="showAssociatedQuestion(item)" :id="'question-'+ index">
                    <Question type="result" :index="index" :baseInfo="baseInfo" :questionList="questionList" ></Question>
                </div>
            </div>
        </div>
        <div class="footer" v-if="baseInfo.type == 2">
            <van-row gutter="20">
                <van-col :span="24">
                    <div class="option" @click="showPopup = true">
                        <van-icon name="notes-o" size="0.6rem" />
                    </div>
                </van-col>
            </van-row>
        </div>
        <!-- 答题卡 -->
        <AnswerCard type="result" :showPopup.sync="showPopup" :questionList="questionList" :goAnchor="goAnchor"></AnswerCard>
    </div>
</template>

<script>
import Question from './components/Question'
import AnswerCard from './components/AnswerCard.vue'
import result from './components/mixins/result'

export default {
    components: { 
        Question,
        AnswerCard
    },
    mixins: [result],
    data() {
        return {
            
        }
    },
    created() {
        
    },
    methods: {
        showAssociatedQuestion(item) {
            if (!item.isAssociated) {
                return !item.isAssociated
            } else {
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
                return hasItemId
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/questionnaire";
</style>