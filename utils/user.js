const {uploadPic} = require('./upload')

function getUserByUid(uid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/user/get?id='+uid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function updateUser(uid,data,callback) {
  let mixedData = JSON.parse(JSON.stringify(data))
  mixedData.id = uid
  wx.request({
    url: 'https://www.tmnhs.top/api/user/update',
    method: 'post',
    data: mixedData,
    success: res => {
      callback(res)
    }
  })
}

function checkVillage(uid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/village/get_by_uid?uid='+uid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

module.exports = {
  getUserByUid,
  updateUser,
  checkVillage
}