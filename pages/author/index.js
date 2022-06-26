const {getPublished,getCollected,getViewed} = require('../../utils/card')
const {getUserByUid,checkVillage} = require('../../utils/user')

Page({
  data: {
    listNavi: 0,
    uid: '',
    likeCount: 0,
    followerCount: 0,
    publishedList: [],
    collectedList: [],
    viewedList: [],
    village: ''
  },
  onLoad(options) {
    this.setData({
      listNavi: 0
    })
    this.setData({
      uid: options.uid
    })
  },
  onShow() {
    let {uid} = this.data
    checkVillage(uid,res => {
      this.setData({
        village: res.data.data.name || ''
      })
    })
    getUserByUid(uid,res => {
      this.setData({
        author: res.data.data,
        likeCount: res.data.data.love,
        followerCount: res.data.data.follower
      })
    })
    getPublished(uid,res => {
      let publishedList = res.data.data.reverse()
      for(let i=0;i<(3-res.data.data.length%3)%3;i++) {
        publishedList.push({})
      }
      this.setData({
        publishedList
      })
    })
    getCollected(uid,res => {
      let collectedList = res.data.data.reverse()
      for(let i=0;i<(3-res.data.data.length%3)%3;i++) {
        collectedList.push({})
      }
      this.setData({
        collectedList
      })
    })
    getViewed(uid,res => {
      let viewedList = res.data.data.reverse()
      for(let i=0;i<(3-res.data.data.length%3)%3;i++) {
        viewedList.push({})
      }
      this.setData({
        viewedList
      })
    })
  },
  setListNavi(e) {
    this.setData({
      listNavi: e.target.dataset.index
    })
  },
  touchStart(e) {
    this.setData({
      touchStart: e.changedTouches[0].clientX
    })
  },
  touchEnd(e) {
    let {touchStart,listNavi} = this.data
    if(e.changedTouches[0].clientX - touchStart < -50&&listNavi<2) {
      this.setData({
        listNavi: listNavi+1
      })
    }else if(e.changedTouches[0].clientX - touchStart > 50&&listNavi>0) {
      this.setData({
        listNavi: listNavi-1
      })
    }
  }
})