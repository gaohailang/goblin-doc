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