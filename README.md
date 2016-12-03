# express-sass-middleware
A lightweight middleware for express that compiles and serves SASS or SCSS

## Installation
```sh
npm install --save express-sass-middleware
```

## Example Usage
```js
var express = require('express')
var sassMiddleware = require('express-sass-middleware')
var app = express()

app.get('/my-styles.css', sassMiddleware({
  file: './client/src/my-sass.sass', // the location of the entry point,
                                     // this can also be a directory

  watch: true,                       // whether or not to recompile on changes,
                                     //  - defaults to false

  precompile: true                   // should it be compiled on server start
                                     // or deferred to the first request
                                     //  - defaults to false

  // any other properties added will be passed down to node-sass directly
  // for example:
  outputStyle: 'compressed',
  includePaths: ['./my', './directories'],
  indentedSyntax: true,
}))
```

## Limitations
This library was designed to work well with deployment to Heroku, so the compiled
contents are stored in and served from memory, and no option is provided for a different
storage method. There is also currently no support for source maps.

## Problems or Suggestions?
Open an issue! I'll try my best to keep up with any feature requests.