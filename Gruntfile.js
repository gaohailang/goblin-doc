/* global module:false */
module.exports = function(grunt) {
    var port = grunt.option('port') || 8000;
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n' +
                ' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
                ' * http://lab.hakim.se/reveal-js\n' +
                ' * MIT licensed\n' +
                ' *\n' +
                ' * Copyright (C) 2014 Hakim El Hattab, http://hakim.se\n' +
                ' */'
        },

        // TODO: add process for normal REAMDME.md
        concat: {
            outputmd: {
                options: {
                    separator: '\n---\n\n',
                    process: function(src, filepath) {
                        return src
                            .replace(/\n\n\n/g, '\n\n---\n\n')
                            .replace(/\\</g, '**『').replace(/\\>/g, '』**');
                    }
                },
                src: ['README.md', 'styles.md', 'app/*.md'],
                dest: 'output.md'
            }
        }
    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Run tests
    grunt.registerTask('build', ['concat']);
};