import PTTApp from './PTTApp.js';
import PTTAppBtn from './PTTAppBtn.js';
import store from './store/store.js';
export function InitApp(chatcon, whitetheme, isstreaming, messageposter, dynamicPlugin = false) {
  InitChatApp(chatcon);
  function InitChatApp(cn) {
    /*-----------------------------------preInitApp-----------------------------------*/
    //init property
    let ele = document.createElement('div');
    ele.id = "PTTChat";
    ele.setAttribute("style", "z-index: 301;");
    if (cn) cn[0].appendChild(ele);
    //Vue.prototype.$bus = new Vue();
    const themewhite = "pttbgc-19 pttc-5";
    const themedark = "pttbgc-2 pttc-2";
    let color = whitetheme ? "pttbgc-19 pttc-5" : "pttbgc-2 pttc-2";

    let PTT = new Vue({
      el: '#PTTChat',

      store,
      components: {
        'PTTAppBtn': PTTAppBtn,
        'PTTApp': PTTApp
      },
      data() {
        return {
          index: appinscount,
          rootmsg: messageposter,
          player: document.getElementsByTagName("video")[0],
          playertime: null,
          exist: null,
        }
      },
      computed: {
        classes: function () {
          let classes = ["position-absolute", "w-100"];
          switch (+this.getTheme) {
            case 0:
              console.log("Appindex set theme", this.getTheme);
              if (whitetheme) classes.push(themewhite);
              else classes.push(themedark);
              break;
            case 1:
              console.log("Appindex set theme", this.getTheme);
              classes.push(themewhite);
              break;
            case 2:
              console.log("Appindex set theme", this.getTheme);
              classes.push(themedark);
              break;
            case 3:
              console.log("Appindex set theme", this.getTheme);
              classes.push("pttbgc-" + this.getThemeColorBG);
              classes.push("pttc-" + (10 - this.getThemeColorBorder));
              break;
            default:
              console.log("Appindex set theme default", this.getTheme);
              break;
          }
          return classes.join(' ');
        },
        ...Vuex.mapGetters([
          'getTheme',
          'getThemeColorBG',
          'getThemeColorBorder',
        ]),
      },
      provide: function () {
        return {
          msg: this.rootmsg,
          isStream: isstreaming,
          nowPluginWidth: cn[0].offsetWidth,
          dynamicPlugin: dynamicPlugin,
        };
      },
      mounted() {
        appinscount++;
        this.playertime = window.setInterval((() => {
          if (this.player) this.$store.dispatch('updateVideoPlayedTime', this.player.currentTime);
          else clearInterval(this.playertime);
        }), 1000);
        this.exist = window.setInterval((() => {
          const self = document.querySelector('#PTTChat[ins="' + this.index + '"');
          if (!self) {
            console.log("Instance " + this.index + " destroyed.");
            PTT.$destroy();
          }
          else { //console.log("Instance " + this.index + " alive.");
          }
        }), 1000);
        this.$store.dispatch('isStream', isstreaming);

        this.rootmsg["PTTState"] = data => { this.$store.dispatch('PTTState', data); };
      },
      beforeDestroy() {
        console.log("beforeDestroy", this);
        clearInterval(this.playertime);
        clearInterval(this.exist);
      },
      template: `<div id="PTTChat" :class="classes" :ins="index">
      <PTTAppBtn></PTTAppBtn>
      <PTTApp></PTTApp>
    </div>`,
    });
  }
}