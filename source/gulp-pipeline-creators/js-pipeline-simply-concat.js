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
	basePathForShorteningPathsInLog,            // optional

	// sources
	sourceBasePath,
	buildingEntryGlobsRelativeToSourceBasePath, // optional
	watchingBasePath,                           // optional
	watchingGlobsRelativeToWatchingBasePath,    // optional

	// building
	outputBasePathOfBuilding,
	builtSingleFileBaseName,
	shouldNotGenerateMinifiedVersions = false,

	// copying
	shouldCopyBuiltFileToElsewhere = false,
	outputBasePathOfCopying,                    // optional
	optionsOfCopyingFiles,                      // optional
}) {
	if (! buildingEntryGlobsRelativeToSourceBasePath) {
		buildingEntryGlobsRelativeToSourceBasePath = [ '**/*.js' ];
	}

	const builtGlobsRelativeToOutputBasePathOfBuilding = [
		`${builtSingleFileBaseName}.js`,
		`${builtSingleFileBaseName}.min.js`,
	];

	function toSimplyConcatJavascriptFiles({
		taskNameForLogs,
		entryGlobsForBuilding,
		outputBasePathOfBuilding,
		basePathForShorteningPathsInLog,
	}) {
		return createTaskBodyForConcatenatingJavascriptFiles(
			entryGlobsForBuilding,
			{
				taskNameForLogs,
				compiledJavascriptOutputFolder: outputBasePathOfBuilding,
				compiledJavascriptFileBaseName: builtSingleFileBaseName,
				basePathForShorteningPathsInLog,
				shouldNotGenerateMinifiedVersions,
			}
		);
	}

	return buildAPipelineForBuildingOneAppOrOnePage({
		// logging
		pipelineCategory: 'JS concat. pipeline',
		taskNameKeyPart,
		basePathForShorteningPathsInLog,

		// source
		sourceBasePath,
		buildingEntryGlobsRelativeToSourceBasePath,
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