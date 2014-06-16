## $http-auth serivce
实现一个优雅的401未授权data api to toggle login modal and retry all buffered http after login

### DEMO1

```js
USAGE:
(function() {
  'use strict';
  angular.module('angular-auth-demo', [
    'http-auth-interceptor',
    'content-mocks',
    'login',
    'content'
  ])
  /**
   * This directive will find itself inside HTML as a class,
   * and will remove that class, so CSS will remove loading image and show app content.
   * It is also responsible for showing/hiding login form.
   */
  .directive('authDemoApplication', function() {
    return {
      restrict: 'C',
      link: function(scope, elem, attrs) {
        //once Angular is started, remove class:
        elem.removeClass('waiting-for-angular');
        
        var login = elem.find('#login-holder');
        var main = elem.find('#content');
        
        login.hide();
        
        scope.$on('event:auth-loginRequired', function() {
          login.slideDown('slow', function() {
            main.hide();
          });
        });
        scope.$on('event:auth-loginConfirmed', function() {
          main.show();
          login.slideUp();
        });
      }
    }
  });
})();

// LOGIN.JS
(function() {
  'use strict';
  angular.module('login',['http-auth-interceptor'])
  
  .controller('LoginController', function ($scope, $http, authService) {
    $scope.submit = function() {
      $http.post('auth/login').success(function() {
        authService.loginConfirmed();
      });
    }
  });
})();

```



### Summary
client-side login form when server answers: status 401
for every /resources/* call, if user is not authorized, response a 401 status.
http://espeo.pl/authentication-in-angularjs-application/

### The goal is to be able to:

- capture 401 response,
- save the request parameters, so in the future we can reconstruct original request,
- create and return new object representing server’s future answer (instead of returning the original failed response),
- broadcast that login is required, so application can react, in particular login form can appear,
- listen to login successful events, so we can gather all the saved request parameters, resend them again and trigger all the ‚future’ objects (returned previously).

PS: 在login popup widget中，
监听住： event:auth-loginRequired，然后popup login modal。
登录成功后使用authService.loginConfirmed或者loginCancelled(它们分别放出了两个event给外部使用)

对于单页面简单的viewController中， ensureLogin().then(getAPIData) 之类的（先让它登录或者取得profile 接口后在rootScope设置的account object等）


goblin 开发者中心，之前的做法是，在interceptor的responseError中，检测401，然后内联写入的。check $rootScope.Account, 是否是开发者，是否email Validate等，后续的逻辑， 等验证成功后在reload一下！！

或者是openAuthInvoker

```js
angular.module('openAuthInvoker', ['http-auth-interceptor']).run(['$rootScope', 'authService',
    function($rootScope, authService) {
        $rootScope.on('event:auth-loginRequired', function() {
            Seapea.AccountHook.openAsync({
                name: 'login'
            }).then(function(resp) {
                $rootScope.Account = resp.data;
                // check $rootScope.Account, 是否是开发者，是否email Validate等，后续的逻辑
                // authService.loginConfirmed
            }, function() {
                // authService.loginCancelled
            });
        });
    }
]);
```

```js
(function () {
  'use strict';

  angular.module('http-auth-interceptor', ['http-auth-interceptor-buffer'])

  .factory('authService', ['$rootScope','httpBuffer', function($rootScope, httpBuffer) {
    return {
      /**
       * Call this function to indicate that authentication was successfull and trigger a
       * retry of all deferred requests.
       * @param data an optional argument to pass on to $broadcast which may be useful for
       * example if you need to pass through details of the user that was logged in
       */
      loginConfirmed: function(data, configUpdater) {
        var updater = configUpdater || function(config) {return config;};
        $rootScope.$broadcast('event:auth-loginConfirmed', data);
        httpBuffer.retryAll(updater);
      },

      /**
       * Call this function to indicate that authentication should not proceed.
       * All deferred requests will be abandoned or rejected (if reason is provided).
       * @param data an optional argument to pass on to $broadcast.
       * @param reason if provided, the requests are rejected; abandoned otherwise.
       */
      loginCancelled: function(data, reason) {
        httpBuffer.rejectAll(reason);
        $rootScope.$broadcast('event:auth-loginCancelled', data);
      }
    };
  }])

  /**
   * $http interceptor.
   * On 401 response (without 'ignoreAuthModule' option) stores the request
   * and broadcasts 'event:angular-auth-loginRequired'.
   */
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q', 'httpBuffer', function($rootScope, $q, httpBuffer) {
      return {
        responseError: function(rejection) {
          if (rejection.status === 401 && !rejection.config.ignoreAuthModule) {
            var deferred = $q.defer();
            httpBuffer.append(rejection.config, deferred);
            /*
            Seapea.AccountHook.openAsync({name: 'login'}).then(function() {
                // authService.loginConfirmed
            },function() {
                // authService.loginCancelled
            })
            */
            $rootScope.$broadcast('event:auth-loginRequired', rejection);
            return deferred.promise;
          }
          // otherwise, default behaviour
          return $q.reject(rejection);
        }
      };
    }]);
  }]);

  /**
   * Private module, a utility, required internally by 'http-auth-interceptor'.
   */
  angular.module('http-auth-interceptor-buffer', [])

  .factory('httpBuffer', ['$injector', function($injector) {
    /** Holds all the requests, so they can be re-requested in future. */
    var buffer = [];

    /** Service initialized later because of circular dependency problem. */
    var $http;

    function retryHttpRequest(config, deferred) {
      function successCallback(response) {
        deferred.resolve(response);
      }
      function errorCallback(response) {
        deferred.reject(response);
      }
      $http = $http || $injector.get('$http');
      $http(config).then(successCallback, errorCallback);
    }

    return {
      /**
       * Appends HTTP request configuration object with deferred response attached to buffer.
       */
      append: function(config, deferred) {
        buffer.push({
          config: config,
          deferred: deferred
        });
      },

      /**
       * Abandon or reject (if reason provided) all the buffered requests.
       */
      rejectAll: function(reason) {
        if (reason) {
          for (var i = 0; i < buffer.length; ++i) {
            buffer[i].deferred.reject(reason);
          }
        }
        buffer = [];
      },

      /**
       * Retries all the buffered requests clears the buffer.
       */
      retryAll: function(updater) {
        for (var i = 0; i < buffer.length; ++i) {
          retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
        }
        buffer = [];
      }
    };
  }]);
})();
```

