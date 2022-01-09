/**
 * @enum {number}
 * @readonly
 */
export const FrameState = Object.freeze({
  login: 0,
  main: 1,
  board: 2,
  firstPageofPost: 3,
  otherPageofPost: 4,
  boardInfo: 5
})
/**
 * @typedef {Object} PttState
 * @property {boolean} connection
 * @property {boolean} login
 * @property {boolean} lock
 * @property {boolean} screenUpdated
 * @property {number} lastUpdateTime
 * @property {FrameState} frame
 * @property {string[]} screen
 * @property {boolean} serverfull
 * @property {number} reconnectTime
 * @property {boolean} deleteOtherConnection
 */

/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @return {PttState}
 */
export function PttState () {
  return {
    connection: true, // 自動 連線狀態
    login: false, // 自動 登入狀態
    lock: false, // 手動 任務是否執行中
    screenUpdated: false, // 自動
    lastUpdateTime: 0, // 自動 最後更新時間
    frame: 0, // 自動 PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
    screen: [], // 自動 畫面資料
    serverfull: false,
    reconnectTime: 10,
    deleteOtherConnection: false
  }
}
