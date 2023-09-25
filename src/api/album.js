import request from './request'

//获取相册列表
export function getAlbumList(){
    return request({
        url:'/api/content/photoAlbum/getPhotoAlbumCatalogList',
        method: 'get'
    })
}

//新建相册
export function createAlbum(name){
    return request({
        url:'/api/content/photoAlbum/createCatalog?name=' + name,
        method: 'post'
    })
}

//修改相册名称
export function updateAlbum(catalogId,newCatalog){
    return request({
        url:`/api/content/photoAlbum/updateCatalogName?catalogId=${catalogId}&newCatalog=${newCatalog}`,
        method: 'post'
    })
}

//删除相册
export function deleteAlbum(id){
    return request({
        url:`/api/content/photoAlbum/deletePhotoAlbumCatalog?id=${id}`,
        method: 'post'
    })
}

//上传相册-图片
export function uploadPhoto(data){
    return request({
        url: '/api/content/photoAlbum/uploadPhoto',
        method: 'post',
        data
    })
}

//获取图片列表
export function getPhotoPageList(data){
    return request({
        url: `/api/content/photoAlbum/getPhotoPageList?customCatalogId=${data.customCatalogId?data.customCatalogId:''}&pageNum=${data.pageNum?data.pageNum:''}&pageSize=${data.pageSize?data.pageSize:''}&name=${data.name?data.name:''}`,
        method: 'post',
    })
}

//删除图片
export function deletePhoto(photoId){
    return request({
        url: '/api/content/photoAlbum/deletePhoto?photoIds=' + photoId,
        method: 'post',
    })
}

//修改图片的目录
export function updatePhotoCatalog(customCatalogId,photoId){
    return request({
        url: `/api/content/photoAlbum/updatePhotoCatalog?customCatalogId=${customCatalogId}&photoIds=${photoId}`,
        method: 'post',
    })
}
