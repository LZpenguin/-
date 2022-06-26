const { getCardByTag } = require('../../utils/card')
const { getAllTag } = require('../../utils/tag')
const {getAllVillage}  = require('../../utils/village')

Page({
  data: {
    listNavi: 0,
    vList: [],
    tagLists: [{},{},{}]
  },
  onLoad() {
    this.setData({
      listNavi: 0
    })
    this.getData()
  },
  onPullDownRefresh() {
    this.getData()
  },
  getData() {
    let user = wx.getStorageSync('user')
    getAllVillage(res => {
      wx.stopPullDownRefresh()
      let vList = res.data.data
      vList.forEach(item => {
        if(item.card) {
          let date = new Date(item.card.createdTime*1000)
          item.card.createdTime = date.toDateString()
        }
      })
      this.setData({
        vList
      })
      getAllTag(res => {
        let tagLists = []
        res.data.data.forEach((item) => {
            getCardByTag(user.uid,item.id,1,res => {
              let list = res.data.data.list
              list.forEach(item2 => {
                let date = new Date(item2.createdTime*1000)
                item2.createdTime = date.toDateString()
              })
              if(item.name == '景区') {
                tagLists[0] = {
                  name: item.name,
                  list
                }
              }else if(item.name == '美食') {
                tagLists[1] = {
                  name: item.name,
                  list
                }
              }else if(item.name == '产业') {
                tagLists[2] = {
                  name: item.name,
                  list
                }
              }
              this.setData({
                tagLists
              })
            })
        })
      })
    })
  },
  setListNavi(e) {
    this.setData({
      listNavi: e.target.dataset.index
    })
  }
})
