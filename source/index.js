module.exports = {
	genericPipelines: {
		aSkeletonForBuildingAndThenCopying:
			require('./gulp-pipeline-creators/_generic-pipeline-a-skeleton-for-building-and-then-copying'),
		copyFiles:
			require('./gulp-pipeline-creators/_generic-pipeline-to-copy-files'),
	},
	specificPipelines: {
		css: {
			stylusCompilation:
				require('./gulp-pipeline-creators/css-pipeline-stylus-compilation'),
		},

		js: {
			concat:
				require('./gulp-pipeline-creators/js-pipeline-simply-concat'),
		},
	},
	utilities: {
		printCompletionOfOneTask:
			require('./utilities/_generic/print-one-task-done'),

		globOperations:
			require('./utilities/pipelines/modify-globs-according-to-some-pipelines'),
		aggregateTasksInPipelines:
			require('./utilities/pipelines/aggregate-tasks-in-multiple-pipelines'),
		forSettingsOfScopedLazyWatchers:
			require('./utilities/pipelines/setup-watchers-for-multiple-pipelines'),
	},
};