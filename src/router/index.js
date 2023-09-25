import Vue from "vue";
import Router from "vue-router";

const routerPush = Router.prototype.push;
Router.prototype.push = function (location) {
    return routerPush.call(this, location).catch(err => {})
};

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/",
			component: () => import("@/views/layout/index")
		},
		{
			path: "/feedback",
			name: "feedback",
			component: () => import("@/views/feedback/index"),
			meta: {
				title: "问题与反馈"
			},
		},
		{
			path: "/question",
			name: "question",
			component: () => import("@/views/feedback/question/index"),
			meta: {
				title: "热门问题"
			},
		},
		{
			path: "/question/detail",
			name: "question-detail",
			component: () => import("@/views/feedback/question/detail"),
			meta: {
				title: "热门问题-详情"
			},
		},
		{
			path: "/my",
			name: "my",
			component: () => import("@/views/feedback/my/index"),
			meta: {
				title: "我的反馈"
			},
		},
		{
			path: "/my/detail",
			name: "my-detail",
			component: () => import("@/views/feedback/my/detail"),
			meta: {
				title: "我的反馈-详情"
			},
		},
		{
			path: "/album",
			name: "album",
			component: () => import("@/views/album/index"),
			meta: {
				title: "相册"
			},
		},
		{
			path: "/album/detail",
			name: "album-detail",
			component: () => import("@/views/album/detail"),
			meta: {
				title: "相册-详情"
			},
		},
		{
			path: "/album/search",
			name: "album-search",
			component: () => import("@/views/album/search"),
			meta: {
				title: "相册-搜索"
			},
		},
		{
			path: "/error",
			name: "error",
			component: () => import("@/views/error/index"),
			meta: {
				title: "错误"
			},
		},
		{
			path: "/questionnaire",
			name: "questionnaire",
			component: () => import("@/views/questionnaire/index"),
			meta: {
				title: "问卷"
			},
		},
		{
			path: "/questionnaire/detail",
			name: "questionnaire-detail",
			component: () => import("@/views/questionnaire/detail"),
			meta: {
				title: "问卷-答题"
			},
		},
		{
			path: "/questionnaire/result",
			name: "questionnaire-result",
			component: () => import("@/views/questionnaire/result"),
			meta: {
				title: "问卷-结果"
			},
		},
		{
			path: "/questionnaire/pc",
			name: "questionnaire-pc",
			component: () => import("@/views/questionnaire/pc/index"),
			meta: {
				title: "问卷"
			},
		},
		{
			path: "/questionnaire/pc/detail",
			name: "questionnaire-pc-detail",
			component: () => import("@/views/questionnaire/pc/detail"),
			meta: {
				title: "问卷-答题"
			},
		},
		{
			path: "/questionnaire/pc/result",
			name: "questionnaire-pc-result",
			component: () => import("@/views/questionnaire/pc/result"),
			meta: {
				title: "问卷-结果"
			},
		},
	],
	scrollBehavior: (to, from, savedPosition) => {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	},
});
