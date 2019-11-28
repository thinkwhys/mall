/* 设置别名 */
module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				assets: "@/assets",  /* 内部已经配置@默认为 src 路径 */
				common: "@/common",
				components: "@/components",
				network: "@/network",
				views: "@/views"
			}
		}
	}
};
