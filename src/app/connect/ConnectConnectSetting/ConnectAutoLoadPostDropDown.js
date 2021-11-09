export const ConnectAutoLoadPostDropDown = {
  inject: ['msg'],
  data () {
    return {
      description: '標題搜尋',
      optionGroup: this.$store.getters.getTitleList,
      dropdownPreview: undefined,
      board: null,
      title: null,
      manualBoard: null,
      manualTitle: null,
      previewTitle: null,
      enableManualInput: false
    }
  },
  watch: {
    previewTitle () {
      $(this.$refs.manualInputArea).collapse('hide')
      $(this.$refs.previewArea).collapse('show')
      this.$store.dispatch('gotoChat', true)
    },
    enableManualInput (e) {
      if (e) $(this.$refs.manualInputArea).collapse('show')
    }
  },
  mounted () {
    this.msg.setPreviewPostTitle = data => {
      this.previewTitle = data
      // if (reportmode) console.log("gettitle" + this.title)
    }
  },
  methods: {
    $_connectAutoLoadPost_onClickDropdownItem (item, index) {
      if (this.PTTState < 1) {
        this.$store.dispatch('Alert', { type: 0, msg: 'PTT尚未登入，請先登入。' })
        return
      }
      $(this.$refs.manualInputArea).collapse('hide')
      const result = /(.+) \((.+)\)/.exec(item)
      this.board = result[2]
      this.title = result[1]
      this.dropdownPreview = `${result[1]} (${result[2]})`
      this.optionGroup.splice(0, 0, this.optionGroup.splice(index, 1)[0])
      this.$store.dispatch('setTitleList', this.optionGroup)
      this.$store.commit('updateBoard', this.board)
      this.msg.PostMessage('getPushByRecent', {
        titleSearch: { board: this.board, title: this.title }, recent: 200
      })
    },
    $_connectAutoLoadPost_onClickRemoveOption (index) {
      this.optionGroup.splice(index, 1)
      this.$store.dispatch('setTitleList', this.optionGroup)
    },
    addAndSearch () {
      if (this.PTTState < 1) {
        this.$store.dispatch('Alert', { type: 0, msg: 'PTT尚未登入，請先登入。' })
        return
      }
      if (!this.manualBoard || !this.manualTitle) {
        this.$store.dispatch('Alert', { type: 0, msg: '看板名稱及標題不得為空。' })
        return
      }
      this.optionGroup.unshift(`${this.manualTitle} (${this.manualBoard})`)
      this.$_connectAutoLoadPost_onClickDropdownItem(this.optionGroup[0], 0)
    }
  },
  computed: {
    ...Vuex.mapGetters(['PTTState'])
  },
  template: `<div class="form-group my-3">
  <div class="form-row mt-3 mb-2">
    <label class="col-3 col-form-label">{{ description }}</label>
    <div class="col">
      <div class="dropdown">
        <button class="btn ptt-btnoutline dropdown-toggle" type="button" data-toggle="dropdown">
          {{ dropdownPreview ? dropdownPreview : '請選擇...' }}
        </button>
        <ul class="dropdown-menu" role="menu">
          <a href="#" class="dropdown-item" v-for="(item, index) in optionGroup"
            @click.prevent="$_connectAutoLoadPost_onClickDropdownItem(item, index)">
              {{ item }}
                <button class="close" type="button" @click.stop.prevent="$_connectAutoLoadPost_onClickRemoveOption(index)">
                  &times;
                </button>
          </a>
          <li class="dropdown-divider"></li>
          <a href="#" class="dropdown-item" @click.prevent="enableManualInput = true">
            新增其他選項
          </a>
        </ul>
      </div>
    </div>
  </div>
  <div class="collapse" ref="manualInputArea">
    <div class="form-row">
      <div class="col-3"></div>
      <div class="col" v-on:keyup.13="addAndSearch">
        <input type="text" class="form-control mb-1" v-model="manualBoard" placeholder="看板：">
        <input type="text" class="form-control mt-1" v-model="manualTitle" placeholder="標題：">
      </div>
      <div class="col-2 px-0">
        <button class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="addAndSearch()">新增</button>
      </div>
    </div>
  </div>
  <div class="my-3 collapse" ref="previewArea">
    <div class="form-row">
      <div class="col-3">
        <label class="col-form-label">標題預覽</label>
      </div>
      <div class="col ml-2" style="border:1px solid;">
        <div class="my-2">{{ previewTitle }}</div>
      </div>
    </div>
  </div>
</div>`
}
