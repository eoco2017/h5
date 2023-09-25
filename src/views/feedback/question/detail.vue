<!-- 热门问题详情 -->
<template>
    <div class="article">
        <van-nav-bar fixed :border="false">
            <template #left>
                <van-button round icon="down" size="small" @click="$router.go(-1);">返回</van-button>
            </template>
        </van-nav-bar>
        <div class="content">
            <div class="title">{{ question }}</div>
            <div v-html="description"></div>
        </div>
    </div>
</template>

<script>
import { getQuestionDetail } from "@/api/feedback";

export default {
    data() {
        return {
            question: "",
            description: "",
        };
    },
    created() {
        if (this.$route.params.id) {
            this.getQuestionDetail(this.$route.params.id);
        }
    },
    methods: {
        async getQuestionDetail(id) {
            const { data } = await getQuestionDetail(id);
            this.question = data.question;
            this.description = data.answer;
        },
    },
};
</script>

<style lang="scss" scoped>
.article {
    width: 100%;
    min-height: 100vh;
    padding: 92px 25px;
    font-size: 26px;
    .content {
        padding-top: 30px;
    }
    .title {
        margin-bottom: 60px;
        font-size: 28px;
    }
}
::v-deep .van-icon-down {
    transform: rotate(90deg);
}
::v-deep .van-nav-bar__left {
    padding: 0 25px;
}
</style>