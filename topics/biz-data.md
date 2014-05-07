# Biz Data

## Summary
dataServices：帮助业务模块中的 controllers 处理业务资源相关的请求，模式和接口统一

## Why
不同的业务模块使用不同的后端的数据，现在的架构在通信层已经是统一的数据 HTTP API模式（并且附带authentication, pagination等），但是各个业务模块在使用的各个资源的 endpoint 的时候，仍然是手动意义上的使用$http. 后续的改进方案是

- 把每个业务模式相关的 http 请求（或后续的本地数据）组成的 model层，统一抽入到 servives.js 中统一以 promise 的形式提供
- 在 global $http 添加如下interceptor： pagination, projection, embedded docuemnt等请求改造方式
- Nice to have: 把以上的逻辑， 抽取到 base 下http api 模块中， 甚至以 devcenter javascript api sdk 的方式提供

## 参考链接

- [ngDropbox - http api sdk](https://github.com/christiansmith/ngDropbox)
- [flexible http mode @Eve](http://python-eve.org/features.html)