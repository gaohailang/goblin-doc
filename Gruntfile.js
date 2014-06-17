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
                files: ['*.md', 'app/*.md', 'topics/*.md'],
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
                src: ['README.md', '*.md', 'app/*.md', 'topics/*.md'],
                dest: 'dist/all.md'
            }
        },
    });

    grunt.registerTask('build-readme', 'extract title and summary from topics directory to append to readme.md', function() {
        // got [{title: '', summary: '', link: ''}]
        // var done = this.async();

        var distillDict = [];
        var titleSummaryTemp;
        grunt.file.recurse('./topics', function(fileSrc) {
            // grunt.file.recurse('./topics', function(){console.log(arguments)}) to sniffer arguments
            content = grunt.file.read(fileSrc);
            titleSummaryTemp = content.split('\n').slice(0, 2);
            distillDict.push({
                link: fileSrc,
                title: titleSummaryTemp[0],
                summary: titleSummaryTemp[1]
            });
        });

        var itemTpl = '[<%= title %>](<%= link %>): <%= summary %>';
        var allItemStr = '';
        distillDict.forEach(function(val, idx) {
            allItemStr += grunt.template.process(itemTpl, {
                data: val
            }) + '\n';
        });
        console.log(allItemStr);

        // append to readme.md
        readmeContent = grunt.file.read('readme.md');
        // console.log(readmeContent.replace(/### Topics\n.*(?=\n\n### TODO)/, '### Topics\n' + allItemStr));
    });

    grunt.registerTask('asyncfoo', 'My "asyncfoo" task.', function() {
        // Force task into async mode and grab a handle to the "done" function.
        var done = this.async();
        // Run some sync stuff.
        grunt.log.writeln('Processing task...');
        // And some async stuff.
        setTimeout(function() {
            grunt.log.writeln('All done!');
            done();
        }, 2000);
    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Run tests
    grunt.registerTask('build', ['concat']);
    grunt.registerTask('serve', ['connect', 'concat', 'watch']);
};