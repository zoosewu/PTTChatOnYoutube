export let ChatPreviewImage = {
  data: function () {
    return {
      mousex: 0,
      mousey: 0,
      w: 0,
      h: 0,
    }
  },
  methods: {
    getWidth: function () {
      if (this.preview) this.w = this.$refs.imgel.width;
      else this.w = -100;
      return this.w;
    },
    getHeight: function () {
      if (this.preview) this.h = this.$refs.imgel.height;
      else this.h = -100;
      return this.h;
    },
  },
  computed: {
    preview: function () {
      return (this.previewImage.match(/\.(jpeg|jpg|gif|png)$/) != null);
    },
    className: function () {
      let classes = ["position-fixed", "my-2"];
      if (this.preview) classes.push("d-block");
      else classes.push("d-none");
      return classes.join(' ');
    },
    style:
      function () {
        const l = this.mousex - this.getWidth() - 10;
        const t = this.mousey - this.getHeight() - 10;
        let styles = {
          left: l + "px",
          top: t + "px",
        };
        if (this.preview) {
          const el = this.$refs.imgel;
          //console.log("W,H,", this.mousex, this.getWidth(), l, this.mousey, this.getHeight(), t);
          styles = {
            maxHeight: "400px",
            maxWidth: "400px",
            left: l + "px",
            top: t + "px",
          };
          //console.log("previewimage style", this.mousex, this.mousey, l, t, styles);
        }
        return styles;
      },
    ...Vuex.mapGetters(['previewImage'])

  },
  mounted() {
    const self = this;
    $("body").mousemove(function (e) {
      self.mousex = e.pageX;
      self.mousey = e.pageY;
    })
  },
  beforeDestroy() { $("body").off('mousemove'); },
  template: `<div style="z-index:460;">
  <img ref="imgel" :class="className" :style="style" :src="previewImage"></img>
</div>`,
}