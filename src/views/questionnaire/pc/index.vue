<template>
    <div class="questionnaire">
        <el-tabs v-model="active" @tab-click="(val) => changeTab(val.name)">
            <el-tab-pane label="待填写" name="first">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="item in listData" :key="item.id">
                        <el-card shadow="hover">
                            <!-- 问卷type:1考试type:2 -->
                            <div class="exam" @click="handleClick(item)">
                                <div class="exam-title">
                                    <span class="exam-left">{{ item.name }}</span>
                                    <el-tag type="primary" size="medium" :color="item.type == 1?'#ff941a':'#407cd5'">
                                        {{item.type == 1?'问卷':'考试'}}
                                    </el-tag>
                                </div>
                                <div class="exam-time">
                                    <span>开始时间：{{ item.startTime | timeFilter }}</span>
                                    <span>结束时间：{{ item.endTime | timeFilter }}</span>
                                </div>
                                <div>题目数量：{{ item.questionNum }}</div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <!-- 数据为空 -->
                <el-image :src="emptyImg" class="empty" v-if="isShowL"></el-image>
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="second">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="item in historyData" :key="item.id">
                        <el-card shadow="hover" style="height: 160px">
                            <!-- 问卷type:1考试type:2 -->
                            <div class="exam" @click="jumpToPageByQuery('/questionnaire/pc/result',{info:encodeURIComponent(JSON.stringify(item))})">
                                <div class="exam-title">
                                    <span class="exam-left">{{ item.name }}</span>
                                    <el-tag type="primary" size="medium" :color="item.type == 1?'#ff941a':'#407cd5'">
                                        {{item.type == 1?'问卷':'考试'}}
                                    </el-tag>
                                </div>
                                <div class="exam-time">
                                    <span v-if="item.submitTime">提交时间：{{ item.submitTime | timeFilter }}</span>
                                    <span v-else>提交时间：</span>
                                </div>
                                <div class="exam-score">
                                    <span>耗时：{{item.userConsumeTime | timeFormat}}</span>
                                </div>
                                <div class="exam-score" v-if="item.type == 2">
                                    <el-row :gutter="10">
                                        <el-col :span="12">
                                            <span>正确：{{item.correctNum?item.correctNum:0}}/{{item.questionNum}}</span>
                                        </el-col>
                                        <el-col :span="12">
                                            <span>得分：{{item.userScore?item.userScore:0}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div v-if="item.type == 2">
                                    <el-row :gutter="10">
                                        <el-col :span="12">
                                            <span>合格分：{{item.passScore}}</span>
                                        </el-col>
                                        <el-col :span="12">
                                            <span>结果：{{item.status === 4?'超时':item.passStatus === null?'待判卷':item.passStatus?'合格':'不合格'}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <!-- 数据为空 -->
                <el-image :src="emptyImg" class="empty" v-if="isShowR"></el-image>
                <pagination
                    :total="total"
                    :page.sync="pageNum"
                    :limit.sync="pageSize"
                    @pagination="loadData"
                    v-if="!isShowR"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import index from '../components/mixins/index'

export default {
    components: {
        Pagination,
    },
    mixins: [index],
    data() {
        return {
        }
    },
    created() {

    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/questionnairePc";
@media only screen and (min-width: 1200px) {
    .questionnaire {
        padding: 30Px 100Px
    }
}
@media only screen and (min-width: 1920px) {
    .questionnaire {
        padding: 30Px 200Px
    }
}
::v-deep .el-card__body {
    padding: 20Px 15Px;
}
</style>