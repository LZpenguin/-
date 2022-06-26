const {getRecommend,likeCard,collectCard, getViewed, addViewed,getLocal, getAround} = require('../../utils/card')
const {checkVillage} = require('../../utils/user')
Page({
  data: {
    listNavi: 1,
    page: 1,
    cardList: [],
    cardNavi: 0,
    cardNow: {},
    userLike: false,
    touchStart: 0,
    touchMove: 0,
    locking: false
  },
  onLoad() {
    let user = wx.getStorageSync('user')
    this.setData({
      user
    })
    this.getRecommend()
  },
  onShow() {
    let user = wx.getStorageSync('user')
    this.setData({
      user
    })
    if(!this.data.cardList) {
      this.getRecommend()
    }
    this.setData({
      listNavi: 1
    })
  },
  setListNavi(e) {
    let listNavi = e.target.dataset.index
    this.setData({
      listNavi
    })
    if(listNavi == 0) {
      this.getLocal()
    }else if(listNavi == 1) {
      this.getRecommend()
    }else if(listNavi == 2) {
      this.getAround()
    }
  },
  toAuthorPage(e) {
    wx.navigateTo({
      url: '/pages/author/index?uid='+e.target.dataset.uid,
    })
  },
  toVillagePage(e) {
    wx.navigateTo({
      url: '/pages/other-village/index?vid='+e.target.dataset.vid,
    })
  },
  getRecommend(append) {
    this.setData({
      locking: true
    })
    if(this.data.cardList.length >= 30) {
      append = false
    }
    getRecommend(this.data.user.uid,this.data.page,res => {
      if(res.data.data.list.length) {
        let cardList = res.data.data.list
        let cardNavi = 0
        let cardNow = cardList[0]
        if(append) {
          cardList = [...this.data.cardList,...cardList]
          cardNavi = this.data.cardNavi
          cardNow = cardList[cardNavi]
        }
        this.fixNumData(cardNow)
        this.setData({
          page: this.data.page + 1,
          cardList,
          cardNavi,
          cardNow,
          locking: false
        })
        addViewed(this.data.user.uid,cardNow.id,res => {})
      }else {
        this.setData({
          page: 1
        })
        this.getRecommend(append)
      }
    })
  },
  getLocal(append) {
    this.setData({
      locking: true
    })
    let user = wx.getStorageSync('user')
    checkVillage(user.uid,res => {
      let vid = res.data.data.id
      if(vid == 0) {
        this.setData({
          listNavi: 1
        })
        this.getRecommend()
        wx.switchTab({
          url: '/pages/village/index',
        })
      }else {
        getLocal(user.uid,vid,this.data.page,res => {
          if(res.data.data.list.length) {
            let cardList = res.data.data.list
            let cardNavi = 0
            let cardNow = cardList[0]
            if(append) {
              cardList = [...this.data.cardList,...cardList]
              cardNavi = this.data.cardNavi
              cardNow = cardList[cardNavi]
            }
            this.fixNumData(cardNow)
            this.setData({
              page: this.data.page + 1,
              cardList,
              cardNavi,
              cardNow,
              locking: false
            })
            addViewed(this.data.user.uid,cardNow.id,res => {})
          }else {
            this.setData({
              page: 1
            })
            this.getLocal(append)
          }
        })
      }
    })
  },
  getAround(append) {
    this.setData({
      locking: true
    })
    getAround(this.data.user.uid,this.data.page,res => {
      if(res.data.data.list.length) {
        let cardList = res.data.data.list
        let cardNavi = 0
        let cardNow = cardList[0]
        if(append&&cardList.length<30) {
          cardList = [...this.data.cardList,...cardList]
          cardNavi = this.data.cardNavi
          cardNow = cardList[cardNavi]
        }
        this.fixNumData(cardNow)
        this.setData({
          page: this.data.page + 1,
          cardList,
          cardNavi,
          cardNow,
          locking: false
        })
        addViewed(this.data.user.uid,cardNow.id,res => {})
      }else {
        this.setData({
          page: 1
        })
        this.getAround(append)
      }
    })
  },
  fixNumData(cardNow) {
    if(cardNow.love >= 1000 && cardNow.love <10000) {
      cardNow.loveFixed = Math.floor(cardNow.love/1000) + 'k+'
    }else if(cardNow.love >= 10000) {
      cardNow.loveFixed = Math.floor(cardNow.love/1000) + 'w+'
    }else {
      cardNow.loveFixed = cardNow.love
    }
    if(cardNow.collect >= 1000 && cardNow.collect <10000) {
      cardNow.collectFixed = Math.floor(cardNow.collect/1000) + 'k+'
    }else if(cardNow.collect >= 10000) {
      cardNow.collectFixed = Math.floor(cardNow.collect/1000) + 'w+'
    }else {
      cardNow.collectFixed = cardNow.collect
    }
    if(cardNow.share >= 1000 && cardNow.share <10000) {
      cardNow.shareFixed = Math.floor(cardNow.share/1000) + 'k+'
    }else if(cardNow.share >= 10000) {
      cardNow.shareFixed = Math.floor(cardNow.share/1000) + 'w+'
    }else {
      cardNow.shareFixed = cardNow.share
    }
  },
  touchStart(e) {
    this.setData({
      touchStart: e.changedTouches[0].clientY
    })
  },
  touchMove(e) {
    this.setData({
      touchMove: e.changedTouches[0].clientY - this.data.touchStart
    })
  },
  touchEnd(e) {
    this.setData({
      touchMove: 0
    })
    if(e.changedTouches[0].clientY - this.data.touchStart < -50) {
      this.next()
    }else if(e.changedTouches[0].clientY - this.data.touchStart > 50) {
      this.last()
    }
  },
  last() {
    let cardNavi = this.data.cardNavi
    let cardList = this.data.cardList
    let listNavi = this.data.listNavi
    if(cardNavi > 0) {
      this.fixNumData(cardList[cardNavi-1])
      this.setData({
        cardNavi: cardNavi-1,
        cardNow: cardList[cardNavi-1],
        cardList
      })
      addViewed(this.data.user.uid,cardList[cardNavi-1].id,res => {})
    }else {
      if(listNavi == 0) {
        this.getLocal()
      }else if(listNavi == 1) {
        this.getRecommend()
      }else if(listNavi == 2) {
        this.getAround()
      }
    }
  },
  next() {
    let cardNavi = this.data.cardNavi
    let cardList = this.data.cardList
    let listNavi = this.data.listNavi
    if(cardNavi < cardList.length-1) {
      this.fixNumData(cardList[cardNavi+1])
      this.setData({
        cardNavi: cardNavi+1,
        cardNow: cardList[cardNavi+1],
        cardList
      })
      addViewed(this.data.user.uid,cardList[cardNavi+1].id,res => {})
    }else {
      if(listNavi == 0) {
        this.getLocal(true)
      }else if(listNavi == 1) {
        this.getRecommend(true)
      }else if(listNavi == 2) {
        this.getAround(true)
      }
    }
  },
  likeCard() {
    let {user,cardNow} = this.data
    likeCard(user.uid,cardNow.id,!cardNow.whether_love,res => {
      if(cardNow.whether_love) {
        cardNow.love = cardNow.love - 1
      }else {
        cardNow.love = cardNow.love + 1
      }
      cardNow.whether_love = !cardNow.whether_love
      this.fixNumData(cardNow)
      this.setData({
        cardNow
      })
    })
  },
  collectCard() {
    let {cardNow,user} = this.data
    collectCard(user.uid,cardNow.id,!cardNow.whether_collect,res => {
      if(cardNow.whether_collect) {
        cardNow.collect = cardNow.collect - 1
      }else {
        cardNow.collect = cardNow.collect + 1
      }
      cardNow.whether_collect = !cardNow.whether_collect
      this.fixNumData(cardNow)
      this.setData({
        cardNow
      })
    })
  }
})