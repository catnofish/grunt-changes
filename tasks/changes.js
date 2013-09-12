/*
 * grunt-changes
 * https://github.com/catnofish/grunt-changes
 *
 * Copyright (c) 2013 Herk Lee
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
	var crypto = require('crypto'),
		path = require('path');

	grunt.registerMultiTask('changes', 'Filter the changed files to a specify directory.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			length: 32,
			hashmap: '.hash',
			temp: '.tmp'
		});

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			var src = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).forEach(function(src) {

			});

			// Handle options.
			src += options.punctuation;

			// Write the destination file.
			grunt.file.write(f.dest, src);

			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});

};
