// components/card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    village: {
      type: String,
      value: "类别"
    },
    avatar: {
      type: String,
      value: ""
    },
    name: {
      type: String,
      value: "村民"
    },
    time: {
      type: String,
      value: "2022-06-18 24:00"
    },
    info: {
      type: String,
      value: ""
    },
    weather: {
      type: String,
      value: ""
    },
    like: {
      type: Number,
      value: 0
    },
    collect: {
      type: Number,
      value: 0
    },
    cid: {
      type: String,
      value: ''
    },
    to: {
      type: String,
      value: ''
    }
  },
  methods: {
    goto() {
      if(this.properties.to) {
        wx.navigateTo({
          url: this.properties.to,
        })
      }
    },
    toAuthorPage() {
      if(this.properties.cid) {
        wx.navigateTo({
          url: '/pages/card/index?cid='+this.properties.cid
        })
      }
    }
  }
})
