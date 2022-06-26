function getAllTag(callback) {
  wx.request({
    url: 'https://www.tmnhs.top/api/tag/get',
    method: 'post',
    success: res => {
      callback(res)
    }
  })
}

module.exports = {
  getAllTag
}