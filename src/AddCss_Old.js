import { library } from './library.js';

export function AddCss(whitetheme, colorlight, colordark) {
  //add globalcss
  let bdcolor, bgcolor, ptp, pid, ptm, pmsg, ptxt;
  if (whitetheme) {
    bdcolor = colordark; bgcolor = colorlight; ptp = "#000"; pid = "#990"; ptm = "#bbb"; pmsg = "#550"; ptxt = "#343a40";
  }
  else {
    bdcolor = colorlight; bgcolor = colordark; ptp = "#fff"; pid = "#ff6"; ptm = "#bbb"; pmsg = "#990"; ptxt = "#f8f9fa";
  }
  const PTTcss =
    //PTTmaincss
    `.ptttext { color: ` + ptxt + `; }
    .pttbg {background-color: ` + bgcolor + `; }` +
    //border
    `.border{
    border-color: ` + bdcolor + `!important;
    border-top-color: `+ bdcolor + ` !important;
    border-right-color: `+ bdcolor + ` !important;
    border-bottom-color: `+ bdcolor + ` !important;
    border-left-color: `+ bdcolor + ` !important;}` +
    //PTTpushcss
    `.pid { color: ` + pid + `; }
     .ptime { color: ` + ptm + `; }
     .pmsg { color: `+ pmsg + `; }
     .ptype { color: ` + ptp + `}`;
  //AddStyle(PTTcss);
}