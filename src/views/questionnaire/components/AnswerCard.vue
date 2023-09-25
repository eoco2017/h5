<template>
    <div>
        <van-popup v-model="isShow" closeable :style="{ minHeight: '50%',width:'90%' }" @close="close">
            <div class="question-card">
                <p class="subtitle">答题卡</p>
                <div>
                    <p>单选题</p>
                    <div class="wrap">
                        <span v-for="item in questionList.length" :key="item+'radio'">
                            <van-tag type="primary" size="large" :color="questionList[item-1].answer?'#ecf5ff':'#f4f4f5'" :text-color="questionList[item-1].answer?'#409EFF':'#909399'" v-show="questionList[item-1].type == 1" @click="handleSwipe(item-1)" v-if="type=='detail'">
                                {{item}}
                            </van-tag>
                            <van-tag type="primary" size="large" :color="questionList[item-1].userScore?'#e1f3d8':'#fde2e2'" :text-color="questionList[item-1].userScore?'#67c23a':'#f56c6c'" v-show="questionList[item-1].type == 1" @click="goAnchor('#question-'+ (item -1))" v-else>
                                {{item}}
                            </van-tag>
                        </span>
                    </div>
                    <p>多选题</p>
                    <div class="wrap">
                        <span v-for="item in questionList.length" :key="item+'check'">
                            <van-tag type="primary" size="large" :color="questionList[item-1].answer&&questionList[item-1].answer.length?'#ecf5ff':'#f4f4f5'" :text-color="questionList[item-1].answer&&questionList[item-1].answer.length?'#409EFF':'#909399'" v-show="questionList[item-1].type == 2" @click="handleSwipe(item-1)" v-if="type=='detail'">
                                {{item}}
                            </van-tag>
                            <van-tag type="primary" size="large" :color="questionList[item-1].userScore?'#e1f3d8':'#fde2e2'" :text-color="questionList[item-1].userScore?'#67c23a':'#f56c6c'" v-show="questionList[item-1].type == 2" @click="goAnchor('#question-'+ (item -1))" v-else>
                                {{item}}
                            </van-tag>
                        </span>
                    </div>
                    <p>简答题</p>
                    <div class="wrap">
                        <span v-for="item in questionList.length" :key="item+'input'">
                            <van-tag type="primary" size="large" :color="questionList[item-1].answer?'#ecf5ff':'#f4f4f5'" :text-color="questionList[item-1].answer?'#409EFF':'#909399'" v-show="questionList[item-1].type == 3" @click="handleSwipe(item-1)" v-if="type=='detail'">
                                {{item}}
                            </van-tag>
                            <van-tag type="primary" size="large" :color="questionList[item-1].userScore === null?'#fdf6ec':questionList[item-1].userScore?'#e1f3d8':'#fde2e2'" :text-color="questionList[item-1].userScore === null?'#e6a23c':questionList[item-1].userScore?'#67c23a':'#f56c6c'" v-show="questionList[item-1].type == 3" @click="goAnchor('#question-'+ (item -1))" v-else>
                                {{item}}
                            </van-tag>
                        </span>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        showPopup: {
            type: Boolean,
            default: false
        },
        questionList: {
            type: Array,
            default: []
        },
        handleSwipe: {
            type: Function,
        },
        goAnchor: {
            type: Function,
        }
    },
    data() {
        return {
            isShow:false
        }
    },
    watch:{
        showPopup(val) {
            this.isShow = val
        }
    },
    methods: {
        close() {
            this.$emit('update:showPopup', false)
        },
    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/questionnaire";
</style>