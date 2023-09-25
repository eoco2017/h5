<template>
    <div class="answer">
        <!-- 导航栏 -->
        <breadcrumb type="detail"></breadcrumb>
        <div class="exam">
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-card shadow="never">
                        <!-- 问题列表 -->
                        <QuestionPC type="detail" :questionList="questionList" :baseInfo="baseInfo"></QuestionPC>
                    </el-card>
                </el-col>
                <el-col :span="6" style="position:relative">
                    <el-card shadow="never">
                        <div class="exam-title">{{baseInfo.name}}</div>
                        <div class="exam-desc">{{baseInfo.description}}</div>
                        <el-divider></el-divider>
                        <div v-if="baseInfo.consumeTime && baseInfo.type == 2">
                            <div class="mb-10">答题类型：考试</div>
                            <div>作答限时：{{ baseInfo.consumeTime/60 }}分钟</div>
                            <el-divider></el-divider>
                        </div>
                        <!-- <div v-if="baseInfo.consumeTime && baseInfo.type == 2">
                            <div class="time">
                                <i class="el-icon-time mr-10"></i>
                                <span>剩余时间</span>
                                <div style="color: red">{{baseInfo.consumeTime | formatSeconds}}</div>
                            </div>
                            <el-divider></el-divider>
                        </div> -->
                        <!-- 答题卡 -->
                        <AnswerCardPC type="detail" :questionList="questionList" :goAnchor="goAnchor"></AnswerCardPC>
                    </el-card>
                    <el-row :gutter="10" class="footer">
                        <el-col :span="12">
                            <el-button round type="primary" plain @click="saveAnswers">暂存</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button round type="primary" @click="beforeSubmitAnswers">提交</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb'
import QuestionPC from '../components/QuestionPC'
import AnswerCardPC from '../components/AnswerCardPC'
import detail from '../components/mixins/detail'

export default {
    components: {
        AnswerCardPC,
        QuestionPC,
        Breadcrumb
    },
    mixins: [detail],
    data() {
        return {

        }
    },
    created() {
        
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
@import "../../../styles/questionnairePc";
::v-deep .el-card {
    overflow-y: auto
}
</style>