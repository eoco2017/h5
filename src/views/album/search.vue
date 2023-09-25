<template>
    <div class="search">
        <nav-bar url="/album"></nav-bar>
        <div class="fixed">
            <form action="/">
                <van-search v-model="searchName" placeholder="请输入搜索内容" show-action @search="search" @cancel="onCancel" @input="onInput" shape="round" :clearabled="true" />
            </form>
        </div>
        <van-list v-model="loading" :finished="finished" @load="loadData">
            <van-row type="flex">
                <van-col :span="8" v-for="(item, index) in photoList" :key="item.id" @click="handlePreview(photoList,index)" class="box">
                    <div class="coverImg">
                        <van-image fit="cover" :src="item.url" v-if="item.url"></van-image>
                    </div>
                </van-col>
            </van-row>
        </van-list>
        <van-empty :image="emptyImg" v-if="isShow" />
        <image-preview v-model="showPreview" :images="images" :start-position="startPosition" closeable>
            <template v-slot:cover>
                <div class="footer">
                    <div class="flex">
                        <div class="option">
                            <van-button icon="delete-o" plain @click="handleDelete">删除</van-button>
                        </div>
                        <div class="option">
                            <van-button icon="peer-pay" plain @click="movePhotoToAlbum">移动</van-button>
                        </div>
                    </div>
                </div>
            </template>
        </image-preview>
        <!-- 移动相册弹框 -->
        <van-action-sheet v-model="showAlbumList" title="选择相册">
            <div class="content">
                <album-list :jumpFlag="false" @getAlbumId="getAlbumId"></album-list>
            </div>
        </van-action-sheet>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import AlbumList from "./components/AlbumList";
import { ImagePreview } from "vant";
import { getPhotoPageList, deletePhoto, updatePhotoCatalog } from "@/api/album";

export default {
    components: {
        NavBar,
        AlbumList,
        ImagePreview: ImagePreview.Component
    },
    data() {
        return {
            searchName: "",
            photoList: [],
            isShow: false,
            total: 0,
            pageNum: 1,
            pageSize: 10,
            loading: false,
            finished: true,
            emptyImg: require("@/assets/empty.png"),
            showAlbumList: false,
            showPreview:false,
            images:[],
            startPosition:0,
        }
    },
    created() {
        
    },
    methods: {
        // 搜索
        async search(searchName) {
            this.photoList = []
            this.pageNum = 1
            if (searchName.trim() == '') {
                this.isShow = false
            } else {
                this.loadData()
            }
        },
        //获取列表数据
        async loadData() {
            const { data } = await getPhotoPageList({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                name: this.searchName
            });
            this.loading = false;
            this.finished = false;
            this.total = data.total;
            if (this.photoList == null) {
                this.photoList = [];
            }
            this.photoList = this.photoList.concat(data.records || []);
            this.isShow = this.photoList.length == 0?true:false;
            if (
                this.photoList.length == 0 ||
                this.photoList.length == this.total
            ) {
                this.finished = true;
                return;
            }
            this.pageNum++;
        },
        //图片预览
        handlePreview(imgList, startPosition) {
            this.showPreview = true
            this.images = imgList.map((item) => {
                return item.url;
            });
            this.startPosition = startPosition
            // ImagePreview({
            //     images,
            //     startPosition,
            //     closeable: true,
            // });
        },
        onCancel() {
            this.$router.go(-1)
        },
        onInput(val) {
            this.searchName = val.replace(/[/\\]*/g, '')
        },
        //删除图片
        handleDelete() {
            this.$dialog.confirm({
                title: '删除照片',
                message: '您确认删除？删除后不可恢复',
            })
            .then(async () => {
                const {data} = await deletePhoto(this.photoList[this.startPosition].id)
                if (data) {
                    this.$toast('删除成功')
                    this.showPreview = false
                    this.reload()
                } else {
                    this.$toast('删除失败')
                }
            })
            .catch(()=>{
            })
        },
        //移动图片
        movePhotoToAlbum() {
            this.showAlbumList = true
        },
        //获取相册ID并移动到该相册
        async getAlbumId(id) {
            const {data} = await updatePhotoCatalog(id,this.photoList[this.startPosition].id)
            if (data) {
                this.$toast('移动成功')
                this.showAlbumList = false
                this.showPreview = false
                this.reload()
            } else {
                this.$toast('移动失败')
            } 
        },
        //重新加载列表
        reload() {
            this.photoList = []
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.loadData()
        }
    }
}
</script>

<style lang="scss" scoped>
    .search {
        width: 100%;
        min-height: 100vh;
        padding: 200px 15px 92px 15px;
        font-size: 28px;
        .fixed {
            position: fixed;
            top: 92px;
            left: 0;
            width: 100%;
            z-index: 1;
            padding: 0 25px;
            background: #FFF
        }
        .box {
            padding:0 10px;
            margin-bottom: 25px
        }
        .coverImg {
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            position: relative;
            .van-image {
                width: 100%;
                height: 100%;
                position:absolute;
                top:0;
                left:0;
                overflow: hidden
            }
        }
    }
    ::v-deep .van-search {
        padding-left: 0;
        padding-right: 0;
    }
    ::v-deep .van-empty__image {
        width: 500px;
        height: auto;
    }
    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: calc(120px + constant(safe-area-inset-bottom));
        height: calc(120px + env(safe-area-inset-bottom));
        padding: 15px 25px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
        .option {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            width: 200px;
            height: 90px;
            font-size: 36px;
            font-weight: bold;
            .van-icon {
                color: #FFF;
                margin-right: 10px;
                text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6);
            }
            .van-button {
                color: #FFF;
                border: none;
                background: transparent;
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
            }
        }
    }
    .content {
        padding: 20px 25px;
    }
</style>