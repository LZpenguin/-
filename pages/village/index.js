const {updateUser,checkVillage}  = require('../../utils/user')
const {newVillage,settleInVillage, settleOutVillage,getVillageByRegion, getVillageByVid}  = require('../../utils/village')
const {getCardByVid} = require('../../utils/card')
var amapFile = require('../../libs/amap-wx.130');

Page({
  data: {
    settled: false,
    name: "",
    phone: "",
    email: "",
    region: ['湖北省','武汉市','洪山区'],
    vList: [],
    vList2: [],
    vNavi: 0,
    village: {},
    villager: 0,
    cards: 0,
    like: 0,
    cardList: []
  },
  onShow() {
    let user = wx.getStorageSync('user')
    this.setData({
      user
    })
    wx.showTabBar({
      animation: false,
    })
    this.checkVillage()
    if(!this.data.settled) {
      wx.setNavigationBarColor({
        backgroundColor: '#e22401',
        frontColor: '#ffffff',
      })
      wx.setNavigationBarTitle({
        title: '',
      })
      getVillageByRegion(this.data.region.join(''),res => {
        let vList = res.data.data
        let vList2 = vList.map(item => item.name)
        this.setData({
          vList,
          vList2,
          vNavi: 0
        })
      })
    }else {
      wx.setNavigationBarColor({
        backgroundColor: '#ffffff',
        frontColor: '#000000',
      })
      wx.setNavigationBarTitle({
        title: '我的村',
      })
    }
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
  regionSelect(e) {
    let region = e.detail.value
    this.setData({
      region
    })
    getVillageByRegion(region.join(''),res => {
      let vList = res.data.data
      let vList2 = vList.map(item => item.name)
      this.setData({
        vList,
        vList2,
        vNavi: 0
      })
    })
  },
  villageSelect(e) {
    this.setData({
      vNavi: e.detail.value
    })
  },
  settleIn() {
    let user = wx.getStorageSync('user')
    let {name,phone,email,vList,vNavi} = this.data
    let vid = vList.length ? vList[vNavi].id : 0
    if(name && phone && email && vid) {
      updateUser(user.uid,{
        username: name,
        phone,
        email
      },res => {
        settleInVillage(user.uid,vid,res => {
          wx.showToast({
            title: '入驻村庄成功',
          })
          this.setData({
            name: '',
            phone: '',
            email: ''
          })
          this.checkVillage()
        })
      })
    }
  },
  settleOut() {
    let user = wx.getStorageSync('user')
    let village = this.data.village
    wx.showModal({
      title: '退出村庄',
      content: `退出村庄'${village.name}'`,
      success: res => {
        if(res.confirm) {
          settleOutVillage(user.uid,village.id,res => {
            wx.showToast({
              title: '退出村庄成功'
            })
            this.setData({
              settled: false
            })
          })
        }
      }
    })
  },
  checkVillage() {
    let user = wx.getStorageSync('user')
    checkVillage(user.uid,res => {
      if(res.data.data.id) {
        this.setData({
          settled: true,
          village: res.data.data
        })
        getVillageByVid(res.data.data.id,res => {
          let {people_count,card_count,love} = res.data.data
          this.setData({
            villager: people_count,
            cards: card_count,
            like: love
          })
        })
        getCardByVid(this.data.user.uid,res.data.data.id,1,res => {
          let cardList = res.data.data.list
          let length = cardList.length
          for(let i=0;i<(3-length%3)%3;i++) {
            cardList.push({})
          }
          this.setData({
            cardList
          })
        })
      }else {
        var that = this;
        var myAmapFun = new amapFile.AMapWX({key:"7c295ba9719beeb78cc7e4a020565248"});
        myAmapFun.getRegeo({
        success: res => {
          let loc = res[0].regeocodeData.addressComponent
          this.setData({
            address: loc.province+loc.city+loc.district+loc.township
          })
        }
      })
      }
    })
  }
})