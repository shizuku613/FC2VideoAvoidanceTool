FC2 Video Avoidance Tool
==================
<!--
[![Build Status](https://travis-ci.org/shizuku613/NosubDownloader.svg?branch=master)](https://travis-ci.org/shizuku613/NosubDownloader)
-->

## Development environment
* TypeScript
* Node.js & NPM
* Visual Studio 2013
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)
* [tsd](http://definitelytyped.org/tsd/)

<!--
* [Travis CI](https://travis-ci.org)
-->

## Used library
* [Underscore.js](http://underscorejs.org)
* [md5.js](http://labs.cybozu.co.jp/blog/mitsunari/2007/07/md5js_1.html)

## How to build
You must install Node.js and NPM before to build this project.

### Install build tools
```
npm install bower -g
npm install grunt-cli -g
npm install tsd -g
```

### Install usage library
```
npm install
bower install
tsd reinstall
```

### Compile
```
grunt build
```

### Test (Not implemented)
```
grunt test
```


## License
* MIT License
* Copyright (c) 2014 KONO Shizuku