# HOME module Explained

## 主要罗列 HOME module 相关设计和 issues

## 代码结构
- styles/home.scss
- scripts/home/
    - index.js
    - services.js
    - directives.js
    - routes.js
- templates/home
    - app-list.html
    - home.html
    - myapp.html
    - stats.html


## 代码结构
```
styles/home.scss
scripts/home
├── directives.js
├── highcharts.js
├── index.js
├── routes.js
├── services.js
└── stats.js
templates/home
├── index.html
└── partials
    ├── app-list.html
    ├── home.html
    ├── myapp.html
    ├── stats.html
    └── teaser.html
```


## Route Layer
- '/home':
    - nickName: 'index',
    - templateUrl: - '/templates/home/partials/home.html',
    - controller: 'homeCtrl',
    - title: '开发者中心 - 豌豆荚'
- '/home/myapp':
    - nickName: 'myapp',
    - templateUrl: - '/templates/home/partials/myapp.html',
    - title: '全部应用 - 开发者中心 - 豌豆荚',
    - controller: 'myAppCtrl'
- '/app/stats/:appid':
    - nickName: 'stats',
    - templateUrl: - '/templates/home/partials/stats.html',
    - title: '应用统计 - 开发者中心 - 豌豆荚',
    - controller: 'statsCtrl',
    - reloadOnSearch: false
- '/home/operation':
    - nickName: 'opinfo',
    - templateUrl: - '/templates/home/partials/operation.html'


## Template Layer


## Scripts Layer
