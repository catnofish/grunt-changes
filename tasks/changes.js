/*
 * grunt-changes
 * https://github.com/catnofish/grunt-changes
 *
 * Copyright (c) 2013 Herk Lee
 * Licensed under the MIT license.
 * https://github.com/catnofish/grunt-changes
 */

'use strict';

module.exports = function (grunt) {
	var crypto = require('crypto'),
		path = require('path');

	grunt.registerMultiTask('changes', 'Filter the changed files to a specify directory.', function () {
		var options = this.options({
				length: 32,
				hashmap: '.hash'
			}),
			hashmapPath = options.hashmap,
			hashmap = grunt.file.exists(hashmapPath) ? grunt.file.readJSON(hashmapPath) : {}, // Read the backup hash or empty
			fileList = [], // Save current files's hash
			changeList = [], v;

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			f.src.filter(function (filepath) { // Ignore dirs
				return !grunt.file.isDir(filepath);
			}).forEach(function(src) {
					var source = grunt.file.read(src, { encoding: null }),
						hash = crypto.createHash('md5').update(source).digest('hex').slice(0, options.length);

					fileList.push({
						src: src,
						hash: hash,
						dest: f.dest
					});
				});
		});

		// Filter the changes
		fileList.forEach(function(file) {
			v = file.hash;
			if ( v == undefined || v != hashmap[file.src] ) {
				changeList.push(file);
			}
		});

		if ( changeList.length > 0 ) {
			var tmpHash = {};
			// Copy changed files
			changeList.forEach(function(file) {
				grunt.file.copy(file.src,file.dest);
				grunt.log.writeln('Detect file ' + file.src.cyan + ' has been changed.');
				tmpHash[file.src] = file.hash;
			});

			grunt.file.write(hashmapPath, JSON.stringify(tmpHash));
			grunt.log.writeln('Hashmap ' + hashmapPath.cyan + ' created/updated.');
		} else {
			grunt.log.writeln('No file has been changed, do nothing.');
		}
	});

};