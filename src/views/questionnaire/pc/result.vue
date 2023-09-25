<template>
    <div class="answer">
        <!-- 导航栏 -->
        <breadcrumb type="result"></breadcrumb>
        <div class="exam">
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-card shadow="never">
                        <!-- 问题列表 -->
                        <QuestionPC type="result" :questionList="questionList" :baseInfo="baseInfo"></QuestionPC>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="never">
                        <div class="exam-title">{{baseInfo.name}}</div>
                        <div class="exam-desc">{{baseInfo.description}}</div>
                        <el-divider></el-divider>
                        <div class="mb-10">耗时：{{baseInfo.userConsumeTime | timeFormat}}</div>
                        <div v-if="baseInfo.type == 2">
                            <div class="mb-10">得分：{{baseInfo.userScore}}</div>
                            <div class="mb-10">合格分：{{baseInfo.passScore}}</div>
                            <div class="mb-10">结果：{{baseInfo.status === 4?'超时':baseInfo.passStatus === null?'待判卷':baseInfo.passStatus?'合格':'不合格'}}</div>
                            <el-divider></el-divider>
                            <!-- 答题卡 -->
                            <AnswerCardPC type="result" :questionList="questionList" :goAnchor="goAnchor"></AnswerCardPC>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb.vue'
import QuestionPC from '../components/QuestionPC'
import AnswerCardPC from '../components/AnswerCardPC'
import result from '../components/mixins/result'

export default {
    components: { 
        Breadcrumb,
        QuestionPC,
        AnswerCardPC
    },
    mixins: [result],
    data() {
        return {
            doRightTag: [{ key: true, value: 'success' }, { key: false, value: 'danger' }, { key: null, value: 'warning' }],
        }
    },
    created() {
        
    },
    methods: {
        questionDoRightTag(status) {
            return this.enumFormat(this.doRightTag, status)
        },
        enumFormat(arrary, key) {
            return this.format(arrary, key)
        },
        format(array, key) {
            for (let item of array) {
                if (item.key === key) {
                    return item.value
                }
            }
            return null
        },
    }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/questionnairePc";
::v-deep .el-card {
    overflow-y: auto
}
</style>