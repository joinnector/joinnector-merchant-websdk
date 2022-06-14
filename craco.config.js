const CracoLessPlugin = require("craco-less");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const StatoscopeWebpackPlugin = require("@statoscope/webpack-plugin").default;

const webpack_config = {};

if (process.env.NODE_ENV === "production" && process.env.ANALYSE_BUNDLE === "true") {
	webpack_config.plugins = {
		add: [
			new BundleAnalyzerPlugin({ analyzerMode: "static" }),
			new StatoscopeWebpackPlugin()
		]
	};
}

module.exports = {
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						modifyVars: { "@primary-color": "#000" },
						javascriptEnabled: true,
					},
				},
			},
		},
	],
	webpack: webpack_config
};