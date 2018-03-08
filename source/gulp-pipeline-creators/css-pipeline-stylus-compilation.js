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

const buildAPipelineForBuildingOneAppOrOnePage = require('./_generic-pipeline-skeleton-to-build-and-then-copy');
const createTaskBodyForCompilingStylus = require('../gulp-task-creators/css-compile-stylus');

function buildACSSStylusBuildingPipelineForOneAppOrOnePage({
	// logging
	taskNameKeyPart,
	basePathForShorteningPathsInLog, // optional

	// sources
	sourceBasePath,
	buildingEntryGlobsRelativeToBasePath,
	watchingGlobs, // optional

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
		buildingOutputRootFolder,
		basePathForShorteningPathsInLog,
	}) {
		return createTaskBodyForCompilingStylus(
			entryGlobsForBuilding,
			{
				compiledCSSOutputFolder: buildingOutputRootFolder,
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
