<link rel="stylesheet" href="../node_modules/@wulechuan/css-stylus-markdown-themes/dist/default.css">




# API
This is the API references for npmjs package `@wulechuan/gulp-3-common-pipeline-presets`.
See [Readme.md](../ReadMe.md).



## Task Creators

### Available Task Creators

#### Copying-files Task Creator

-   arguments[0]: `sourceGlobsToCopy` : `String` or `Array`
	**Required**.

-   arguments[1]: `outputFolderPath` : `String`
	**Required**.

-   arguments[2]: `options` : `object` or `null`
    **Optional**.

	```javascript
	let options = {
		/* Just for logging */
		logPrefix = 'Unspeficied task',

		/* `true` to log more details. */
		shouldNotLogDetails = false,

		/* If detail logging is allowed,
		 * and this one being `true`,
		 * then every single involved file will be logged. */
		shouldListSourceFiles = true,

		/* If detail logging is allowed
		 * While listing source files is **not** allowed,
		 * then this string will be logged, just for human
		 * to easier undertand what's going on. */
		descriptionOfAssetsToCopy = '',

		shouldFlattenSubFolders = false,

		/* For example: '.html' */
		outputFileTypeWithDot = null,

		/* For example: 'default' */
		forSingleInputFileChangeOuputFileBaseNameInto = '',
	};
	```

#### CSS-Stylus-compilation Task Creator

-   arguments[0]: `entryStylusGlobs` : `String` or `Array`
    **Required**.

	All `.styl` files that are treated as compilation entries.

-   arguments[1]: `options` : `Object`
    **Required**.

	```javascript
	let options = {
		taskNameForLogs = '',
		compiledCSSOutputFolder,
		compiledCSSFileBaseName,
		basePathForShorteningPathsInLog,
		shouldNotGenerateMinifiedVersions = false,
	}
	```

	> Note
	> that the **non-minified** css
	> is **always** generated.

#### JavaScript-concatenation Task Creator

-   arguments[0]: `sourceGlobsOfJavascript` : `String` or `Array`
    **Required**.

	All `.js` files to concatenate into a single output js file.

-   arguments[0]: `options` : `Object`
    **Required**.

	```javascript
	{
		taskNameForLogs = '',
		compiledJavascriptOutputFolder,
		compiledJavascriptFileBaseName,
		basePathForShorteningPathsInLog,
		shouldNotGenerateMinifiedVersions = false,
	}
	```

	> Note
	> that the **non-minified** js
	> is **always** generated.





## Pipeline Creators

### Availabe Pipeline Creators

#### Copying Files Pipeline Creator

-   arguments[0]: `options` : `Object`
    **Required**.

	```javascript
	let options = {
		/* logging */

		/* e.g. 'Page: User Dashboard' or maybe just 'App' */
		taskNameKeyPart,

		/* e.g. 'front-end/source/js' or 'front-end/source',
		 * basically any path you prefer. */
		basePathForShorteningPathsInLog = '',



		/* source */

		/* e.g. 'front-end/source/js' */
		sourceBasePath = process.pwd(),

		// e.g. [ '**/*.js' ]
		globsToCopyRelativeToSoureBasePath,

		/* e.g. [ 'd:/projects/something/**.* '],
		 * An excluded glob can be either an absolute one or a relative one.
		 * If an excluded glob is a relative one,
		 * then it's assumed that
		 * the reference base path is the `sourceBasePath`. */
		globsToExclude,



		/* output */

		/* e.g. '../static' or 'dist/assets' */
		outputBasePath,

		/* Optional.
		 * If the output file set is difficault to determine by computer,
		 * simply provide them here. 
		 * For example: it is not so easy to track whether there will be
		 * only one output file, thus is difficault to tell whether the
		 * output file(s) are renamed. */
		globsOfOutputFilesRelativeToOuputBasePath,



		/* copying */

		/* This will be directly passed to
		 * the instance of the copying files task. */
		optionsOfCopyingFiles,
	}
	```


#### Generic Skeleton For Building Pipelines Creator

-   arguments[0]: `options` : `Object`
    **Required**.
	```javascript
	let options = {
		/* logging */

		/* e.g. 'Javascript' or '爪哇脚本'.
		 * Basically any non-empty string you prefer. */
		pipelineCategory,


		/* e.g. 'Page: User Dashboard' or maybe just 'App'
		 * Basically any non-empty string you prefer. */
		taskNameKeyPart,


		/* e.g. 'front-end/source/js', or 'front-end/source'.
		 * Basically any path you prefer. */
		basePathForShorteningPathsInLog = '',



		/* source */

		/* e.g. 'front-end/source/js' */
		sourceBasePath = process.pwd(),


		// e.g. [ '**/*.js' ]
		buildingEntryGlobsRelativeToSourceBasePath,

		watchingBasePath,

		// e.g. [ '**/*.js' ]
		watchingGlobsRelativeToWatchingBasePath,



		/* building */

		/* e.g. '../static' or 'dist/assets' */
		outputBasePathOfBuilding,

		builtGlobsRelativeToOutputBasePathOfBuilding = [],

		/* A function to create another function,
		 * the created function will be used
		 * as the task body of the building process
		 * upon source globs. */
		toCreateBuildingTaskBody,



		/* copying */

		shouldCopyBuiltFileToElsewhere = false,

		/* e.g. 'build/tryout-website/assets' */
		outputBasePathOfCopying,

		/* This will be directly passed to
		 * the instance of the copying files task. */
		optionsOfCopyingFiles,
	}
	```

#### CSS Stylus Compilation Pipeline Creator

-   arguments[0]: `options` : `Object`
    **Required**.

	```javascript
	{
		/* logging */

		taskNameKeyPart,
		basePathForShorteningPathsInLog,         /* optional */



		/* sources */

		sourceBasePath,
		buildingEntryGlobsRelativeToSourceBasePath,
		watchingBasePath,
		watchingGlobsRelativeToWatchingBasePath, /* optional */



		/* building */

		outputBasePathOfBuilding,
		builtSingleFileBaseName,
		shouldNotGenerateMinifiedVersions = false,



		/* copying */

		shouldCopyBuiltFileToElsewhere = false,
		outputBasePathOfCopying,                 /* optional */
		optionsOfCopyingFiles,                   /* optional */
	}
	```


#### Javascript Concatenation Pipeline Creator

-   arguments[0]: `options` : `Object`
    **Required**

	```javascript
	{
		/* logging */

		taskNameKeyPart,
		basePathForShorteningPathsInLog,            /* optional */



		/* sources */

		sourceBasePath,
		buildingEntryGlobsRelativeToSourceBasePath, /* optional */
		watchingBasePath,                           /* optional */
		watchingGlobsRelativeToWatchingBasePath,    /* optional */



		/* building */

		outputBasePathOfBuilding,
		builtSingleFileBaseName,
		shouldNotGenerateMinifiedVersions = false,



		/* copying */

		shouldCopyBuiltFileToElsewhere = false,
		outputBasePathOfCopying,                    /* optional */
		optionsOfCopyingFiles,                      /* optional */
	}
	```

	> Note
	> that the **non-minified** js
	> is **always** generated.








## Pipeline Objects

Pipelines, aka pipeline objects are created by pipeline creators.
So these pipeline objects are `return`ed **outputs**, and should be
distinguished from those objects as arguments of pipeline creators,
which obviousely are **inputs** of those creators.


### Pipeline Objects Common APIs

Any given pipeline object
always contains these properties:

1.  `pipelineFullName`  
    A descriptive name for logging messages or errors
    in the console.

1.  `watchingBasePath` and `watchingGlobsRelativeToWatchingBasePath`  
    A pair of properties together build up
    those globs for watching.

1.  `actionToTakeOnSourceFilesChange`  
    A `Function` being the action to trigger
	whenever a change or several changes happen
	to those files covered in the globs metioned in (2).

1.  A task for deleting all those built files during the last run of the pipeline.

    -   The task name stores in the `taskNameofDeletingFiles` property
	    of the pipeline object.

	-   The task body function stores in the `toClean` property
	    of the pipeline object.

1.  `taskNameOfMainTask`  
    The name of the so-called main task.

	> The main task's body function
	> is also stores in the pipeline object,
	> but in variant property names
	> across different pipeline types.



### Specific Pipeline Objects

#### The Copying Files Pipeline Object

```javascript
const pipeline = {
	/* logging */
	pipelineFullName,


	/* globs of pipeline */
	resolvedPathsOfGlobsToCopy,
	resolvedPathsOfGlobsToDeleteBeforeCopyingAgain,


	/* globs for watching */
	watchingBasePath,
	watchingGlobsRelativeToWatchingBasePath,


	/* task names */
	taskNameOfMainTask,
	taskNameOfDeletingFiles,
	taskNameOfCopyingFiles,


	/* task bodies */
	toClean,
	toCopy,


	/* Obviously this is the action
	 * to trigger on watched changes. */
	actionToTakeOnSourceFilesChange,
};
```


#### The CSS Stylus Compilation Pipeline Object, and the Javascript Concatenation Pipeline Object

```javascript
const pipeline = {
	/* logging */
	pipelineFullName,


	/* globs of pipeline */
	resolvedPathsOfEntryGlobsForBuilding,
	resolvedPathsOfBuiltGlobs,
	resolvedPathsOfGlobsToDeleteBeforeEachBuild,


	/* globs for watching */
	watchingBasePath,
	watchingGlobsRelativeToWatchingBasePath,


	/* task names */
	taskNameOfMainTask,
	taskNameOfDeletingFiles,
	taskNameOfBuilding: taskNameOfDeletingOldOutputFilesAndThenBuilding,


	/* task bodies */
	toClean: taskBodyOfDeletingFiles,
	toBuild: taskBodyOfDeletingOldOutputFilesAndThenBuilding,


	/* Obviously this is the action
	 * to trigger on watched changes. */
	actionToTakeOnSourceFilesChange,


	/* These properties are available
	 * if and only if copying file task is allowed. */
	resolvedPathsOfGlobsToCopyAfterEachBuild,
	resolvedPathsOfCopiesOfBuiltGlobs,
	taskNameOfBuildingAndThenCopying,
};
```





# See Also
- [Read Me](../ReadMe.md)
- [User Guide](./User-Guide.md)