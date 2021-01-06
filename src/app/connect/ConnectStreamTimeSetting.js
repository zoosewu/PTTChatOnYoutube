export let ConnectStreamTimeSetting = {
  data: function () {
    return {
      VideoTime: "18:00:00",
      isbeforpost: false,
    }
  },
  methods: {
    timeChange: function () {
      console.log(this.VideoTime);
      let videotime = [];
      let result = /(\d\d)\:(\d\d)/.exec(this.VideoTime);
      let secresult = /\d\d\:\d\d\:(\d\d)/.exec(this.VideoTime);
      if (result) {
        videotime.push(result[1]);
        videotime.push(result[2]);
      }
      else {
        videotime.push("18");
        videotime.push("00");
      }
      if (secresult) videotime.push(secresult[1]);
      else videotime.push("00");
      result.push(this.isbeforpost);
      this.$store.dispatch('updateVideoStartTime', videotime);
    }
  },
  mounted() {
    this.$store.dispatch('updateVideoStartTime', ["18", "00", "00"]);
  },
  template: `<div id="PTTConnect-Time-Setting" class="form-row mb-2">
  <div class="form-group col-8">
    <label for="appt-time">實況重播開台時間:</label>
    <input id="stream-time" type="time" name="stream-time" step="2" v-model="VideoTime" @change="timeChange">
  </div>
  <div class="form-check col-4 pl-4">
    <input type="checkbox" class="form-check-input" id="streambeforepost" :value="isbeforpost" @change="timeChange">
    <label class="form-check-label ml-2" for="streambeforepost">發文前已開台</label>
  </div>
</div>`,
}