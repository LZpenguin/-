// pages/new-succ/index.js
Page({
  data: {},
  toVillage() {
    wx.switchTab({
      url: '/pages/village/index',
    })
  },
  newAgain() {
    wx.switchTab({
      url: '/pages/new/index',
    })
  }
})