## preload data with loading
加载完初始数据后再跳转，并且合理的引入indicator

### 目前解决：
1 单一http api， 会在config中加上global: true，这样http interceptor后，request时会显示全局的loading indicaotr, 在response后会隐藏掉。

2 多个http api, 使用<div ng-show="isLoadResource1 && isLoadResource1"> 去实现

### 解决方案：

在每个模块的index.html中引入.<!-- PMT-LOADING --> - 通过partial构建方法

```html
<ng-view></ng-view>

<div class="modal" ng-show="loadingView">
  <ul id="loading">
    <li class="bar" ng-repeat="i in [0,1,2,3,4,5,6,7,8,9]"></li>
  </ul>
</div>
```

在common.js中引入 (common.js 是每个模块的index.js 都会require的通用逻辑，譬如一些跨模块用的工具方法，绑定在$root下)

```js
var app = angular.module('pmt-common');
app.run(['$rootScope', function($root) {
    $root.$on('$routeChangeStart', function(e, curr, prev) { 
        if (curr.$$route && curr.$$route.resolve) {
            // Show a loading message until promises are not resolved
            $root.loadingView = true;
        }
    });
    $root.$on('$routeChangeSuccess', function(e, curr, prev) { 
        // Hide loading message
        $root.loadingView = false;
    });
}]);
```

然后在routes.js中什么resolve，定义依赖的数据和使用service去触发取得数据，在controller中，引入被依赖的数据

```js
$routeProvider.when('/library', {
    templateUrl: 'partials/library.html',
    controller: 'LibraryCtrl',
    resolve: {
        books: function(srvLibrary) {
            return srvLibrary.getBooks();
        },
        movies: function(srvLibrary) {
            return srvLibrary.getMovies();
        }
    }
});
angular.module('myApp.services', []).factory('srvLibrary', ['$http', function($http) {
    var sdo = {
        getBooks: function() {
            var promise = $http({ method: 'GET', url: 'api/books.php' }).success(function(data, status, headers, config) {
                return data;
            });
            return promise;
        },
        getMovies: function() {
            var promise = $http({ method: 'GET', url: 'api/movies.php' }).success(function(data, status, headers, config) {
                return data;
            });
            return promise;
        }
    }
    return sdo;
}]);
angular.module('myApp.controllers', []).controller('LibraryCtrl', 
        ['$scope', 'books', 'movies', function($scope, books, movies) {
    $scope.books = books.data;
    $scope.movies = movies.data;
}]);

```


