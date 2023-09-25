<template>
    <div class="album">
        <!-- 搜索 -->
        <div class="fixed">
            <van-row gutter="10" type="flex" justify="space-between" class="flex-align">
                <van-col :span="19">
                    <van-search placeholder="请输入搜索内容" shape="round" readonly @click="jumpToPage('album-search')" />
                </van-col>
                <van-col :span="5">
                    <div class="flex" @click="addAlbum">
                        <van-icon name="add-o" size="0.6rem" class="mr-10" />
                        <span>新建</span>
                    </div>
                </van-col>
            </van-row>
        </div>
        <!-- 相册列表 -->
        <album-list></album-list>
        <!-- 新建相册 -->
        <Dialog v-model="isShow" title="新建相册" show-cancel-button close-on-click-overlay :beforeClose="submitAlbum">
            <div class="content">
                <van-field
                    v-model="albumName"
                    placeholder="请填写相册名称"
                    :formatter="formatter"
                    maxlength="20"
                    clearable
                />
            </div>
        </Dialog>
    </div>
</template>

<script>
import {  Dialog } from 'vant'
import AlbumList from "./components/AlbumList"
import { createAlbum } from "@/api/album";

export default {
    components: {
        AlbumList,
        Dialog: Dialog.Component
    },
    data() {
        return {
            isShow: false,
            albumName: "",
        }
    },
    created() {

    },
    methods: {
        //新建相册
        addAlbum() {
            this.isShow = true
            this.albumName = ""
        },
        //提交
        async submitAlbum(action, done) {
            if (action === 'confirm') {
                if (this.albumName.trim() == '') {
                    this.$toast('请填写相册名称')
                    return done(false)
                } else {
                    const {data} = await createAlbum(this.albumName)
                    if (data) {
                        done();
                        this.jumpToPage('album-detail',{info:encodeURIComponent(JSON.stringify(data))})
                    } else {
                        this.$toast('新建失败') 
                        return done(false)
                    }
                }
            } else {
                done();
            }
        },
        formatter(value) {
            return value.replace(/[/\\]*/g, '');
        },
    }
}
</script>

<style lang="scss" scoped>
    .album {
        width: 100%;
        min-height: 100vh;
        padding: 110px 25px 0 25px;
        padding-bottom: calc(constant(safe-area-inset-bottom));
        padding-bottom: calc(env(safe-area-inset-bottom));
        font-size: 28px;
        .fixed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
            padding: 0 25px;
            background: #FFF
        }
        .flex-align {
            align-items: center;
        }
        .content {
            padding: 30px;
            .btn-add {
                width: 100%;
                margin-top: 30px;
                background: rgb(64, 124, 213);
            }
        }
    }
    ::v-deep .van-search,::v-deep .van-cell {
        padding-left: 0;
        padding-right: 0;
    }
    ::v-deep .van-cell::after {
        left: 0;
        right: 0
    }
</style>