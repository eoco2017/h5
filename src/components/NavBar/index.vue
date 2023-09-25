<template>
    <div>
        <van-nav-bar fixed :border="false">
            <template #left>
                <van-button round icon="down" size="small" :to="url">返回</van-button>
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
export default {
    props: {
        url:''
    },
    data() {
        return {
            
        }
    },
    created() {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
    ::v-deep .van-icon-down {
        transform: rotate(90deg);
    }
    ::v-deep .van-nav-bar__left {
        padding: 0 25px;
    }
</style>