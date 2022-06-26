const {searchLocation} = require('../../utils/map')
const {updateUser,checkVillage}  = require('../../utils/user')
const {newVillage,settleInVillage,getVillageByVid}  = require('../../utils/village')
const {getCardByVid} = require('../../utils/card')
var amapFile = require('../../libs/amap-wx.130');

Page({
  data: {
    village: {},
    villager: 0,
    cards: 0,
    like: 0,
    cardList: []
  },
  onLoad(options) {
    let vid = options.vid
    this.setData({
      vid
    })
    getVillageByVid(vid,res => {
      let {people_count,villager,love,card_count} = res.data.data
      this.setData({
        village: res.data.data.village,
        villager: people_count,
        cards: card_count,
        like: love
      })
    })
  },
  onShow() {
    let user = wx.getStorageSync('user')
    getCardByVid(user.uid,this.data.vid,1,res => {
      let cardList = res.data.data.list
      let length = cardList.length
      for(let i=0;i<(3-length%3)%3;i++) {
        cardList.push({})
      }
      this.setData({
        cardList
      })
    })
  },
  nameChange(e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneChange(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  emailChange(e) {
    this.setData({
      email: e.detail.value
    })
  },
  addressChange(e) {
    this.setData({
      address: e.detail.value
    })
    searchLocation(e.detail.value,res => {
      let location = res.data.geocodes[0].location.split(',')
      let lo = JSON.parse(location[0]).toFixed(1)
      let la = JSON.parse(location[1]).toFixed(1)
      console.log(lo,la);
      this.setData({
        location: lo+','+la
      })
    })
  }, 
  settleIn() {
    let {name,phone,email,address,location,user} = this.data
    if(name && phone && address) {
      updateUser(user.uid,{
        username: name,
        phone,
        email
      },res => {
      })
      newVillage(location,address,res => {
        let vid = res.data.data.id
        let uid = user.uid
        settleInVillage(uid,vid,res => {
          console.log(res);
        })
      })
    }
  },
})