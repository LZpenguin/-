const {newCard,addTag} = require('../../utils/card')
const {getAllTag} = require('../../utils/tag')

Page({
  data: {
    userInfo: {},
    user: {},
    token: "",
    title: "",
    desc: "",
    pics: [],
    tags: [],
    tag: 0
  },
  onShow() {
    let userInfo = wx.getStorageSync('userInfo')
    let user = wx.getStorageSync('user')
    let token = wx.getStorageSync('token')
    this.setData({
      userInfo,
      user,
      token
    })
    getAllTag(res => {
      this.setData({
        tags: res.data.data,
        tag: res.data.data[0].id
      })
    })
    wx.hideTabBar({
      animation: true,
    })
  },
  onHide() {
   wx.showTabBar({
     animation: true,
   }) 
  },
  titleChange(e) {
    this.setData({
      title: e.detail.value
    })
  },
  descChange(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  choosePic() {
    wx.chooseImage({
      count: 4,
      success: res => {
        let pics = this.data.pics
        pics = [...pics,...res.tempFilePaths]
        pics.length > 4?pics=pics.slice(0,4):''
        this.setData({
          pics: pics
        })
      }
    })
  },
  deletePic(e) {
    let pics = this.data.pics
    pics.splice(e.target.dataset.index,1)
    this.setData({
      pics
    })
  },
  chooseTag(e) {
    this.setData({
      tag: e.target.dataset.id
    })
  },
  cancel() {
    this.setData({
      title: "",
      desc: "",
      pics: [],
      tag: 0
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 100);
  },
  new() {
    wx.showLoading({
      title: '新建名片中',
    })
    let {title,desc,pics,user,tag} = this.data
    if(!(title&&desc&&pics.length&&user&&tag)) return
    if(this.data.waiting) return
    this.setData({
      waiting: true
    })
    newCard(this.data,res => {
      wx.hideLoading()
      this.setData({
        title: "",
        desc: "",
        pics: []
      })
      this.setData({
        waiting: false
      })
      wx.navigateTo({
        url: '/pages/new-succ/index',
      })
    })
  }
})