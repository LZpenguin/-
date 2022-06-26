Component({
  properties: {
    title: {
      type: String,
      value: ""
    },
    pics: {
      type: Array,
      value: []
    },
    intro: {
      type: String,
      value: ""
    },
  },
  data: {
    focus: 0
  },
  methods: {
    touchStart(e) {
      clearInterval(this.data.interval)
      this.setData({
        touchStart: e.changedTouches[0].clientX
      })
    },
    touchEnd(e) {
      if(e.changedTouches[0].clientX - this.data.touchStart < -50&&this.data.focus<this.data.pics.length-1) {
        this.setData({
          focus: this.data.focus + 1
        })
      }else if(e.changedTouches[0].clientX - this.data.touchStart > 50&&this.data.focus>0) {
        this.setData({
          focus: this.data.focus - 1
        })
      }
      let interval = setInterval(() => {
        this.setData({
          focus: (this.data.focus+1)%this.data.pics.length
        })
      },2000);
      this.setData({
        interval
      })
    }
  }
})
