import PttApp from './PttApp.vue'
import PttAppButton from './PttAppButton.vue'
import { store } from './store/store'
let appinscount = 0
/**
 *
 * @param {*} chatContainer
 * @param {*} isWhitetheme
 * @param {*} isStreaming
 * @param {*} messagePoster
 */
export default function InitApp (
  chatContainer,
  isWhitetheme,
  isStreaming,
  messagePoster,
  siteName
) {
  // generate crypt key everytime;
  InitChatApp(chatContainer)
  function InitChatApp (cn) {
    /* -----------------------------------preInitApp----------------------------------- */
    // init property
    const ele = document.createElement('div')
    ele.id = 'PTTChat'
    ele.setAttribute('style', 'z-index: 301;')
    if (cn) cn[0].appendChild(ele)
    const bootsrtapicon = document.createElement('link')
    bootsrtapicon.setAttribute('rel', 'stylesheet')
    bootsrtapicon.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css')
    if (cn) cn[0].appendChild(bootsrtapicon)

    const themewhite = 'pttbgc-19 pttc-5'
    const themedark = 'pttbgc-2 pttc-2'

    console.log('Instance PTTChatOnYT App, index', appinscount)
    const PTT = new Vue({
      el: '#PTTChat',
      store,
      components: {
        PTTAppBtn: PttAppButton,
        PTTApp: PttApp
      },
      provide: function () {
        return {
          msg: this.rootmsg,
          isStream: isStreaming,
          nowPluginWidth: GM_getValue('PluginWidth', 400)
        }
      },
      data () {
        return {
          index: appinscount,
          rootmsg: messagePoster,
          player: document.getElementsByTagName('video')[0],
          playertime: null,
          exist: null,
          customPluginSettingListenerId: 0
        }
      },
      computed: {
        classes: function () {
          const classes = ['position-absolute', 'w-100']
          if (reportMode) console.log('Appindex set theme', this.getTheme)
          switch (+this.getTheme) {
            case 0:
              if (isWhitetheme) classes.push(themewhite)
              else classes.push(themedark)
              break
            case 1:
              classes.push(themewhite)
              break
            case 2:
              classes.push(themedark)
              break
            case 3:
              classes.push('pttbgc-' + this.getThemeColorBG)
              classes.push('pttc-' + (10 - this.getThemeColorBorder))
              break
            default:
              break
          }
          return classes.join(' ')
        },
        ...Vuex.mapGetters([
          'getTheme',
          'getThemeColorBG',
          'getThemeColorBorder'
        ])
      },
      mounted () {
        this.$store.dispatch('updateLog', { type: 'videoType', data: isStreaming ? '實況' : '影片' })
        this.customPluginSettingListenerId = GM_addValueChangeListener('menuCommand-customPluginSetting-' + siteName,
          (name, oldValue, newValue, remote) => this.$store.dispatch('setCustomPluginSetting', newValue)
        )
        this.$store.dispatch('setSiteName', siteName)
        this.$store.dispatch('setCustomPluginSetting', GM_getValue('menuCommand-customPluginSetting-' + siteName, false))
        console.log('dispatch setCustomPluginSetting', GM_getValue('menuCommand-customPluginSetting-' + siteName, false))
        appinscount++
        this.playertime = window.setInterval(() => {
          if (this.player) {
            this.$store.dispatch('updateVideoPlayedTime', this.player.currentTime)
          } else clearInterval(this.playertime)
        }, 1000)
        this.exist = window.setInterval(() => {
          const self = document.querySelector('#PTTChat[ins="' + this.index + '"')
          if (!self) {
            console.log('Instance ' + this.index + ' destroyed.')
            PTT.$destroy()
          } else {
            // console.log("Instance " + this.index + " alive.");
          }
        }, 1000)
        this.$store.dispatch('isStream', isStreaming)
        if (!isStreaming) {
          try {
            const videoinfo = JSON.parse(document.getElementById('scriptTag').innerHTML)
            if (reportMode) console.log('videoinfo', videoinfo)
            const startDate = new Date(videoinfo.publication[0].startDate)
            if (reportMode) console.log('startDate', startDate)
            this.$store.dispatch('updateVideoStartDate', startDate)
          } catch (e) {
            console.log(e)
          }
        }
        this.rootmsg.pttState = data => { this.$store.dispatch('pttState', data) }
      },
      beforeDestroy () {
        GM_removeValueChangeListener(this.customPluginSettingListenerId)
        clearInterval(this.playertime)
        clearInterval(this.exist)
      },

      template: `<div id="PTTChat" :class="classes" :ins="index">
      <PTTAppBtn></PTTAppBtn>
      <PTTApp></PTTApp>
    </div>`
    })
  }
}
