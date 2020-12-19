import { globalvar } from './globlevariable.js';
import { MessagePoster } from './MessagePoster.js';
import { HerfFilter } from './HerfFilter.js';
import { Bootstrap } from './BootStrap.js';

import { app } from './app/appindex.js';
import { lib } from './library.js';
'use strict';
(function () {
  let msg = new MessagePoster;

  HerfFilter(msg);

})()