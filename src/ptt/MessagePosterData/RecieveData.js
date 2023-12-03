export default function RecieveData () {
  /** @type {string} */
  this.key = ''
  /** @type {string} */
  this.board = ''
  /** @type {string} */
  this.title = ''
  /** @type {string} */
  this.date = new Date(Date.now())
  /** @type {string} */
  this.endLine = 0
  /** @type {Object[]} */
  this.comments = []
  /** @type {string} */
  this.commentedText = ''
}
