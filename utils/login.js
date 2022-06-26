function login(that,callback) {
  wx.getUserProfile({
    desc: '登录村旅者',
    success: res => {
      that.setData({
        userInfo: res.userInfo
      })
      wx.setStorageSync('userInfo', res.userInfo)
      wx.login({
        timeout: 1000,
        success: res => {
          console.log(res);
          wx.request({
            url: 'https://www.tmnhs.top/api/login',
            method: 'post',
            data: {
              'wx_code': res.code
            },
            success: res => {
              console.log(res);
              callback(res)
            }
          })
        }
      })
    }
  })
}

module.exports = {
  login
}