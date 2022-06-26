Component({
  properties: {
    pics: {
      type: Array,
      value: []
    },
    cid: {
      type: String,
      value: ""
    },
    uid: {
      type: String,
      value: ""
    }
  },
  data: {},
  methods: {
    toCardPage(e) {
      if(this.properties.cid) {
        wx.navigateTo({
          url: '/pages/card/index?cid='+this.properties.cid+'&uid='+this.properties.uid,
        })
      }
    } 
  }
})
