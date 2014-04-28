# Goblin 项目 总结

### 整个项目先按照代码类型划分：
- templates
- scripts
- styles(包含images)

### 各个类型的代码分为：
- base
- **『app』** - 具体业务模块

----

### base代码：
- [基础样式](styles.md)
    - Adonis
    - component
        - base - 设置全局的字体，颜色link，等
        - ng-animate - angular's animation hook
        - form 
        - `BASIC UI COMPONENT` dropdown, bubble, popup, help-tips，等
        - `DEVCENTER UI COMPONENT` protocol, step-progress-bar, icon, tab-btn, 等
- 基础模板 - 财务信息模板，分页，导航， 步骤条， 帐号avataor & menu， date range picker等 
- 基础脚本
    - pmtAccount
    - pmtHttp
    - pmtDirectives - 给之前的模板封装成directive并且加入controller 或者dom linker 函数
    - pmtUploader -> 封装fineuploader jquery插件为支持promise的上传组件
    - pmtFilters - 全局使用的filters: humanBytes, percentage， 
    - pmtPagination
    - pmtBusyDirective
    - pmtFinancial
    - pmtAlert（复杂的组件包含directive, service[如addAlert etc]）

----

### 业务 **『app』**代码：
- account 帐号创建和设置
- ad 广告创建
- admanagement 广告管理和数据
- app 应用上传
- charge - 账单 （申请充值和发票）
- clearing - 结算（结算单和财务信息修改）
- console - 单机联运和管理
- [home](app/home.md) - 首页（我的应用，各应用统计数据）
- network - 网盟广告（创建和管理）
- online - 网游联运创建
- open - oem 厂商的配置后台
- opmanagement - 网游管理（SDK下的订单查询，成功失败订单，等）
- package - 礼包创建

### 其他代码：
- vender - 第三方非bower管理的library
- config.js - 给require.js 用的配置文件

----

### 业务**『app』**代码组成：(举例network, home)
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

----

### build & deploy & develop 开发，构建，发布
- 配置抽取： 抽出配置信息到gruntUitls.js中（如copy, replace, requirejs, connect settings(proxy, modRewrite等)）
- multi-index.html优化
    - snippet 插入，GAsnippet, FrameworkSnippet抽取到单独文件
        - deploy 通过`replace`（对于framework.js的构建的hack）
        - develop 通过`connectInject`插入
    - 优化usemin, useminPrepare
        - home/index.html 引入 usemin 语法来单独完成framework.js的生成，然后deploy时候其他页面通过replace前的hook取得build & reversioned filename 并且替换

----

### Spec 专题
- [httpAuth](topics/http-auth.md)
- form validate （420， message directive和 input设置）
    - 特殊的input field情况（pmtScreenShowcase）
- GA insert
- 局部directive和外围通信
- dataServices：帮助controllers处理 业务资源请求和修改的http请求

----

### TODO:
- [x] 把这篇简要的文档， 改成markdown 形式， 修饰下。
- [x] 更酷炫的见reveal.js中的效果
- [ ] keep your word! - 把一些设想的，但没有实施的很好的，去实施！


---

# DEVCENTER STYLES Explained

## Summary: 
具体罗列现有的 UI 组件和基础样式，以基础样式层， 通用 UI 层, 业务相关 UI 层[跨业务模块的 UI 组件， 单独业务专属 UI 组件]等纬度来切分整理归类现有的styles 代码。

----

## Doc Tree
```
├── styles
│   ├── Adonis
│   │   ├── _button.scss
│   │   ├── _reset.scss
│   │   ├── _standardColors.scss
│   │   └── _typography.scss
│   ├── account.scss
│   ├── ad.scss
│   ├── admanagement.scss
│   ├── app.scss
│   ├── charge.scss
│   ├── clearing.scss
│   ├── component
│   │   ├── _app-list.scss
│   │   ├── _base.scss
│   │   ├── _bubble.scss
│   │   ├── _dropdown.scss
│   │   ├── _form.scss
│   │   ├── _green-card-list.scss
│   │   ├── _green-step-list.scss
│   │   ├── _header.scss
│   │   ├── _icon.scss
│   │   ├── _ng-animate.scss
│   │   ├── _pagination.scss
│   │   ├── _popup.scss
│   │   ├── _progress.scss
│   │   ├── _protocol.scss
│   │   ├── _step-progress-bar.scss
│   │   ├── _tab-btn.scss
│   │   ├── _table.scss
│   │   ├── _tb-help-tips.scss
│   │   └── _white-box.scss
│   ├── dashboard.scss
│   ├── home.scss
│   ├── network.scss
│   ├── online.scss
│   ├── opmanagement.scss
│   ├── package.scss
│   └── solo.scss
```
---

# DEVCENTER STYLES Explained

## Doc Tree
```
templates
    ├── account
    │   ├── index.html
    │   └── partials
    │       ├── accountinfo.html
    │       └── protocol.html
    ├── ad
    │   ├── index.html
    │   └── partials
    │       ├── agreement.html
    │       ├── create.html
    │       ├── display.html
    │       ├── keyword.html
    │       └── review.html
    ├── admanagement
    │   ├── index.html
    │   └── partials
    │       ├── detail.html
    │       ├── list.html
    │       └── stats.html
    ├── app
    │   ├── index.html
    │   └── partials
    │       ├── form.html
    │       └── summary.html
    ├── base
    │   └── financial-form.html
    ├── charge
    │   ├── index.html
    │   └── partials
    │       ├── bankinfo.html
    │       ├── create.html
    │       ├── invoice.html
    │       └── list.html
    ├── clearing
    │   ├── index.html
    │   └── partials
    │       ├── statements.html
    │       └── summary.html
    ├── console
    │   ├── index.html
    │   └── partials
    │       ├── detail.html
    │       ├── fininfo.html
    │       ├── operateinfo.html
    │       ├── protocol.html
    │       ├── result.html
    │       ├── summary.html
    │       └── type.html
    ├── home
    │   ├── index.html
    │   └── partials
    │       ├── app-list.html
    │       ├── home.html
    │       ├── myapp.html
    │       ├── stats.html
    │       └── teaser.html
    ├── network
    │   ├── index.html
    │   └── partials
    │       ├── agreement.html
    │       ├── blacklist-adder.html
    │       ├── blacklist.html
    │       ├── financial.html
    │       ├── finish.html
    │       ├── network-adder.html
    │       ├── network-apk-validator.html
    │       ├── network-list.html
    │       ├── report.html
    │       ├── setting.html
    │       └── setup.html
    ├── online
    │   ├── index.html
    │   └── partials
    │       ├── agreement.html
    │       ├── approve.html
    │       ├── financials.html
    │       ├── opinfo.html
    │       ├── sdk.html
    │       ├── selftest.html
    │       └── type.html
    ├── opmanagement
    │   ├── index.html
    │   └── partials
    │       ├── detail.html
    │       ├── failedorder.html
    │       ├── finishedorder.html
    │       ├── refund.html
    │       └── searchorder.html
    └── package
        ├── index.html
        └── partials
            ├── form.html
            └── list.html
```
---

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

----

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

----

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

----

## Template Layer

----

## Scripts Layer

---

# HTTP Auth

## Summary
client-side login form when server answers: status 401
for every /resources/* call, if user is not authorized, response a 401 status.
http://espeo.pl/authentication-in-angularjs-application/
[Reference](http://espeo.pl/authentication-in-angularjs-application/)

## Why
capture 401 response
save the request parameters, so in the future we can reconstruct original request,
create and return new object representing server’s future answer (instead of returning the original failed response),
broadcast that login is required, so application can react, in particular login form can appear,
listen to login successful events, so we can gather all the saved request parameters, resend them again and trigger all the ‚future’ objects (returned previously).

[Github](https://github.com/witoldsz/angular-http-auth)