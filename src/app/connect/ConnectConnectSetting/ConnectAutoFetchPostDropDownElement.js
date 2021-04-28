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
      connectAutoFetchPost_manualBoard: null,
      connectAutoFetchPost_manualTitle: null,
      SetingValue_previewTitle: null,
    }
  },
  watch: {
    SetingValue_previewTitle: function () {
      $("#previewForm").collapse("show");
      $("#manualinputarea").collapse("hide");
      this.getPost();
    }
  },
  mounted() {
    this.msg["getAutoFetchedPostTitle"] = data => { 
      this.SetingValue_previewTitle = data; 
      //if (reportmode) console.log("gettitle" + this.title);
    };
  },
  methods: {
    $_ConnectAutoFetchPost_onClickRemoveOption(_index) {
      this.optionGroup.splice(_index, 1);
      this.$store.dispatch("setSearchTitle", this.optionGroup);
    },
    $_ConnectAutoFetchPost_onClickDropdownItem(_item, _index) {
      $("#manualinputarea").collapse("hide");
      const result = /(.+) \((.+)\)/.exec(_item);
      this.board = result[2];
      this.title = result[1];
      this.dropdownPreview = result[1] + " (" + result[2] + ")";
      this.optionGroup.splice(0, 0, this.optionGroup.splice(_index, 1)[0]);
      this.$store.dispatch("setSearchTitle", this.optionGroup);
      this.msg.PostMessage("getPostTitle", { boardforsearch: this.board, titleforsearch: this.title });
    },
    addAndSearch: function () {
      if ( this.connectAutoFetchPost_manualBoard !== null && this.connectAutoFetchPost_manualTitle !== null) {
        this.optionGroup.unshift(this.connectAutoFetchPost_manualTitle + " (" + this.connectAutoFetchPost_manualBoard + ")");
      }
      else {
        this.$store.dispatch('Alert', { type: 0, msg: "看板名稱及標題不得為空。" });
        return;
      }
      if (this.PTTState < 1) {
        this.$store.dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
        return;
      }
      this.$_ConnectAutoFetchPost_onClickDropdownItem(this.optionGroup[0]);
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
      if (option === null || option.length === 0)
      return [
        "直播單 (C_Chat)",
        "彩虹直播 (Vtuber)"]
      else return option;
    },
  },
  computed: {
    DisplayOption() { return  this.dropdownPreview === null ? "請選擇...." : this.dropdownPreview},
    ...Vuex.mapGetters(['PTTState'])
  },
  template: `<div class="form-group my-3">
  <div class="form-row mt-3 mb-2">
    <label class="col-3 col-form-label">{{this.description}}</label>
    <div class="col">
      <div class="dropdown">
        <button class="btn ptt-btnoutline dropdown-toggle" type="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          {{this.DisplayOption}}
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
          <a href="#" class="dropdown-item" v-for="(item, index) in optionGroup"
            @click.prevent="$_ConnectAutoFetchPost_onClickDropdownItem(item, index)">{{item}}<button type="button"
              @click.stop="$_ConnectAutoFetchPost_onClickRemoveOption(index)" @click.prevent
              class="close">&times;</button></a>
          <li class="dropdown-divider"></li>
          <a href="#" class="dropdown-item" data-toggle="collapse" data-target="#manualinputarea" @click.prevent>新增其他選項</a>
        </ul>
      </div>
    </div>
  </div>
  <div class="form-row collapse" id="manualinputarea">
    <div class="col-3"></div>
    <div class="col" v-on:keyup.13="addAndSearch">
      <input type="text" class="form-control mb-1" v-model="connectAutoFetchPost_manualBoard" placeholder="看板：">
      <input type="text" class="form-control mt-1" v-model="connectAutoFetchPost_manualTitle" placeholder="標題：">
    </div>
    <div class="col-2 px-0">
      <button class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="addAndSearch()">新增</button>
    </div>
  </div>
  <div class="form-row my-3 collapse" id="previewForm">
    <div class="col-3">
      <label class="col-form-label">標題預覽</label>
    </div>
    <div class="col ml-2" style="border:1px solid;">
      <div class="my-2">{{SetingValue_previewTitle}}</div>
    </div>
  </div>
</div>`,
}
