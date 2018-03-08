const pathTool = require('path');
const fileSytem = require('fs');
const deleteFiles = require('del');

const gulp = require('gulp');

const { join: joinPath } = pathTool;
const { sync: deleteFilesSync } = deleteFiles;

const printInfoAboutTheCompletionOfTask = require('../../../source/utils/print-one-task-done'); // eslint-disable-line no-unused-vars
const scopedGlobsLazilyWatchingMechanism = require('@wulechuan/scoped-glob-watchers');
const {
	npmProjectRootPath,
	// packageJSON,
} = findNPMProjectRootFolderAndPackageJSON({
	desiredNPMProjectName: '@wulechuan/gulp-3-common-pipeline-presets',
});

const gulp3CommonPipelines = require(npmProjectRootPath);

/*
*
*
*
*
*
*
* ****************************************
*               整理环境常量
* ****************************************
*/

// --------------- 基本常量 ---------------

const frontEndSubProjectRootPath = process.cwd();
const projectRootPath = joinPath(frontEndSubProjectRootPath, '..');

const javaOrDjangoTemplatesFolder = 'templates';
const javaOrDjangoStaticFilesFolder = 'static';

// --------------- 路径 ---------------

const javaOrDjangoPageTemplatesPath = joinPath(projectRootPath, javaOrDjangoStaticFilesFolder);
const javaOrDjangoStaticFilesPath   = joinPath(projectRootPath, javaOrDjangoTemplatesFolder);

const frontEndBuildRootPath = joinPath(frontEndSubProjectRootPath, 'build');
const frontEndBuildHTMLPath = frontEndBuildRootPath;

const frontEndBuildAssetsPath     = joinPath(frontEndBuildRootPath, 'assets');

const frontEndBuildIconfontsPath  = joinPath(frontEndBuildAssetsPath, 'fonts');
const frontEndBuildMediaPath      = joinPath(frontEndBuildAssetsPath, 'images');
const frontEndBuildJavascriptPath = joinPath(frontEndBuildAssetsPath, 'js');
const frontEndBuildCSSPath        = joinPath(frontEndBuildAssetsPath, 'css');

global.paths = {
	npmProjectRoot:    npmProjectRootPath,
	javaPageTemplates: javaOrDjangoPageTemplatesPath,
	javaStaticFiles:   javaOrDjangoStaticFilesPath,
	frontEndBuild:       frontEndBuildRootPath,
	frontEndBuildAssets: frontEndBuildAssetsPath,
};

// --------------- globs ---------------

const allGlobsToDeleteBeforeEachBuild = [
	frontEndBuildRootPath,
];


/*
*
*
*
*
*
*
* *****************************************************
* 利用【工作流预设（pipeline presets）】构建的整套整套的任务集
* *****************************************************
*/

const buildACSSStylusBuildingPipelineForOneAppOrOnePage  = gulp3CommonPipelines.specificPipelines.css.stylusCompilation;
const buildAJavascriptBuildingPipelineForOneAppOrOnePage = gulp3CommonPipelines.specificPipelines.js.concat;
const buildAPipelineForCopyingSomeFiles = gulp3CommonPipelines.genericPipelines.copyFiles;


const allCSSBuildingPipelines = [
	buildACSSStylusBuildingPipelineForOneAppOrOnePage({
		taskNameKeyPart: 'App',
		buildingEntryGlobsRelativeToSoureRootFolder: 'everything.styl',
		builtSingleFileBaseName: 'everything',
	}),
];

const allJavascriptBuildingPipelines = [
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		taskNameKeyPart:               'Fake Java Tempalte',
		appOrPageSourceRootFolderName: 'fake-java-page',
	}),
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		taskNameKeyPart:               'Fake Django Template',
		appOrPageSourceRootFolderName: 'fake-django-page',
	}),
];

allCSSBuildingPipelines.forEach(thisPipeline => {
	allGlobsToDeleteBeforeEachBuild.push(thisPipeline.builtGlobs);
});

allJavascriptBuildingPipelines.forEach(thisPipeline => {
	allGlobsToDeleteBeforeEachBuild.push(thisPipeline.builtGlobs);
});




const javaStaticFilesPipeline_HTML = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Java Templates',
	taskNameKeyPart: 'HTML (.vm)',
	sourceBasePath: javaOrDjangoPageTemplatesPath,
	globsRelativeToSoureBasePath: [ '**/*.vm' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndBuildHTMLPath,
	// copyingFilesTaskOption: null,
});

const djangoStaticFilesPipeline_HTML = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Django Templates',
	taskNameKeyPart: 'HTML',
	sourceBasePath: javaOrDjangoPageTemplatesPath,
	globsRelativeToSoureBasePath: [ '**/*.html' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndBuildHTMLPath,
	// copyingFilesTaskOption: null,
});

const staticFilesPipeline_Media = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'media',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'images'),
	// globsRelativeToSoureBasePath: [ '**/*' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndBuildMediaPath,
	// copyingFilesTaskOption: null,
});

const staticFilesPipeline_Fonts = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'iconfonts',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'fonts/iconfont*.*'),
	// globsRelativeToSoureBasePath: [ '**/*' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndBuildIconfontsPath,
	// copyingFilesTaskOption: null,
});

const staticFilesPipeline_otherCSS = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'css',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'css'),
	globsRelativeToSoureBasePath: [ '**/*.css' ],
	excludedSourcGlobs: [
		...allCSSBuildingPipelines.reduce((accum, pipeline) => {
			return [
				...accum,
				...pipeline.builtGlobs,
			];
		}, []),
	],
	copyingFilesOutputBasePath: frontEndBuildCSSPath,
	// copyingFilesTaskOption: null,
});

const staticFilesPipeline_otherJavascript = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'javascript',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'js'),
	globsRelativeToSoureBasePath: [ '**/*.js' ],
	excludedSourcGlobs: [
		...allJavascriptBuildingPipelines.reduce((accum, pipeline) => {
			return [
				...accum,
				...pipeline.builtGlobs,
			];
		}, []),
	],
	copyingFilesOutputBasePath: frontEndBuildJavascriptPath,
	// copyingFilesTaskOption: null,
});


/*
*
*
*
*
*
*
* ****************************************
*                 其他任务
* ****************************************
*/

gulp.task('delete old files: everything', (thisTaskIsDone) => {
	deleteFilesSync(allGlobsToDeleteBeforeEachBuild, { force: true });
	printInfoAboutTheCompletionOfTask('delete old files: everything', false);
	thisTaskIsDone();
});

gulp.task('build: css: all', [
	staticFilesPipeline_otherCSS.taskNameOfCopyingFiles,
	...allCSSBuildingPipelines.map(pipeline => pipeline.taskNameOfBuilding),
]);

gulp.task('build: javascript: all', [
	staticFilesPipeline_otherJavascript.taskNameOfCopyingFiles,
	...allJavascriptBuildingPipelines.map(pipeline => pipeline.taskNameOfBuilding),
]);

gulp.task('build: everything', [
	javaStaticFilesPipeline_HTML  .taskNameOfCopyingFiles,
	djangoStaticFilesPipeline_HTML.taskNameOfCopyingFiles,
	staticFilesPipeline_Media     .taskNameOfCopyingFiles,
	staticFilesPipeline_Fonts     .taskNameOfCopyingFiles,
	'build: css: all',
	'build: javascript: all',
]);


/*
*
*
*
*
*
*
* ****************************************
*                Watchers
* ****************************************
*/

const shouldTakeActionOnWatcherCreation = true;
const scopedWatchingSettings = {};

forAScopedWatchingSettings_addMoreScopesViaPipelineSetings(
	scopedWatchingSettings,

	javaStaticFilesPipeline_HTML,
	djangoStaticFilesPipeline_HTML,
	staticFilesPipeline_Media,
	staticFilesPipeline_Fonts,
	staticFilesPipeline_otherCSS,
	staticFilesPipeline_otherJavascript,

	...allCSSBuildingPipelines,
	...allJavascriptBuildingPipelines
);

gulp.task('build and then watch: everything', (thisTaskIsDone) => {
	scopedGlobsLazilyWatchingMechanism.createWatchersAccordingTo(scopedWatchingSettings, {
		basePath: npmProjectRootPath,
		// shouldLogVerbosely: false,
	});

	thisTaskIsDone();
});


/*
*
*
*
*
*
*
* ****************************************
*   所谓的公开任务（本质上所有任务均是公开的）
* ****************************************
*/

gulp.task('clean',      [ 'delete old files: everything' ]); // Simply give it a shorter name.
gulp.task('build-once', [ 'build: everything' ]);            // Simply give it a shorter name.
gulp.task('default',    [ 'build and then watch: everything' ]); // The *default* gulp task


/*
*
*
*
*
*
*
* ****************************************
*                 辅助函数
* ****************************************
*/

function forAScopedWatchingSettings_addMoreScopesViaPipelineSetings(scopedWatchingSettings, ...piplineSettingsArray) {
	piplineSettingsArray.forEach(pipelineSettings => {
		const scopeName = pipelineSettings.pipelineFullName;
		scopedWatchingSettings[scopeName] = {
			globsToWatch: pipelineSettings.globsToWatch,
			actionToTake: pipelineSettings.actionToTakeOnSourceFileEvents,
			shouldTakeActionOnWatcherCreation,
		};
	});
}

// function ensureCWDToBeNPMProjectRootAndReturnPackageJSON(options) {
// 	const result = findNPMProjectRootFolderAndPackageJSON(options);

// 	if (! result) {
// 		throw ReferenceError('Fail to locate npm project root.');
// 	}

// 	const {
// 		npmProjectRootPath,
// 	} = result;


// 	process.chdir(npmProjectRootPath);

// 	console.log(`[${
// 		chalk.gray(moment().format('HH:mm:ss'))
// 	}] Working directory changed to\n${' '.repeat('[HH:mm:ss] '.length)}${
// 		chalk.green(process.cwd())
// 	}\n\n\n`);

// 	return result;
// }


function findNPMProjectRootFolderAndPackageJSON(options) {
	if (! options || typeof options !== 'object' || !options.desiredNPMProjectName || typeof options.desiredNPMProjectName !== 'string') {
		throw TypeError('options must be an object with a non empty string property named "desiredNPMProjectName".');
	}

	const { desiredNPMProjectName } = options;
	if (! ( // https://docs.npmjs.com/files/package.json#name
		(
			desiredNPMProjectName.match(/@[a-z]+\/[a-z_-]+/) ||
			desiredNPMProjectName.match(/[a-z]+[a-z_-]+/)
		) && desiredNPMProjectName.length < 215
	)) {
		throw RangeError('NPM project name should only contains lowercase letters, "@", "-", "_", or "/".');
	}


	let currentCheckingPath = process.cwd();
	let packageJSON;
	while (
		! (packageJSON = foundValidPackageJSON(currentCheckingPath, desiredNPMProjectName)) &&
		! folderIsTopMostOne(currentCheckingPath)
	) {
		currentCheckingPath = pathTool.resolve(currentCheckingPath, '..');
	}

	if (! packageJSON) {
		return null;
	}

	return {
		npmProjectRootPath: currentCheckingPath,
		packageJSON,
	};


	function foundValidPackageJSON(folder, desiredNPMProjectName) {
		const foundPackageJsonFullPath = joinPath(folder, 'package.json');

		if (fileSytem.existsSync(foundPackageJsonFullPath)) {
			const packageJSON = require(foundPackageJsonFullPath); // eslint-disable-line import/no-dynamic-require

			if (
				packageJSON && typeof packageJSON === 'object' &&
				packageJSON.name === desiredNPMProjectName
			) {
				return packageJSON;
			}
		}

		return null;
	}

	function folderIsTopMostOne(folder) {
		// folder = pathTool.resolve(folder);
		const segments = folder.split(pathTool.sep);
		return segments.length === 2 && segments[1].length === 0;
	}
}
