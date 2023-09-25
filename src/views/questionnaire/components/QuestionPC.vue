<template>
    <div>
        <div v-for="(item,index) in questionList" :key="item.id">
            <div class="main" v-show="showAssociatedQuestion(item)" :id="'question-'+ index">
                <div class="main-title">
                    <div>
                        <span><i>{{index + 1}}</i>/{{questionList.length}}</span>
                        <span>
                            <el-tag type="primary" effect="dark" size="mini">{{item.type === 1?'单选题':item.type === 2?'多选题':'简答题'}}</el-tag>
                        </span>
                    </div>
                    <!-- 考试显示 -->
                    <span v-if="baseInfo.type == 2">
                        （本题{{item.score}}分，总共{{baseInfo.score}}分）
                    </span>
                </div>
                <div class="main-subtitle">{{item.question}}</div>
                <!-- 单选题 -->
                <div v-if="item.type === 1">
                    <el-radio-group v-model="item.answer" :disabled="type=='result'">
                        <el-radio v-for="ritem in item.options" :key="ritem.index" :label="ritem.index" icon-size="16px" :class="(item&&item.answer&&item.answer == ritem.index)?'active':''">{{ritem.des}}</el-radio>
                    </el-radio-group>
                </div>
                <!-- 多选题 -->
                <div v-if="item.type === 2">
                    <el-checkbox-group v-model="item.answer" :disabled="type=='result'">
                        <el-checkbox v-for="(citem,cindex) in item.options" :key="citem.index" :label="citem.index" :class="(item&&item.answer&&item.answer.indexOf(citem.index) !== -1)?'active':''">
                            <div>
                                <span class="mr-10">{{optionName[cindex] + '.'}}</span>
                                <span>{{citem.des}}</span>
                            </div>
                            <i class="el-icon-check" style="color:#1989fa" v-show="item&&item.answer&&item.answer.indexOf(citem.index) !== -1"></i>
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <!-- 简答题 -->
                <div v-if="item.type === 3">
                    <div>
                        <el-input
                            v-model="item.answer"
                            rows="5"
                            type="textarea"
                            placeholder="请输入"
                            :disabled="type=='result'"
                        />
                    </div>
                </div>
                <!-- 详情页里的考试 -->
                <div class="result" v-if="baseInfo.type == 2 && type=='result'">
                    <!-- 单选题 -->
                    <div v-if="item.type == 1">正确答案：
                        <span v-if="item.options.find(option=>option.index == item.correctOptions)">{{item.options.find(option=>option.index == item.correctOptions).des}}</span>
                    </div>
                    <!-- 多选题 -->
                    <div v-if="item.type == 2">
                        正确答案：
                        <span v-for="(correct,correctindex) in item.correctOptions" :key="correctindex">
                            {{optionName[correct - 1]}}
                        </span>
                    </div>
                    <!-- 单选题 -->
                    <div v-if="item.type == 1">结果：
                        <span v-if="item.answer" class="mr-10">{{item.options.find(option=>option.index == item.answer).des}}</span>
                        <el-tag type="success" v-if="item.answer && item.answer === item.correctOptions">正确</el-tag>
                        <el-tag type="danger" v-else>错误</el-tag>
                    </div>
                    <!-- 多选题 -->
                    <div v-if="item.type == 2">结果：
                        <span v-for="(result,resultindex) in item.answer" :key="resultindex">
                            {{optionName[result - 1]}}
                        </span>
                        <el-tag type="success" v-if="item.answer.length && item.answer.join(',') === item.correctOptions.join(',')">正确</el-tag>
                        <el-tag type="danger" v-else>错误</el-tag>
                    </div>
                    <div>得分：
                        <el-tag type="warning" v-if="item.userScore === null">待判卷</el-tag>
                        <span v-else>{{item.userScore}}</span>
                    </div>
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
@import "../../../styles/questionnairePc";
</style>