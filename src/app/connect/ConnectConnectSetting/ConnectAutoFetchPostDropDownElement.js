export let ConnectAutoFetchPostDropDownElement = {
  inject: ['msg'],
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    optionGroup: { type: Object, required: true },
  },
  data() {
    return {
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
      if (reportmode) console.log("gettitle" + this.title);
    };
  },
  methods: {
    $_ConnectAutoFetchPost_onClickDropdownItem(_board, _species) {
      this.board = _board; 
      this.title = this.optionGroup[_board][_species];
      this.dropdownPreview = _board + " " + _species;
      this.showPreviewForm = true;
    },
    $_ConnectAutoFetchPost_enableManualSetting() {
      this.showPreviewForm = true;
      this.enableManualSetting = true;
    },
    getPostTitle: function () {
      if ( this.connectAutoFetchPost_manualBoard !== null && this.connectAutoFetchPost_manualTitle !== null) {
        this.board = this.connectAutoFetchPost_manualBoard; 
        this.title = this.connectAutoFetchPost_manualTitle;
      }
      this.msg.PostMessage("getPostTitle", { board: this.board, titleforsearch: this.title });
    },
    getPost: function () {
      if (reportmode) console.log("click AutoFetchPostBtn" + this.board + " " + this.title + " " + this.SetingValue_previewTitle);
      this.msg.PostMessage("getPushByRecent", { board: this.board, titleforsearch: this.title, recent: 200 });
      this.$store.dispatch("gotoChat", true);
    },
  },
  computed: {
    DisplayOption() { return  this.dropdownPreview === null ? "請選擇...." : this.dropdownPreview},
    AvailableDict: function () { 
      let container = {};
      for ( [board, species] of Object.entries(this.optionGroup)) {
        if(Object.keys(species).length !== 0) {container[board] = this.optionGroup[board];}
      }
      return container;
    },
    UnavailableDict: function () { 
      let container = {};
      for ( [board, species] of Object.entries(this.optionGroup)) {
        if(Object.keys(species).length === 0) {container[board] = this.optionGroup[board];}
      }
      return container;
    },
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
          <li class="dropdown-submenu" v-for="(item, board) in AvailableDict">
            <a class="dropdown-item" tabindex="-1" href="#" @click.prevent>{{board}}</a>
            <ul class="dropdown-menu">
              <li class="dropdown-item" type="button" v-for="(item, species) in item"><a tabindex="-1" href="#"
                  @click.prevent="$_ConnectAutoFetchPost_onClickDropdownItem(board, species)">{{species}}</a></li>
            </ul>
          </li>
          <li class="dropdown-divider"></li>
          <h6 class="dropdown-header"><em>施工中</em></h6>
          <li class="dropdown-item disabled" v-for="(item, board) in UnavailableDict"><a href="#">{{board}}</a></li>
          <li class="dropdown-divider"></li>
          <li class="dropdown-item"><a href="#" @click.prevent="$_ConnectAutoFetchPost_enableManualSetting()">其他</a></li>
        </ul>
      </div>
      <div class="col px-0" v-show="enableManualSetting" v-on:keyup.13="getPostTitle">
        <input type="text" class="form-control mb-1" v-model="connectAutoFetchPost_manualBoard" placeholder="看板：">
        <input type="text" class="form-control mt-1" v-model="connectAutoFetchPost_manualTitle" placeholder="標題：">
      </div>
    </div>
    <div class="col-2 px-0">
      <button id="asd" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="getPostTitle()">讀取</button>
    </div>
  </div>
  <div class="form-row mt-2 mb-3" v-show="showPreviewForm">
    <div class="col-3"></div>
    <div class="col">
      <input class="form-control" type="text" placeholder="文章標題預覽" readonly v-model="SetingValue_previewTitle">
    </div>
    <div class="col-2 px-0">
      <button id="asd" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="getPost()">確定</button>
    </div>
  </div>
</div>`,
}