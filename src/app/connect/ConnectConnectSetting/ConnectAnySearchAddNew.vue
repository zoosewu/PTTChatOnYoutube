
<template>
  <div>
    <div
      class="form-row mt-3"
    >
      <label
        for="anySearch"
        class="col-3 col-form-label"
      >搜尋</label>
      <div class="col">
        <input
          id="anySearch"
          v-model.lazy="search"
          class="form-control"
          type="text"
          placeholder="C_Chat,/直播單或#1VobIvqC (C_Chat)"
          autocomplete="off"
          @keyup.13="$_ConnectAnySearchAddNew_Add"
        >
      </div>
      <div class="col-2 px-0">
        <button
          id="anySearchbtn"
          class="btn ptt-btnoutline w-100 px-2"
          type="button"
          @click.self="$_ConnectAnySearchAddNew_Add()"
        >
          搜尋
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['msg', 'isStream'],
  data () {
    return {
      search: ''
    }
  },
  methods: {
    $_ConnectAnySearchAddNew_Add: function () {
      const searchResultBoard = /^ *([a-zA-Z0-9_-]+) *, *(.+) *$/.exec(this.search)
      if (searchResultBoard) {
        const board = searchResultBoard[1]
        const searches = searchResultBoard[2]
        const searchResultSearch = /^ *([#/?aZGA][^,]+?) *(?:, *([#/?aZGA!].+))? *$/.exec(searches)
        if (searchResultSearch) {
          let search = board + ',' + searchResultSearch[1]
          search += searchResultSearch.length > 2 && searchResultSearch[2] ? ',' + searchResultSearch[2] : ''
          this.$store.dispatch('addAnySearch', search)
          return
        }
      }
      const AidResult = / *(#[a-zA-Z0-9_-]+) \(([a-zA-Z0-9_-]+)\) */.exec(this.search)
      if (AidResult) {
        const search = AidResult[2] + ',' + AidResult[1]
        this.$store.dispatch('addAnySearch', search)
      }
    }
  }
}
</script>

<style lang="scss">
</style>
