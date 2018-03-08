module.exports = {
	genericPipelines: {
		aSkeletonForBuildingAndThenCopying: require('./gulp-pipeline-creators/_generic-pipeline-a-skeleton-for-building-and-then-copying'),
		copyFiles: require('./gulp-pipeline-creators/_generic-pipeline-to-copy-files'),
	},
	specificPipelines: {
		css: {
			stylusCompilation: require('./gulp-pipeline-creators/css-pipeline-stylus-compilation'),
		},
		js: {
			concat: require('./gulp-pipeline-creators/js-pipeline-simply-concat'),
		},
	},
	utils: {
		printCompletionOfOneTask: require('./utils/print-one-task-done'),
	},
};