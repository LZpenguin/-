const {uploadPic} = require('./upload')

function newCard(data,callback) {
  let {title,desc,pics,user,tag} = data
    let promises = []
    pics.forEach(item => {
      promises.push(new Promise((resolve,reject) => {
        uploadPic(item,res => {
          resolve((JSON.parse(res.data)).data.file.url)
        })
      }))
    })
    Promise.all(promises).then((res) => {
      wx.request({
        url: 'https://www.tmnhs.top/api/card/add',
        method: 'post',
        data: {
          uid: user.uid,
          name: title,
          description: desc,
          shuffling: res,
          tid: tag
        },
        success: res => {
          callback(res)
        }
      })
    })
}

function delCard(cid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/del?id='+cid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getRecommend(uid,page,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/recommend?page='+page+'&pageSize=10&uid='+uid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getLocal(uid,vid,page,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/get_by_vid?vid='+vid+'&page='+page+'&pageSize=10&uid='+uid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getAround(uid,page,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/near_village?page='+page+'&pageSize=10&uid='+uid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getCardByCid(uid,cid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/get_by_cid?id='+cid+'&uid='+uid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getPublished(uid,callback) {
    wx.request({
      url: 'https://www.tmnhs.top/api/card/get_by_uid?uid='+uid,
      method: 'post',
      success: res => {
        callback(res)
      }
    })
}

function getCollected(uid,callback) {
    wx.request({
      url: 'https://www.tmnhs.top/api/card/get_collect?uid='+uid,
      method: 'post',
      success: res => {
        callback(res)
      }
    })
}

function getViewed(uid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/history/get?uid='+uid,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function addViewed(uid,cid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/history/add',
    method: 'post',
    data: {
      uid,
      cid
    },
    success: res => {
      callback(res)
    }
  })
}

function addTag(cid,tid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/add_tag',
    method: 'post',
    data: {
      cid,
      tid
    },
    success: res => {
      callback(res)
    }
  })
}

function checkLike(uid,cid,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/whether_love',
    method: 'post',
    data: {
      uid,
      cid
    },
    success: res => {
      callback(res)
    }
  })
}

function likeCard(uid,cid,bool,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/'+(bool?'':'cancel_')+'love',
    method: 'post',
    data: {
      uid,
      cid
    },
    success: res => {
      callback(res)
    }
  })
}

function collectCard(uid,cid,bool,callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/card/'+(bool?'':'cancel_')+'collect',
    method: 'post',
    data: {
      uid,
      cid
    },
    success: res => {
      callback(res)
    }
  })
}

function getCardByTag(uid,tid,page,callback) {
  wx.request({
    url: `https://www.tmnhs.top/api/card/get_by_tid?tid=${tid}&page=${page}&pageSize=10&uid=${uid}`,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

function getCardByVid(uid,vid,page,callback) {
  wx.request({
    url: `https://www.tmnhs.top/api/card/get_by_vid?vid=${vid}&page=${page}&pageSize=10&uid=${uid}`,
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

module.exports = {
  newCard,
  delCard,
  getRecommend,
  getLocal,
  getAround,
  getCardByCid,
  getPublished,
  getCollected,
  getViewed,
  addViewed,
  addTag,
  checkLike,
  likeCard,
  collectCard,
  getCardByTag,
  getCardByVid
}
