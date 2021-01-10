# userscript-builder

Simple tool for building userscript for tampermonkey.

ES6 modules are not supported.

* Simple configuration.
* Uses ES6 classes syntax.
* Support css files.
* No webpack
* No babel
* The only one third party dependency

Don't forget import css files via ```import 'some-css.css'```. Extension is required.

## Getting Started

Update Your package.json with userscript section

```bash
{
  "name": "git-name",
  "version": "0.0.0",
  "description": "Describe your user script",
  "author": "va4ok",
  "license": "MIT",
  "userscript": {
    "entry": "./src/index.js",     // Entry file
    "dev": "./dist",               // Output folder for dev builds
    "release": "./release",        // Output folder for release builds
    "fileName": "filename",        // Output filename -> filename.user.js
    "meta": {                      // Userscript meta info
      "name": "User script name",
      "namespace": "http://tampermonkey.net/",
      "homepage": "https://openuserjs.org/scripts/va4ok",
      "match": "*://*.*",
      "grant": "none",
      "require": [
        "https://some.url.1",
        "https://some.url.2"
      ]
    }
  }
}
```

Fields version, description, author, license will be used in output meta.

Default properties if not specified

```bash
  entry: './src/index.js',
  dev: './dist',
  release: './release',
  fileName: 'new-userscript'

  name: 'New Userscript',
  namespace: 'http://tampermonkey.net/',
  version: '0.0.0',
  description: 'try to take over the world!',
  author: 'You',
  match: 'http://*/*',
  grant: 'none'
```

Please visit https://www.tampermonkey.net/ for more details and options.

### Prerequisites

It works with NodeJS v10.16.0 or higher. Lower versions of NodeJS wasn't tested.

### Install

Install with npm:

```bash
npm install --save-dev userscript-builder
```

Install with yarn:

```bash
yarn add userscript-builder --dev
```

### Build options

Dev - no version changes

```bash
npm run userscript-builder --mode dev
or
npm run userscript-builder
```

Release-bugfix - bugfix version will increase and commited into package.json file

```bash
npm run userscript-builder --mode bugfix
or
npm run userscript-builder --mode bug
2.7.1 -> 2.7.2
```

Release-minor - minor version will increase and commited into package.json file

```bash
npm run userscript-builder --mode minor
or
npm run userscript-builder --mode min
2.7.1 -> 2.8.0
```

Release-major - major version will increase and commited into package.json file

```bash
npm run userscript-builder --mode major
or
npm run userscript-builder --mode maj
2.7.1 -> 3.0.0
```

## How it works

Create your entry file with selfexecuted function

```bash
import { Class1 } from './class1/class1.js';
import { StaticClass } from './static-class/static-class.js';

(function () {
  'use strict';

  const class1 = new Class1();

  class1.doSomething();
  StaticClass.saySomerthing();
})();
```

Use ES6 classes and imports to organize you code.

```bash
import { StaticClass } from './../static-class/static-class.js';
import './class1.css';

const CLASS1_CONST = 200;
 
 export class Class1 {
   doSomething() {
     console.log('Class 1');
   }
 }
```

Build your user script and publish on https://openuserjs.org

```bash
// ==UserScript==
// @name         User script name
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  description
// @author       va4ok
// @match        *://*.*
// @grant        none
// @source       git+https://github.com/va4ok/userscript-builder.git
// @license      MIT
// @homepage     https://openuserjs.org/scripts/va4ok
// @require      https://some.url.1
// @require      https://some.url.2
// ==/UserScript==

// src/static-class/static-class.js
class StaticClass {
  static saySomerthing() {
    console.log('static class method');
  }
}

// src/class1/class1.js
const CLASS1_CONST = 200;

class Class1 {
  doSomething() {
    console.log('Class 1');
  }
}

// ./src/index.js
let notificator;

(function () {
  'use strict';

  const class1 = new Class1();

  class1.doSomething();
  StaticClass.saySomerthing();
})();

// CSS injection
(function(){
  const $style = document.createElement('style');

  $style.innerHTML = `/* src/class1/class1.css */
.class1-container {
  transition: height 1s ease-out;
  background-color: #3dcd59;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  height: 0;
  z-index: 1000;
}`;
  document.body.appendChild($style);
})();
```

## Running the tests

Not implemented yet.

## Built With

* [minimist](https://github.com/substack/minimist) - Node arguments parser

## Authors

* **Oleg Vaka** - *Initial work* - [va4ok](https://github.com/va4ok)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## History

**0.3.0 - Minor changes:**
* Skip empty meta info.
* Remove ```git+``` from source.
* Remove ```default``` keyword in class declaration.
* Remove code comments in release mode.

0.2.0 - Support for arrays of meta values

0.1.6 - Default file extension .js is used if extension is not defined into import line

0.1.5 - Remove source path comments in code built in release mode

0.1.4 - Remove leading dot for entry file

0.1.3 - Build progress available for css files 

0.1.2 - Add examples

0.1.1 - Fix Current Working Directory using

0.1.0 - Dev and release modes support
