const pathTool = require('path');
const deleteFiles = require('del');

const gulp = require('gulp');

const { join: joinPath } = pathTool;
const { sync: deleteFilesSync } = deleteFiles;

const scopedGlobsLazilyWatchingMechanism = require('@wulechuan/scoped-glob-watchers');
const {
	npmProjectRootPath: gulp3PipelinesNPMProjectRootPath,
} = require('@wulechuan/find-package-dot-json')({
	desiredNPMProjectName: '@wulechuan/gulp-3-common-pipeline-presets',
});





const gulp3CommonPipelines = require(gulp3PipelinesNPMProjectRootPath);

const gulp3PipelineUtils = gulp3CommonPipelines.utilities;

const {
	printCompletionOfOneTask,
	globOperations,
	aggregateTasksInPipelines,
	forSettingsOfScopedLazyWatchers,
} = gulp3PipelineUtils;

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
const frontEndSourceCSSPath         = joinPath(frontEndSourceRootPath, 'stylus');
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
		// basePathForShorteningPathsInLog: projectRootPath,
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
	// basePathForShorteningPathsInLog: projectRootPath,
	sourceBasePath: frontEndSourceJavascriptPath,
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




globOperations.forAGivenGlobArray.appendCertainGlobsInSomePipelines({
	globArrayToAppendThingsTo:    allGlobsToDeleteBeforeEachBuild,
	globsPropertyNameOfAPipeline: 'resolvedPathsOfBuiltGlobs',

	pipelines: [
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

gulp.task('delete generated files: everything', (thisTaskIsDone) => {
	deleteFilesSync(allGlobsToDeleteBeforeEachBuild, { force: true });
	printCompletionOfOneTask('delete generated files: everything', false);
	thisTaskIsDone();
});

gulp.task('build once: css: all', [
	frontEndTestSitePipeline_staticFiles_otherCSS.taskNameOfMainTask,
	...allCSSBuildingPipelines.map(pipeline => pipeline.taskNameOfMainTask),
]);

gulp.task('build once: javascript: all', [
	frontEndTestSitePipeline_staticFiles_otherJavascript.taskNameOfMainTask,
	...allJavascriptBuildingPipelines.map(pipeline => pipeline.taskNameOfMainTask),
]);

gulp.task('build once: everything', [
	frontEndTestSitePipeline_javaTemplates        .taskNameOfMainTask,
	frontEndTestSitePipeline_djangoTemplates      .taskNameOfMainTask,
	frontEndTestSitePipeline_staticFiles_media    .taskNameOfMainTask,
	frontEndTestSitePipeline_staticFiles_iconfonts.taskNameOfMainTask,
	'build once: css: all',
	'build once: javascript: all',
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

const scopedWatchingSettings = {};

forSettingsOfScopedLazyWatchers.appendMoreScopesViaPipelines({
	scopedWatchingSettingsToModify: scopedWatchingSettings,

	// defaultBasePathForShorteningPathsInLog: frontEndSubProjectRootPath,
	shouldTakeActionOnWatcherCreation: true,

	involvedPipelines: [
		frontEndTestSitePipeline_javaTemplates,
		frontEndTestSitePipeline_djangoTemplates,
		frontEndTestSitePipeline_staticFiles_media,
		frontEndTestSitePipeline_staticFiles_iconfonts,
		frontEndTestSitePipeline_staticFiles_otherCSS,
		frontEndTestSitePipeline_staticFiles_otherJavascript,

		...allCSSBuildingPipelines,
		...allJavascriptBuildingPipelines,
	],
});


gulp.task('build and then watch: everything', (thisTaskIsDone) => {
	scopedGlobsLazilyWatchingMechanism.createWatchersAccordingTo(scopedWatchingSettings, {
		basePathForShorteningPathsInLog: projectRootPath,
		// watchingBasePath:                projectRootPath,
		// shouldLogVerbosely:              false,
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

gulp.task('clean',      [ 'delete generated files: everything' ]); // Simply give it a shorter name.
gulp.task('build-once', [ 'build once: everything' ]);             // Simply give it a shorter name.
gulp.task('default',    [ 'build and then watch: everything' ]);   // The *default* gulp task
