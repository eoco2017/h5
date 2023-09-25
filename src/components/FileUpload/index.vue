<template>
    <div>
        <div class="checkAll">
            <span @click="handleCheckAll(true)" v-if="showChecked && !isCheckAll">全选</span>
            <span @click="handleCheckAll(false)" v-if="showChecked && isCheckAll">取消全选</span>
        </div>
        <van-list v-model="loading" :finished="finished" @load="loadData">
            <van-uploader
                v-model="fileList"
                use-before-read
                :before-read="beforeRead"
                :after-read="afterRead"
                :disabled="disabled"
                :deletable="deletable"
                :show-upload="!disabled"
                multiple
                image-fit="cover"
            >
                <div :class="showChecked?'hide':'btn-plus'">
                    <van-icon name="plus" size="0.8rem" color="#FFF"/>
                </div>
                <template #preview-cover=file v-if="showChecked">
                    <div class="preview-cover" @click.stop="handleClick(file)">
                        <van-checkbox v-model="file.isChecked"></van-checkbox>
                    </div>
                </template>
            </van-uploader>
        </van-list>
    </div>
</template>

<script>
import Exif from "exif-js"
import Compressor from 'compressorjs';
import { uploadPhoto,getPhotoPageList,deletePhoto,updatePhotoCatalog } from "@/api/album";

export default {
    props: {
        id: {
            default: null
        },
        disabled: {
            default: false
        },
        deletable: {
            default: true
        },
        showChecked: {
            default: false
        },
    },
    data() {
        return {
            fileList: [],
            isCheckAll: false,
            total: 0,
            pageNum: 1,
            pageSize: 10,
            loading: false,
            finished: false,
        }
    },
    watch: {
        showChecked(val) {
            //取消时去掉图片勾选状态
            if (!val) {
                this.fileList.forEach(item => {
                    delete item.isChecked
                })
                this.isCheckAll = false
            }
        },
        fileList:{
            handler(val) {
                this.isCheckAll = val.every(item=>item.isChecked)?true:false;
                //传递底部按钮状态
                let manageAble = val.length==0?true:false;
                let deleteAble = val.some(item=>item.isChecked)?false:true;
                this.$emit('getBtnStatus',manageAble,deleteAble)
            },
            deep:true
        }
    },
    created() {
        
    },
    methods: {
        //图片压缩
        imageCompressor(file) {
            return new Promise((resolve,reject) => {
                // compressorjs 默认开启 checkOrientation 选项
                // 会将图片修正为正确方向
                new Compressor(file, {
                    quality: (file.size <= 1024*1024)?1: 0.6,
                    success(result){
                        //返回file格式
                        console.log('压缩')
                        let fileType = new File([result], file.name, { type: file.type })
                        resolve(fileType)
                    },
                    error(err) {
                        console.log(err.message);
                        reject(err)
                    },
                });
            })
        },
        //上传前处理
        beforeRead(file) {
            if (!Array.isArray(file)) {
                file = [file]
            }
            let hasError = false
            if (file.length>10) {
                this.$toast('最多选择10张图片')
                hasError = true
            }
            //图片大小限制50M
            let sizeTotal = file.map((item) => item.size?(Number(item.size/1024/1024).toFixed(2)):0).reduce((cur, next) => {
                return Number(cur) + Number(next)
            },0)
            if (sizeTotal>50) {
                this.$toast('上传图片大小不能超过 50M')
                hasError = true
            }
            if (hasError) {
                return false
            } else {
                return true
            }
        },
        //上传图片
        async afterRead(file) {
            if (!Array.isArray(file)) {
                file = [file]
            }
            const promises = file.map(async (val) => {
                if (val.file.size <= 1024*1024) {
                    //小于1MB时不压缩直接上传
                    return val.file
                } else {
                    const res = await this.imageCompressor(val.file)
                    return res
                }
            })
            this.fileList.splice(this.fileList.length-file.length,file.length)
            let uploadSuccessNumber = 0
            setTimeout(()=>{//超过1秒未全部上传完毕，提示
                if(uploadSuccessNumber < file.length ){
                    this.$toast({
                        duration: 0,
                        message:('正在上传，请稍后')
                    })
                }
            },1000)
            for (let item of promises) {
                item.then(async (data) => {
                    let formData = new FormData()
                    formData.append("customCatalogId", this.id)
                    formData.append("files", data)
                    const res = await uploadPhoto(formData)
                    if (res.code == 200) {
                        if (res.data.length > 0) {
                            for (let item of res.data) {
                                this.fileList.unshift(item)
                            }
                        }
                        uploadSuccessNumber++;
                        if (uploadSuccessNumber == promises.length ) {
                            this.$toast.clear()
                        }
                    } else {
                        this.$toast(res.msg);
                    }
                })
            }
            
        },
        //获取图片列表
        async loadData() {
            const {data} = await getPhotoPageList({
                customCatalogId: this.id,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            })
            this.loading = false;
            this.finished = false;
            this.total = data.total;
            this.fileList = this.fileList.concat(data.records || []);
            if (
                this.fileList.length == 0 ||
                this.fileList.length == this.total
            ) {
                this.finished = true;
                return;
            }
            this.pageNum++;
        },
        //删除图片
        handleDelete() {
            this.$dialog.confirm({
                title: '删除照片',
                message: '您确认删除？删除后不可恢复',
            })
            .then(async () => {
                let idList = this.fileList.filter(item=>item.isChecked).map(item=>item.id)
                const {data} = await deletePhoto(idList.join(','))
                if (data) {
                    this.$toast('删除成功')
                    this.reload()
                } else {
                    this.$toast('删除失败')
                }
            })
            .catch(()=>{

            })
        },
        //勾选图片
        handleClick(file){
            this.$set(this.fileList[file.index],'isChecked',!file.isChecked)
        },
        //移动图片到相册
        async updatePhotoCatalog(id) {
            let idList = this.fileList.filter(item=>item.isChecked).map(item=>item.id)
            const {data} = await updatePhotoCatalog(id,idList.join(','))
            if (data) {
                this.$toast('移动成功')
                this.reload()
            } else {
                this.$toast('移动失败')
            } 
        },
        //全选/取消全选
        handleCheckAll(data) {
            this.fileList.forEach((file)=>{
                this.$set(file,'isChecked',data)
            })
        },
        //重新加载列表
        reload() {
            this.fileList = []
            this.pageNum = 1
            this.loading = true
            this.finished = false
            this.loadData()
            this.$emit('closeSheet',false,false)
        }
    }
}
</script>

<style lang="scss" scoped>
    .btn-plus {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        box-shadow: 0 1Px 8px 0 rgba(0, 0, 0, 0.10);
        background: rgb(64, 124, 213)
    }
    .checkAll {
        display: block;
        width: 100%;
        height: 70px;
        line-height: 70px;
        text-align: right;
        font-size: 28px;
        font-weight: bold;
        color: rgb(64, 124, 213);
        span {
            display: inline-block;
            padding: 0 25px;
        }
    }
    ::v-deep .van-uploader__input-wrapper {
        position: fixed;
        bottom: calc(150px + constant(safe-area-inset-bottom));
        bottom: calc(150px + env(safe-area-inset-bottom));
        right: 30px;
    }
    ::v-deep .van-uploader__preview-image, ::v-deep .van-uploader__upload {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0
    }
    ::v-deep .van-uploader__preview {
        margin-left: 10px;
        margin-right: 10px;
        width: calc(33.33% - 20px);
        height: 0;
        padding-bottom: calc(33.33% - 20px);
        position: relative
    }
    ::v-deep .van-uploader {
        width: 100%;
        padding: 0 15px
    }
    ::v-deep .preview-cover {
        width: 100%;
        height: 100%;
        .van-checkbox {
            margin: 10px
        }
    }
    .hide .van-uploader__upload,.hide .van-icon {
        display: none
    }
    ::v-deep .van-checkbox__icon .van-icon {
        border: 3px solid #FFF
    }
</style>