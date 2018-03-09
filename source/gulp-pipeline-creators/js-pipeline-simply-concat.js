const pathTool = require('path');
const { join: joinPath } = pathTool;

module.exports = buildAJavascriptBuildingPipelineForOneAppOrOnePage;

/*
*
*
*
*
*
*
* ****************************************
*           任务集工厂函数；工具
* ****************************************
*/

const buildAPipelineForBuildingOneAppOrOnePage = require('./_generic-pipeline-a-skeleton-for-building-and-then-copying');
const createTaskBodyForConcatenatingJavascriptFiles = require('../gulp-task-creators/js-simply-concat');

function buildAJavascriptBuildingPipelineForOneAppOrOnePage({
	// logging
	taskNameKeyPart,
	basePathForShorteningPathsInLog, // optional

	// sources
	sourceBasePath,
	buildingEntryGlobsRelativeToBasePath, // optional
	watchingGlobs, // optional
	watchingBasePath, // optional

	// building
	builtOutputBasePath,
	builtSingleFileBaseName,
	shouldNotGenerateMinifiedVersions = false,

	// copying
	shouldCopyBuiltFileToElsewhere = false,
	copyingFilesOutputBasePath, // optional
	copyingFilesTaskOption, // optional
}) {
	if (! buildingEntryGlobsRelativeToBasePath) {
		buildingEntryGlobsRelativeToBasePath = joinPath(sourceBasePath, '**/*.js');

		if (watchingGlobs || watchingBasePath) {
			throw Error('Why do we have settings for watching globs but NOT settings for source globs?');
		}
	}

	if (! watchingBasePath) {
		watchingBasePath = sourceBasePath;
	}

	if (! watchingGlobs) {
		watchingGlobs = buildingEntryGlobsRelativeToBasePath;
	}

	const resovledWatchingGlobs = watchingGlobs.map(
		glob => pathTool.relative(
			watchingBasePath,
			pathTool.resolve(watchingBasePath, glob)
		)
	);

	const builtGlobsRelativeToBuiltOutputBasePath = [
		`${builtSingleFileBaseName}.js`,
		`${builtSingleFileBaseName}.min.js`,
	];

	function toSimplyConcatJavascriptFiles({
		taskNameKeyPart,
		entryGlobsForBuilding,
		builtOutputBasePath,
		basePathForShorteningPathsInLog,
	}) {
		return createTaskBodyForConcatenatingJavascriptFiles(
			entryGlobsForBuilding,
			{
				taskNameForLogs: taskNameKeyPart,
				compiledJavascriptOutputFolder: builtOutputBasePath,
				compiledJavascriptFileBaseName: builtSingleFileBaseName,
				basePathForShorteningPathsInLog,
				shouldNotGenerateMinifiedVersions,
			}
		);
	}

	return buildAPipelineForBuildingOneAppOrOnePage({
		// logging
		pipelineCategory: 'Javascript',
		taskNameKeyPart,
		basePathForShorteningPathsInLog,

		// source
		sourceBasePath,
		buildingEntryGlobsRelativeToBasePath,
		watchingGlobs: resovledWatchingGlobs,
		watchingBasePath,

		// building
		builtOutputBasePath,
		builtGlobsRelativeToBuiltOutputBasePath,
		toCreateBuildingTaskBody: toSimplyConcatJavascriptFiles,

		// copying
		shouldCopyBuiltFileToElsewhere,
		copyingFilesOutputBasePath,
		copyingFilesTaskOption,
	});
}
