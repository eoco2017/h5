<template>
    <div class="questionnaire">
        <van-tabs ref="tabs" v-model="active" swipeable fixed @change="changeTab">
            <van-tab title="待填写" name="first">
                <div class="container">
                    <div v-for="item in listData" :key="item.id" @click="handleClick(item)">
                        <!-- 问卷type:1考试type:2 -->
                        <div class="exam">
                            <div class="exam-title">
                                <span class="exam-left">{{ item.name }}</span>
                                <van-tag type="primary" size="medium" :color="item.type == 1?'#ff941a':'#407cd5'">
                                    {{item.type == 1?'问卷':'考试'}}
                                </van-tag>
                            </div>
                            <div class="exam-time">
                                <span>开始时间：{{ item.startTime | timeFilter }}</span>
                                <span>结束时间：{{ item.endTime | timeFilter }}</span>
                            </div>
                            <div>题目数量：{{ item.questionNum }}</div>
                        </div>
                    </div>
                </div>
                <!-- 数据为空 -->
                <ListEmpty :isShow="isShowL"></ListEmpty>
            </van-tab>
            <van-tab title="历史记录" name="second">
                <div class="container">
                    <van-list v-model="loading" :finished="finished" @load="loadData">
                        <div v-for="item in historyData" :key="item.id" @click="jumpToPageByQuery('/questionnaire/result',{info:encodeURIComponent(JSON.stringify(item))})">
                            <!-- 问卷type:1 -->
                            <div class="exam">
                                <div class="exam-title">
                                    <span class="exam-left">{{ item.name }}</span>
                                    <van-tag type="primary" size="medium" :color="item.type == 1?'#ff941a':'#407cd5'">
                                        {{item.type == 1?'问卷':'考试'}}
                                    </van-tag>
                                </div>
                                <div class="exam-time">
                                    <span v-if="item.submitTime">提交时间：{{ item.submitTime | timeFilter }}</span>
                                    <span v-else>提交时间：</span>
                                </div>
                                <div class="mb-10">
                                    <van-row>
                                        <van-col :span="8" v-if="item.type == 2">
                                            <span>正确：{{ item.correctNum?item.correctNum:0 }}/{{ item.questionNum }}</span>
                                        </van-col>
                                        <van-col :span="8" v-if="item.type == 2">
                                            <span>得分：{{ item.userScore?item.userScore:0 }}</span>
                                        </van-col>
                                        <van-col :span="8">
                                            <span>耗时：{{ item.userConsumeTime | timeFormat }}</span>
                                        </van-col>
                                    </van-row>
                                </div>
                                <div v-if="item.type == 2">
                                    <van-row>
                                        <van-col :span="8">
                                            <span>合格分：{{ item.passScore }}</span>
                                        </van-col>
                                        <van-col :span="8">
                                            <span>结果：{{ item.status === 4?'超时':item.passStatus === null?'待判卷':item.passStatus?'合格':'不合格' }}</span>
                                        </van-col>
                                    </van-row>
                                </div>
                            </div>
                        </div>
                    </van-list>
                </div>
                <!-- 数据为空 -->
                <ListEmpty :isShow="isShowR"></ListEmpty>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import ListEmpty from '@/components/ListEmpty'
import index from './components/mixins/index'

export default {
    components: {
        ListEmpty
    },
    mixins: [index],
    data() {
        return {
        };
    },
    created() {
        setTimeout(() => {
            if (this.$refs.tabs) {
                this.$refs.tabs.resize()
            }
        }, 200)
    },
    methods: {

    },
};
</script>

<style lang="scss" scoped>
@import "../../styles/questionnaire";
</style>
