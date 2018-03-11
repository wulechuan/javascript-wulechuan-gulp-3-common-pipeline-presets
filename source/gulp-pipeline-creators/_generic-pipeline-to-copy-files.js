module.exports = buildAPipelineForCopyingSomeFiles;

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

// const chalk = require('chalk');

const { join: joinPath } = pathTool;
const { sync: deleteFilesSync } = deleteFiles;

const getValidatedGlobsFrom             = require('../utils/get-validated-globs');
const printInfoAboutTheCompletionOfTask = require('../utils/print-one-task-done');
const createTaskForCopyingFiles         = require('../gulp-task-creators/_generic-copy-files');

const { namePrefixOfEveryAutoGeneratedTask } = require('../configurations');


function buildAPipelineForCopyingSomeFiles({ // eslint-disable-line max-statements
	// logging
	pipelineCategory, // e.g. 'Javascript' or '爪哇脚本'
	taskNameKeyPart, // e.g. 'Page: User Dashboard' or maybe just 'App'

	// source
	sourceBasePath = process.cwd(),     // e.g. 'front-end/source/js'
	globsToCopyRelativeToSoureBasePath, // e.g. [ '**/*.js' ]

	// e.g. [ 'd:/projects/something/**.* '],
	// An excluded glob can be either an absolute one or a relative one.
	// If an excluded glob is a relative one,
	// then it's assumed that
	// the reference base path is the sourceBasePath.
	globsToExclude,

	// copying
	outputBasePathOfCopying, // e.g. 'build/tryout-website/assets'
	optionsOfCopyingFiles,   // will be passed to **createTaskForCopyingFiles**
}) {
	const validatedRelativeSourceGlobsToCopy = getValidatedGlobsFrom({
		rawGlobs: globsToCopyRelativeToSoureBasePath,
		defaultValue: [ '**/*' ],
	});

	const excludedGlobsRelativeToSourceBasePath = getValidatedGlobsFrom({
		rawGlobs: globsToExclude,
		defaultValue: [], // To omit means nothing to exclude.
	}).map(glob => {
		const resolvedGlob = pathTool.resolve(sourceBasePath, glob);
		return pathTool.relative(sourceBasePath, resolvedGlob);
	});



	// This globs array below is for watching configuration only.
	// Note that watching configuration has its own `watchingBasePath`,
	// thus we need to pass a watcher the relative globs,
	// instead of resolved ones.
	const relativeSourceGlobsToCopyPlusRelativeExcludedGlobs = [
		...validatedRelativeSourceGlobsToCopy,
		...excludedGlobsRelativeToSourceBasePath.map(
			glob => `!${glob}`
		),
	];



	const resolvedPathsOfGlobsToCopy = validatedRelativeSourceGlobsToCopy.map(
		glob => joinPath(sourceBasePath, glob)
	);

	const resolvedPathsOfGlobsToDeleteBeforeCopyingAgain = validatedRelativeSourceGlobsToCopy.map(
		glob => joinPath(outputBasePathOfCopying, glob)
	);

	excludedGlobsRelativeToSourceBasePath.forEach(glob => {
		resolvedPathsOfGlobsToCopy.push(
			`!${joinPath(sourceBasePath, glob)}`
		);
	});

	excludedGlobsRelativeToSourceBasePath.forEach(glob => {
		resolvedPathsOfGlobsToDeleteBeforeCopyingAgain.push(
			`!${joinPath(outputBasePathOfCopying, glob)}`
		);
	});



	const pipelineFullName = `${taskNameKeyPart} - ${pipelineCategory}`;

	const taskPrintingNameOfDeletingFiles                   = `${pipelineFullName}: Delete copied output files`;
	const taskPrintingNameOfCopyingFiles                    = `${pipelineFullName}: Copy source files`;
	const taskPrintingNameOfDeletingOldCopiesAndThenCopying = `${pipelineFullName}: Deleting old copies and then copy source files`;

	const taskNameOfDeletingFiles                   = `${namePrefixOfEveryAutoGeneratedTask} - ${taskPrintingNameOfDeletingFiles}`;
	const taskNameOfDeletingFilesWithoutPrinting    = `${namePrefixOfEveryAutoGeneratedTask} - ${taskPrintingNameOfDeletingFiles} (without printing completion info)`;
	const taskNameOfCopyingFiles                    = `${namePrefixOfEveryAutoGeneratedTask} - ${taskPrintingNameOfCopyingFiles}`;
	const taskNameOfDeletingOldCopiesAndThenCopying = `${namePrefixOfEveryAutoGeneratedTask} - ${taskPrintingNameOfDeletingOldCopiesAndThenCopying}`;

	const taskNameOfMainTask = taskNameOfDeletingOldCopiesAndThenCopying;





	const taskBodyOfDeletingFilesWithoutPrinting = (thisTaskIsDone) => {
		deleteFilesSync(resolvedPathsOfGlobsToDeleteBeforeCopyingAgain, {
			force: true, // force 为 true，是为了删除位于 npm 项目文件夹之外的文件。
		});
		thisTaskIsDone();
	};

	const taskBodyOfDeletingFiles = (thisTaskIsDone) => {
		deleteFilesSync(resolvedPathsOfGlobsToDeleteBeforeCopyingAgain, {
			force: true, // force 为 true，是为了删除位于 npm 项目文件夹之外的文件。
		});
		printInfoAboutTheCompletionOfTask(taskPrintingNameOfDeletingFiles, false);
		thisTaskIsDone();
	};

	const usedOptionsOfCopyingFiles = {
		...{
			shouldFlattenSubFolders:   false,
			logPrefix:                 taskNameOfCopyingFiles,
			// descriptionOfAssetsToCopy: pipelineFullName,
			shouldNotLogDetails:       true,
			shouldListSourceFiles:     false,
		},

		...optionsOfCopyingFiles,
	};

	const taskBodyOfCopyingFiles = createTaskForCopyingFiles(
		resolvedPathsOfGlobsToCopy,
		outputBasePathOfCopying,
		usedOptionsOfCopyingFiles
	);

	const taskBodyOfDeletingOldCopiesAndThenCopying = (thisTaskIsDone) => {
		runTasksSequentially(
			taskNameOfDeletingFilesWithoutPrinting,
			taskNameOfCopyingFiles
		)(thisTaskIsDone);
	};

	const actionToTakeOnSourceFilesChange = (thisActionIsDone) => {
		taskBodyOfDeletingFilesWithoutPrinting(() => {
			taskBodyOfCopyingFiles(
				thisActionIsDone
			);
		});
	};





	gulp.task(
		taskNameOfDeletingFiles,
		taskBodyOfDeletingFiles
	);
	gulp.task(
		taskNameOfDeletingFilesWithoutPrinting,
		taskBodyOfDeletingFilesWithoutPrinting
	);
	gulp.task(
		taskNameOfCopyingFiles,
		taskBodyOfCopyingFiles
	);
	gulp.task(
		taskNameOfDeletingOldCopiesAndThenCopying,
		taskBodyOfDeletingOldCopiesAndThenCopying
	);





	const pipelineSettings = {
		// logging
		pipelineFullName,

		// globs of pipeline
		resolvedPathsOfGlobsToCopy,
		resolvedPathsOfGlobsToDeleteBeforeCopyingAgain,

		// globs for watching
		watchingBasePath: sourceBasePath,
		watchingGlobsRelativeToWatchingBasePath: relativeSourceGlobsToCopyPlusRelativeExcludedGlobs,

		// task names
		taskNameOfMainTask,
		taskNameOfDeletingFiles, // 或可用于完整清除所有构建输出的任务
		taskNameOfCopyingFiles: taskNameOfDeletingOldCopiesAndThenCopying,

		// task bodies
		toClean: taskBodyOfDeletingFiles,
		toCopy:  taskBodyOfDeletingOldCopiesAndThenCopying,

		actionToTakeOnSourceFilesChange, // 显然，这是针对【文件变动监测机制】的
	};




	return pipelineSettings;
}