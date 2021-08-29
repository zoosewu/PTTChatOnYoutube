export function InsFilter (fullname, reg, ownerOrigin, Initcallback) {
  return {
    Fullname: fullname,
    Reg: reg,
    ownerOrigin: ownerOrigin,
    callback: Initcallback
  }
}
