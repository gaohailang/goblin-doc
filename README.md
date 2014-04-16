Goblin 项目 总结

整个项目先按照代码类型划分：
scripts,
templates
styles(包含images)

各个类型的代码分为：
base
<app>

base代码：
基础样式：：
Adonis
component：
base: 设置全局的字体，颜色link，等
ng-animate：angular下动画hover(如.ng-animate-fadedown{.ng-enter, .ng-leave} 等)
form 组件的样式
dropdown, bubble, popup, help-tips，
protocol, step-progress-bar, icon, tab-btn, 

基础模板：
财务信息模板，分页，导航， 步骤条， 帐号avataor & menu， date range picker等 

基础脚本：
pmtAccount,
pmtHttp
pmtDirectives - 给之前的模板封装成directive并且加入controller 或者dom linker 函数
pmtUploader -> 封装fineuploader jquery插件为支持promise的上传组件
pmtFilters - 全局使用的filters: humanBytes, percentage， 
pmtPagination, pmtBusyDirective, pmtFinancial, pmtAlert（复杂的组件包含directive, service[如addAlert etc]）


业务<app>代码：
account 帐号创建和设置
ad 广告创建
admanagement 广告管理和数据
app 应用上传
charge - 账单 （申请充值和发票）
clearing - 结算（结算单和财务信息修改）
console - 单机联运和管理
home - 首页（我的应用，各应用统计数据）
network - 网盟广告（创建和管理）
online - 网游联运创建
opmanagement - 网游管理（SDK下的订单查询，成功失败订单，等）
package - 礼包创建

vender - 第三方非bower管理的library
config.js - 给require.js 用的配置文件


业务<app>代码组成： 举例network, home
styles/home.scss
scripts/home/
index.js
services.js
directives.js
routes.js
templates:


开发，构建，发布 - build & deploy & develop
Gruntfile.js重构，抽出配置信息到gruntUitls.js中（如copy, replace, requirejs, connect settings(proxy, modRewrite等)）
优化GAsnippet, FrameworkSnippet 到单独文件 - deploy和develop分别通过replace（对于framework.js的构建的hack）和connectInject插入


专题Spec:
httpAuth
form validate （420， message directive和 input设置） - 高阶情况下的优化（pmtScreenShowcase）
GA 植入的策略
局部directive和外围通信
dataServices 帮助controllers处理 业务资源请求和修改的http请求

TODO:
keep your word! - 把一些设想的，但没有实施的很好的，去实施！
把这篇简要的文档， 改成markdown 形式， 修饰下。
更酷炫的见reveal.js中的效果
