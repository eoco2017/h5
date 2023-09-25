<!-- 热门问题列表 -->
<template>
    <div class="wrapper">
        <van-nav-bar fixed :border="false">
            <template #left>
                <van-button round icon="down" size="small" to="/feedback">返回</van-button>
            </template>
        </van-nav-bar>
        <van-list v-model="loading" :finished="finished" @load="loadData">
            <div class="content">
                <div v-for="(item,index) in listData" :key="index" class="list" @click="jumpToPage('question-detail', {id: item.id})">
                    <div class="title">{{item.question}}</div>
                    <van-icon name="arrow" slot="right-icon" color="#959595" />
                </div>
            </div>
        </van-list>
        <van-empty :image="emptyImg" v-if="isShow" />
    </div>
</template>

<script>
import { getQuestionList } from "@/api/feedback";

export default {
    data() {
        return {
            question: "",
            total: 0,
            pageNum: 1,
            pageSize: 10,
            loading: false,
            finished: false,
            listData: [],
            emptyImg: require("@/assets/empty.png"),
            isShow: false
        };
    },
    created() {
        if (this.$route.params.question) {
            this.question = this.$route.params.question;
        }
    },
    methods: {
        //获取列表数据
        async loadData() {
            const { data } = await getQuestionList({
                question: this.question,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            });
            this.loading = false;
            this.finished = false;
            this.total = data.total;
            if (this.listData == null) {
                this.listData = [];
            }
            this.listData = this.listData.concat(data.records || []);
            if ( this.listData.length == 0 ) {
                this.isShow = true;
            }
            if (
                this.listData.length == 0 ||
                this.listData.length == this.total
            ) {
                this.finished = true;
                return;
            }
            this.pageNum++;
        },
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    min-height: 100vh;
    padding: 92px 25px;
    background: #f4f4f4;
    font-size: 28px;
    .content {
        width: 100%;
        padding: 0 25px;
        border-radius: 30px;
        background: #fff;
        .list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 115px;
            line-height: 115px;
            border-bottom: 1px solid #eaeaea;
        }
        .list:last-child {
            border-bottom: none;
        }
        .title {
            width: 80%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}
::v-deep .van-icon-down {
    transform: rotate(90deg);
}
::v-deep .van-empty__image {
    width: 500px;
    height: auto;
}
::v-deep .van-nav-bar {
    background: #f4f4f4;
}
::v-deep .van-nav-bar__left {
    padding: 0 25px;
}
</style>