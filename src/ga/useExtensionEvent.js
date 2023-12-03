import gaPush from './setvalue'
export default function () {
  const useExtensionEventTime = 'useExtensionEventTime'
  const lastEventTime = +GM_getValue(useExtensionEventTime, 0)
  const now = Date.now()
  if (now - lastEventTime >= 1000 * 60 * 60 * 24) {
    GM_setValue(useExtensionEventTime, now)
    gaPush({ event: 'useExtension' })
  }
}
