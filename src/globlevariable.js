'use strict';
//user log
const reportmode = true;
//all log
const showalllog = false;
//dev log
const showPTTscreen = (false || reportmode || showalllog);
const showcommand = (false || reportmode || showalllog);
const showPostMessage = (false || reportmode || showalllog);
const showonMessage = (false || reportmode || showalllog);
const showalertmsg = false || showalllog;
//dev use 
let devmode = true;
const defaultopen = false;
const disablepttframe = false;
const simulateisstreaming = false;
// add listener to get msg
let cryptkey;