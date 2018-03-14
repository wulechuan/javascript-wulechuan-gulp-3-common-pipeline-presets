const gulp = require('gulp');
const concatFiles = require('gulp-concat');
const uglifyJavascript = require('gulp-uglify');
const pump = require('pump');

const printCompletionOfOneTask          = require('../utilities/_generic/print-one-task-done');
const printGulpUglifyJsErrorBeautifully = require('@wulechuan/javascript-gulp-plugin-error-printer');

module.exports = function createTaskBodyForCompilingJS(sourceGlobsOfJavascript, options) {
	const {
		taskNameForLogs = '',
		compiledJavascriptOutputFolder,
		compiledJavascriptFileBaseName,
		basePathForShorteningPathsInLog,
		shouldNotGenerateMinifiedVersions = false,
	} = options;

	return (thisTaskIsDone) => {
		const taskSteps = [];

		taskSteps.push(gulp.src(sourceGlobsOfJavascript));
		taskSteps.push(concatFiles(`${compiledJavascriptFileBaseName}.js`));
		taskSteps.push(gulp.dest(compiledJavascriptOutputFolder));

		if (! shouldNotGenerateMinifiedVersions) {
			// 故意不借用上文已有的、拼接好的 js 文件，
			// 是为了在编译出错时，能准确看到哪一个 js 文件的哪一行出错。
			taskSteps.push(gulp.src(sourceGlobsOfJavascript));
			taskSteps.push(uglifyJavascript());
			taskSteps.push(concatFiles(`${compiledJavascriptFileBaseName}.min.js`));
			taskSteps.push(gulp.dest(compiledJavascriptOutputFolder));
		}

		pump(taskSteps, (error) => {
			if (error) {
				printGulpUglifyJsErrorBeautifully(error, basePathForShorteningPathsInLog);
			}

			printCompletionOfOneTask(`${taskNameForLogs}: concatenation`, !!error);
			thisTaskIsDone();
		});
	};
};