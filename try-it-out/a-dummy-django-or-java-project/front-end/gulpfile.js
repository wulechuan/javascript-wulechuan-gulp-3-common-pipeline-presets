const pathTool = require('path');
const deleteFiles = require('del');

const gulp = require('gulp');

const { join: joinPath } = pathTool;
const { sync: deleteFilesSync } = deleteFiles;

const scopedGlobsLazilyWatchingMechanism = require('@wulechuan/scoped-glob-watchers');
const {
	npmProjectRootPath,
	// packageJSON,
} = require('@wulechuan/find-package-dot-json')({
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

const frontEndSourceRootPath        = joinPath(frontEndSubProjectRootPath, frontEndSourceRootFolder);
const frontEndSourceCSSPath         = joinPath(frontEndSourceRootPath, 'styles');
const frontEndSourceJavascriptPath  = joinPath(frontEndSourceRootPath, 'javascript');

const frontEndChiefBuildRootPath       = javaOrDjangoStaticFilesPath;
const frontEndChiefBuildCSSPath        = joinPath(frontEndChiefBuildRootPath, 'css');
const frontEndChiefBuildJavascriptPath = joinPath(frontEndChiefBuildRootPath, 'js');

const frontEndTestSiteRootPath       = joinPath(frontEndSubProjectRootPath, frontEndTestSiteBuildFolder);
const frontEndTestSiteHTMLPath       = frontEndTestSiteRootPath;
const frontEndTestSiteAssetsPath     = joinPath(frontEndTestSiteRootPath, 'assets');
const frontEndTestSiteIconfontsPath  = joinPath(frontEndTestSiteAssetsPath, 'fonts');
const frontEndTestSiteMediaPath      = joinPath(frontEndTestSiteAssetsPath, 'images');
const frontEndTestSiteJavascriptPath = joinPath(frontEndTestSiteAssetsPath, 'js');
const frontEndTestSiteCSSPath        = joinPath(frontEndTestSiteAssetsPath, 'css');

// const watchingBasePath = frontEndSubProjectRootPath;

// --------------- globs ---------------

const allGlobsToDeleteBeforeEachBuild = [
	frontEndTestSiteRootPath,
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
		// watchingBasePath,
		buildingEntryGlobsRelativeToSourceBasePath: 'everything.styl',
		outputBasePathOfBuilding: frontEndChiefBuildCSSPath,
		builtSingleFileBaseName: 'everything',
		shouldCopyBuiltFileToElsewhere: true,
		outputBasePathOfCopying: frontEndTestSiteCSSPath,
	}),
];




const commonSettingsAcrossMultipleJavascriptPipelines = {
	basePathForShorteningPathsInLog: projectRootPath,
	sourceBasePath: frontEndSourceJavascriptPath,
	// watchingBasePath,
	outputBasePathOfBuilding: frontEndChiefBuildJavascriptPath,
	shouldCopyBuiltFileToElsewhere: true,
	outputBasePathOfCopying: frontEndTestSiteJavascriptPath,
};

const buildingCommonEntryGlobsRelativeToSourceBasePath = [
	joinPath('common', '/**/*.js'),
];

const allJavascriptBuildingPipelines = [
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		...commonSettingsAcrossMultipleJavascriptPipelines,

		taskNameKeyPart:         'For a Fake Java Tempalte',
		builtSingleFileBaseName: 'page-a-java-served-web-page',
		buildingEntryGlobsRelativeToSourceBasePath: [
			...buildingCommonEntryGlobsRelativeToSourceBasePath,
			joinPath('page-a-java-page', '/**/*.js'),
		],
	}),
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		...commonSettingsAcrossMultipleJavascriptPipelines,

		taskNameKeyPart:         'For a Fake Django Tempalte',
		builtSingleFileBaseName: 'page-a-django-page',
		buildingEntryGlobsRelativeToSourceBasePath: [
			...buildingCommonEntryGlobsRelativeToSourceBasePath,
			joinPath('page-a-django-page', '/**/*.js'),
		],
	}),
];




gulp3CommonPipelines.utils.forAGlobArrayExcludeGlobsInPipelines({
	globArrayToExcludeThingsOutOf: allGlobsToDeleteBeforeEachBuild,
	globsPropertyNameOfAPipelineSettings: 'resolvedPathsOfBuiltGlobs',

	pipelineSettingsArray: [
		...allCSSBuildingPipelines,
		...allJavascriptBuildingPipelines,
	],
});




const frontEndTestSitePipeline_javaTemplates = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Java Templates',
	taskNameKeyPart: 'HTML (.vm)',
	sourceBasePath: javaOrDjangoPageTemplatesPath,
	globsToCopyRelativeToSoureBasePath: [ '**/*.vm' ],
	// globsToExclude: [],
	outputBasePathOfCopying: frontEndTestSiteHTMLPath,
	// optionsOfCopyingFiles: null,
});

const frontEndTestSitePipeline_djangoTemplates = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Django Templates',
	taskNameKeyPart: 'HTML',
	sourceBasePath: javaOrDjangoPageTemplatesPath,
	globsToCopyRelativeToSoureBasePath: [ '**/*.html' ],
	// globsToExclude: [],
	outputBasePathOfCopying: frontEndTestSiteHTMLPath,
	// optionsOfCopyingFiles: null,
});

const frontEndTestSitePipeline_staticFiles_media = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'media',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'images'),
	// globsToCopyRelativeToSoureBasePath: [ '**/*' ],
	// globsToExclude: [],
	outputBasePathOfCopying: frontEndTestSiteMediaPath,
	// optionsOfCopyingFiles: null,
});

const frontEndTestSitePipeline_staticFiles_iconfonts = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'iconfonts',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'fonts'),
	globsToCopyRelativeToSoureBasePath: [ '**/iconfont*.*' ],
	// globsToExclude: [],
	outputBasePathOfCopying: frontEndTestSiteIconfontsPath,
	// optionsOfCopyingFiles: null,
});

const frontEndTestSitePipeline_staticFiles_otherCSS = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'css',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'css'),
	globsToCopyRelativeToSoureBasePath: [ '**/*.css' ],
	globsToExclude: [
		...allCSSBuildingPipelines.reduce((accum, pipeline) => {
			return [
				...accum,
				...pipeline['resolvedPathsOfBuiltGlobs'],
			];
		}, []),
	],
	outputBasePathOfCopying: frontEndTestSiteCSSPath,
	// optionsOfCopyingFiles: null,
});

const frontEndTestSitePipeline_staticFiles_otherJavascript = buildAPipelineForCopyingSomeFiles({
	pipelineCategory: 'Static Files',
	taskNameKeyPart: 'javascript',
	sourceBasePath: joinPath(javaOrDjangoStaticFilesPath, 'js'),
	globsToCopyRelativeToSoureBasePath: [ '**/*.js' ],
	globsToExclude: [
		...allJavascriptBuildingPipelines.reduce((accum, pipeline) => {
			return [
				...accum,
				...pipeline['resolvedPathsOfBuiltGlobs'],
			];
		}, []),
	],
	outputBasePathOfCopying: frontEndTestSiteJavascriptPath,
	// optionsOfCopyingFiles: null,
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
	frontEndTestSitePipeline_staticFiles_otherCSS.taskNameOfLastTask,
	...allCSSBuildingPipelines.map(pipeline => pipeline.taskNameOfLastTask),
]);

gulp.task('build: javascript: all', [
	frontEndTestSitePipeline_staticFiles_otherJavascript.taskNameOfLastTask,
	...allJavascriptBuildingPipelines.map(pipeline => pipeline.taskNameOfLastTask),
]);

gulp.task('build: everything', [
	frontEndTestSitePipeline_javaTemplates        .taskNameOfLastTask,
	frontEndTestSitePipeline_djangoTemplates      .taskNameOfLastTask,
	frontEndTestSitePipeline_staticFiles_media    .taskNameOfLastTask,
	frontEndTestSitePipeline_staticFiles_iconfonts.taskNameOfLastTask,
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

const shouldTakeActionOnWatcherCreation = false;
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
		watchingBasePath: npmProjectRootPath,
		basePathForShorteningPathsInLog: frontEndSubProjectRootPath,
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
			globsToWatch: pipelineSettings.watchingGlobsRelativeToWatchingBasePath,
			actionToTake: pipelineSettings.actionToTakeOnSourceFilesChange,
			shouldTakeActionOnWatcherCreation,
		};

		const pipelineWatchingBasePath = pipelineSettings.watchingBasePath;
		if (pipelineWatchingBasePath && typeof pipelineWatchingBasePath === 'string') {
			scopedWatchingSettings[scopeName].watchingBasePath = pipelineWatchingBasePath;
		}

		const pipelineLoggingBasePath = pipelineSettings.basePathForShorteningPathsInLog;
		if (pipelineLoggingBasePath && typeof pipelineLoggingBasePath === 'string') {
			scopedWatchingSettings[scopeName].basePathForShorteningPathsInLog = pipelineLoggingBasePath;
		}
	});
}
