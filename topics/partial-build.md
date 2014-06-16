## partial构建方法
现状是因为有些共同的东西，希望有一种方式来做到便于统一修改，减少无谓的build等.

在home模块的index.html中如下：（使得usemin构建后续js，css处理，只会编译一遍）
<!-- GA_PARTIAL -->
<!-- build:js /scripts/framework.js -->
<!-- FRAMEWORK_PARTIAL -->
<!-- endbuild -->

在其他模块中如下：
<!-- GA_PARTIAL -->

<!-- FRAMEWORK_PARTIAL -->

目前比较dirty的实现是
在development时：

```js
middleware: function(connect, options) {
    return [
        ....
        _utils.replacePartial('GA_PARTIAL', 'ga_partial.html'),
        _utils.replacePartial('FRAMEWORK_PARTIAL', 'framework_partial.html'),
        ....
    ];
}

var replacePartial = function(placeholder, filename) {
    'use strict';
    return injector(function(req, res) {
        return (/\/index.html/).test(require('url').parse(req.url).pathname);
    }, function(callback, content, req, res) {
        require('fs').readFile(filename, function(err, data) {
            var lineSeparator = /\r\n/.test(content) ? '\r\n' : '\n';
            if (err) {
                callback(err, content);
            } else {
                content = content.toString().replace('<!-- ' + placeholder + ' -->', data);
                callback(null, content);
            }
        });
    });
};
```

在deploy时：（注意，对于framework 替换的是versioned后的文件名，通过getFrameworkFilename 得到）

```js
replace: {
    framework: {
        options: {
            patterns: [{
                match: /<!-- FRAMEWORK_PARTIAL -->/,
                replacement: _utils.getFrameworkFilename
            }]
        },
        files: [{
            expand: true,
            src: ['<%= pmtPaths.dist %>/templates/**/index.html', ],
            dest: '.'
        }]
    },
    ga: {
        options: {
            patterns: [{
                match: /<!-- GA_PARTIAL -->/,
                replacement: '<%= grunt.file.read("ga_partial.html") %>'
            }],
            force: true
        },
        files: [{
            expand: true,
            src: ['<%= pmtPaths.dist %>/templates/**/index.html', ],
            dest: '.'
        }]
    }
}
```