<template>
    <div>
        <div class="main" v-if="questionList[index]">
            <div class="main-title">
                <span>{{index + 1}}/{{questionList.length}}</span>
                <span>
                    {{questionList[index].type === 1?'单选题':questionList[index].type === 2?'多选题':'简答题'}}
                </span>
                <!-- 考试显示 -->
                <span v-if="baseInfo.type == 2">
                    （本题{{questionList[index].score}}分，总共{{baseInfo.score}}分）
                </span>
            </div>
            <div class="main-subtitle">{{questionList[index].question}}</div>
            <!-- 单选题 -->
            <div v-if="questionList[index].type === 1">
                <van-radio-group v-model="questionList[index].answer" :disabled="type=='result'" @change="aaa">
                    <van-radio v-for="ritem in questionList[index].options" :key="ritem.index" :name="ritem.index" icon-size="16px" :class="(questionList[index]&&questionList[index].answer&&questionList[index].answer == ritem.index)?'active':''">{{ritem.des}}</van-radio>
                </van-radio-group>
            </div>
            <!-- 多选题 -->
            <div v-if="questionList[index].type === 2">
                <van-checkbox-group v-model="questionList[index].answer" :disabled="type=='result'">
                    <van-checkbox v-for="(citem,cindex) in questionList[index].options" :key="citem.index" :name="citem.index" :class="(questionList[index]&&questionList[index].answer&&questionList[index].answer.indexOf(citem.index) !== -1)?'active':''">
                        <div>
                            <span class="mr-10">{{optionName[cindex] + '.' }}</span>
                            <span>{{citem.des}}</span>
                        </div>
                        <van-icon name="success" color="#1989fa" v-show="questionList[index]&&questionList[index].answer&&questionList[index].answer.indexOf(citem.index) !== -1" />
                    </van-checkbox>
                </van-checkbox-group>
            </div>
            <!-- 简答题 -->
            <div v-if="questionList[index].type === 3">
                <div class="main-textarea">
                    <van-field
                        v-model="questionList[index].answer"
                        rows="5"
                        type="textarea"
                        placeholder="请输入"
                        :disabled="type=='result'"
                    />
                </div>
            </div>
            <!-- 考试 -->
            <div class="result" v-if="baseInfo.type == 2 && type=='result'">
                <div v-if="questionList[index].type == 1">正确答案：
                    <span v-if="questionList[index].options.find(option=>option.index == questionList[index].correctOptions)">{{questionList[index].options.find(option=>option.index == questionList[index].correctOptions).des}}</span>
                </div>
                <div v-if="questionList[index].type == 2">
                    正确答案：
                    <span v-for="(correct,correctindex) in questionList[index].correctOptions" :key="correctindex">
                        {{optionName[correct - 1]}}
                    </span>
                </div>
                <div v-if="questionList[index].type == 1">结果：
                    <span v-if="questionList[index].answer" class="mr-10">{{questionList[index].options.find(option=>option.index == questionList[index].answer).des}}</span>
                    <van-tag type="primary" color="#67c23a" v-if="questionList[index].answer && questionList[index].answer === questionList[index].correctOptions">正确</van-tag>
                    <van-tag type="danger" v-else>错误</van-tag>
                </div>
                <div v-if="questionList[index].type == 2">结果：
                    <span v-for="(result,resultindex) in questionList[index].answer" :key="resultindex">
                        {{optionName[result - 1]}}
                    </span>
                    <van-tag type="primary" color="#67c23a" v-if="questionList[index].answer.length && questionList[index].answer.join(',') === questionList[index].correctOptions.join(',')">正确</van-tag>
                    <van-tag type="danger" v-else>错误</van-tag>
                </div>
                <div>得分：
                    <van-tag type="primary" color="#e6a23c" v-if="questionList[index].userScore === null">待判卷</van-tag>
                    <span v-else>{{questionList[index].userScore}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { OPTION_NAME } from "@/api/constant";

export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        index: {
            type: Number,
            default: 0
        },
        questionList: {
            type: Array,
            default: []
        },
        baseInfo: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            optionName: OPTION_NAME,
        }
    },
    methods: {
        aaa() {
            this.$emit('aaa')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/questionnaire";
.main {
    margin-top: 30px;
}
</style>