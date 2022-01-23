/**
 * @typedef PttCommand
 * @property {Object} cmd
 * @property {Function} set
 * @property {Function} replace
 * @property {Function} remove
 * @property {Function} execute
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 */
export function PttCommand () {
  return {
    cmd: null,
    set: (fn, ...args) => {
      if (!this.command.cmd) {
        this.command.cmd = { fn, args }
        if (showCommand) console.log('set command', this.command.cmd)
      } else if (showCommand) {
        console.log('set command error, already exist', this.command.cmd)
      }
    },
    replace: (fn, ...args) => {
      if (!this.state.lock) return
      const lastCommand = this.command.cmd
      this.command.cmd = { fn, args }
      if (showCommand) { console.log('replace command', lastCommand, '=>', this.command.cmd) }
    },
    remove: () => {
      if (showCommand) console.log('remove command', this.command.cmd)
      this.command.cmd = null
    },
    execute: () => {
      if (!this.command.cmd) return
      const cmd = this.command.cmd
      this.command.cmd = null
      if (cmd) {
        if (reportMode) console.log('execute command:', cmd)
        cmd.fn.apply(this, cmd.args)
      }
    }
  }
}
