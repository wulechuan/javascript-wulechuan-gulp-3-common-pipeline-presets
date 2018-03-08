module.exports = buildAPipelineForBuildingOneAppOrOnePage;

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

const pathTool = require('path');
const deleteFiles = require('del');

const gulp = require('gulp');
const runTasksSequentially = require('gulp-sequence');

const chalk = require('chalk'); // eslint-disable-line no-unused-vars

const { join: joinPath } = pathTool;
const { sync: deleteFilesSync } = deleteFiles;

const printInfoAboutTheCompletionOfTask = require('../utils/print-one-task-done'); // eslint-disable-line no-unused-vars
const createTaskForCopyingFiles         = require('../gulp-task-creators/_generic-copy-files');


function buildAPipelineForBuildingOneAppOrOnePage({ // eslint-disable-line max-statements
	// logging
	pipelineCategory, // e.g. 'Javascript' or '爪哇脚本'
	taskNameKeyPart, // e.g. 'Page: User Dashboard' or maybe just 'App'
	basePathForShorteningPathsInLog = '', // e.g. 'front-end/source/js' or 'front-end/source', anything you like.

	// source
	sourceBasePath, // e.g. 'front-end/source/js'
	buildingEntryGlobsRelativeToSoureRootFolder, // e.g. [ '**/*.js' ]
	watchingGlobs, // e.g. [ '**/*.js' ]

	// building
	builtOutputBasePath, // e.g. '../static' or 'dist/assets'
	builtOutputRootFolderName, // e.g. 'js'
	builtGlobsRelativeToBuildingOutputRootFolder = '', // e.g. 'page-user-dashboard'
	toCreateBuildingTaskBody, // A function to create another function, the created function will be used as the task body of comiplation

	// copying
	shouldCopyBuiltFileToElsewhere = false,
	copyingFilesOutputBasePath, // e.g. 'build/tryout-website/assets'
	copyingFilesTaskOption, // will be passed to **createTaskForCopyingFiles**
}) {
	const buildingOutputRootFolder     = joinPath(builtOutputBasePath,        builtOutputRootFolderName);
	const copyingFilesOutputRootFolder = joinPath(copyingFilesOutputBasePath, builtOutputRootFolderName);





	let _sourceGlobsArray = buildingEntryGlobsRelativeToSoureRootFolder;

	if (! _sourceGlobsArray) {
		_sourceGlobsArray = [ '**/*' ];
	} else if (! Array.isArray(_sourceGlobsArray)) {
		_sourceGlobsArray = [_sourceGlobsArray];
	}

	const entryGlobsForBuilding = _sourceGlobsArray.reduce((accum, glob) => {
		if (typeof glob === 'string') {
			accum.push(joinPath(sourceBasePath, glob));
		}

		return accum;
	}, []);




	let _builtGlobsArray = builtGlobsRelativeToBuildingOutputRootFolder;

	if (! _builtGlobsArray) {
		_builtGlobsArray = [ '**/*' ];
	} else if (! Array.isArray(_builtGlobsArray)) {
		_builtGlobsArray = [_builtGlobsArray];
	}

	const _validBuiltGlobs = _builtGlobsArray.reduce((accum, glob) => {
		if (typeof glob === 'string' && !! glob) {
			accum.push(glob);
		}

		return accum;
	}, []);






	const builtGlobs = _validBuiltGlobs.map(
		glob => joinPath(buildingOutputRootFolder, glob)
	);

	const globsToCopyAfterEachBuild = [
		...builtGlobs,
	];

	let globsToDeleteBeforeEachBuild = [
		...builtGlobs,
	];

	let builtGlobCopies;
	if (shouldCopyBuiltFileToElsewhere) {
		builtGlobCopies = _validBuiltGlobs.map(
			glob => joinPath(copyingFilesOutputRootFolder, glob)
		);
		globsToDeleteBeforeEachBuild = [
			...globsToDeleteBeforeEachBuild,
			...builtGlobCopies,
		];
	}







	const taskNameOfDeletingFiles = `Delete old files: ${pipelineCategory}: Those of ${taskNameKeyPart}`;
	const taskNameOfBuilding = `Build: ${pipelineCategory}: ${taskNameKeyPart}`;
	const taskNameOfCopyingFiles = `Copy: ${pipelineCategory}: ${taskNameKeyPart}`;
	const taskNameOfBuildingAndThenCopying = `Build and then Copy: ${pipelineCategory} ${taskNameKeyPart}`;

	const pipelineFullName = taskNameOfBuilding;






	const taskBodyOfDeletingFiles = (thisTaskIsDone) => {
		deleteFilesSync(globsToDeleteBeforeEachBuild, {
			force: true, // force 为 true，是为了删除位于 npm 项目文件夹之外的文件。
		});
		// printInfoAboutTheCompletionOfTask(taskNameForDeletingFiles, false);
		thisTaskIsDone();
	};

	const taskBodyOfBuilding = toCreateBuildingTaskBody({
		taskNameKeyPart,
		entryGlobsForBuilding,
		buildingOutputRootFolder,
		basePathForShorteningPathsInLog,
	});

	let taskBodyOfCopyingFiles;
	let taskBodyOfBuildingAndThenCopyingBuiltOutputFiles;

	if (shouldCopyBuiltFileToElsewhere) {
		const usedCopyingFilesTaskOption = {
			...{
				shouldFlattenSubFolders: false,
				logPrefix: taskNameOfCopyingFiles,
				// descriptionOfAssetsToCopy: `Build ${pipelineCategory} Files`,
				shouldNotLogDetails: true,
				shouldListSourceFiles: false,
			},

			...copyingFilesTaskOption,
		};

		taskBodyOfCopyingFiles = createTaskForCopyingFiles(
			globsToCopyAfterEachBuild,
			copyingFilesOutputRootFolder,
			usedCopyingFilesTaskOption
		);

		taskBodyOfBuildingAndThenCopyingBuiltOutputFiles = (thisTaskIsDone) => {
			runTasksSequentially(
				taskNameOfBuilding,
				taskNameOfCopyingFiles
			)(thisTaskIsDone);
		};
	}







	gulp.task(taskNameOfDeletingFiles, taskBodyOfDeletingFiles);
	gulp.task(taskNameOfBuilding, [ taskNameOfDeletingFiles ], taskBodyOfBuilding);
	if (shouldCopyBuiltFileToElsewhere) {
		gulp.task(taskNameOfCopyingFiles, taskBodyOfCopyingFiles);
		gulp.task(taskNameOfBuildingAndThenCopying, taskBodyOfBuildingAndThenCopyingBuiltOutputFiles);
	} else {
		gulp.task(taskNameOfBuildingAndThenCopying, taskNameOfBuilding);
	}





	const pipelineSettings = {
		pipelineFullName,

		builtGlobs,
		globsToWatch: watchingGlobs,
		globsToDeleteBeforeEachBuild,
		globsToCopyAfterEachBuild,

		taskNameOfBuilding,               // 可用于一次性编译或构建任务
		taskNameOfDeletingFiles,          // 可用于完整清除所有构建输出的任务

		toBuild: taskBodyOfBuilding,      // 可用于一次性编译或构建任务
		toClean: taskBodyOfDeletingFiles, // 我想其实基本用不到
	};

	if (shouldCopyBuiltFileToElsewhere) {
		pipelineSettings.taskNameOfBuildingAndThenCopying = taskNameOfBuildingAndThenCopying; // 我想其实基本用不到
		pipelineSettings.toCopyBuildingOutputFiles        = taskBodyOfCopyingFiles;

		pipelineSettings.toBuildAndThenCopy               = taskBodyOfBuildingAndThenCopyingBuiltOutputFiles;
		pipelineSettings.actionToTakeOnSourceFileEvents   = taskBodyOfBuildingAndThenCopyingBuiltOutputFiles;
	} else {
		pipelineSettings.actionToTakeOnSourceFileEvents   = taskBodyOfBuilding;
	}





	return pipelineSettings;
}
