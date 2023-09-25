<template>
    <div class="guide">
        <span>当前位置：</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{name: 'questionnaire-pc'}">问卷</el-breadcrumb-item>
            <el-breadcrumb-item>{{type=='detail'?'答题':'详情'}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
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
    .guide {
        display: flex;
        margin-bottom: 20Px;
    }
    ::v-deep .el-breadcrumb__inner.is-link {
        font-weight: normal;
    }
</style>