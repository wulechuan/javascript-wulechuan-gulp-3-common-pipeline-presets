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
	basePathForShorteningPathsInLog,

	// sources
	sourceBasePath,
	buildingEntryGlobsRelativeToSoureRootFolder,
	watchingGlobs, // optional

	// building
	builtOutputBasePath,
	builtOutputRootFolderName,
	builtSingleFileBaseName,


	// copying
	shouldCopyBuiltFileToElsewhere = true,
	copyingFilesOutputBasePath,
	copyingFilesTaskOption = null,
}) {
	if (! watchingGlobs) {
		watchingGlobs = joinPath(sourceBasePath, '**/*.styl');
	}

	const builtGlobsRelativeToBuildingOutputRootFolder = [
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
		buildingEntryGlobsRelativeToSoureRootFolder,
		watchingGlobs,

		// building
		builtOutputBasePath,
		builtOutputRootFolderName,
		builtGlobsRelativeToBuildingOutputRootFolder,
		toCreateBuildingTaskBody: toCreateStylusCompilationTaskBody,

		// copying
		shouldCopyBuiltFileToElsewhere,
		copyingFilesOutputBasePath,
		copyingFilesTaskOption,
	});
}
