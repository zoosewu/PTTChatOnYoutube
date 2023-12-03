
<template>
  <div class="form-group my-3">
    <div class="form-row mt-3 mb-2">
      <label class="col-3 col-form-label">{{ description }}</label>
      <div class="col">
        <div class="dropdown">
          <button
            class="btn ptt-btnoutline dropdown-toggle"
            type="button"
            data-toggle="dropdown"
          >
            {{ dropdownPreview ? dropdownPreview : '最近搜尋' }}
          </button>
          <ul
            class="dropdown-menu"
            role="menu"
          >
            <a
              v-for="(item, index) in optionGroup"
              :key="'o-' + index"
              href="#"
              class="dropdown-item"
              @click.prevent="$_connectAnySearchDropdown_onClickDropdownItem(item, index)"
            >
              {{ item }}
              <button
                class="close ml-2"
                type="button"
                @click.stop.prevent="$_connectAnySearchDropdown_onClickRemoveOption(index)"
              >
                <i
                  class="bi bi-x"
                  style="font-size: 1rem;"
                />
              </button>
              <button
                class="close ml-2"
                type="button"
                disabled
              >
                <i
                  class="bi bi-lock-fill"
                  style="font-size: .7rem;"
                />
              </button>
            </a>
            <a
              v-for="(item, index) in recentGroup"
              :key="'r-' + index"
              href="#"
              class="dropdown-item"
              @click.prevent="$_connectAnySearchDropdown_onClickDropdownItem(item, index)"
            >
              {{ item }}
              <button
                class="close ml-2"
                type="button"
                @click.stop.prevent="$_connectAnySearchDropdown_onClickRemoveRecent(index)"
              >
                <i
                  class="bi bi-x"
                  style="font-size: 1rem;"
                />
              </button>
              <button
                class="close ml-2"
                type="button"
                @click.stop.prevent="$_connectAnySearchDropdown_onClickLock(index)"
              >
                <i
                  class="bi bi-unlock-fill"
                  style="font-size: .7rem;"
                />
              </button>
            </a>
          </ul>
        </div>
      </div>
    </div>
    <div
      ref="previewArea"
      class="my-3 collapse"
    >
      <div class="form-row">
        <div class="col-3">
          <label class="col-form-label">標題預覽</label>
        </div>
        <div
          class="col ml-2"
          style="border:1px solid;"
        >
          <div class="my-2">
            {{ previewTitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gaPush from 'src/ga/setvalue'
export default {
  inject: ['msg', 'isStream'],
  data () {
    return {
      description: '',
      optionGroup: GM_getValue('AnySearchOption', [
        'C_Chat,/間直播單,Z20',
        'vtuber,/彩虹直播'
      ]),
      recentGroup: GM_getValue('AnySearchRecent', []),
      dropdownPreview: undefined,
      previewTitle: null,
      lastAnySearch: ''
    }
  },
  computed: {
    ...Vuex.mapGetters(['pttState', 'anySearch', 'post'])
  },
  watch: {
    previewTitle () {
      $(this.$refs.manualInputArea).collapse('hide')
      $(this.$refs.previewArea).collapse('show')
      this.$store.dispatch('gotoChat', true)
    },
    anySearch (e) {
      if (e !== '') {
        this.$_connectAnySearchDropdown_AddNew(e)
        this.$store.dispatch('addAnySearch', '')
      }
    }
  },
  mounted () {
    this.msg.setPreviewPostTitle = (data) => {
      this.previewTitle = data
      // if (reportMode) console.log("gettitle" + this.title)
    }
  },
  methods: {
    $_connectAnySearchDropdown_AddNew (item) {
      if (showAllLog)console.log('_connectAnySearchDropdown_AddNew', item)
      const executeItem = this.$_connectAnySearchDropdown_onClickDropdownItem(item)
      if (!executeItem) return
      let index = this.optionGroup.indexOf(item)
      if (index > -1) return
      index = this.recentGroup.indexOf(item)
      if (index > -1) {
        this.recentGroup.splice(index, 1)
      }
      this.recentGroup.splice(0, 0, item)
      GM_setValue('AnySearchRecent', this.recentGroup)
    },
    $_connectAnySearchDropdown_onClickDropdownItemRecent (item, index) {
      const executeItem = this.$_connectAnySearchDropdown_onClickDropdownItem(item)
      if (executeItem) {
        this.recentGroup.splice(0, 0, this.recentGroup.splice(index, 1)[0])
        GM_setValue('AnySearchRecent', this.recentGroup)
      }
    },
    $_connectAnySearchDropdown_onClickDropdownItem (item) {
      let board = ''
      let key = ''
      if (this.pttState < 1) {
        this.$store.dispatch('Alert', { type: 0, msg: 'PTT尚未登入，請先登入。' })
        return false
      }
      const RuleResult = / *([a-zA-Z0-9_-]+) *, *(.+) */.exec(item)
      if (RuleResult) {
        board = RuleResult[1]
        key = RuleResult[2]
        this.$_connectAnySearchDropdown_PostMessage(board, key)
        return true
      }
      this.$store.dispatch('Alert', { type: 0, msg: '格式錯誤' })
      return false
    },
    $_connectAnySearchDropdown_PostMessage (board, key) {
      const data = { key: key, board: board }
      if (showAllLog)console.log('AnySearch', key, this.post.key, board, this.post.board, this.isStream)
      if (this.post.key === key && this.post.board === board) { // 相同文章取最新推文
        data.startLine = this.post.lastEndLine
        if (reportMode) console.log('AnySearch same post', data)
      } else if (this.isStream) { // 實況取得最近的推文
        data.recent = 200
        if (reportMode) console.log('AnySearch recent', data)
      } else { // 實況紀錄取得所有推文
        data.startLine = 0
        if (reportMode) console.log('AnySearch total', data)
      }
      gaPush({ event: 'search', search: board + ',' + key })
      this.msg.PostMessage('getCommentByAnySearch', data)
      this.$store.dispatch('pageChange', true)
    },
    $_connectAnySearchDropdown_onClickRemoveOption (index) {
      this.optionGroup.splice(index, 1)
      GM_setValue('AnySearchOption', this.optionGroup)
    },
    $_connectAnySearchDropdown_onClickRemoveRecent (index) {
      this.recentGroup.splice(index, 1)
      GM_setValue('AnySearchRecent', this.recentGroup)
    },
    $_connectAnySearchDropdown_onClickLock (index) {
      const item = this.recentGroup[index]
      this.optionGroup.push(item)
      this.recentGroup.splice(index, 1)
      GM_setValue('AnySearchOption', this.optionGroup)
      GM_setValue('AnySearchRecent', this.recentGroup)
    }
  }
}
</script>

<style lang="scss">
</style>
