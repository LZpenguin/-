const {getCardByCid,likeCard,collectCard, addViewed} = require('../../utils/card.js')
const user = require('../../utils/user.js')

Page({
  data: {
    cardInfo: {},
    focus: 0
  },
  onLoad(options) {
    let user = wx.getStorageSync('user')
    //cid为卡片id，uid为从主页过来的主页人id，用来判断是返回还是跳转
    let {cid,uid} = options
    addViewed(user.uid,parseInt(cid),res => {})
    getCardByCid(user.uid,cid,res => {
      this.setData({
        cardInfo: res.data.data,
        focus: 0
      })
    })
    let interval = setInterval(() => {
      this.setData({
        focus: (this.data.focus+1)%this.data.cardInfo.shuffling.length
      })
    },2000);
    this.setData({
      user,
      uid,
      interval
    })
  },
  goAuthorPage() {
    let {cardInfo,uid} = this.data
    if(cardInfo.uid == uid) {
      wx.navigateBack({
        delta: -1,
      })
    }else {
      wx.navigateTo({
        url: '/pages/author/index?uid='+cardInfo.uid,
      })
    }
  },
  touchStart(e) {
    clearInterval(this.data.interval)
    this.setData({
      touchStart: e.changedTouches[0].clientX
    })
  },
  touchEnd(e) {
    if(e.changedTouches[0].clientX - this.data.touchStart < -50&&this.data.focus<this.data.cardInfo.shuffling.length-1) {
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
        focus: (this.data.focus+1)%this.data.cardInfo.shuffling.length
      })
    },2000);
    this.setData({
      interval
    })
  },
  likeCard() {
    let {cardInfo} = this.data
    likeCard(cardInfo.uid,cardInfo.id,!cardInfo.whether_love,res => {
      if(cardInfo.whether_love) {
        cardInfo.love = cardInfo.love - 1
      }else {
        cardInfo.love = cardInfo.love + 1
      }
      cardInfo.whether_love = !cardInfo.whether_love
      this.setData({
        cardInfo
      })
    })
  },
  collectCard() {
    let {cardInfo,user} = this.data
    collectCard(user.uid,cardInfo.id,!cardInfo.whether_collect,res => {
      if(cardInfo.whether_collect) {
        cardInfo.collect = cardInfo.collect - 1
      }else {
        cardInfo.collect = cardInfo.collect + 1
      }
      cardInfo.whether_collect = !cardInfo.whether_collect
      this.setData({
        cardInfo
      })
    })
  }
})