module.exports = buildACSSStylusBuildingPipelineForOneAppOrOnePage;

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
const createTaskBodyForCompilingStylus = require('../gulp-task-creators/css-compile-stylus');

function buildACSSStylusBuildingPipelineForOneAppOrOnePage({
	// logging
	taskNameKeyPart,
	basePathForShorteningPathsInLog,         // optional

	// sources
	sourceBasePath,
	buildingEntryGlobsRelativeToSourceBasePath,
	watchingBasePath,
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
	if (! watchingGlobsRelativeToWatchingBasePath) {
		watchingGlobsRelativeToWatchingBasePath = [ '**/*.styl' ];
	}

	const builtGlobsRelativeToOutputBasePathOfBuilding = [
		`${builtSingleFileBaseName}.css`,
		`${builtSingleFileBaseName}.min.css`,
	];

	function toCreateStylusCompilationTaskBody({
		taskNameForLogs,
		entryGlobsForBuilding,
		outputBasePathOfBuilding,
		basePathForShorteningPathsInLog,
	}) {
		return createTaskBodyForCompilingStylus(
			entryGlobsForBuilding,
			{
				taskNameForLogs,
				compiledCSSOutputFolder: outputBasePathOfBuilding,
				compiledCSSFileBaseName: builtSingleFileBaseName,
				basePathForShorteningPathsInLog,
				shouldNotGenerateMinifiedVersions,
			}
		);
	}

	return buildAPipelineForBuildingOneAppOrOnePage({
		// logging
		pipelineCategory: 'CSS Stylus pipeline',
		taskNameKeyPart,
		basePathForShorteningPathsInLog,

		// sources
		sourceBasePath,
		buildingEntryGlobsRelativeToSourceBasePath,
		watchingBasePath,
		watchingGlobsRelativeToWatchingBasePath,

		// building
		outputBasePathOfBuilding,
		builtGlobsRelativeToOutputBasePathOfBuilding,
		toCreateBuildingTaskBody: toCreateStylusCompilationTaskBody,

		// copying
		shouldCopyBuiltFileToElsewhere,
		outputBasePathOfCopying,
		optionsOfCopyingFiles,
	});
}