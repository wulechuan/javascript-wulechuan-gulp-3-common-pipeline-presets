const pathTool = require('path');
const { join: joinPath } = pathTool;

const sourceRootFolderName      = 'styles';
const builtOutputRootFolderName = 'css';

const basePathForShorteningPathsInLog = joinPath(global.paths.npmProjectRoot, 'source');
const sourceBasePath                  = joinPath(global.paths.npmProjectRoot, 'source', sourceRootFolderName);

const builtOutputBasePath        = global.paths.javaStaticFiles;
const copyingFilesOutputBasePath = global.paths.frontEndBuildAssets;

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
	taskNameKeyPart,
	buildingEntryGlobsRelativeToSoureRootFolder,
	builtSingleFileBaseName,
}) {
	const watchingGlobs = [
		joinPath(sourceBasePath, '**/*.styl'),
	];

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
		pipelineCategory: 'CSS: Compiling 司戴勒斯',
		taskNameKeyPart,
		basePathForShorteningPathsInLog,

		// source
		sourceBasePath,
		buildingEntryGlobsRelativeToSoureRootFolder,
		watchingGlobs,

		// building
		builtOutputBasePath,
		builtOutputRootFolderName,
		builtGlobsRelativeToBuildingOutputRootFolder,
		toCreateBuildingTaskBody: toCreateStylusCompilationTaskBody,

		// copying
		shouldCopyBuiltFileToElsewhere: true,
		copyingFilesOutputBasePath,
		copyingFilesTaskOption: null,
	});
}
