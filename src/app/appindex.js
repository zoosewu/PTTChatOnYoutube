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
    let color = whitetheme ? "pttbgc-19 pttc-5" : "pttbgc-2 pttc-2";
    let PTT = new Vue({
      el: '#PTTChat',
      template: `<div id="PTTChat" class="position-absolute w-100 ` + color + `" ins="` + appinscount + `"><PTTAppBtn></PTTAppBtn><PTTApp></PTTApp></div>`,
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
    });
    return;
  }
}