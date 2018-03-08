const pathTool = require('path');
const { join: joinPath } = pathTool;

const sourceRootFolderName      = 'js';
const builtOutputRootFolderName = 'js';

const basePathForShorteningPathsInLog = joinPath(global.paths.npmProjectRoot, 'source');
const javascriptSourceBasePath        = joinPath(global.paths.npmProjectRoot, 'source', sourceRootFolderName);

const builtOutputBasePath        = global.paths.javaStaticFiles;
const copyingFilesOutputBasePath = global.paths.frontEndBuildAssets;

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

const buildAPipelineForBuildingOneAppOrOnePage = require('./_generic-pipeline-skeleton-to-build-and-then-copy');
const createTaskBodyForCompilingJavascript = require('../gulp-task-creators/js-simply-concat');

function buildAJavascriptBuildingPipelineForOneAppOrOnePage({
	taskNameKeyPart, // e.g. 'Page: Marketing Dashboard'
	appOrPageSourceRootFolderName, // e.g. 'page-marketing-dashboard'
}) {
	const sourceBasePath = joinPath(javascriptSourceBasePath, appOrPageSourceRootFolderName);
	const buildingEntryGlobsRelativeToSoureRootFolder = [ '**/*.js' ];

	const builtSingleFileBaseName = appOrPageSourceRootFolderName;
	const watchingGlobs = [
		joinPath(sourceBasePath, '**/*.js'),
	];

	const builtGlobsRelativeToBuildingOutputRootFolder = [
		`${builtSingleFileBaseName}.js`,
		`${builtSingleFileBaseName}.min.js`,
	];

	function toCreateJavascriptCompilationTaskBody({
		taskNameKeyPart,
		entryGlobsForBuilding,
		buildingOutputRootFolder,
		basePathForShorteningPathsInLog,
	}) {
		return createTaskBodyForCompilingJavascript(
			entryGlobsForBuilding,
			{
				taskNameForLogs: taskNameKeyPart,
				compiledJavascriptOutputFolder: buildingOutputRootFolder,
				compiledJavascriptFileBaseName: builtSingleFileBaseName,
				basePathForShorteningPathsInLog,
				shouldNotGenerateMinifiedVersions: false,
			}
		);
	}

	return buildAPipelineForBuildingOneAppOrOnePage({
		// logging
		pipelineCategory: '爪哇脚本',
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
		toCreateBuildingTaskBody: toCreateJavascriptCompilationTaskBody,

		// copying
		shouldCopyBuiltFileToElsewhere: true,
		copyingFilesOutputBasePath,
		copyingFilesTaskOption: null,
	});
}
