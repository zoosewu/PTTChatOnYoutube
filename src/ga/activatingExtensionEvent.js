import gaPush from './setvalue'
export default function () {
  const GaInstalledEventTime = 'GaInstalledEventTime'
  const lastEventTime = +GM_getValue(GaInstalledEventTime, 0)
  const now = Date.now()
  if (now - lastEventTime >= 1000 * 60 * 60 * 24) {
    GM_setValue(GaInstalledEventTime, now)
    gaPush({ event: 'activatingExtension' })
  }
}
