<template>
    <div class="question-card">
        <div class="cate">
            <span>
                <i class="el-icon-s-order mr-6"></i>答题卡
            </span>
            <div class="cate-right">
                <span :class="type=='detail'?'circle':'circle success'"></span>
                <span class="mr-10">{{type=='detail'?'未答':'正确'}}</span>
                <span :class="type=='detail'?'circle finish':'circle error'"></span>
                <span>{{type=='detail'?'已答':'错误'}}</span>
            </div>
        </div>
        <p>单选题</p>
        <div class="wrap">
            <span v-for="item in questionList.length" :key="item+'radio'">
                <el-tag :type="questionList[item-1].answer?'':'info'" plain v-show="questionList[item-1].type == 1" @click="goAnchor('#question-'+  (item -1))" v-if="type=='detail'">
                    {{item}}
                </el-tag>
                <el-tag :type="questionList[item-1].userScore?'success':'danger'" plain v-show="questionList[item-1].type == 1" @click="goAnchor('#question-'+  (item -1))" v-else>
                    {{item}}
                </el-tag>
            </span>
        </div>
        <p>多选题</p>
        <div class="wrap">
            <span v-for="item in questionList.length" :key="item+'check'">
                <el-tag :type="questionList[item-1].answer&&questionList[item-1].answer.length?'':'info'" plain v-show="questionList[item-1].type == 2" @click="goAnchor('#question-'+  (item -1))" v-if="type=='detail'">
                    {{item}}
                </el-tag>
                <el-tag :type="questionList[item-1].userScore?'success':'danger'" plain v-show="questionList[item-1].type == 2" @click="goAnchor('#question-'+  (item -1))" v-else>
                    {{item}}
                </el-tag>
            </span>
        </div>
        <p>简答题</p>
        <div class="wrap">
            <span v-for="item in questionList.length" :key="item+'input'">
                <el-tag :type="questionList[item-1].answer?'':'info'" plain v-show="questionList[item-1].type == 3" @click="goAnchor('#question-'+ (item -1) )" v-if="type=='detail'">
                    {{item}}
                </el-tag>
                <el-tag :type="questionList[item-1].userScore === null?'warning':questionList[item-1].userScore?'success':'danger'" plain v-show="questionList[item-1].type == 3" @click="goAnchor('#question-'+ (item -1))" v-else>
                    {{item}}
                </el-tag>
            </span>
        </div>
    </div>
</template>

<script>
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
        goAnchor: {
            type: Function,
        }
    },
}
</script>
<style lang="scss" scoped>
@import "../../../styles/questionnairePc";
</style>