const pathTool = require('path');
const fileSytem = require('fs');
const deleteFiles = require('del');

const gulp = require('gulp');

const { join: joinPath } = pathTool;
const { sync: deleteFilesSync } = deleteFiles;

const scopedGlobsLazilyWatchingMechanism = require('@wulechuan/scoped-glob-watchers');
const {
	npmProjectRootPath,
	// packageJSON,
} = findNPMProjectRootFolderAndPackageJSON({
	desiredNPMProjectName: '@wulechuan/gulp-3-common-pipeline-presets',
});





const gulp3CommonPipelines = require(npmProjectRootPath);
const printInfoAboutTheCompletionOfTask                  = gulp3CommonPipelines.utils.printCompletionOfOneTask;
const buildACSSStylusBuildingPipelineForOneAppOrOnePage  = gulp3CommonPipelines.specificPipelines.css.stylusCompilation;
const buildAJavascriptBuildingPipelineForOneAppOrOnePage = gulp3CommonPipelines.specificPipelines.js.concat;
const buildAPipelineForCopyingSomeFiles                  = gulp3CommonPipelines.genericPipelines.copyFiles;

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

const frontEndSourceRootFolder = 'source';
const frontEndTestSiteBuildFolder = 'build';
const javaOrDjangoTemplatesFolder = 'templates';
const javaOrDjangoStaticFilesFolder = 'static';

// --------------- 路径 ---------------

const frontEndSubProjectRootPath = process.cwd();
const projectRootPath = joinPath(frontEndSubProjectRootPath, '..');

const javaOrDjangoPageTemplatesPath = joinPath(projectRootPath, javaOrDjangoTemplatesFolder);
const javaOrDjangoStaticFilesPath   = joinPath(projectRootPath, javaOrDjangoStaticFilesFolder);

const frontEndSourceRootPath       = joinPath(frontEndSubProjectRootPath, frontEndSourceRootFolder);
const frontEndSourceCSSPath        = joinPath(frontEndSourceRootPath, 'styles');
const frontEndSourceJavascriptPath = joinPath(frontEndSourceRootPath, 'javascript');

const frontEndChiefBuildRootPath       = javaOrDjangoStaticFilesPath;
const frontEndChiefBuildCSSPath        = joinPath(frontEndChiefBuildRootPath, 'css');
const frontEndChiefBuildJavascriptPath = joinPath(frontEndChiefBuildRootPath, 'js');

const frontEndTestSiteBuildRootPath  = joinPath(frontEndSubProjectRootPath, frontEndTestSiteBuildFolder);
const frontEndBuildHTMLPath          = frontEndTestSiteBuildRootPath;
const frontEndBuildAssetsPath        = joinPath(frontEndTestSiteBuildRootPath, 'assets');
const frontEndTestSiteIconfontsPath  = joinPath(frontEndBuildAssetsPath, 'fonts');
const frontEndTestSiteMediaPath      = joinPath(frontEndBuildAssetsPath, 'images');
const frontEndTestSiteJavascriptPath = joinPath(frontEndBuildAssetsPath, 'js');
const frontEndTestSiteCSSPath        = joinPath(frontEndBuildAssetsPath, 'css');

const watchingBasePath = frontEndSubProjectRootPath;

// --------------- globs ---------------

const allGlobsToDeleteBeforeEachBuild = [
	frontEndTestSiteBuildRootPath,
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

const allCSSBuildingPipelines = [
	buildACSSStylusBuildingPipelineForOneAppOrOnePage({
		taskNameKeyPart: 'App',
		basePathForShorteningPathsInLog: projectRootPath,
		sourceBasePath: frontEndSourceCSSPath,
		buildingEntryGlobsRelativeToBasePath: 'everything.styl',
		builtOutputBasePath: frontEndChiefBuildCSSPath,
		builtSingleFileBaseName: 'everything',
		watchingBasePath,
		shouldCopyBuiltFileToElsewhere: true,
		copyingFilesOutputBasePath: frontEndTestSiteCSSPath,
	}),
];




const commonSettingsAcrossMultipleJavascriptPipelines = {
	basePathForShorteningPathsInLog: projectRootPath,
	sourceBasePath: frontEndSourceJavascriptPath,
	watchingBasePath,
	builtOutputBasePath: frontEndChiefBuildJavascriptPath,
	shouldCopyBuiltFileToElsewhere: true,
	copyingFilesOutputBasePath: frontEndTestSiteJavascriptPath,
};

const allJavascriptBuildingPipelines = [
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		...commonSettingsAcrossMultipleJavascriptPipelines,

		taskNameKeyPart:         'For a Fake Java Tempalte',
		builtSingleFileBaseName: 'page-a-java-served-web-page',
		buildingEntryGlobsRelativeToBasePath: [
			joinPath('common', '/**/*.js'),
			joinPath('page-a-java-page', '/**/*.js'),
		],
	}),
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		...commonSettingsAcrossMultipleJavascriptPipelines,

		taskNameKeyPart:         'For a Fake Django Tempalte',
		builtSingleFileBaseName: 'page-a-django-page',
		buildingEntryGlobsRelativeToBasePath: [
			joinPath('common', '/**/*.js'),
			joinPath('page-a-django-page', '/**/*.js'),
		],
	}),
];




allCSSBuildingPipelines.forEach(thisPipeline => {
	thisPipeline.builtGlobs.forEach(
		glob => allGlobsToDeleteBeforeEachBuild.push(glob)
	);
});

allJavascriptBuildingPipelines.forEach(thisPipeline => {
	thisPipeline.builtGlobs.forEach(
		glob => allGlobsToDeleteBeforeEachBuild.push(glob)
	);
});




const frontEndTestSitePipeline_javaTemplates = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Java Templates',
	taskNameKeyPart: 'HTML (.vm)',
	sourceBasePath: javaOrDjangoPageTemplatesPath,
	globsRelativeToSoureBasePath: [ '**/*.vm' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndBuildHTMLPath,
	// copyingFilesTaskOption: null,
});

const frontEndTestSitePipeline_djangoTemplates = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Django Templates',
	taskNameKeyPart: 'HTML',
	sourceBasePath: javaOrDjangoPageTemplatesPath,
	globsRelativeToSoureBasePath: [ '**/*.html' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndBuildHTMLPath,
	// copyingFilesTaskOption: null,
});

const frontEndTestSitePipeline_staticFiles_media = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'media',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'images'),
	// globsRelativeToSoureBasePath: [ '**/*' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndTestSiteMediaPath,
	// copyingFilesTaskOption: null,
});

const frontEndTestSitePipeline_staticFiles_iconfonts = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'iconfonts',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'fonts/iconfont*.*'),
	// globsRelativeToSoureBasePath: [ '**/*' ],
	// excludedSourcGlobs: [],
	copyingFilesOutputBasePath: frontEndTestSiteIconfontsPath,
	// copyingFilesTaskOption: null,
});

const frontEndTestSitePipeline_staticFiles_otherCSS = buildAPipelineForCopyingSomeFiles({
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
	copyingFilesOutputBasePath: frontEndTestSiteCSSPath,
	// copyingFilesTaskOption: null,
});

const frontEndTestSitePipeline_staticFiles_otherJavascript = buildAPipelineForCopyingSomeFiles({
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
	copyingFilesOutputBasePath: frontEndTestSiteJavascriptPath,
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
	frontEndTestSitePipeline_staticFiles_otherCSS.taskNameOfCopyingFiles,
	...allCSSBuildingPipelines.map(pipeline => pipeline.taskNameOfBuilding),
]);

gulp.task('build: javascript: all', [
	frontEndTestSitePipeline_staticFiles_otherJavascript.taskNameOfCopyingFiles,
	...allJavascriptBuildingPipelines.map(pipeline => pipeline.taskNameOfBuilding),
]);

gulp.task('build: everything', [
	frontEndTestSitePipeline_javaTemplates        .taskNameOfCopyingFiles,
	frontEndTestSitePipeline_djangoTemplates      .taskNameOfCopyingFiles,
	frontEndTestSitePipeline_staticFiles_media    .taskNameOfCopyingFiles,
	frontEndTestSitePipeline_staticFiles_iconfonts.taskNameOfCopyingFiles,
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

	frontEndTestSitePipeline_javaTemplates,
	frontEndTestSitePipeline_djangoTemplates,
	frontEndTestSitePipeline_staticFiles_media,
	frontEndTestSitePipeline_staticFiles_iconfonts,
	frontEndTestSitePipeline_staticFiles_otherCSS,
	frontEndTestSitePipeline_staticFiles_otherJavascript,

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

		if (pipelineSettings.watchingBasePath) {
			scopedWatchingSettings[scopeName].basePath = pipelineSettings.watchingBasePath;
		}

		console.log('basePath:');
		console.log(scopedWatchingSettings[scopeName].basePath);
		console.log('\nglobsToWatch:');
		console.log(scopedWatchingSettings[scopeName].globsToWatch);
		console.log('========================\n\n\n');
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
