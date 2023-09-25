<template>
    <div>
        <van-empty :image="emptyImg" v-if="isShow" />
    </div>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            emptyImg: require("@/assets/empty.png"),
        }
    },
}
</script>

<style lang="scss" scoped>
    ::v-deep .van-empty__image {
        width: 500px;
        height: auto;
    }
</style>