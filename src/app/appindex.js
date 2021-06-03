import { PTTApp } from './PTTApp.js'
import { PTTAppBtn } from './PTTAppBtn.js'
import { store } from './store/store.js'
export function InitApp (chatcon, whitetheme, isstreaming, messageposter, dynamicPlugin = false) {
  // generate crypt key everytime;
  InitChatApp(chatcon)
  function InitChatApp (cn) {
    /* -----------------------------------preInitApp----------------------------------- */
    // init property
    const ele = document.createElement('div')
    ele.id = 'PTTChat'
    ele.setAttribute('style', 'z-index: 301;')
    if (cn) cn[0].appendChild(ele)
    // Vue.prototype.$bus = new Vue();
    const themewhite = 'pttbgc-19 pttc-5'
    const themedark = 'pttbgc-2 pttc-2'
    // const color = whitetheme ? 'pttbgc-19 pttc-5' : 'pttbgc-2 pttc-2'
    console.log('Instance PTTChatOnYT App, index', appinscount)
    const PTT = new Vue({
      el: '#PTTChat',

      store,
      components: {
        PTTAppBtn: PTTAppBtn,
        PTTApp: PTTApp
      },
      provide: function () {
        return {
          msg: this.rootmsg,
          isStream: isstreaming,
          nowPluginWidth: cn[0].offsetWidth,
          dynamicPlugin: dynamicPlugin
        }
      },
      data () {
        return {
          index: appinscount,
          rootmsg: messageposter,
          player: document.getElementsByTagName('video')[0],
          playertime: null,
          exist: null
        }
      },
      computed: {
        classes: function () {
          const classes = ['position-absolute', 'w-100']
          if (reportmode) console.log('Appindex set theme', this.getTheme)
          switch (+this.getTheme) {
            case 0:
              if (whitetheme) classes.push(themewhite)
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
        updateheight () {
          return {
            height: this.getPluginHeight + 'px'
          }
        },
        ...Vuex.mapGetters([
          'getTheme',
          'getThemeColorBG',
          'getThemeColorBorder',
          'getPluginHeight'
        ])

      },

      mounted () {
        /* eslint-disable no-global-assign */
        appinscount++
        /* eslint-enable no-global-assign */
        this.playertime = window.setInterval(() => {
          if (this.player) this.$store.dispatch('updateVideoPlayedTime', this.player.currentTime)
          else clearInterval(this.playertime)
        }, 1000)
        this.exist = window.setInterval(() => {
          const self = document.querySelector('#PTTChat[ins="' + this.index + '"')
          if (!self) {
            console.log('Instance ' + this.index + ' destroyed.')
            PTT.$destroy()
          } else { // console.log("Instance " + this.index + " alive.");
          }
        }, 1000)
        this.$store.dispatch('isStream', isstreaming)
        if (!isstreaming) {
          try {
            const videoinfo = JSON.parse(document.getElementById('scriptTag').innerHTML)
            if (reportmode) console.log('videoinfo', videoinfo)
            const startDate = new Date(videoinfo.publication[0].startDate)
            if (reportmode) console.log('startDate', startDate)
            this.$store.dispatch('updateVideoStartDate', startDate)
          } catch (e) {
            console.log(e)
          }
        }

        this.rootmsg.PTTState = data => { this.$store.dispatch('PTTState', data) }
      },
      beforeDestroy () {
        console.log('beforeDestroy', this)
        clearInterval(this.playertime)
        clearInterval(this.exist)
      },
      template: `<div id="PTTChat" :class="classes" :ins="index" :style="updateheight">
      <PTTAppBtn></PTTAppBtn>
      <PTTApp></PTTApp>
    </div>`
    })
  }
}
