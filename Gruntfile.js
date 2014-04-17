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


        watch: {
            markdown: {
                options: {
                    livereload: 35729
                },
                files: ['*.md', 'app/*.md'],
                tasks: ['concat']
            }
        },

        connect: {
            options: {
                port: 8080,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729,
                open: true
            },
            markdown: {
                options: {
                    port: 9001,
                    base: ['./']
                }
            },
        },

        // TODO: add process for normal REAMDME.md
        concat: {
            outputmd: {
                options: {
                    separator: '\n---\n\n',
                    process: function(src, filepath) {
                        console.log(filepath);
                        return src
                            .replace(/\n\n\n/g, '\n\n----\n\n')
                            .replace(/\\</g, '**『').replace(/\\>/g, '』**');
                    }
                },
                src: ['README.md', '*.md', 'app/*.md'],
                dest: 'dist/all.md'
            }
        }
    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Run tests
    grunt.registerTask('build', ['concat']);
    grunt.registerTask('serve', ['connect', 'concat', 'watch']);
};