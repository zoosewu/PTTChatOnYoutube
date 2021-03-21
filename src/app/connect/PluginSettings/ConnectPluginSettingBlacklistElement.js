Vue.component('plugin-setting-blacklist', {
	props: {
		settingName: { type: String, required: true },
		description: { type: String, required: true },
		text: { type: String, required: false },
	},  
	data() { return { SettingValue: this.$store.getters["get" + this.settingName], } },
  methods: {
    $_PluginSetting_valueChange: function () {this.$store.dispatch('set' + this.settingName, this.SettingValue); }
  },
	template: `<div class="form-group">
	<textarea class="form-control" id="blacklist" rows="5" v-model="SettingValue" 
	@change="$_PluginSetting_valueChange($event)">
</textarea>
</div>`
});