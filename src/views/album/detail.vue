<template>
    <div class="album-detail">
        <nav-bar url="/album"></nav-bar>
        <div class="p-25">
            <van-field
                v-model="albumName"
                placeholder="请填写相册名称"
                :formatter="formatter"
                maxlength="20"
                clearable
                @blur="changeAlbumName"
                class="title"
            />
            <div class="time">{{baseInfo.updateTime | timeFilter}}</div>
        </div>
        <div class="upload">
            <file-upload ref="fileUpload" :id="baseInfo.id" :deletable="false" :showChecked="showChecked" @closeSheet="closeSheet" @getBtnStatus="getBtnStatus"></file-upload>
        </div>
        <div class="footer">
            <van-row gutter="20" v-if="!showChecked">
                <van-col :span="12">
                    <div class="option">
                        <van-button icon="delete-o" plain class="btn-option" @click="deleteAlbum">删除</van-button>
                    </div>
                </van-col>
                <van-col :span="12">
                    <div class="option">
                        <van-button icon="ellipsis" plain class="btn-option" :disabled="manageAble" @click="manageAlbum(true)">管理</van-button>
                    </div>
                </van-col>
            </van-row>
            <van-row gutter="20" v-if="showChecked">
                <van-col :span="8">
                    <div class="option">
                        <van-button icon="revoke" plain class="btn-option" @click="manageAlbum(false)">取消</van-button>
                    </div>
                </van-col>
                <van-col :span="8">
                    <div class="option">
                        <van-button icon="delete-o" plain class="btn-option" :disabled="deleteAble" @click="batchDelete">删除</van-button>
                    </div>
                </van-col>
                <van-col :span="8">
                    <div class="option">
                        <van-button icon="peer-pay" plain class="btn-option" :disabled="deleteAble" @click="movePhotoToAlbum">移动</van-button>
                    </div>
                </van-col>
            </van-row>
        </div>
        <!-- 移动相册弹框 -->
        <van-action-sheet v-model="showAlbumList" title="选择相册">
            <div class="content">
                <album-list :jumpFlag="false" @getAlbumId="getAlbumId"></album-list>
            </div>
        </van-action-sheet>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar"
import FileUpload from "@/components/FileUpload"
import AlbumList from "./components/AlbumList"
import { deleteAlbum, updateAlbum } from "@/api/album";

export default {
    components: {
        NavBar,
        FileUpload,
        AlbumList
    },
    data() {
        return {
            baseInfo: {},
            albumName: "",
            showChecked: false,//底部按钮切换状态
            manageAble: true,//管理状态
            deleteAble: true,//删除状态
            showAlbumList: false,
        }
    },
    created() {
        if (this.$route.params.info) {
            this.baseInfo = JSON.parse(decodeURIComponent(this.$route.params.info))
            this.albumName = this.baseInfo.name
        }
    },
    methods: {
        //批量管理
        manageAlbum(check) {
            this.showChecked = check
        },
        //修改相册标题
        async changeAlbumName() {
            if (this.albumName.trim() == '') {
                this.$toast('请填写相册名称')
                this.albumName = this.baseInfo.name
            } else if (this.albumName === this.baseInfo.name) {
                return
            } else {
                const {data} = await updateAlbum(this.baseInfo.id,this.albumName)
                if (data) {
                    this.$toast('修改相册名称成功');
                    this.$set(this.baseInfo,'name',this.albumName)
                } else {
                    this.$toast('相册名称有误，请重新修改')
                    this.albumName = this.baseInfo.name
                }
            }
        },
        //删除相册
        async deleteAlbum() {
            if (!this.manageAble) {
                this.$toast("相册不为空，无法删除")
            } else {
                this.$dialog.confirm({
                    title: '删除相册',
                    message: '您确认删除？删除后不可恢复',
                })
                .then(async () => {
                    const res = await deleteAlbum(this.baseInfo.id);
                    if (res.code == 200) {
                        this.$toast("删除成功")
                        this.jumpToPage('album')
                    } else {
                        this.$toast(res.msg)
                    }
                })
                .catch(()=>{

                })
            }
        },
        //批量删除图片
        batchDelete() {
            this.$refs.fileUpload.handleDelete()
        },
        //移动图片
        movePhotoToAlbum() {
            this.showAlbumList = true
        },
        //获取相册ID并移动到该相册
        getAlbumId(id) {
            this.$refs.fileUpload.updatePhotoCatalog(id)
        },
        closeSheet(showAlbumList,showChecked) {
            this.showAlbumList = showAlbumList
            this.showChecked = showChecked
        },
        //获取管理状态
        getBtnStatus(manageAble,deleteAble) {
            this.manageAble = manageAble
            this.deleteAble = deleteAble
        },
        //格式化
        formatter(value) {
            return value.replace(/[/\\]*/g, '');
        },
    }
}
</script>

<style lang="scss" scoped>
    .album-detail {
        width: 100%;
        min-height: 100vh;
        padding: 92px 0;
        font-size: 24px;
        .title {
            font-size: 30px;
            font-weight: bold;
            line-height: 1.2;
            margin: 15px 0
        }
        .time {
            color: #ccc;
            margin-bottom: 20px
        }
        .upload {
            padding-bottom: calc(120px + constant(safe-area-inset-bottom));
            padding-bottom: calc(120px + env(safe-area-inset-bottom));
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
            .option {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                width: 100%;
                height: 90px;
                font-size: 36px;
                background: #fff;
                .van-icon {
                    margin-right: 10px;
                }
            }
        }
    }
    .content {
        padding: 20px 25px;
    }
    .btn-option {
        font-size: 32px;
        border:none!important
    }
    ::v-deep .van-cell {
        padding: 0;
    }
    ::v-deep .van-cell::after {
        border-bottom: none;
    }
</style>