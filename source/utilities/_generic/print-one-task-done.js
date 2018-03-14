const chalk = require('chalk');

function formatTimestamp(timestamp) {
	const dateObjectOfTheTime = new Date(timestamp);

	const hours   = dateObjectOfTheTime.getHours();
	const minutes = dateObjectOfTheTime.getMinutes();
	const seconds = dateObjectOfTheTime.getSeconds();

	return [
		hours   < 10 ? `0${hours}`   : `${hours}`,
		minutes < 10 ? `0${minutes}` : `${minutes}`,
		seconds < 10 ? `0${seconds}` : `${seconds}`,
	].join(':');
}


module.exports = function printCompletionOfOneTask(taskDescription = 'Unspecified Task', errorOccured) {
	errorOccured = !!errorOccured;
	const symbol     = errorOccured ? ' ╳ '               : ' ♥ ';
	const conclusion = errorOccured ? ' DONE with ERROR ' : ' DONE ';

	const symbolColor        = errorOccured ? 'black'     : 'red';
	const symbolBgColor      = errorOccured ? 'bgRed'     : 'bgMagenta';

	const descriptionColor   = errorOccured ? 'black'     : 'black';
	const descriptionBGColor = errorOccured ? 'bgMagenta' : 'bgWhite';

	const conclusionColor    = errorOccured ? 'black'     : 'black';
	const conclusionBgColor  = errorOccured ? 'bgYellow'  : 'bgGreen';

	console.log(`${
		chalk.gray(formatTimestamp(Date.now()))
	} ${
		chalk[symbolBgColor][symbolColor](symbol)
	}${
		chalk[descriptionBGColor][descriptionColor](` ${taskDescription} `)
	}${
		chalk[conclusionBgColor][conclusionColor](conclusion)
	} ${chalk.gray('~')}`);

	console.log('\n'.repeat(errorOccured ? 4 : 0));
};