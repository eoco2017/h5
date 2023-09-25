<!-- 帮助与反馈 -->
<template>
    <div class="feedback">
        <van-search v-model="question" placeholder="请输入搜索内容" @search="search" shape="round" :clearabled="true" :show-action="false" />
        <div class="help">
            <van-row :gutter="20">
                <van-col :span="12">
                    <div class="help-card" @click="backToApp('/pages/helpPage/index')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-chajiananzhuangjiaochengqu"></use>
                        </svg>
                        <span>使用帮助</span>
                    </div>
                </van-col>
                <van-col :span="12">
                    <div class="help-card" @click="backToApp('/pages/aboutWe/index')">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiaocheng"></use>
                        </svg>
                        <span>关于我们</span>
                    </div>
                </van-col>
            </van-row>
        </div>
        <div v-if="questionList.length !== 0">
            <div class="guide">
                <div>热门问题</div>
                <div class="more" @click="jumpToPage('question')">更多</div>
            </div>
            <div class="content">
                <div v-for="(item, index) in questionList" :key="index" class="list" @click="jumpToPage('question-detail', { id: item.id })">
                    <div class="title">{{ item.question }}</div>
                    <div>
                        <span v-if="item.hot" class="hot">热</span>
                        <van-icon name="arrow" slot="right-icon" color="#959595" />
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="guide">
                <div>我的反馈</div>
                <div class="more" @click="jumpToPage('my')">
                    <span v-if="feedbackList.length !== 0">更多</span>
                </div>
            </div>
            <div class="content">
                <div v-for="(item, index) in feedbackList" :key="index" class="my" @click="jumpToPage('my-detail', { id: item.id })">
                    <div class="my-head">
                        <div>
                            <span v-for="(sitem, sindex) in item.module" :key="sindex">
                                <van-tag type="primary" size="medium" color="#407cd5" class="mr-6">{{
                                    sitem | dataFilter(supportModule)
                                }}</van-tag>
                            </span>
                            <van-tag type="primary" size="medium" color="#f2f6f9" text-color="#888c95">{{ item.type | dataFilter(supportType) }}</van-tag>
                        </div>
                        <div>{{ item.createTime }}</div>
                    </div>
                    <div class="my-content">
                        {{ item.content }}
                    </div>
                    <div class="my-pic" v-if="item.screenshotUrl">
                        <van-image :src="imgSrc + sitem + '?accessToken=' + imgToken" v-for="(sitem, sindex) in item.screenshotUrl.split(',')" :key="sindex" @click.stop="handlePreview(item.screenshotUrl.split(','),sindex)">
                        </van-image>
                    </div>
                    <div class="my-reply">
                        <div>管理员回复：</div>
                        <p>{{ item.reply?item.reply:'感谢您的反馈。' }}</p>
                    </div>
                </div>
            </div>
            <van-empty :image="emptyImg" v-if="isShow" />
        </div>
        <div class="footer">
            <div class="support" @click="backToApp('/pages/support/index')">
                <van-icon name="edit" color="#21305d" size="0.64rem" />
                <span>意见反馈</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getQuestionList, getFeedbackList } from "@/api/feedback";
import { SUPPORT_MODULE, SUPPORT_TYPE } from "@/api/constant";
import { ImagePreview } from "vant";

export default {
    data() {
        return {
            question: "",
            questionList: [],
            feedbackList: [],
            supportModule: SUPPORT_MODULE,
            supportType: SUPPORT_TYPE,
            imgSrc: process.env.VUE_APP_STATIC_API,
            emptyImg: require("@/assets/empty.png"),
            isShow: false,
            imgToken: ""
        };
    },
    mounted() {
        document.addEventListener("UniAppJSBridgeReady", function (res) {});
    },
    created() {
        this.getQuestionList();
        this.getFeedbackList();
        this.imgToken = localStorage.getItem('accessToken')
    },
    methods: {
        //获取热门问题列表
        async getQuestionList() {
            const { data } = await getQuestionList({
                pageNum: 1,
                pageSize: 5,
            });
            this.questionList = data.records || [];
        },
        //获取我的反馈列表
        async getFeedbackList() {
            const { data } = await getFeedbackList({
                pageNum: 1,
                pageSize: 5,
                userId: localStorage.getItem("userEmail"),
            });
            let arr = data.records || [];
            this.feedbackList = arr.map((item) => {
                if (item.module) {
                    item.module = item.module.splice(0, 5);
                }
                return item;
            });
            if ( this.feedbackList.length == 0 ) {
                this.isShow = true;
            }
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
        //返回APP页面
        backToApp(url) {
            uni.navigateTo({
                url,
            });
        },
        search(question) {
            if (question.trim() == '') {
                return
            } else {
                this.jumpToPage('question', { question })
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.feedback {
    width: 100%;
    min-height: 100vh;
    position: relative;
    padding: 20px 25px 0 25px;
    padding-bottom: calc(140px + constant(safe-area-inset-bottom));
    padding-bottom: calc(140px + env(safe-area-inset-bottom));
    background: #f4f4f4;
    .help {
        font-size: 36px;
        margin-top: 40px;
        .icon {
            font-size: 90px;
            margin-right: 20px;
        }
        &-card {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 25px 0;
            border-radius: 30px;
            background: #fff;
        }
    }
    .guide {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;
        font-size: 28px;
        .more {
            font-weight: normal;
            font-size: 24px;
            color: #616161;
            padding: 50px 0 35px 50px;
        }
    }
    .content {
        width: 100%;
        padding: 0 25px;
        border-radius: 30px;
        background: #fff;
        font-size: 28px;
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
        .hot {
            padding: 4px 8px;
            margin-right: 15px;
            font-size: 22px;
            color: #fff;
            border-radius: 5px;
            background: #de3839;
        }
        .title {
            width: 80%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .my {
            display: flex;
            flex-direction: column;
            width: 100%;
            border-bottom: 1px solid #eaeaea;
            &-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                font-size: 24px;
                margin-top: 55px;
                color: #616161
            }
            &-content {
                width: 100%;
                line-height: 40px;
                margin: 35px 0 30px 0;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            &-pic {
                display: flex;
                align-items: center;
                margin-bottom: 50px;
                .van-image {
                    width: 170px;
                    height: 170px;
                    margin-right: 25px;
                }
            }
            &-reply {
                padding: 30px;
                margin-bottom: 50px;
                background: #f2f2f2;
                p {
                    line-height: 36px;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin-top: 24px;
                }
            }
        }
        .my:last-child {
            border-bottom: none;
        }
    }
    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: calc(120px + constant(safe-area-inset-bottom));
        height: calc(120px + env(safe-area-inset-bottom));
        padding: 15px 25px;
        background: #fff;
        box-shadow: 0 -1Px 8px 0 rgba(0, 0, 0, 0.10);
        .support {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 90px;
            border: 3px solid #21305d;
            border-radius: 30px;
            font-size: 36px;
            background: #fff;
            .van-icon {
                margin-right: 10px;
            }
        }
    }
}
::v-deep .van-search {
    padding: 0;
    background-color: transparent;
}
::v-deep .van-search__content {
    background-color: #fff;
}
::v-deep .van-tag--medium {
    padding: 4px 10px;
    border-radius: 8px;
}
::v-deep .van-empty__image {
    width: 500px;
    height: auto;
}
</style>
