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
	basePathForShorteningPathsInLog,         // optional

	// sources
	sourceBasePath,
	buildingEntryGlobsRelativeToBasePath,    // optional
	watchingBasePath,                        // optional
	watchingGlobsRelativeToWatchingBasePath, // optional

	// building
	outputBasePathOfBuilding,
	builtSingleFileBaseName,
	shouldNotGenerateMinifiedVersions = false,

	// copying
	shouldCopyBuiltFileToElsewhere = false,
	outputBasePathOfCopying,                 // optional
	optionsOfCopyingFiles,                   // optional
}) {
	if (! buildingEntryGlobsRelativeToBasePath) {
		buildingEntryGlobsRelativeToBasePath = [ '**/*.js' ];

		if (watchingBasePath || watchingGlobsRelativeToWatchingBasePath) {
			throw Error('Why do we have settings for watching globs but NOT those for source globs?');
		}
	}

	if (! watchingBasePath) {
		watchingBasePath = sourceBasePath;
	}

	if (! watchingGlobsRelativeToWatchingBasePath) {
		watchingGlobsRelativeToWatchingBasePath = buildingEntryGlobsRelativeToBasePath;
	}


	const builtGlobsRelativeToOutputBasePathOfBuilding = [
		`${builtSingleFileBaseName}.js`,
		`${builtSingleFileBaseName}.min.js`,
	];

	function toSimplyConcatJavascriptFiles({
		taskNameKeyPart,
		entryGlobsForBuilding,
		outputBasePathOfBuilding,
		basePathForShorteningPathsInLog,
	}) {
		return createTaskBodyForConcatenatingJavascriptFiles(
			entryGlobsForBuilding,
			{
				taskNameForLogs: taskNameKeyPart,
				compiledJavascriptOutputFolder: outputBasePathOfBuilding,
				compiledJavascriptFileBaseName: builtSingleFileBaseName,
				basePathForShorteningPathsInLog,
				shouldNotGenerateMinifiedVersions,
			}
		);
	}

	return buildAPipelineForBuildingOneAppOrOnePage({
		// logging
		pipelineCategory: 'Javascript: To Concatenate',
		taskNameKeyPart,
		basePathForShorteningPathsInLog,

		// source
		sourceBasePath,
		buildingEntryGlobsRelativeToBasePath,
		watchingBasePath,
		watchingGlobsRelativeToWatchingBasePath,

		// building
		outputBasePathOfBuilding,
		builtGlobsRelativeToOutputBasePathOfBuilding,
		toCreateBuildingTaskBody: toSimplyConcatJavascriptFiles,

		// copying
		shouldCopyBuiltFileToElsewhere,
		outputBasePathOfCopying,
		optionsOfCopyingFiles,
	});
}