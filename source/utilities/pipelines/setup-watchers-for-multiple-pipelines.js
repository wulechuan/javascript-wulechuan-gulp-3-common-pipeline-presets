module.exports = {
	appendMoreScopesViaPipelines: forSettingsOfScopedLazyWatchers_appendMoreScopesViaPipelines,
};

function forSettingsOfScopedLazyWatchers_appendMoreScopesViaPipelines({
	scopedWatchingSettingsToModify,
	defaultBasePathForShorteningPathsInLog,
	shouldTakeActionOnWatcherCreation = true,
	involvedPipelines = [],
}) {
	involvedPipelines.forEach(pipeline => {
		const scopeId = pipeline.pipelineFullName;

		const newWatchingScope = {
			globsToWatch: pipeline.watchingGlobsRelativeToWatchingBasePath,
			actionToTake: pipeline.actionToTakeOnSourceFilesChange,
			shouldTakeActionOnWatcherCreation,
		};

		const { watchingBasePath } = pipeline;
		if (watchingBasePath && typeof watchingBasePath === 'string') {
			newWatchingScope.watchingBasePath = watchingBasePath;
		}

		const loggingBasePath = pipeline.basePathForShorteningPathsInLog;
		if (loggingBasePath && typeof loggingBasePath === 'string') {
			newWatchingScope.basePathForShorteningPathsInLog = loggingBasePath;
		} else if (defaultBasePathForShorteningPathsInLog && typeof defaultBasePathForShorteningPathsInLog === 'string') {
			newWatchingScope.basePathForShorteningPathsInLog = defaultBasePathForShorteningPathsInLog;
		}

		scopedWatchingSettingsToModify[scopeId] = newWatchingScope;
	});
}