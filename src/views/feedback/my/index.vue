<!-- 我的反馈列表 -->
<template>
    <div class="wrapper">
        <van-nav-bar fixed :border="false">
            <template #left>
                <van-button round icon="down" size="small" to="/feedback">返回</van-button>
            </template>
        </van-nav-bar>
        <van-list v-model="loading" :finished="finished" @load="loadData">
            <div class="content">
                <div v-for="(item, index) in listData" :key="index" class="list" @click="jumpToPage('my-detail', { id: item.id })">
                    <div class="head">
                        <div>
                            <span v-for="(sitem, sindex) in item.module" :key="sindex">
                                <van-tag type="primary" size="medium" color="#407cd5" class="mr-6">
                                    {{ sitem | dataFilter(supportModule) }}
                                </van-tag>
                            </span>
                            <van-tag type="primary" size="medium" color="#f2f6f9" text-color="#888c95">
                                {{ item.type | dataFilter(supportType) }}
                            </van-tag>
                        </div>
                        <div>{{ item.createTime }}</div>
                    </div>
                    <div class="desc">
                        {{ item.content }}
                    </div>
                </div>
            </div>
        </van-list>
        <van-empty :image="emptyImg" v-if="isShow" />
    </div>
</template>

<script>
import { getFeedbackList } from "@/api/feedback";
import { SUPPORT_MODULE, SUPPORT_TYPE } from "@/api/constant";

export default {
    data() {
        return {
            total: 0,
            pageNum: 1,
            pageSize: 10,
            loading: false,
            finished: false,
            listData: [],
            supportModule: SUPPORT_MODULE,
            supportType: SUPPORT_TYPE,
            emptyImg: require("@/assets/empty.png"),
            isShow: false
        };
    },
    methods: {
        //获取列表数据
        async loadData() {
            const { data } = await getFeedbackList({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                userId: localStorage.getItem("userEmail"),
            });
            this.loading = false;
            this.finished = false;
            this.total = data.total;
            if (this.listData == null) {
                this.listData = [];
            }
            //模块限制5个
            let arr = data.records.map((item) => {
                if (item.module) {
                    item.module = item.module.splice(0, 5);
                }
                return item;
            });
            this.listData = this.listData.concat(arr || []);
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
            flex-direction: column;
            width: 100%;
            padding: 50px 0 40px 0;
            border-bottom: 1px solid #eaeaea;
        }
        .list:last-child {
            border-bottom: none;
        }
        .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: 24px;
            margin-bottom: 35px;
            color: #616161
        }
        .desc {
            width: 100%;
            line-height: 40px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
}
::v-deep .van-icon-down {
    transform: rotate(90deg);
}
::v-deep .van-tag--medium {
    padding: 4px 10px;
    border-radius: 8px;
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
