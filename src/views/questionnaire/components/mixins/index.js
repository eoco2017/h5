// 问卷列表页面公共方法
import { formatUtcString, showInfo } from '@/utils/index';
import { getQuestionnaireList, getHistoryQuestionnaireList } from "@/api/questionnaire";

export default {
    data() {
        return {
            active: 'first',
            listData: [],
            total: 0,
            pageNum: 1,
            pageSize: 12,
            loading: false,
            finished: false,
            historyData: [],
            emptyImg: require("@/assets/empty.png"),
            isShowL: false,
            isShowR: false,
        }
    },
    created() {
        if (sessionStorage.getItem('activeName')) {
            this.active = sessionStorage.getItem('activeName')
            this.changeTab(this.active)
        } else {
            this.getQuestionnaireList()
        }
    },
    methods: {
        //切换tab
        changeTab(val) {
            sessionStorage.setItem('activeName', val)
            if (val == 'first') {
                this.getQuestionnaireList()
            } else {
                this.historyData = []
                this.pageNum = 1
                this.loading = true
                this.finished = false
                this.loadData()
            }
        },
        //获取问卷列表
        async getQuestionnaireList() {
            const { data } = await getQuestionnaireList()
            this.listData = data || [];
            this.isShowL = this.listData.length == 0?true:false;
            //只有一条数据时跳转详情页
            // if (this.listData.length == 1 && this.isFlag) {
            //     this.jumpToPageByQuery('/questionnaire/detail',{info:encodeURIComponent(JSON.stringify(this.listData[0]))})
            // }
        },
        //点击问卷，判断是否过期
        handleClick(item) {
            if (this.$route.name.includes('pc')) {
                this.jumpToPageByQuery('/questionnaire/pc/detail',{info: encodeURIComponent(JSON.stringify(item))})
            } else {
                this.jumpToPageByQuery('/questionnaire/detail',{info: encodeURIComponent(JSON.stringify(item))})
            }
            // let startTime = new Date(formatUtcString(item.startTime))
            // let endTime = new Date(formatUtcString(item.endTime))
            // let nowTime = new Date()
            // if ( startTime && startTime > nowTime) {
            //     showInfo(`该${item.type == 1?'问卷':'考试'}暂未开始`)
            // } else if ( endTime && endTime < nowTime) {
            //     showInfo(`该${item.type == 1?'问卷':'考试'}已过期`)
            // } else {
            //     if (this.$route.name.includes('pc')) {
            //         this.jumpToPageByQuery('/questionnaire/pc/detail',{info: encodeURIComponent(JSON.stringify(item))})
            //     } else {
            //         this.jumpToPageByQuery('/questionnaire/detail',{info: encodeURIComponent(JSON.stringify(item))})
            //     }
            // }
        },
        //获取历史列表数据
        async loadData() {
            const { data } = await getHistoryQuestionnaireList({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            });
            this.total = data.total;
            if (this.$route.name.includes('pc')) {
                this.historyData = data.records || [];
                this.isShowR = this.historyData.length == 0?true:false;
            } else {
                this.loading = false;
                this.finished = false;
                this.historyData = this.historyData.concat(data.records || []);
                this.isShowR = this.historyData.length == 0?true:false;
                if (this.historyData.length == 0 || this.historyData.length == this.total) {
                    this.finished = true;
                    return;
                }
                this.pageNum++;
            }
        },
    },
}
