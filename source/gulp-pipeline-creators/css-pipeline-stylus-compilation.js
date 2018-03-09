const pathTool = require('path');
const { join: joinPath } = pathTool;

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
	basePathForShorteningPathsInLog, // optional

	// sources
	sourceBasePath,
	buildingEntryGlobsRelativeToBasePath,
	watchingGlobs, // optional
	watchingBasePath,

	// building
	builtOutputBasePath,
	builtSingleFileBaseName,

	// copying
	shouldCopyBuiltFileToElsewhere = false,
	copyingFilesOutputBasePath, // optional
	copyingFilesTaskOption, // optional
}) {
	if (! watchingGlobs) {
		watchingGlobs = joinPath(sourceBasePath, '**/*.styl');
	}

	const builtGlobsRelativeToBuiltOutputBasePath = [
		`${builtSingleFileBaseName}.css`,
		`${builtSingleFileBaseName}.min.css`,
	];

	function toCreateStylusCompilationTaskBody({
		// taskNameKeyPart,
		entryGlobsForBuilding,
		builtOutputBasePath,
		basePathForShorteningPathsInLog,
	}) {
		return createTaskBodyForCompilingStylus(
			entryGlobsForBuilding,
			{
				compiledCSSOutputFolder: builtOutputBasePath,
				compiledCSSFileBaseName: builtSingleFileBaseName,
				basePathForShorteningPathsInLog,
				// shouldNotGenerateMinifiedVersions: false,
			}
		);
	}

	return buildAPipelineForBuildingOneAppOrOnePage({
		// logging
		pipelineCategory: 'CSS: Compiling Stylus',
		taskNameKeyPart,
		basePathForShorteningPathsInLog,

		// sources
		sourceBasePath,
		buildingEntryGlobsRelativeToBasePath,
		watchingBasePath,
		watchingGlobs,

		// building
		builtOutputBasePath,
		builtGlobsRelativeToBuiltOutputBasePath,
		toCreateBuildingTaskBody: toCreateStylusCompilationTaskBody,

		// copying
		shouldCopyBuiltFileToElsewhere,
		copyingFilesOutputBasePath,
		copyingFilesTaskOption,
	});
}
