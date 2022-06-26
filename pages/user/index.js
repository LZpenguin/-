const {login} = require('../../utils/login.js')
const {getPublished,getCollected,getViewed,delCard,collectCard} = require('../../utils/card')
const {updateUser,getUserByUid,checkVillage} = require('../../utils/user')

Page({
  data: {
    likeCount: 0,
    folloerCount: 0,
    listNavi: 0,
    publishedList: [],
    collectedList: [],
    viewedList: [],
    patchList: [],
    village: ''
  },
  onLoad() {
    this.setData({
      listNavi: 0
    })
    let token = wx.getStorageSync('token')
    let user = wx.getStorageSync('user')
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      token,
      user,
      userInfo
    })
    updateUser(user.uid,{
      username: userInfo.nickName,
      avatar: userInfo.avatarUrl
    },res => {})
  },
  onShow() {
    this.getData()
    checkVillage(this.data.user.uid,res => {
      this.setData({
        village: res.data.data.name || ''
      })
    })
  },
  getData() {
    let {token,user} = this.data
    if(token && user) {
      getUserByUid(user.uid,res => {
        this.setData({
          likeCount: res.data.data.love,
          followerCount: res.data.data.follower
        })
      })
      getPublished(user.uid,res => {
        let publishedList = res.data.data.reverse()
        for(let i=0;i<(3-res.data.data.length%3)%3;i++) {
          publishedList.push({})
        }
        this.setData({
          publishedList
        })
      })
      getCollected(user.uid,res => {
        let collectedList = res.data.data.reverse()
        for(let i=0;i<(3-res.data.data.length%3)%3;i++) {
          collectedList.push({})
        }
        this.setData({
          collectedList
        })
      })
      getViewed(user.uid,res => {
        let viewedList = res.data.data.reverse()
        for(let i=0;i<(3-res.data.data.length%3)%3;i++) {
          viewedList.push({})
        }
        this.setData({
          viewedList
        })
      })
    }
  },
  login() {
    login(this,res=> {
      let {token,user} = res.data.data
        this.setData({
          user,
          token
        })
        wx.setStorageSync('user', user)
        wx.setStorageSync('token', token)
        getPublished(user.uid,res => {
          let patchList = []
          for(let i=0;i<3-res.data.data.length%3;i++) {
            patchList.push(i)
          }
          this.setData({
            publishedList: res.data.data.reverse(),
            patchList
          })
        })
        getCollected(user.uid,res => {
          this.setData({
            collectedList: res.data.data
          })
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
  },
  delCard(e) {
    let {cid,title} = e.target.dataset
    if(title.length > 5) {
      title = title.slice(0,5)+'...'
    }
    wx.showModal({
      title: '删除名片',
      content: `删除标题为'${title}'的名片`,
      success: res => {
          if (res.confirm) {
            delCard(cid,res => {
              this.getData()
              wx.showToast({
                title: '删除成功',
              })
            })
          }
      }
    })
  },
  cancelCollect(e) {
    let {cid,title} = e.target.dataset
    let user = wx.getStorageSync('user')
    if(title.length > 3) {
      title = title.slice(0,3)+'...'
    }
    wx.showModal({
      title: '取消收藏',
      content: `取消收藏标题为'${title}'的名片`,
      success: res => {
          if (res.confirm) {
            collectCard(user.uid,cid,false,res => {
              this.getData()
              wx.showToast({
                title: '取消收藏成功',
              })
            })
          }
      }
    })
  }
})