function newVillage(position,name,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/village/add',
    method: 'post',
    data: {
      position,
      name
    },
    success: res => {
      callback(res)
    }
  })
}

function getAllVillage(callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/village/get_all',
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getVillageByVid(vid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/village/info?vid='+vid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getVillageByRegion(region,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/village/get_by_region?region='+region,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function settleInVillage(uid,vid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/village/in',
    method: 'post',
    data: {
      uid,
      vid
    },
    success: res => {
      callback(res)
    }
  })
}

function settleOutVillage(uid,vid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/village/out',
    method: 'post',
    data: {
      uid,
      vid
    },
    success: res => {
      callback(res)
    }
  })
}

module.exports = {
  newVillage,
  getAllVillage,
  getVillageByVid,
  getVillageByRegion,
  settleInVillage,
  settleOutVillage
}