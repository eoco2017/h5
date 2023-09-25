<!-- 我的反馈详情 -->
<template>
    <div class="article">
        <van-nav-bar fixed :border="false">
            <template #left>
                <van-button round icon="down" size="small" @click="$router.go(-1);">返回</van-button>
            </template>
        </van-nav-bar>
        <div class="content">
            <van-cell-group :border="false">
                <van-cell title="功能模块">
                    <template #label>
                        <span v-for="(item,index) in baseInfo.module" :key="index">
                            {{item | dataFilter(supportModule)}}
                        </span>
                    </template>
                </van-cell>
                <van-cell title="问题类型">
                    <template #label>
                        <div>{{ (baseInfo.type + '') | dataFilter(supportType) }}</div>
                    </template>
                </van-cell>
                <van-cell title="问题描述">
                    <template #label>
                        <div>{{ baseInfo.content }}</div>
                        <div class="pic" v-if="baseInfo.screenshotUrl">
                            <van-image :src="imgSrc + item + '?accessToken=' + imgToken" v-for="(item,index) in baseInfo.screenshotUrl.split(',')" :key="index" @click="handlePreview(baseInfo.screenshotUrl.split(','),index)"></van-image>
                        </div>
                    </template>
                </van-cell>
                <van-cell title="满意度评价">
                    <template #label>
                        <div v-for="(item,index) in baseInfo.scoreList" :key="index">
                            <span>{{ item.columnName | dataFilter(rateType) }}</span>
                            <van-rate v-model="item.score" color="#ffd21e" readonly />
                        </div>
                    </template>
                </van-cell>
                <van-cell title="管理员回复">
                    <template #label>
                        {{ baseInfo.reply?baseInfo.reply:'感谢您的反馈。' }}
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
import { getFeedbackDetail } from "@/api/feedback";
import { SUPPORT_MODULE, SUPPORT_TYPE, RATE_TYPE } from "@/api/constant";
import { ImagePreview } from "vant";

export default {
    data() {
        return {
            baseInfo: {},
            supportModule: SUPPORT_MODULE,
            supportType: SUPPORT_TYPE,
            rateType: RATE_TYPE,
            imgSrc: process.env.VUE_APP_STATIC_API,
            imgToken: ""
        };
    },
    created() {
        if (this.$route.params.id) {
            this.getFeedbackDetail(this.$route.params.id);
        }
        this.imgToken = localStorage.getItem('accessToken')
    },
    methods: {
        async getFeedbackDetail(id) {
            const { data } = await getFeedbackDetail(id);
            this.baseInfo = data;
        },
        //图片预览
        handlePreview(imgList, startPosition) {
            let images = imgList.map((item) => {
                return this.imgSrc + item + '?accessToken=' + this.imgToken;
            });
            ImagePreview({
                images,
                startPosition,
                closeable: true,
            });
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
    .pic {
        display: flex;
        align-items: center;
        margin-top: 20px;
        .van-image {
            width: 170px;
            height: 170px;
            margin-right: 25px;
        }
    }
}
::v-deep .van-cell {
    padding-left: 0;
    padding-right: 0;
}
::v-deep .van-cell::after {
    left: 0;
    right: 0
}
::v-deep .van-cell__label {
    font-size: 26px;
    line-height: 40px;
    color: #333;
    span {
        margin-right: 20px;
    }
}
::v-deep .van-icon-down {
    transform: rotate(90deg);
}
::v-deep .van-nav-bar__left {
    padding: 0 25px;
}
</style>