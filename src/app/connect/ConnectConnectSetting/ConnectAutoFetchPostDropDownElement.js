export let ConnectAutoFetchPostDropDownElement = {
  inject: ['msg'],
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
  },
  data() {
    return {
      optionGroup: this.checkOptionGroup(),
      dropdownPreview: null,
      board: null,
      title: null,
      enableManualSetting: false,
      connectAutoFetchPost_manualBoard: null,
      connectAutoFetchPost_manualTitle: null,
      showPreviewForm: false,
      SetingValue_previewTitle: null,
    }
  },
  mounted() {
    this.msg["getAutoFetchedPostTitle"] = data => { 
      this.SetingValue_previewTitle = data; 
      //if (reportmode) console.log("gettitle" + this.title);
    };
  },
  methods: {
    $_ConnectAutoFetchPost_onClickRemoveOption(_parent) {
      const c = this.optionGroup;
      this.optionGroup = {};
      this.optionGroup = c;
      delete this.optionGroup[_parent];
      this.$store.dispatch("setSearchTitle", this.optionGroup);
    },
    $_ConnectAutoFetchPost_onClickDropdownItem(_board, _species) {
      this.board = _board; 
      this.title = this.optionGroup[_board][_species];
      this.dropdownPreview = _board + " " + _species;
      this.showPreviewForm = true;
    },
    $_ConnectAutoFetchPost_onClickDropdownItem(_parents) {
      const result = /(.+) \((.+)\)/.exec(_parents);
      this.board = result[2];
      this.title = result[1];
      this.dropdownPreview = result[1] + " (" + result[2] + ")";
      this.showPreviewForm = true;
      const self = this;
      $(this.$refs.preview).on('shown.bs.collapse', ()=>{ 
        $(self.$refs.preview).removeAttr('id');
      });    
    },
    $_ConnectAutoFetchPost_enableManualSetting() {
      //this.showPreviewForm = true;
      const self = this;
      $(this.$refs.manualinput).on('shown.bs.collapse', ()=>{ 
        if (!this.showPreviewForm) $(self.$refs.preview).collapse('toggle');
      });
      this.enableManualSetting = true;
    },
    getPostTitle: function () {
      if ( this.connectAutoFetchPost_manualBoard !== null && this.connectAutoFetchPost_manualTitle !== null) {
        this.board = this.connectAutoFetchPost_manualBoard; 
        this.title = this.connectAutoFetchPost_manualTitle;
        this.optionGroup[this.title + " (" + this.board + ")"] = this.title + " (" + this.board + ")";
        this.$store.dispatch("setSearchTitle", this.optionGroup);
      }
      if (this.PTTState < 1) {
        this.$store.dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
        return;
      }
      this.msg.PostMessage("getPostTitle", { boardforsearch: this.board, titleforsearch: this.title });
    },
    getPost: function () {
      //if (reportmode) console.log("click AutoFetchPostBtn" + this.board + " " + this.title + " " + this.SetingValue_previewTitle);
      if (this.PTTState < 1) {
        this.$store.dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
        return;
      }
      this.msg.PostMessage("getPushByRecent", { boardforsearch: this.board, titleforsearch: this.title, recent: 200 });
      this.$store.dispatch("gotoChat", true);
    },
    checkOptionGroup: function() {
      let option = this.$store.getters["getSearchTitle"];
      if (option === null || (option !== null && Object.keys(option).length === 0)) 
      return {
        "直播單 (C_Chat)": "直播單 (C_Chat)",
        "彩虹直播 (Vtuber)": "彩虹直播 (Vtuber)"
      }
      else return option;
    },
  },
  computed: {
    DisplayOption() { return  this.dropdownPreview === null ? "請選擇...." : this.dropdownPreview},
    TwoLevelDict: function () {
      let container = {};
      for ( [parents, children] of Object.entries(this.optionGroup)) {
        if(typeof children === 'object' && Object.keys(children).length !== 0) container[parents] = this.optionGroup[parents];
      }
      return container;
    },
    OneLevelDict: function () { 
      let container = {};
      for ( [parents, children] of Object.entries(this.optionGroup)) {
        if(typeof children !== 'object' || Object.keys(children).length === 0) container[parents] = this.optionGroup[parents];
      }
      return container;
    },
    ...Vuex.mapGetters(['PTTState'])
  },
  template: `<div class="form-group">
  <div class="form-row mt-3 mb-2">
    <label class="col-3 col-form-label">{{this.description}}</label>
    <div class="col">
      <div class="dropdown" v-show="!enableManualSetting">
        <button class="btn ptt-btnoutline dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          {{this.DisplayOption}}
        </button>
        <ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
          <li class="dropdown-submenu" v-for="(item, parents) in TwoLevelDict" v-show="Object.keys(TwoLevelDict).length !== 0">
            <a class="dropdown-item" tabindex="-1" href="#" @click.prevent>{{parents}}</a>
            <ul class="dropdown-menu">
              <li class="dropdown-item" type="button" v-for="(item, children) in item" data-toggle="collapse" data-target="#previewtitle"><a tabindex="-1" href="#"
                  @click.prevent="$_ConnectAutoFetchPost_onClickDropdownItem(parents, children)">{{children}}</a></li>
            </ul>
          </li>
          <a href="#" class="dropdown-item" v-for="(item, parents) in OneLevelDict" data-toggle="collapse" data-target="#previewtitle" v-show="Object.keys(TwoLevelDict).length === 0" @click.prevent="$_ConnectAutoFetchPost_onClickDropdownItem(parents)">{{parents}}<button type="button" @click.stop="$_ConnectAutoFetchPost_onClickRemoveOption(parents)" @click.prevent class="close">&times;</button></a>
          <li class="dropdown-divider"></li>
          <a href="#" class="dropdown-item" data-toggle="collapse" data-target="#manualinputarea" @click.prevent="$_ConnectAutoFetchPost_enableManualSetting()">其他</a>
        </ul>
      </div>
      <div ref="manualinput" class="col px-0 collapse" v-on:keyup.13="getPostTitle" id="manualinputarea">
        <input type="text" class="form-control mb-1" v-model="connectAutoFetchPost_manualBoard" placeholder="看板：">
        <input type="text" class="form-control mt-1" v-model="connectAutoFetchPost_manualTitle" placeholder="標題：">
      </div>
    </div>
    <div class="col-2 px-0">
      <button class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="getPostTitle()">搜尋</button>
    </div>
  </div>
  <div ref="preview" class="form-row mt-2 mb-3 collapse" id="previewtitle">
    <div class="col-3"></div>
    <div class="col mx-2" style="border:1px solid;">
      <div class="my-2">{{SetingValue_previewTitle}}</div>
    </div>
    <div class="col-2 px-0">
      <button id="asd" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="getPost()">讀取</button>
    </div>
  </div>
</div>`,
}
