<template>
    <!-- 相册列表组件 -->
    <div class="list">
        <van-row type="flex" justify="space-between">
            <van-col :span="12" v-for="item in listData" :key="item.id" @click="handleClick(item)" class="box">
                <div class="coverImg flex">
                    <van-image fit="cover" :src="item.frontPicUrl" v-if="item.frontPicUrl">
                    </van-image>
                    <van-icon name="photo-o" size="1rem" color="rgb(153, 153, 153)" v-else />
                </div>
                <div class="list-title">{{item.name}}</div>
                <div class="list-picNum"><span class="mr-6">{{item.picNum?item.picNum:0}}</span>张</div>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import { getAlbumList } from "@/api/album";

export default {
    props: {
        jumpFlag: {
            default: true,//点击图片时true跳转,false不跳转
        },
    },
    data() {
        return {
            isShowEmpty: false,
            listData: [],
        }
    },
    created() {
        this.getAlbumList()
    },
    methods: {
        //获取相册列表
        async getAlbumList() {
            const { data } = await getAlbumList()
            this.listData = data || []
            this.isShowEmpty = this.listData.length == 0?true:false;
        },
        handleClick(item) {
            if (this.jumpFlag) {
                this.jumpToPage('album-detail',{info:encodeURIComponent(JSON.stringify(item))})
            } else {
                //选择相册，获取相册id
                this.$dialog.confirm({
                    title: '提示',
                    message: `确认将图片移动到${item.name}？`,
                })
                .then(async () => {
                    this.$emit('getAlbumId',item.id)
                })
                .catch(()=>{

                })
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .list {
        width: 100%;
        font-size: 28px;
        &-title {
            margin-bottom: 10px;
            font-weight: bold;
            line-height: 36px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        &-picNum {
            font-size: 24px;
            color: rgb(153, 153, 153)
        }
        .coverImg {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            margin-bottom: 20px;
            border-radius: 10px;
            background: #f4f4f4;
            .van-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%)
            }
        }
        .box {
            display:flex;
            flex-direction: column;
            margin-bottom: 25px;
        }
        .box:nth-child(2n) {
            padding-left: 7.5Px;
        }
        .box:nth-child(2n+1) {
            padding-right: 7.5Px;
        }
    }
    ::v-deep .van-image {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    ::v-deep .van-image__img {
        border-radius: 10px;
    }
</style>